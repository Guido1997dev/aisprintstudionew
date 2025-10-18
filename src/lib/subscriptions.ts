/**
 * Subscription & Feature System
 * Defines features per subscription tier
 */

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface FeatureConfig {
  chat: {
    enabled: boolean;
    model: 'gpt-4o-mini' | 'gpt-4o';
    limit: number | null;
  };
  insights: boolean;
  triggering: boolean;
  custom_branding: boolean;
  scheduling: boolean;
  api_access: boolean;
  max_workflows: number | null;
  max_team_members: number | null;
}

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, FeatureConfig> = {
  free: {
    chat: {
      enabled: true,
      model: 'gpt-4o-mini',
      limit: 100,
    },
    insights: false,
    triggering: false,
    custom_branding: false,
    scheduling: false,
    api_access: false,
    max_workflows: 1,
    max_team_members: 1,
  },
  pro: {
    chat: {
      enabled: true,
      model: 'gpt-4o',
      limit: 1000,
    },
    insights: true,
    triggering: true,
    custom_branding: false,
    scheduling: false,
    api_access: false,
    max_workflows: 10,
    max_team_members: 5,
  },
  enterprise: {
    chat: {
      enabled: true,
      model: 'gpt-4o',
      limit: null,
    },
    insights: true,
    triggering: true,
    custom_branding: true,
    scheduling: true,
    api_access: true,
    max_workflows: null,
    max_team_members: null,
  },
};

export interface PricingOption {
  tier: SubscriptionTier;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  cta: string;
  stripePriceId?: string;
}

export const PRICING_OPTIONS: PricingOption[] = [
  {
    tier: 'free',
    name: 'Starter',
    price: 0,
    currency: 'EUR',
    interval: 'month',
    description: 'Perfect for trying out the platform',
    features: [
      'Chat interface (100 messages/month)',
      'Powered by GPT-4o-mini',
      '1 workflow',
      '1 team member',
      'Community support',
    ],
    cta: 'Get Started Free',
  },
  {
    tier: 'pro',
    name: 'Professional',
    price: 29,
    currency: 'EUR',
    interval: 'month',
    description: 'For teams that need workflow insights',
    features: [
      'Everything in Starter',
      'Workflow insights & analytics',
      'Workflow triggering',
      '1000 messages/month',
      '10 workflows',
      '5 team members',
      'Priority support',
      '14-day free trial',
    ],
    cta: 'Start Free Trial',
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    price: 0,
    currency: 'EUR',
    interval: 'month',
    description: 'For large organizations with custom needs',
    features: [
      'Everything in Professional',
      'Custom branding',
      'Workflow scheduling',
      'API access',
      'Unlimited messages',
      'Unlimited workflows',
      'Unlimited team members',
      '24/7 dedicated support',
    ],
    cta: 'Contact Sales',
  },
];

export interface FeatureAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stripePriceId?: string;
}

export const FEATURE_ADD_ONS: FeatureAddOn[] = [
  {
    id: 'custom-branding',
    name: 'Custom Branding',
    description: 'White-label your dashboard with custom colors and logo',
    price: 10,
    currency: 'EUR',
  },
  {
    id: 'api-access',
    name: 'API Access',
    description: 'Full API access to integrate with your own applications',
    price: 15,
    currency: 'EUR',
  },
  {
    id: 'scheduling',
    name: 'Workflow Scheduling',
    description: 'Schedule workflows to run at specific times',
    price: 5,
    currency: 'EUR',
  },
  {
    id: 'premium-support',
    name: 'Premium Support',
    description: '24/7 priority support with dedicated account manager',
    price: 20,
    currency: 'EUR',
  },
];

export function getFeatures(tier: SubscriptionTier): FeatureConfig {
  return SUBSCRIPTION_TIERS[tier];
}

export function hasFeature(
  tier: SubscriptionTier,
  feature: keyof FeatureConfig
): boolean {
  const features = getFeatures(tier);
  const value = features[feature];

  if (typeof value === 'boolean') {
    return value;
  }

  return false;
}

export function getFeatureLimit(
  tier: SubscriptionTier,
  feature: keyof FeatureConfig
): number | null {
  const features = getFeatures(tier);
  const value = features[feature];

  if (typeof value === 'number') {
    return value;
  }

  return null;
}

export function formatPrice(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
  }).format(amount);
}

export const TRIAL_PERIOD_DAYS = 14;

export function isTrialActive(trialEndDate: string | null): boolean {
  if (!trialEndDate) return false;
  return new Date(trialEndDate) > new Date();
}

export function getDaysRemainingInTrial(trialEndDate: string | null): number {
  if (!trialEndDate) return 0;

  const end = new Date(trialEndDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return Math.max(0, days);
}
