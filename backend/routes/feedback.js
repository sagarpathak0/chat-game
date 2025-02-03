const express = require('express');
const router = express.Router();
const pool = require("../config/config");

// POST /api/interactions - To submit interaction data (sentence, prediction, confidence score)
router.post('/feedback', async (req, res) => {
    const { sentence, model_prediction, confidence_score, user_feedback, correct_emotion } = req.body;

    // Validate input
    if (!sentence || !model_prediction || !confidence_score) {
        return res.status(400).json({
            error: 'All fields (sentence, model_prediction, confidence_score, user_feedback, correct_emotion) are required'
        });
    }

    try {
        // Insert interaction into the user_interactions table
        const insertInteractionQuery = `
            INSERT INTO user_interactions (sentence, model_prediction, confidence_score, user_feedback, correct_emotion)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        const interactionValues = [sentence, model_prediction, confidence_score, user_feedback, correct_emotion];
        const interactionResult = await pool.query(insertInteractionQuery, interactionValues);
        const interaction_id = interactionResult.rows[0].id;  // The generated interaction_id

        // Return the interaction_id to be used for feedback submission
        res.status(200).json({
            message: 'Interaction saved successfully',
            interaction_id: interaction_id,
        });
    } catch (error) {
        console.error('Error saving interaction:', error);
        res.status(500).json({ error: 'An error occurred while saving the interaction' });
    }
});

// POST /api/feedback - To submit feedback data (user_feedback)
// router.post('/feedback', async (req, res) => {
//     const { interaction_id, user_feedback } = req.body;

//     // Validate input
//     if (!interaction_id || !user_feedback) {
//         return res.status(400).json({
//             error: 'Both interaction_id and user_feedback are required'
//         });
//     }

//     try {
//         // Insert feedback into the feedback table
//         const feedbackQuery = `
//             INSERT INTO feedback (interaction_id, user_feedback)
//             VALUES ($1, $2)
//             RETURNING id, interaction_id, user_feedback, timestamp;
//         `;
//         const feedbackValues = [interaction_id, user_feedback];

//         const feedbackResult = await pool.query(feedbackQuery, feedbackValues);

//         // Return the inserted feedback record
//         res.status(200).json({
//             message: 'Feedback submitted successfully',
//             feedback: feedbackResult.rows[0],  // Return the inserted feedback record
//         });
//     } catch (error) {
//         console.error('Error inserting feedback:', error);
//         res.status(500).json({ error: 'An error occurred while saving the feedback' });
//     }
// });

module.exports = router;
