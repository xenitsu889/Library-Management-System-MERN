import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { formatMongooseError, parseMobileNumber, parsePositiveInt } from "../utils/validation.js";

const router = express.Router();

/* User Registration */
router.post("/register", async (req, res) => {
  try {
    const {
      userType, userFullName, admissionId, employeeId,
      age, dob, gender, address, mobileNumber, email, password
    } = req.body;

    if (!userType || !userFullName?.trim()) {
      return res.status(400).json("User type and full name are required.");
    }
    if (userType === "Student" && !admissionId?.trim()) {
      return res.status(400).json("Admission ID is required for students.");
    }
    if (userType === "Staff" && !employeeId?.trim()) {
      return res.status(400).json("Employee ID is required for staff.");
    }
    if (!gender || !dob || !address?.trim() || !email?.trim() || !password) {
      return res.status(400).json("All required fields must be filled.");
    }
    if (password.length < 6) {
      return res.status(400).json("Password must be at least 6 characters.");
    }

    const ageResult = parsePositiveInt(age, "Age");
    if (ageResult.error) {
      return res.status(400).json(ageResult.error);
    }
    if (ageResult.value < 1 || ageResult.value > 150) {
      return res.status(400).json("Age must be between 1 and 150.");
    }

    const mobileResult = parseMobileNumber(mobileNumber);
    if (mobileResult.error) {
      return res.status(400).json(mobileResult.error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newuser = await new User({
      userType,
      userFullName: userFullName.trim(),
      admissionId: admissionId?.trim() || undefined,
      employeeId: employeeId?.trim() || undefined,
      age: ageResult.value,
      dob,
      gender,
      address: address.trim(),
      mobileNumber: mobileResult.value,
      email: email.trim().toLowerCase(),
      password: hashedPass,
      isAdmin: req.body.isAdmin,
    });

    const user = await newuser.save();
    const { password: storedPassword, ...userWithoutPassword } = user._doc;
    const authUser = {
      ...userWithoutPassword,
      username: userWithoutPassword.userFullName,
    };
    res.status(200).json(authUser);
  } catch (err) {
    const { status, message } = formatMongooseError(err);
    res.status(status).json(message);
  }
});

/* User Login */
router.post("/signin", async (req, res) => {
  try {
    const { admissionId, employeeId, password } = req.body;

    if (!password || (!admissionId && !employeeId)) {
      return res.status(400).json("Missing login credentials");
    }

    const user = req.body.admissionId
      ? await User.findOne({
          admissionId,
        })
      : await User.findOne({
          employeeId,
        });

    if (!user) {
      return res.status(404).json("User not found");
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json("Wrong Password");
    }

    const { password: storedPassword, ...userWithoutPassword } = user._doc;
    const authUser = {
      ...userWithoutPassword,
      username: userWithoutPassword.userFullName,
    };
    res.status(200).json(authUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json("Login failed");
  }
});

export default router;
