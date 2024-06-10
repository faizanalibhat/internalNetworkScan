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
      let nucleiCmd = path.resolve(__dirname, '..', 'tools', 'nuclei');

      const cmd = `sudo ${nucleiCmd} -target ${ip} -t ${templatePath}`;
      console.log("Command: ",cmd)
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
};

module.exports = {
  performNucleiScan
};
