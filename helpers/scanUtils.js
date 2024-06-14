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

      const cmd = `sudo ${nucleiCmd} -target http://${ip} -t ${templatePath} -je ${nucleiCmd}.json`;
      console.log("Command: ",cmd)
      exec(cmd, { cwd: path.resolve(__dirname, '..') }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Nuclei scan: ${stderr}`);
          return reject(`Nuclei scan failed: ${stderr}`);
        }

        try {
          const results = JSON.parse(stdout);
          
          // Read the file
          fs.readFile(`${nucleiCmd}.json`, 'utf8', (err, data) => {
            if (err) {
              console.error(`Error reading Nuclei scan output file: ${err}`);
              reject(`Failed to read Nuclei scan output file: ${err}`);
              return;
            }
            
            // Parse the file content
            const fileContent = JSON.parse(data);
            
            // Send back the results
            resolve({
              scanResults: results,
              fileContent: fileContent
            });
          });
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
