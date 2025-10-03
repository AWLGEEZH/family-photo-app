#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Family Photo App - Deployment Setup');
console.log('======================================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: Please run this script from the project root directory');
  process.exit(1);
}

// Generate JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Create .env.production if it doesn't exist
const envProductionPath = '.env.production';
if (!fs.existsSync(envProductionPath)) {
  const envTemplate = fs.readFileSync('.env.production.template', 'utf8');
  const envContent = envTemplate.replace(
    'JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long',
    `JWT_SECRET=${jwtSecret}`
  );

  fs.writeFileSync(envProductionPath, envContent);
  console.log('✅ Created .env.production with generated JWT secret');
} else {
  console.log('✅ .env.production already exists');
}

// Create client/.env.production if it doesn't exist
const clientEnvPath = 'client/.env.production';
if (!fs.existsSync(clientEnvPath)) {
  const clientEnvTemplate = fs.readFileSync('client/.env.production.template', 'utf8');
  fs.writeFileSync(clientEnvPath, clientEnvTemplate);
  console.log('✅ Created client/.env.production');
} else {
  console.log('✅ client/.env.production already exists');
}

// Check if .gitignore includes environment files
const gitignorePath = '.gitignore';
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  if (!gitignoreContent.includes('.env.production')) {
    fs.appendFileSync(gitignorePath, '\n# Production environment files\n.env.production\nclient/.env.production\n');
    console.log('✅ Added environment files to .gitignore');
  } else {
    console.log('✅ Environment files already in .gitignore');
  }
}

console.log('\n📋 Next Steps:');
console.log('==============');
console.log('1. Update .env.production with your actual values:');
console.log('   - MONGODB_URI (MongoDB Atlas connection string)');
console.log('   - CLOUDINARY credentials');
console.log('   - CLIENT_URL (your Vercel URL)');
console.log('');
console.log('2. Update client/.env.production with:');
console.log('   - REACT_APP_API_URL (your Railway backend URL)');
console.log('');
console.log('3. Push your code to GitHub');
console.log('4. Deploy backend to Railway');
console.log('5. Deploy frontend to Vercel');
console.log('');
console.log('🔑 Generated JWT Secret:');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('');
console.log('💡 This secret has been added to .env.production');
console.log('🔒 Never share this secret or commit it to version control');