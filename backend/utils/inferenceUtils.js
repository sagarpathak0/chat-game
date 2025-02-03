const { exec } = require("child_process");

async function runInference(input) {
    return new Promise((resolve, reject) => {
        const scriptPath = './data/predict_emotion.py'; // Updated to relative path

        exec(`python "${scriptPath}" "${input}"`, (error, stdout, stderr) => {
            if (error) {
                console.error("Error executing Python script:", error);
                reject({ error: `Python script execution error: ${stderr || error.message}` });
            } 
            else {
                console.log("stdout:", stdout);
                resolve(stdout);
            }
        });
    });
}

module.exports = { runInference };
