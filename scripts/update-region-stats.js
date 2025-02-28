// scripts/update-region-stats.js
/**
 * This script can be used to update region statistics manually or within automated processes.
 * It can be run from the command line using: node scripts/update-region-stats.js
 */

// Load environment variables
require('dotenv').config();

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CRON_SECRET = process.env.CRON_SECRET || 'default-cron-secret';

async function triggerStatsUpdate() {
  try {
    console.log('Triggering region statistics update...');
    
    const url = `${BASE_URL}/api/cron/update-region-stats?key=${CRON_SECRET}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update statistics: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Success: ${result.message}`);
      console.log(`Timestamp: ${result.timestamp}`);
    } else {
      console.error(`❌ Error: ${result.message}`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error triggering region statistics update:', error);
    process.exit(1);
  }
}

// Execute the function
triggerStatsUpdate();