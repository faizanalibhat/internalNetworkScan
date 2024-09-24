const { exec } = require('child_process');

const execCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
};

exports.scan = () => {
    return new Promise((resolve, reject) => {
        Promise.all([
            execCommand('ip a'),
            execCommand('uname -a')
        ])
            .then(([ipInfo, systemInfo]) => {
                const aggregatedResult = {
                    ipInfo: ipInfo.trim(),
                    systemInfo: systemInfo.trim()
                };
                resolve(aggregatedResult);
            })
            .catch((error) => {
                reject(`Error occurred: ${error}`);
            });
    });
};
