const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Split the version string into major, minor, and patch parts
const versionParts = packageJson.version.split('.');
const patchVersion = parseInt(versionParts[2], 10) + 1;  // Increment the patch version
versionParts[2] = patchVersion.toString();

// Update the version in package.json
packageJson.version = versionParts.join('.');

// Write the updated package.json back to disk
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Write the version to version.json
const versionJsonPath = path.join(__dirname, 'version.json');
fs.writeFileSync(versionJsonPath, JSON.stringify({ version: packageJson.version }, null, 2));

console.log(`Version bumped to ${packageJson.version}`);