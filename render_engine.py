#!/usr/bin/env python3
"""
Hyper Agent (v1) - Video Render Engine
---------------------------------------
Orchestrates:
1. Cloudflare Workers AI (Llama 3.1 8B) for 3-scene scriptwriting
2. Pixazo API (Flux Schnell) for high-resolution scene image synthesis
3. Pixazo API (TTS) for voiceover narration audio
4. FFmpeg for assembling 9:16 vertical video with audio and burn-in captions
5. Supabase Database & Storage updates (status transitions: processing -> completed / failed)
"""

import os
import sys
import json
import time
import shutil
import base64
import logging
import traceback
import subprocess
from pathlib import Path
from typing import Dict, Any, List

import requests
from supabase import create_client, Client

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("RenderEngine")

# Environment variables
RENDER_ID = os.environ.get("RENDER_ID", "").strip()
PROMPT = os.environ.get("PROMPT", "").strip()
CLOUDFLARE_ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "").strip()
CLOUDFLARE_API_TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "").strip()
PIXAZO_API_KEY = os.environ.get("PIXAZO_API_KEY", "").strip()
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").strip()
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()

WORK_DIR = Path("/tmp/hyper_agent_render") / (RENDER_ID or f"local_{int(time.time())}")


def init_supabase() -> Client:
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def update_render_status(supabase: Client, status: str, **kwargs):
    """Updates the render row in Supabase with new status and optional fields."""
    if not RENDER_ID:
        logger.warning("RENDER_ID not provided; skipping database status update.")
        return

    update_payload = {"status": status}
    for k, v in kwargs.items():
        if v is not None:
            update_payload[k] = v

    try:
        supabase.table("renders").update(update_payload).eq("id", RENDER_ID).execute()
        logger.info(f"Database updated: status -> '{status}'")
    except Exception as e:
        logger.error(f"Failed to update database status: {e}")


def generate_script_cloudflare(prompt: str) -> Dict[str, Any]:
    """Generates a 3-scene video storyboard using Cloudflare Workers AI (Llama 3.1 8B)."""
    logger.info("Generating 3-scene script via Cloudflare Workers AI...")
    if not CLOUDFLARE_ACCOUNT_ID or not CLOUDFLARE_API_TOKEN:
        raise ValueError("CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be configured.")

    endpoint = (
        f"https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}"
        f"/ai/run/@cf/meta/llama-3.1-8b-instruct"
    )

    system_instruction = (
        "You are an expert viral short-form video director. Based on the user's prompt, create a concise, "
        "dramatic 3-scene script for a vertical (9:16) video. Output ONLY a valid raw JSON object with NO markdown "
        "fences, NO backticks, and NO conversational filler.\n\n"
        "Required JSON schema:\n"
        "{\n"
        '  "title": "Short punchy video title",\n'
        '  "scenes": [\n'
        '    {\n'
        '      "scene_number": 1,\n'
        '      "visual_prompt": "Detailed cinematic text-to-image prompt for Flux Schnell, vertical composition, 8k, photorealistic, cinematic lighting",\n'
        '      "narration": "Spoken voiceover line for scene 1 (15-20 words)",\n'
        '      "duration_seconds": 4\n'
        '    },\n'
        '    {\n'
        '      "scene_number": 2,\n'
        '      "visual_prompt": "Detailed cinematic text-to-image prompt for scene 2",\n'
        '      "narration": "Spoken voiceover line for scene 2 (15-20 words)",\n'
        '      "duration_seconds": 4\n'
        '    },\n'
        '    {\n'
        '      "scene_number": 3,\n'
        '      "visual_prompt": "Detailed cinematic text-to-image prompt for scene 3 climax",\n'
        '      "narration": "Spoken voiceover line for scene 3 (15-20 words)",\n'
        '      "duration_seconds": 4\n'
        '    }\n'
        '  ]\n'
        "}"
    )

    headers = {
        "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
        "Content-Type": "application/json",
    }

    body = {
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": f"Create a vertical 9:16 script for: {prompt}"},
        ],
        "max_tokens": 1200,
        "temperature": 0.7,
    }

    resp = requests.post(endpoint, headers=headers, json=body, timeout=45)
    if not resp.ok:
        raise RuntimeError(f"Cloudflare AI error ({resp.status_code}): {resp.text}")

    resp_json = resp.json()
    result_text = ""
    if "result" in resp_json:
        if isinstance(resp_json["result"], dict):
            result_text = resp_json["result"].get("response", "")
        elif isinstance(resp_json["result"], str):
            result_text = resp_json["result"]
    elif "response" in resp_json:
        result_text = resp_json["response"]

    # Clean potential markdown backticks or commentary
    cleaned = result_text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()

    try:
        script_data = json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback if there is surrounding prose
        import re
        json_match = re.search(r"(\{.*\})", cleaned, re.DOTALL)
        if json_match:
            script_data = json.loads(json_match.group(1))
        else:
            logger.warning("Failed to parse Cloudflare JSON output. Using structured fallback.")
            script_data = {
                "title": prompt[:40],
                "scenes": [
                    {
                        "scene_number": 1,
                        "visual_prompt": f"Dramatic cinematic opening of {prompt}, vertical 9:16, volumetric lighting, photorealistic, 8k",
                        "narration": f"Deep within the unknown, the story of {prompt} begins.",
                        "duration_seconds": 4,
                    },
                    {
                        "scene_number": 2,
                        "visual_prompt": f"Intense close-up sequence relating to {prompt}, hyper-detailed, neon reflections, cinematic",
                        "narration": "Every shadow hides a secret, pushing closer to the edge.",
                        "duration_seconds": 4,
                    },
                    {
                        "scene_number": 3,
                        "visual_prompt": f"Grand climax cinematic reveal of {prompt}, atmospheric, high contrast, cinematic masterpiece",
                        "narration": "The moment arrives, transforming everything forever.",
                        "duration_seconds": 4,
                    },
                ],
            }

    logger.info(f"Script generated: {len(script_data.get('scenes', []))} scenes.")
    return script_data


def generate_scene_image_pixazo(visual_prompt: str, scene_num: int, output_path: Path) -> str:
    """Calls Pixazo API (Flux Schnell) to synthesize 9:16 vertical image."""
    logger.info(f"Generating image for Scene {scene_num} via Pixazo Flux Schnell...")
    if not PIXAZO_API_KEY:
        raise ValueError("PIXAZO_API_KEY must be provided.")

    endpoint = "https://api.pixazo.ai/v1/images/generations"
    headers = {
        "Authorization": f"Bearer {PIXAZO_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "flux-schnell",
        "prompt": f"{visual_prompt}, vertical 9:16 ratio, portrait orientation, 8k resolution, cinematic lighting, photorealistic",
        "width": 720,
        "height": 1280,
        "aspect_ratio": "9:16",
        "num_inference_steps": 4,
    }

    resp = requests.post(endpoint, headers=headers, json=payload, timeout=60)
    if not resp.ok:
        raise RuntimeError(f"Pixazo Image API error ({resp.status_code}): {resp.text}")

    data = resp.json()
    img_url = ""

    # Parse response format variations
    if "data" in data and isinstance(data["data"], list) and len(data["data"]) > 0:
        item = data["data"][0]
        if "url" in item:
            img_url = item["url"]
        elif "b64_json" in item:
            raw_bytes = base64.b64decode(item["b64_json"])
            output_path.write_bytes(raw_bytes)
            return "data:image/png;base64,..."
    elif "url" in data:
        img_url = data["url"]
    elif "image_url" in data:
        img_url = data["image_url"]
    elif "images" in data and len(data["images"]) > 0:
        img_url = data["images"][0]

    if img_url:
        img_resp = requests.get(img_url, timeout=45)
        if img_resp.ok:
            output_path.write_bytes(img_resp.content)
            logger.info(f"Scene {scene_num} image downloaded -> {output_path}")
            return img_url

    raise RuntimeError(f"Could not retrieve image data from Pixazo response: {data}")


def generate_scene_audio_pixazo(narration: str, scene_num: int, output_path: Path) -> str:
    """Calls Pixazo TTS API for scene voiceover audio."""
    logger.info(f"Generating TTS audio for Scene {scene_num} via Pixazo...")
    if not PIXAZO_API_KEY:
        raise ValueError("PIXAZO_API_KEY must be provided.")

    endpoint = "https://api.pixazo.ai/v1/audio/speech"
    headers = {
        "Authorization": f"Bearer {PIXAZO_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "tts-1",
        "input": narration,
        "voice": "echo",
        "response_format": "mp3",
    }

    resp = requests.post(endpoint, headers=headers, json=payload, timeout=45)
    if resp.ok and resp.content:
        # If binary audio returned directly
        if resp.headers.get("content-type", "").startswith("audio") or resp.content[:3] == b"ID3" or resp.content[:2] == b"\xff\xfb":
            output_path.write_bytes(resp.content)
            logger.info(f"Scene {scene_num} audio saved ({len(resp.content)} bytes).")
            return f"local://audio_scene_{scene_num}.mp3"

        # If JSON response containing audio URL or base64
        try:
            data = resp.json()
            if "audio_url" in data or "url" in data:
                audio_url = data.get("audio_url") or data.get("url")
                a_resp = requests.get(audio_url, timeout=30)
                if a_resp.ok:
                    output_path.write_bytes(a_resp.content)
                    return audio_url
            elif "audio" in data:
                output_path.write_bytes(base64.b64decode(data["audio"]))
                return f"local://audio_scene_{scene_num}.mp3"
        except Exception:
            pass

        output_path.write_bytes(resp.content)
        return f"local://audio_scene_{scene_num}.mp3"

    # Fallback: synthesize tone/silence using ffmpeg so the render does not fail
    logger.warning(f"Pixazo TTS endpoint returned status {resp.status_code}. Generating synthesized fallback voice.")
    cmd = [
        "ffmpeg", "-y", "-f", "lavfi", "-i", "sine=frequency=0:duration=4",
        "-c:a", "libmp3lame", str(output_path)
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return "local://fallback_audio.mp3"


def escape_ffmpeg_drawtext(text: str) -> str:
    """Escapes special characters for FFmpeg drawtext filter."""
    text = text.replace("\\", "\\\\").replace("'", "\\'").replace("%", "\\%")
    text = text.replace(":", "\\:").replace("[", "\\[").replace("]", "\\]")
    return text


def assemble_video_ffmpeg(
    scenes: List[Dict[str, Any]],
    image_paths: List[Path],
    audio_paths: List[Path],
    output_video_path: Path
):
    """Uses FFmpeg to create 9:16 vertical subclips for each scene and concatenate with burn-in captions."""
    logger.info("Assembling video clips via FFmpeg...")
    subclips = []

    for i, (scene, img_path, audio_path) in enumerate(zip(scenes, image_paths, audio_paths), 1):
        clip_path = WORK_DIR / f"clip_{i}.mp4"

        # Determine audio duration via ffprobe
        probe_cmd = [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", str(audio_path)
        ]
        probe_res = subprocess.run(probe_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        try:
            dur = float(probe_res.stdout.strip())
            dur = max(dur, 3.5)
        except Exception:
            dur = float(scene.get("duration_seconds", 4))

        narration_text = escape_ffmpeg_drawtext(scene.get("narration", ""))

        # 9:16 Vertical Filter with Ken Burns subtle zoom and centered clean burn-in caption
        # Video resolution: 720x1280 (vertical standard)
        filter_str = (
            f"scale=720:1280:force_original_aspect_ratio=increase,"
            f"crop=720:1280,"
            f"zoompan=z='min(zoom+0.0008,1.15)':d={int(dur * 25)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=720x1280:fps=25,"
            f"drawtext=text='{narration_text}':fontcolor=white:fontsize=28:borderw=3:bordercolor=black:"
            f"x=(w-text_w)/2:y=h*0.82:line_spacing=8"
        )

        ffmpeg_cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", str(img_path),
            "-i", str(audio_path),
            "-vf", filter_str,
            "-c:v", "libx264", "-tune", "stillimage", "-c:a", "aac", "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-t", f"{dur:.2f}",
            "-shortest",
            str(clip_path)
        ]

        logger.info(f"Rendering Scene {i} clip ({dur:.2f}s)...")
        res = subprocess.run(ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if res.returncode != 0:
            logger.error(f"FFmpeg scene {i} error: {res.stderr}")
            # Simplified fallback without complex zoompan
            simple_filter = (
                f"scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,"
                f"drawtext=text='{narration_text}':fontcolor=white:fontsize=28:borderw=3:bordercolor=black:x=(w-text_w)/2:y=h*0.82"
            )
            fallback_cmd = [
                "ffmpeg", "-y",
                "-loop", "1", "-i", str(img_path),
                "-i", str(audio_path),
                "-vf", simple_filter,
                "-c:v", "libx264", "-c:a", "aac", "-b:a", "128k",
                "-pix_fmt", "yuv420p",
                "-t", f"{dur:.2f}",
                "-shortest",
                str(clip_path)
            ]
            subprocess.run(fallback_cmd, check=True)

        subclips.append(clip_path)

    # Create concat list file
    concat_list_file = WORK_DIR / "concat_list.txt"
    with open(concat_list_file, "w") as f:
        for c in subclips:
            f.write(f"file '{c.absolute()}'\n")

    # Final concatenation to output.mp4
    logger.info("Concatenating scenes into final video...")
    concat_cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", str(concat_list_file),
        "-c:v", "libx264", "-c:a", "aac",
        "-movflags", "+faststart",
        str(output_video_path)
    ]
    subprocess.run(concat_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    logger.info(f"Final video rendered successfully: {output_video_path}")


def upload_to_supabase_storage(supabase: Client, video_path: Path, render_id: str) -> str:
    """Uploads MP4 video to Supabase Storage 'renders' bucket and returns public URL."""
    logger.info("Uploading video to Supabase Storage bucket 'renders'...")
    storage_path = f"videos/{render_id}.mp4"

    with open(video_path, "rb") as f:
        file_bytes = f.read()

    # Upload file (with overwrite upsert)
    supabase.storage.from_("renders").upload(
        path=storage_path,
        file=file_bytes,
        file_options={"content-type": "video/mp4", "upsert": "true"},
    )

    public_url = supabase.storage.from_("renders").get_public_url(storage_path)
    logger.info(f"Video uploaded successfully. Public URL: {public_url}")
    return public_url


def main():
    logger.info(f"Starting Hyper Agent Assembly Engine for RENDER_ID: {RENDER_ID}")
    logger.info(f"Prompt: {PROMPT}")

    if not RENDER_ID or not PROMPT:
        logger.error("Missing RENDER_ID or PROMPT environment variables.")
        sys.exit(1)

    WORK_DIR.mkdir(parents=True, exist_ok=True)
    supabase = init_supabase()

    try:
        # 1. Update database status to 'processing'
        update_render_status(supabase, "processing")

        # 2. Call Cloudflare Workers AI for 3-scene script
        script = generate_script_cloudflare(PROMPT)
        scenes = script.get("scenes", [])
        if not scenes:
            raise ValueError("Cloudflare AI returned an empty scenes list.")

        # 3. Generate media (Flux Schnell image + TTS audio) for each scene
        image_paths = []
        audio_paths = []
        media_urls = []

        for scene in scenes:
            scene_num = scene.get("scene_number", len(image_paths) + 1)
            visual_prompt = scene.get("visual_prompt", PROMPT)
            narration = scene.get("narration", "")

            img_file = WORK_DIR / f"scene_{scene_num}.png"
            audio_file = WORK_DIR / f"scene_{scene_num}.mp3"

            img_url = generate_scene_image_pixazo(visual_prompt, scene_num, img_file)
            audio_url = generate_scene_audio_pixazo(narration, scene_num, audio_file)

            image_paths.append(img_file)
            audio_paths.append(audio_file)
            media_urls.append({
                "scene": scene_num,
                "image_url": img_url,
                "audio_url": audio_url,
                "narration": narration
            })

        # Save intermediate script and media URLs
        update_render_status(supabase, "processing", script=script, media_urls=media_urls)

        # 4. Assemble video with FFmpeg
        final_mp4 = WORK_DIR / f"render_{RENDER_ID}.mp4"
        assemble_video_ffmpeg(scenes, image_paths, audio_paths, final_mp4)

        # 5. Upload to Supabase Storage & mark completed
        video_url = upload_to_supabase_storage(supabase, final_mp4, RENDER_ID)
        update_render_status(
            supabase,
            "completed",
            video_url=video_url,
            script=script,
            media_urls=media_urls
        )
        logger.info(f"Render {RENDER_ID} completed successfully! Video URL: {video_url}")

    except Exception as exc:
        err_msg = f"{type(exc).__name__}: {str(exc)}\n{traceback.format_exc()}"
        logger.error(f"Render job failed: {err_msg}")
        update_render_status(supabase, "failed", error_log=err_msg)
        sys.exit(1)
    finally:
        # Clean up temporary files
        try:
            if WORK_DIR.exists():
                shutil.rmtree(WORK_DIR, ignore_errors=True)
        except Exception:
            pass


if __name__ == "__main__":
    main()
