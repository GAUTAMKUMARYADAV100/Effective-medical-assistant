import express from "express";
import { spawn } from "child_process";
import multer from "multer";
import path from "path";

const router = express.Router();

//const path = require('path');

const diabetesModel = path.resolve("diabetes.pkl");
const heartModel = path.resolve("heart.pkl");
const kidneyModel = path.resolve("model_ckd.pkl");
const kidneyScaler = path.resolve("scaler_ckd.pkl");

const liverModel = path.resolve("../aimodels/liver.pkl");
const liverScalerModel = path.resolve("../aimodels/liver_standard_scaler.pkl");

const breastCancerModel = path.resolve("breast_cancer_model.pkl");

const pythonScriptPathForDiabetes = path.resolve("predict.py");
const pythonScriptPathForHeart = path.resolve("heart.py");
const pythonScriptPathForKidney = path.resolve("kidney.py");
const pythonScriptPathForLiver = path.resolve("kidney.py");  // same as kidney here
const pythonScriptPathForBreastCancer = path.resolve("breast-cancer.py");

router.post("/diabetes", (req, res) => {
  try {
    const data = req.body.data;
    const pythonProcess = spawn("python", [
      pythonScriptPathForDiabetes,
      "--loads",
      diabetesModel,
      JSON.stringify(data),
      "diabetes",
    ]);
    let prediction = "";
    let responseSent = false; // Flag to track if response has been sent

    pythonProcess.stdout.on("data", (data) => {
      console.log("Python script output:", data.toString());
      prediction += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process closed with code:", code);
      console.log("Prediction:", prediction);
      if (!responseSent) {
        res.json({ prediction });
        responseSent = true;
      }
    });

    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error);
      if (!responseSent) {
        res.status(500).send("Internal Server Error");
        responseSent = true;
      }
    });
  } catch (error) {
    console.error("Error:", error);
    if (!responseSent) {
      res.status(500).send("Internal Server Error");
      responseSent = true;
    }
  }
});
router.post("/heart", (req, res) => {
  try {
    console.log("python script run hui p1")
    const data = req.body.data;
    const pythonProcess = spawn("python", [
      pythonScriptPathForHeart,
      "--loads",
      heartModel,
      JSON.stringify(data),
      "heart",
    ]);
    let prediction = "";
    let responseSent = false; // Flag to track if response has been sent
    console.log("python script run hui p2")

    pythonProcess.stdout.on("data", (data) => {
      const output = data.toString().trim(); 
      console.log("Python script raw output:", output);
    
      // Try to extract JSON part (last line)
      const lines = output.split("\n");
      const lastLine = lines[lines.length - 1];
    
      try {
        prediction = JSON.parse(lastLine);
      } catch (err) {
        console.error("Error parsing JSON prediction:", err);
        prediction = null;
      }
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process closed with code:", code);
      console.log("Prediction123:", prediction);
      if (!responseSent) {
        console.log("response gaya kya",prediction)
        res.json({ prediction });
        responseSent = true;
      }
    });

    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error);
      if (!responseSent) {
        res.status(500).send("Internal Server Error");
        responseSent = true;
      }
    });
  } catch (error) {
    console.error("Error:", error);
    if (!responseSent) {
      res.status(500).send("Internal Server Error");
      responseSent = true;
    }
  }
});
router.post("/kidney", (req, res) => {
  try {
    const data = req.body.data;
    const pythonProcess = spawn("python", [
      pythonScriptPathForKidney,
      "--loads",
      kidneyModel,
      kidneyScaler,
      JSON.stringify(data),
      'kidney',
    ]);
    let prediction = "";
    let responseSent = false; // Flag to track if response has been sent

    pythonProcess.stdout.on("data", (data) => {
      console.log("Python script output:", data.toString());
      prediction += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process closed with code:", code);
      console.log("Prediction:", prediction);
      if (!responseSent) {
        res.json({ prediction });
        responseSent = true;
      }
    });

    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error);
      if (!responseSent) {
        res.status(500).send("Internal Server Error");
        responseSent = true;
      }
    });
  } catch (error) {
    console.error("Error:", error);
    if (!responseSent) {
      res.status(500).send("Internal Server Error");
      responseSent = true;
    }
  }
});

router.post("/liver", (req, res) => {
  try {
    console.log("Starting liver disease prediction...");

    const data = req.body.data;
    console.log("Received Data:", data);

    const pythonProcess = spawn("python", [
      pythonScriptPathForLiver,
      "--loads",
      liverScalerModel,
      liverModel,
      JSON.stringify(data),
    ]);
    let prediction = "";
    let responseSent = false;

    pythonProcess.stdout.on("data", (data) => {
      const output = data.toString().trim();
      console.log("Python script output:", output);

      const lines = output.split("\n");
      const lastLine = lines[lines.length - 1];

      try {
        prediction = JSON.parse(lastLine);
      } catch (error) {
        console.log("Python script output:", output);
        console.error("Error parsing JSON:", error);
        prediction = null;
      }
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process exited with code:", code);
      console.log("Prediction123:", prediction);
      if (!responseSent) {
        console.log("Prediction:",prediction);
        res.json({ prediction })
        responseSent = true;
      }
    });

    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error);
      if (!responseSent) {
        res.status(500).send("Internal Server Error");
        responseSent = true;
      }
    });

  } catch (error) {
    console.error("Server Error:", error);
    if (!responseSent) {
      res.status(500).send("Internal Server Error");
      responseSent = true;
    }
  }
});

router.post("/breast-cancer", (req, res) => {
  try {
    const data = req.body.data;
    const pythonProcess = spawn("python", [
      pythonScriptPathForBreastCancer,
      "--loads",
      breastCancerModel,
      JSON.stringify(data),
      'breast-cancer',
    ]);
    let prediction = "";
    let responseSent = false; // Flag to track if response has been sent

    pythonProcess.stdout.on("data", (data) => {
      console.log("Python script output:", data.toString());
      prediction += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process closed with code:", code);
      console.log("Prediction:", prediction);
      if (!responseSent) {
        res.json({ prediction });
        responseSent = true;
      }
    });

    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error);
      if (!responseSent) {
        res.status(500).send("Internal Server Error");
        responseSent = true;
      }
    });
  } catch (error) {
    console.error("Error:", error);
    if (!responseSent) {
      res.status(500).send("Internal Server Error");
      responseSent = true;
    }
  }
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.post("/predict-pneumonia", upload.single("image"), (req, res) => {
  try {
    // Get the uploaded image file path
    const imagePath = req.file.path;

    // Path to the Python script for pneumonia prediction
    const pythonScriptPathForPneumonia = path.resolve("pneumonia.py");

    // Spawn a Python process to execute the prediction script
    const pythonProcess = spawn("python", [
      pythonScriptPathForPneumonia,
      imagePath,
    ]);

    let prediction = "";
    let responseSent = false; // Flag to track if response has been sent

    pythonProcess.stdout.on("data", (data) => {
      console.log("Python script output:", data.toString());
      prediction += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process closed with code:", code);
      console.log("Prediction:", prediction);
      if (!responseSent) {
        res.json({ prediction });
        responseSent = true;
      }
    });

    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error);
      if (!responseSent) {
        res.status(500).send("Internal Server Error");
        responseSent = true;
      }
    });
  } catch (error) {
    console.error("Error:", error);
    if (!responseSent) {
      res.status(500).send("Internal Server Error");
      responseSent = true;
    }
  }
});

router.post("/predict-malaria", upload.single("image"), (req, res) => {
  try {
    // Get the uploaded image file path
    const imagePath = req.file.path;

    // Path to the Python script for pneumonia prediction
    const pythonScriptPathForPneumonia = path.resolve("malaria.py");

    // Spawn a Python process to execute the prediction script
    const pythonProcess = spawn("python", [
      pythonScriptPathForPneumonia,
      imagePath,
    ]);

    let prediction = "";
    let responseSent = false; // Flag to track if response has been sent

    pythonProcess.stdout.on("data", (data) => {
      console.log("Python script output:", data.toString());
      prediction += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process closed with code:", code);
      console.log("Prediction:", prediction);
      if (!responseSent) {
        res.json({ prediction });
        responseSent = true;
      }
    });

    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error);
      if (!responseSent) {
        res.status(500).send("Internal Server Error");
        responseSent = true;
      }
    });
  } catch (error) {
    console.error("Error:", error);
    if (!responseSent) {
      res.status(500).send("Internal Server Error");
      responseSent = true;
    }
  }
});


router.post("/predict-eye-disease", upload.single("image"), (req, res) => {
  let responseSent = false;
  let errorOutput = ""; // To capture all error output

  try {
    const imagePath = req.file.path;
    const pythonScriptPath = path.resolve("eye_disease.py");

    const pythonProcess = spawn("python", [pythonScriptPath, imagePath]);

    let output = "";
    console.log("Process started, waiting for output...");

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
      console.log("Python stdout:", data.toString());
    });

    pythonProcess.stderr.on("data", (data) => {
      const errorData = data.toString();
      errorOutput += errorData;
      console.error("Python stderr:", errorData);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);
      console.log("Full output:", output);
      console.log("Full error output:", errorOutput);
      
      try {
        if (code !== 0) {
          throw new Error(`Python script failed with code ${code}: ${errorOutput}`);
        }

        const parsedOutput = JSON.parse(output.trim());
        if (!responseSent) {
          res.json(parsedOutput);
          responseSent = true;
        }
      } catch (err) {
        console.error("Error handling output:", err);
        if (!responseSent) {
          res.status(500).json({
            error: "Prediction failed",
            details: errorOutput || err.message
          });
          responseSent = true;
        }
      }
    });

    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error);
      if (!responseSent) {
        res.status(500).json({
          error: "Failed to start Python process",
          details: error.message
        });
        responseSent = true;
      }
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    if (!responseSent) {
      res.status(500).json({
        error: "Internal server error",
        details: error.message
      });
      responseSent = true;
    }
  }
});
export default router;
