import express from "express";
import User from "../models/User.js";
import BookTransaction from "../models/BookTransaction.js";
import bcrypt from "bcrypt";
import { formatMongooseError, parseMobileNumber, parsePositiveInt } from "../utils/validation.js";

const router = express.Router()

/* Getting user by id */
router.get("/getuser/:id", async (req, res) => {
    try {
        const identifier = req.params.id;
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

        const user = await User.findOne(
            isObjectId
                ? { _id: identifier }
                : { $or: [{ admissionId: identifier }, { employeeId: identifier }] }
        ).populate("activeTransactions").populate("prevTransactions")

        if (!user) {
            return res.status(404).json("User not found");
        }

        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } 
    catch (err) {
        return res.status(500).json(err);
    }
})

/* Getting all members in the library */
router.get("/allmembers", async (req,res)=>{
    try{
        const users = await User.find({ isAdmin: { $ne: true } }).populate("activeTransactions").populate("prevTransactions").sort({_id:-1})
        res.status(200).json(users)
    }
    catch(err){
        return res.status(500).json(err);
    }
})

/* Leaderboard by points */
router.get("/leaderboard", async (req, res) => {
    try {
        const users = await User.find({ isAdmin: { $ne: true } })
            .select("userFullName admissionId employeeId userType points")
            .sort({ points: -1 });
        res.status(200).json(users);
    } catch (err) {
        return res.status(500).json("Failed to load leaderboard");
    }
})

/* Update user by id */
router.put("/updateuser/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const allowedFields = ["userFullName", "address", "mobileNumber", "age", "gender", "dob", "email", "photo", "points", "password"];
            const updateFields = {};
            allowedFields.forEach((field) => {
                if (req.body[field] !== undefined) updateFields[field] = req.body[field];
            });
            if (updateFields.mobileNumber !== undefined) {
                const mobileResult = parseMobileNumber(updateFields.mobileNumber);
                if (mobileResult.error) {
                    return res.status(400).json(mobileResult.error);
                }
                updateFields.mobileNumber = mobileResult.value;
            }
            if (updateFields.age !== undefined) {
                const ageResult = parsePositiveInt(updateFields.age, "Age");
                if (ageResult.error) {
                    return res.status(400).json(ageResult.error);
                }
                updateFields.age = ageResult.value;
            }
            if (updateFields.email !== undefined) {
                updateFields.email = updateFields.email.trim().toLowerCase();
            }
            await User.findByIdAndUpdate(req.params.id, {
                $set: updateFields,
            });
            res.status(200).json("Account has been updated");
        } catch (err) {
            const { status, message } = formatMongooseError(err);
            res.status(status).json(message);
        }
    }
    else {
        return res.status(403).json("You can update only your account!");
    }
})

/* Adding transaction to active transactions list */
router.put("/:id/move-to-activetransactions" , async (req,res)=>{
    if(req.body.isAdmin){
        try{
            const user = await User.findById(req.body.userId);
            await user.updateOne({$push:{activeTransactions:req.params.id}})
            res.status(200).json("Added to Active Transaction")
        }
        catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("Only Admin can add a transaction")
    }
})

/* Remove transaction from active list without moving to history */
router.put("/:id/remove-from-active", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const user = await User.findById(req.body.userId);
            await user.updateOne({ $pull: { activeTransactions: req.params.id } });
            res.status(200).json("Removed from active transactions");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("Only Admin can do this");
    }
})

/* Adding transaction to previous transactions list and removing from active transactions list */
router.put("/:id/move-to-prevtransactions", async (req,res)=>{
    if(req.body.isAdmin){
        try{
            const user = await User.findById(req.body.userId);
            await user.updateOne({$pull:{activeTransactions:req.params.id}})
            await user.updateOne({$push:{prevTransactions:req.params.id}})
            res.status(200).json("Added to Prev transaction Transaction")
        }
        catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("Only Admin can do this")
    }
})

/* Delete user by id */
router.delete("/deleteuser/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findById(req.params.id).populate("activeTransactions");
            if (!user) {
                return res.status(404).json("User not found.");
            }
            if (user.isAdmin && req.body.userId !== req.params.id) {
                return res.status(400).json("Admin accounts cannot be deleted from this screen.");
            }
            const activeCount = await BookTransaction.countDocuments({
                borrowerId: req.params.id.toString(),
                transactionStatus: "Active"
            });
            if (activeCount > 0) {
                return res.status(400).json("Cannot delete a member with active loans or reservations.");
            }
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (err) {
            const { status, message } = formatMongooseError(err);
            res.status(status).json(message);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
})

export default router