'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import type { Company } from '@/lib/supabase';
import type { SubscriptionTier, FeatureConfig } from '@/lib/subscriptions';
import { getFeatures } from '@/lib/subscriptions';

interface TenantContextType {
  company: Company | null;
  subscriptionTier: SubscriptionTier;
  features: FeatureConfig;
  isLoading: boolean;
  error: string | null;
  companyId: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setCompany(null);
      setSubscriptionTier('free');
      setIsLoading(false);
      return;
    }

    const loadCompanyData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const mockCompany: Company = {
          id: `company-${user.company}`,
          name: user.company,
          slug: user.company.toLowerCase().replace(/\s+/g, '-'),
          subscription_tier: 'free',
          subscription_start: null,
          subscription_end: null,
          trial_end_date: null,
          created_at: new Date().toISOString(),
          custom_branding: null,
          metadata: null,
        };

        setCompany(mockCompany);
        setSubscriptionTier(mockCompany.subscription_tier);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load company data';
        setError(errorMessage);
        console.error('Error loading company:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyData();
  }, [user]);

  const features = getFeatures(subscriptionTier);

  return (
    <TenantContext.Provider
      value={{
        company,
        subscriptionTier,
        features,
        isLoading,
        error,
        companyId: company?.id || null,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

export function useFeature(feature: keyof FeatureConfig): boolean {
  const { features } = useTenant();
  const value = features[feature];

  if (typeof value === 'boolean') {
    return value;
  }

  return false;
}

export function useFeatureLimit(feature: keyof FeatureConfig): number | null {
  const { features } = useTenant();
  const value = features[feature];

  if (typeof value === 'number') {
    return value;
  }

  return null;
}






