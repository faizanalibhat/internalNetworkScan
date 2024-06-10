const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Perform a Nuclei scan on the given IP address.
 * 
 * @param {string} ip - The IP address to scan.
 * @param {string} templatePath - The path to the Nuclei templates.
 * @returns {Promise<Object>} - A promise that resolves with the scan results.
 */
const performNucleiScan = (ip, templatePath) => {
  return new Promise((resolve, reject) => {
    let nucleiCmd = 'nuclei';
    
    // Check if the 'nuclei' command is available in the system PATH
    exec('command -v nuclei', (error, stdout, stderr) => {
      if (!error && stdout.trim()) {
        nucleiCmd = 'nuclei';
      } else {
        // 'nuclei' command not found, execute the binary from the 'tools' directory
        nucleiCmd = path.resolve(__dirname, '..', 'tools', 'nuclei');
      }

      // Execute the Nuclei scan command
      const cmd = `${nucleiCmd} -target ${ip} -t ${templatePath}`;
      exec(cmd, { cwd: path.resolve(__dirname, '..') }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Nuclei scan: ${stderr}`);
          return reject(`Nuclei scan failed: ${stderr}`);
        }

        try {
          const results = JSON.parse(stdout);
          resolve(results);
        } catch (parseError) {
          console.error(`Error parsing Nuclei scan output: ${parseError}`);
          reject(`Failed to parse Nuclei scan output: ${parseError}`);
        }
      });
    });
  });
};

module.exports = {
  performNucleiScan
};
