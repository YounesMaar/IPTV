import express from "express";

import { ObjectId } from "mongodb";
// database Changes
import { UserModel } from "../db/Users.js";

const router = express.Router();

router.put("/status/:id", async (req, res) => {
  const id = req.params.id;
  const success = req.body.success; // true / false
  // handling
  console.log(success);
  if (success) {
    UserModel.updateOne(
      { _id: new ObjectId(`${id}`) },
      { $set: { process: "success" } }
    ).then((result) => {
      res.json({ updated: true });
      console.log(result);
    });
  } else {
    UserModel.updateOne(
      { _id: new ObjectId(`${id}`) },
      { $set: { process: "faild" } }
    ).then((result) => {
      res.json({ updated: true });
    });
  }

  // // update
  // const updateDocument = await UserModel.findOne(filter);
  // await UserModel.save(updateDocument);
});

export { router as updating };
