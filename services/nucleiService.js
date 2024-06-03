const { exec } = require('child_process');

exports.scan = (target) => {
    return new Promise((resolve, reject) => {
        exec(`nuclei -u ${target}`, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
};
