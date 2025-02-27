// lib/config/cron.ts
/**
 * Configuration settings for various cron jobs in the application
 */

export const CRON_CONFIG = {
    // Region statistics update frequency, following cron syntax
    // Default: Run once per day at midnight (00:00)
    REGION_STATS_SCHEDULE: process.env.REGION_STATS_CRON || '0 0 * * *',
    
    // Base URL for the API endpoints
    BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    
    // Secret key for authentication
    SECRET_KEY: process.env.CRON_SECRET || 'default-cron-secret',
    
    // Endpoints
    ENDPOINTS: {
      UPDATE_REGION_STATS: '/api/cron/update-region-stats',
    },
    
    // Flag to enable or disable cron jobs
    ENABLED: process.env.ENABLE_CRON_JOBS === 'true',
  };
  
  /**
   * Helper function to generate a cron job URL with authentication
   */
  export function getCronUrl(endpoint: keyof typeof CRON_CONFIG.ENDPOINTS): string {
    const baseUrl = CRON_CONFIG.BASE_URL;
    const path = CRON_CONFIG.ENDPOINTS[endpoint];
    const secretKey = CRON_CONFIG.SECRET_KEY;
    
    return `${baseUrl}${path}?key=${secretKey}`;
  }