import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

/* User Registration */
router.post("/register", async (req, res) => {
  try {
    /* Salting and Hashing the Password */
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    /* Create a new user */
    const newuser = await new User({
      userType: req.body.userType,
      userFullName: req.body.userFullName,
      admissionId: req.body.admissionId,
      employeeId: req.body.employeeId,
      age: req.body.age,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: hashedPass,
      isAdmin: req.body.isAdmin,
    });

    /* Save User and Return */
    const user = await newuser.save();
    const { password: storedPassword, ...userWithoutPassword } = user._doc;
    const authUser = {
      ...userWithoutPassword,
      username: userWithoutPassword.userFullName,
    };
    res.status(200).json(authUser);
  } catch (err) {
    console.log(err);
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
