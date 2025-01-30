// prediction.js
const express = require("express");
const dotenv = require("dotenv");
const { exec } = require("child_process");

dotenv.config();

const router = express.Router();

// Route to get predictions
router.post("/get-predictions", async (req, res) => {
    console.log("acknowledged");
    const { input } = req.body;

    if (!input || typeof input !== 'string') {
        return res.status(400).json({ error: "Invalid input text" });
    }

    try {
        const inferenceResponse = await runInference(input);
        console.log("Inference Response:", inferenceResponse);
        
        // Extract only the JSON part from the response
        const jsonMatch = inferenceResponse.match(/\{.*\}/);
        if (!jsonMatch) {
            throw new Error("No valid JSON found in response");
        }
        
        const parsedResponse = JSON.parse(jsonMatch[0]);
        console.log("Parsed Response:", parsedResponse);
        res.json(parsedResponse);
    } catch (error) {
        console.error("Error during inference:", error);
        res.status(500).json({ error: error.message || "Internal server error during inference" });
    }
});

async function runInference(input) {
    return new Promise((resolve, reject) => {
        const scriptPath = 'C:/Users/sagar/OneDrive/desktop/dev/ecom/backend/data/predict_emotion.py';

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

module.exports = router;