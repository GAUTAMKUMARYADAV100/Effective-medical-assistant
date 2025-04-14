import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import doctorRoute from "./Routes/doctor.js";
import reviewRoute from "./Routes/review.js";
import bookingRoute from "./Routes/booking.js";
import diseaseRoute from "./Routes/disease.js";
import adminRoute from "./Routes/admin.js";
import contactRoute from "./Routes/contact.js";
import forgotPassRoute from "./Routes/forgot-password.js";
import healthRoute from "./Routes/healthPredict.js";
import healthRoutellm from "./Routes/healthPredictllm.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;


app.get("/", (req, res) => {
  res.send("API is working");
});

// ✅ MongoDB connection using Mongoose
mongoose.set("strictQuery", false);
export const connectDB = async() =>{
  try{
    const conn= await mongoose.connect(process.env.MONGODB_URL)
    console.log(`MongoDB connected : ${conn.connection.host}`)
  }catch(error){
    console.log(`MongoDB connection error:`,error);
  }
}

// ✅ Middleware
// ✅ Enable CORS for all origins and methods
app.use(cors({
  origin: 'http://localhost:5173', // Allow specific frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Handle preflight OPTIONS request
app.options('*', cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());


// ✅ Route Middleware
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/", diseaseRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/", contactRoute);
app.use("/api/v1/", forgotPassRoute);
app.use("/api/v1/", healthRoute);
app.use("/api/v1/llm",healthRoutellm);

// ✅ Start server
app.listen(port, () => {
  connectDB(); // ✅ Establish MongoDB connection when the server starts
  console.log(`🚀 Server is running on port ${port}`);
});
