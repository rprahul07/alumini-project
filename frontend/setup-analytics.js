#!/usr/bin/env node

/**
 * Analytics Setup Script
 * This script helps you set up Google Analytics for the Alumni Portal
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Google Analytics Setup for Alumni Portal\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Environment Variables for Alumni Portal
# Copy this file to .env for local development

# API Configuration
VITE_API_BASE_URL=http://localhost:5001

# Google Analytics Configuration
# Replace with your actual Google Analytics 4 Measurement ID
VITE_GA_MEASUREMENT_ID=G-EYT378V7XP

# Development Settings
VITE_DEBUG=true
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
} else {
  console.log('✅ .env file already exists');
}

// Check if measurement ID is set
const envContent = fs.readFileSync(envPath, 'utf8');
const hasMeasurementId = envContent.includes('VITE_GA_MEASUREMENT_ID=') && 
                        !envContent.includes('VITE_GA_MEASUREMENT_ID=G-EYT378V7XP');

if (!hasMeasurementId) {
  console.log('\n⚠️  IMPORTANT: You need to set your Google Analytics Measurement ID');
  console.log('   1. Go to https://analytics.google.com/');
  console.log('   2. Create a new GA4 property or use an existing one');
  console.log('   3. Get your Measurement ID (starts with G-)');
  console.log('   4. Update the VITE_GA_MEASUREMENT_ID in your .env file');
  console.log('   5. Restart your development server');
} else {
  console.log('✅ Google Analytics Measurement ID is configured');
}

console.log('\n🚀 Next steps:');
console.log('   1. Update VITE_GA_MEASUREMENT_ID in .env with your actual ID');
console.log('   2. Run: npm run dev');
console.log('   3. Check browser console for analytics debug logs');
console.log('   4. Verify tracking in Google Analytics Real-time reports');

console.log('\n📊 Debug Information:');
console.log('   - Analytics will show debug logs in browser console');
console.log('   - Look for "Analytics Service Constructor" and "Analytics Config Debug"');
console.log('   - Events will be tracked once properly configured');
