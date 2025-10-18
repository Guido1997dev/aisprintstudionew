'use client';

import { useTenant } from '@/contexts/tenant-context';
import type { FeatureConfig } from '@/lib/subscriptions';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FeatureGateProps {
  feature: keyof FeatureConfig;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
}: FeatureGateProps) {
  const { features, subscriptionTier } = useTenant();
  const value = features[feature];
  const isEnabled = typeof value === 'boolean' ? value : false;

  if (isEnabled) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const featureNames: Record<keyof FeatureConfig, string> = {
    chat: 'Chat Interface',
    insights: 'Workflow Insights',
    triggering: 'Workflow Triggering',
    custom_branding: 'Custom Branding',
    scheduling: 'Workflow Scheduling',
    api_access: 'API Access',
    max_workflows: 'Multiple Workflows',
    max_team_members: 'Team Members',
  };

  const featureName = featureNames[feature];

  return (
    <Alert variant="default" className="border-blue-200 bg-blue-50">
      <AlertCircle className="h-4 w-4 text-blue-600" />
      <AlertDescription className="ml-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-blue-900">{featureName} not available</p>
            <p className="text-sm text-blue-800">
              {subscriptionTier === 'free'
                ? `Upgrade to Professional to access ${featureName}`
                : `Contact support to enable ${featureName}`}
            </p>
          </div>
          {subscriptionTier === 'free' && (
            <Link href="/pricing">
              <Button size="sm" variant="outline">
                Upgrade Now
              </Button>
            </Link>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

interface UpgradePromptProps {
  feature: string;
  tier?: 'pro' | 'enterprise';
}

export function UpgradePrompt({ feature, tier = 'pro' }: UpgradePromptProps) {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900">Unlock {feature}</h3>
          <p className="text-sm text-yellow-800 mt-1">
            Upgrade to our{' '}
            <span className="font-medium capitalize">{tier}</span> plan to access {feature}.
          </p>
          <Link href="/pricing">
            <Button size="sm" className="mt-3">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
