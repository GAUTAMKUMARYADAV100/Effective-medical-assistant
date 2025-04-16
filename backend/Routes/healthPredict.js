import express from "express";
import { spawn } from "child_process";
import path from "path";

const router = express.Router({ mergeParams: true });

const pythonScriptPathForSymptoms = path.resolve("symptoms.py")
const symptomsModel = path.resolve("svc.pkl");

router.post("/symptoms", (req, res) => {
  let responseSent = false;

  try {
    const data = req.body.data;
    console.log("Data received for symptom.py:", data);
    console.log({ dataInString: JSON.stringify({ data }) });

    const pythonProcess = spawn("python", [
      pythonScriptPathForSymptoms,
      "--loads",
      symptomsModel,
      JSON.stringify({ data }),
    ]);

    let outputData = "";

    // Handle stdout
    pythonProcess.stdout.on("data", (data) => {
      const dataString = data.toString().trim();


      // Filter out symptom warnings
      if (dataString.includes("symptom '")) {
        console.warn("Skipping symptom warning:", dataString);
        return;
      }

      console.log("Raw Python script output:", dataString);

      // Collect valid output
      outputData += dataString;
    });

    // Handle stderr
    pythonProcess.stderr.on("data", (data) => {
      const errorMessage = data.toString().trim();

      // Ignore sklearn warnings
      if (
        errorMessage.includes("InconsistentVersionWarning") ||
        errorMessage.includes("UserWarning")
      ) {
        console.warn("Non-critical Python warning:", errorMessage);
        return;
      }

      console.error("Python script error:", errorMessage);
      if (!responseSent) {
        res.status(500).json({ error: errorMessage });
        responseSent = true;
      }
    });

    // On process close
    pythonProcess.on("close", (code) => {
      console.log(`Python process closed with code: ${code}`);

      if (!responseSent) {
        try {
          // Extract only valid JSON part using regex
          const jsonMatch = outputData.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            let prediction = JSON.parse(jsonMatch[0]);
        
            // Clean up "workout" data if it's an array
            if (Array.isArray(prediction.workout)) {
              prediction.workout = prediction.workout
                .map((line) => line.replace(/^\d+\s*/, "").trim())
                .join(", ");
            }
        
            console.log("Parsed prediction:", prediction);
            res.json({ data: prediction });
          } else {
            throw new Error("Invalid JSON format in Python output");
          }
        } catch (parseError) {
          console.error("Failed to parse Python output:", parseError);
          res.status(500).json({
            error: "Invalid response format from Python script",
            rawOutput: outputData,
          });
        }
        responseSent = true;
      }
    });

    // Handle process error
    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error);
      if (!responseSent) {
        res.status(500).json({ error: "Internal Server Error" });
        responseSent = true;
      }
    });
  } catch (error) {
    console.error("Error:", error);
    if (!responseSent) {
      res.status(500).json({ error: "Internal Server Error" });
      responseSent = true;
    }
  }
});

export default router;
