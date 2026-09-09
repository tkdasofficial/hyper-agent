import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface TriggerRenderRequest {
  prompt: string;
}

serve(async (req: Request) => {
  // Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Only POST is supported." }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const githubPat = Deno.env.get("GITHUB_PAT");
    const githubRepo = Deno.env.get("GITHUB_REPO"); // Expected format: "owner/repo"

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase backend credentials (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).");
    }

    if (!githubPat || !githubRepo) {
      throw new Error("Missing GitHub automation credentials (GITHUB_PAT or GITHUB_REPO).");
    }

    // Parse request body
    const body: TriggerRenderRequest = await req.json();
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Validation failed: 'prompt' field is required." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Optional: resolve caller user ID from Authorization Bearer token
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (user) {
        userId = user.id;
      }
    }

    // 1. Insert record into 'renders' table with status 'queued'
    const { data: renderRow, error: insertError } = await supabaseAdmin
      .from("renders")
      .insert({
        prompt: prompt,
        status: "queued",
        user_id: userId,
        script: {},
        media_urls: [],
      })
      .select("id")
      .single();

    if (insertError || !renderRow) {
      console.error("Database insert error:", insertError);
      throw new Error(`Failed to queue render in database: ${insertError?.message || "Unknown error"}`);
    }

    const renderId = renderRow.id;

    // 2. Dispatch GitHub Action Workflow via repository_dispatch
    // Format repo: clean up potential leading slashes or full URLs
    const sanitizedRepo = githubRepo.replace(/^https?:\/\/github\.com\//, "").replace(/^\//, "").replace(/\/$/, "");
    const dispatchUrl = `https://api.github.com/repos/${sanitizedRepo}/dispatches`;

    const dispatchPayload = {
      event_type: "trigger-video-render",
      client_payload: {
        render_id: renderId,
        prompt: prompt,
      },
      // Additional fallback key for compatibility
      payload: {
        render_id: renderId,
        prompt: prompt,
      },
    };

    const githubResponse = await fetch(dispatchUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${githubPat}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "Supabase-Edge-Function-Hyper-Agent",
      },
      body: JSON.stringify(dispatchPayload),
    });

    if (!githubResponse.ok) {
      const errText = await githubResponse.text();
      console.error("GitHub dispatch failed:", githubResponse.status, errText);

      // Update database status to failed
      await supabaseAdmin
        .from("renders")
        .update({
          status: "failed",
          error_log: `GitHub dispatch failure (${githubResponse.status}): ${errText}`,
        })
        .eq("id", renderId);

      throw new Error(`GitHub repository_dispatch failed: ${errText}`);
    }

    // 3. Return success response with render_id
    return new Response(
      JSON.stringify({
        success: true,
        render_id: renderId,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Edge function error:", message);
    return new Response(
      JSON.stringify({
        success: false,
        error: message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
