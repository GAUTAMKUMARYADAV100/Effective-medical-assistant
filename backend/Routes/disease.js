import express from "express";
import { spawn } from "child_process";
import multer from "multer";
import path from "path";

const router = express.Router();

const diabetesModel = "E:\\Projects\\emaC1\\Effective-medical-assistant\\backend\\aimodels\\diabetes\\diabetes.pkl";
const heartModel = "C:\\Users\\Gautam Kumar Yadav\\Desktop\\tkinterpj\\Effective-medical-assistant\\EffectiveMedicalAssistant\\backend\\aimodels\\heart.pkl";
const kidneyModel = "C:\\Users\\Gautam Kumar Yadav\\Desktop\\tkinterpj\\Effective-medical-assistant\\EffectiveMedicalAssistant\\backend\\aimodels\\kidney.pkl";
const liverModel = "C:\\Users\\Gautam Kumar Yadav\\Desktop\\tkinterpj\\Effective-medical-assistant\\EffectiveMedicalAssistant\\backend\\aimodels\\kidney.pkl";
const breastCancerModel = "E:\\Projects\\emaC1\\Effective-medical-assistant\\backend\\aimodels\\breast_cancer\\breast_cancer_model.pkl";

const pythonScriptPathForDiabetes = "E:\\Projects\\emaC1\\Effective-medical-assistant\\backend\\predict.py";
const pythonScriptPathForHeart = "C:\\Users\\Gautam Kumar Yadav\\Desktop\\tkinterpj\\Effective-medical-assistant\\EffectiveMedicalAssistant\\backend\\heart.py";
const pythonScriptPathForKidney = "C:\\Users\\Gautam Kumar Yadav\\Desktop\\tkinterpj\\Effective-medical-assistant\\EffectiveMedicalAssistant\\backend\\kidney.py";
const pythonScriptPathForLiver = "C:\\Users\\Gautam Kumar Yadav\\Desktop\\tkinterpj\\Effective-medical-assistant\\EffectiveMedicalAssistant\\backend\\kidney.py";
const pythonScriptPathForBreastCancer =
  "E:\\Projects\\emaC1\\Effective-medical-assistant\\backend\\breast-cancer.py";


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
    const data = req.body.data;
    const pythonProcess = spawn("python", [
      pythonScriptPathForLiver,
      "--loads",
      liverModel,
      JSON.stringify(data),
      'liver'
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
    const pythonScriptPathForPneumonia = "C:\\Users\\Gautam Kumar Yadav\\Desktop\\tkinterpj\\Effective-medical-assistant\\EffectiveMedicalAssistant\\backend\\pneumonia.py";

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
    const pythonScriptPathForPneumonia = "C:\\Users\\Gautam Kumar Yadav\\Desktop\\tkinterpj\\Effective-medical-assistant\\EffectiveMedicalAssistant\\backend\\malaria.py";

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
    const pythonScriptPath = "C:\\Users\\Gautam Kumar Yadav\\Desktop\\tkinterpj\\Effective-medical-assistant\\EffectiveMedicalAssistant\\backend\\eye_disease.py";

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
