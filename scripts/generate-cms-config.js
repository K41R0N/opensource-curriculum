#!/usr/bin/env node

/**
 * CMS Config Generator
 *
 * Generates static/admin/config.yml from config.template.yml using environment variables.
 * Run manually: node scripts/generate-cms-config.js
 * Runs automatically: npm run build (via prebuild hook)
 *
 * Required environment variables:
 *   CMS_REPO     - GitHub username/repo (e.g., "username/repo-name")
 *   CMS_AUTH_URL - Cloudflare Worker URL (e.g., "https://my-auth.workers.dev")
 */

import fs from 'fs';
import path from 'path';

const TEMPLATE_PATH = path.join(process.cwd(), 'static', 'admin', 'config.template.yml');
const OUTPUT_PATH = path.join(process.cwd(), 'static', 'admin', 'config.yml');

// Get environment variables with defaults for local development
const CMS_REPO = process.env.CMS_REPO;
const CMS_AUTH_URL = process.env.CMS_AUTH_URL;

// Check required variables
const missing = [];
if (!CMS_REPO) missing.push('CMS_REPO');
if (!CMS_AUTH_URL) missing.push('CMS_AUTH_URL');

if (missing.length > 0) {
	console.error('Error: Missing required environment variables:');
	missing.forEach(v => console.error(`  - ${v}`));
	console.error('\nSet these in your Netlify dashboard or .env file.');
	console.error('See docs/cms-setup.md for instructions.\n');
	process.exit(1);
}

// Read template
if (!fs.existsSync(TEMPLATE_PATH)) {
	console.error(`Error: Template not found at ${TEMPLATE_PATH}`);
	process.exit(1);
}

let config = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// Replace placeholders
config = config.replace(/\${CMS_REPO}/g, CMS_REPO);
config = config.replace(/\${CMS_AUTH_URL}/g, CMS_AUTH_URL);

// Write output
fs.writeFileSync(OUTPUT_PATH, config);

console.log('✓ Generated static/admin/config.yml');
console.log(`  repo: ${CMS_REPO}`);
console.log(`  auth: ${CMS_AUTH_URL}`);
