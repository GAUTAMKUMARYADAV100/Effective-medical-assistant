import express from "express";
import axios from "axios";


const router = express.Router({ mergeParams: true });

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME;

router.post("/symptoms", async (req, res) => {
    let responseSent = false;

    try {
        console.log("Received request at /llm/symptoms");
        console.log("Request body:", req.body);
        console.log("model name"+MODEL_NAME+"Huggingapi"+HUGGINGFACE_API_KEY);

        const symptoms = req.body.data;
        if (!symptoms || typeof symptoms !== "string") {
            console.error("Invalid symptoms format");
            return res.status(400).json({ error: "Invalid symptoms format. Expected a comma-separated string." });
        }

        console.log("Symptoms received:", symptoms);

        // Preparing prompt for LLM
        const prompt = `Given symptoms: ${symptoms}, predict the disease and return JSON format:
{
  "predicted_disease": "...",
  "dis_des": "...",
  "my_precautions": [...],
  "medications": [...],
  "rec_diet": [...],
  "workout": "...",
  "warnings": [...]
}`;

        console.log("Generated prompt:", prompt);

        // Sending request to Hugging Face API
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${MODEL_NAME}`,
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Raw response from Hugging Face:", response.data);

        // Extracting response from Hugging Face API
        const llmResponse = response.data;
        
        if (!llmResponse || !llmResponse[0] || !llmResponse[0].generated_text) {
            console.error("Invalid response from LLM");
            return res.status(500).json({ error: "Invalid response from LLM." });
        }

        console.log("Generated text from LLM:", llmResponse[0].generated_text);

        // Parse the JSON response from the LLM output
        let parsedData;
        try {
            parsedData = JSON.parse(llmResponse[0].generated_text);
            console.log("Parsed JSON response:", parsedData);
        } catch (error) {
            console.error("Failed to parse LLM response:", error);
            return res.status(500).json({ error: "Failed to parse LLM response." });
        }

        responseSent = true;
        return res.json(parsedData);
    } catch (error) {
        console.error("Error fetching from Hugging Face:", error);
        if (!responseSent) {
            return res.status(500).json({ error: "Internal server error. Please try again later." });
        }
    }
});

export default router;
