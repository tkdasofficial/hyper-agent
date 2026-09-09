'use client';

import React from 'react';
import { WorkflowsView } from '@/components/WorkflowsView';
import { useSession } from '@/lib/session-context';

export default function WorkflowsPage() {
  const { workflows } = useSession();

  return <WorkflowsView initialWorkflows={workflows} />;
}
