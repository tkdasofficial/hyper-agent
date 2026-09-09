'use client';

import React from 'react';
import { IntegrationsView } from '@/components/IntegrationsView';
import { useSession } from '@/lib/session-context';

export default function IntegrationsPage() {
  const { integrations } = useSession();

  return <IntegrationsView initialIntegrations={integrations} />;
}
