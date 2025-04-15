import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const generateToken = (user) => {
  console.log("Generating token for user:", user._id, "with role:", user.role);
  return jwt.sign(
    {
      id: user._id,
      role: user.role  // 🔥 This is crucial!
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15d" }
  );
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;

  try {
    let user = null;

    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }

    //check if user exist
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User Successfully created" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error, Try again" });
  }
};

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     let user = null;

//     const patient = await User.findOne({ email });
//     const doctor = await Doctor.findOne({ email });
//     const admin = await User.findOne({ email, role: "admin" }); // Add admin check

//     if (patient) {
//       user = patient;
//     }
//     if (doctor) {
//       user = doctor;
//     }
//     if (admin) {
//       // Handle admin login
//       user = admin;
//     }

//     //check if user exist
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     //compare password
//     const isPasswordMatch = await bcrypt.compare(password, user.password);

//     if (!isPasswordMatch) {
//       return res
//         .status(404)
//         .json({ status: false, message: "Invalid Credentials, try again" });
//     }

//     // get token
//     const token = generateToken(user);
//     const { password: userPassword, role, appointments, ...rest } = user._doc;
//     res.status(200).json({
//       status: true,
//       message: "Successfully login",
//       token,
//       data: { ...rest },
//       role,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: false, message: "Failed to login" });
//   }
// };


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;

    // Look for the user in one of three collections: patient, doctor, or admin
    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });
    const admin = await User.findOne({ email, role: "admin" });

    // Assign the correct user object
    if (patient) {
      user = patient;
    } else if (doctor) {
      user = doctor;
    } else if (admin) {
      user = admin;
    }

    // If no user is found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password with the hash stored in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If password doesn't match
    if (!isPasswordMatch) {
      return res.status(401).json({ status: false, message: "Invalid credentials, try again" });
    }

    // Generate token with user details
    
    const token = generateToken(user);

    // Destructure user to exclude sensitive information like password
    const { password: userPassword, ...rest } = user._doc;

    // Return the response with the token and user data
  
    res.status(200).json({
      status: true,
      message: "Successfully logged in",
      token,
      data: { ...rest },
      role: user.role, // Include role in response if needed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Failed to login" });
  }
};
