'use client';

import React from 'react';
import { LibraryView } from '@/components/LibraryView';
import { INITIAL_LIBRARY_VIDEOS } from '@/lib/initial-data';
import { useSession } from '@/lib/session-context';

export default function LibraryPage() {
  const { handleSelectFromLibrary } = useSession();

  return (
    <LibraryView
      videos={INITIAL_LIBRARY_VIDEOS}
      onSelectVideoForCanvas={handleSelectFromLibrary}
    />
  );
}
