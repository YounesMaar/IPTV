import express from "express";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { AdminModel } from "../db/Users.js";

// router
const router = express.Router();

// router.post("/register", async (req, res) => {
//   const { username, email, admin, password } = req.body;

//   const user = await AdminModel.find({ username });
//   if (user === []) {
//     console.log(user);
//     return res.json({
//       status: false,
//       message: "this user is already in our database",
//     });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const newAdmin = new AdminModel({
//     username,
//     email,
//     admin,
//     pass: hashedPassword,
//   });
//   await newAdmin.save();

//   res.json({ status: true });
// });
// login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await AdminModel.findOne({ username });
  if (!user) {
    return res.json({ status: false });
  }
  const isPasswordValid = bcrypt.compareSync(password, user.pass);

  console.log(isPasswordValid);
  if (!isPasswordValid) {
    return res.json({ status: false });
  }

  console.log(isPasswordValid);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, userId: user._id, status: true });
});

export { router as adminRouter };

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
