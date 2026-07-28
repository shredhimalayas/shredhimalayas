/**
 * Firestore Rules Deployment Script
 * Deploys security rules to Firebase project "shredhimalayas"
 * using the Firebase CLI token approach.
 * 
 * Usage: node deploy-rules.js <FIREBASE_TOKEN>
 * Get token by running: npx firebase-tools login:ci
 */

const https = require('https');
const fs = require('fs');

const PROJECT_ID = 'shredhimalayas';
const RULES_SOURCE = fs.readFileSync('./firestore.rules', 'utf8');

// Read token from argument or environment
const token = process.argv[2] || process.env.FIREBASE_TOKEN;

if (!token) {
  console.error('ERROR: Firebase token required.');
  console.error('Run: npx firebase-tools login:ci');
  console.error('Then: node deploy-rules.js <TOKEN>');
  process.exit(1);
}

const releaseBody = JSON.stringify({
  name: `projects/${PROJECT_ID}/releases/cloud.firestore`,
  rulesetName: '' // Will be updated after ruleset creation
});

// Step 1: Create a new ruleset
function createRuleset() {
  const body = JSON.stringify({
    source: {
      files: [{
        name: 'firestore.rules',
        content: RULES_SOURCE
      }]
    }
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'firebaserules.googleapis.com',
      path: `/v1/projects/${PROJECT_ID}/rulesets`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const ruleset = JSON.parse(data);
          console.log('✅ Ruleset created:', ruleset.name);
          resolve(ruleset.name);
        } else {
          reject(new Error(`Ruleset creation failed: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Step 2: Create a release pointing to the ruleset
function createRelease(rulesetName) {
  const body = JSON.stringify({
    name: `projects/${PROJECT_ID}/releases/cloud.firestore`,
    rulesetName: rulesetName
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'firebaserules.googleapis.com',
      path: `/v1/projects/${PROJECT_ID}/releases`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Release created — rules deployed!');
          resolve(JSON.parse(data));
        } else if (res.statusCode === 409) {
          // Release already exists — patch it
          patchRelease(rulesetName).then(resolve).catch(reject);
        } else {
          reject(new Error(`Release creation failed: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Step 2b: Patch existing release
function patchRelease(rulesetName) {
  const body = JSON.stringify({
    rulesetName: rulesetName
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'firebaserules.googleapis.com',
      path: `/v1/projects/${PROJECT_ID}/releases/cloud.firestore`,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Release updated — rules deployed!');
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Release patch failed: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

console.log('🚀 Deploying Firestore rules to project:', PROJECT_ID);
createRuleset()
  .then(createRelease)
  .then(() => {
    console.log('');
    console.log('🎉 SUCCESS! Firestore rules deployed.');
    console.log('Real-time sync will now work on all devices.');
  })
  .catch(err => {
    console.error('❌ Deployment failed:', err.message);
    process.exit(1);
  });
