const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios"); // Use axios to call the API

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
        const response = await axios.post("http://localhost:8080/predict", { text: input }, {
            headers: { "Content-Type": "application/json" }
        });
        
        console.log("Inference Response:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error during inference:", error);
        res.status(500).json({ error: error.response?.data || "Internal server error during inference" });
    }
});

module.exports = router;
