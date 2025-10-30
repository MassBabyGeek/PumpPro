/**
 * Feature flags configuration
 * Enable or disable features in development
 */

interface FeatureFlags {
  enableSocialFeatures: boolean;
  // Add other feature flags here as needed
  // enableNotifications: boolean;
  // enablePremiumFeatures: boolean;
}

const features: FeatureFlags = {
  // Social features - Set to true when backend is ready
  // When false, shows skeleton/placeholder UI
  // When true, shows real data and functionality
  enableSocialFeatures: false,
};

export default features;
