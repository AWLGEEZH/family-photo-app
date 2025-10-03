#!/usr/bin/env node

const https = require('https');
const http = require('http');

console.log('🔍 Family Photo App - Deployment Verification');
console.log('==============================================\n');

// Helper function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;

    const req = protocol.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Test backend health endpoint
async function testBackend(backendUrl) {
  console.log(`🔧 Testing Backend: ${backendUrl}`);

  try {
    const response = await makeRequest(`${backendUrl}/api/health`);

    if (response.statusCode === 200) {
      const healthData = JSON.parse(response.data);
      console.log('✅ Backend Health Check: PASSED');
      console.log(`   Status: ${healthData.status}`);
      console.log(`   Environment: ${healthData.environment}`);
      console.log(`   Timestamp: ${healthData.timestamp}`);
      return true;
    } else {
      console.log(`❌ Backend Health Check: FAILED (Status: ${response.statusCode})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Backend Health Check: FAILED (${error.message})`);
    return false;
  }
}

// Test frontend accessibility
async function testFrontend(frontendUrl) {
  console.log(`\n🎨 Testing Frontend: ${frontendUrl}`);

  try {
    const response = await makeRequest(frontendUrl);

    if (response.statusCode === 200) {
      console.log('✅ Frontend Accessibility: PASSED');
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   Content-Type: ${response.headers['content-type']}`);

      // Check if it's actually React app
      if (response.data.includes('react') || response.data.includes('React') || response.data.includes('root')) {
        console.log('✅ React App Detection: PASSED');
        return true;
      } else {
        console.log('⚠️  React App Detection: Could not detect React app');
        return true; // Still consider it passed
      }
    } else {
      console.log(`❌ Frontend Accessibility: FAILED (Status: ${response.statusCode})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Frontend Accessibility: FAILED (${error.message})`);
    return false;
  }
}

// Test CORS configuration
async function testCORS(backendUrl, frontendOrigin) {
  console.log(`\n🌐 Testing CORS Configuration`);

  return new Promise((resolve) => {
    const protocol = backendUrl.startsWith('https:') ? https : http;
    const url = new URL(`${backendUrl}/api/health`);

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'OPTIONS',
      headers: {
        'Origin': frontendOrigin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization,Content-Type'
      }
    };

    const req = protocol.request(options, (res) => {
      const corsHeaders = {
        'access-control-allow-origin': res.headers['access-control-allow-origin'],
        'access-control-allow-methods': res.headers['access-control-allow-methods'],
        'access-control-allow-headers': res.headers['access-control-allow-headers'],
        'access-control-allow-credentials': res.headers['access-control-allow-credentials']
      };

      if (corsHeaders['access-control-allow-origin'] === frontendOrigin ||
          corsHeaders['access-control-allow-origin'] === '*') {
        console.log('✅ CORS Configuration: PASSED');
        console.log(`   Allowed Origin: ${corsHeaders['access-control-allow-origin']}`);
        console.log(`   Allowed Methods: ${corsHeaders['access-control-allow-methods']}`);
        resolve(true);
      } else {
        console.log('❌ CORS Configuration: FAILED');
        console.log(`   Expected Origin: ${frontendOrigin}`);
        console.log(`   Allowed Origin: ${corsHeaders['access-control-allow-origin']}`);
        resolve(false);
      }
    });

    req.on('error', (error) => {
      console.log(`❌ CORS Test: FAILED (${error.message})`);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.log('❌ CORS Test: FAILED (Timeout)');
      resolve(false);
    });

    req.end();
  });
}

// Main verification function
async function verifyDeployment() {
  // Get URLs from command line arguments or prompt user
  const args = process.argv.slice(2);

  let backendUrl, frontendUrl;

  if (args.length >= 2) {
    backendUrl = args[0];
    frontendUrl = args[1];
  } else {
    console.log('Usage: npm run deploy:verify <backend-url> <frontend-url>');
    console.log('Example: npm run deploy:verify https://api.railway.app https://app.vercel.app');
    console.log('');

    // Try to read from environment files
    try {
      const fs = require('fs');
      const path = require('path');

      // Try to read backend URL from .env.production
      if (fs.existsSync('.env.production')) {
        const envContent = fs.readFileSync('.env.production', 'utf8');
        const match = envContent.match(/CLIENT_URL=(.+)/);
        if (match) {
          frontendUrl = match[1].trim();
        }
      }

      // Try to read frontend URL from client/.env.production
      if (fs.existsSync('client/.env.production')) {
        const clientEnvContent = fs.readFileSync('client/.env.production', 'utf8');
        const match = clientEnvContent.match(/REACT_APP_API_URL=(.+)/);
        if (match) {
          backendUrl = match[1].trim().replace('/api', '');
        }
      }

      if (!backendUrl || !frontendUrl) {
        console.log('❌ Could not find deployment URLs in environment files');
        console.log('Please provide URLs as arguments or update your environment files');
        process.exit(1);
      }

      console.log(`🔍 Found URLs in environment files:`);
      console.log(`   Backend: ${backendUrl}`);
      console.log(`   Frontend: ${frontendUrl}\n`);

    } catch (error) {
      console.log('❌ Could not read environment files');
      process.exit(1);
    }
  }

  // Run tests
  const results = [];

  results.push(await testBackend(backendUrl));
  results.push(await testFrontend(frontendUrl));
  results.push(await testCORS(backendUrl, frontendUrl));

  // Summary
  console.log('\n📊 Deployment Verification Summary');
  console.log('==================================');

  const passedTests = results.filter(r => r).length;
  const totalTests = results.length;

  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Your deployment is ready for use.');
    console.log('');
    console.log('🌟 Next Steps:');
    console.log('   1. Register a test user account');
    console.log('   2. Create family profiles');
    console.log('   3. Upload your first family photo');
    console.log('   4. Share your family code with relatives');
  } else {
    console.log(`⚠️  ${passedTests}/${totalTests} tests passed. Please check the failed tests above.`);

    if (passedTests < totalTests) {
      console.log('');
      console.log('🔧 Common Issues:');
      console.log('   - Backend not fully deployed yet (wait a few minutes)');
      console.log('   - Environment variables not set correctly');
      console.log('   - CORS configuration needs frontend URL update');
      console.log('   - Network connectivity issues');
    }
  }

  console.log('');
  console.log(`🔗 Your App URLs:`);
  console.log(`   Frontend: ${frontendUrl}`);
  console.log(`   Backend API: ${backendUrl}/api`);
  console.log(`   Backend Health: ${backendUrl}/api/health`);
}

// Run verification
verifyDeployment().catch(console.error);