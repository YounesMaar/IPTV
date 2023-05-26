import express from "express";
// database Changes
import { UserModel } from "../db/Users.js";

const router = express.Router();

router.get("/get-five-users", (req, res) => {
  UserModel.find()
    .limit(5)
    .sort({ createdAt: -1 })
    .then((result) => {
      res.json({ users: result });
    })
    .catch((err) => {
      console.log("there is an error ");
      res.json({ message: "No data found" });
    });
});
// Count all the Users
router.get("/get-all-users-count", (req, res) => {
  UserModel.find()
    .count()
    .then((result) => {
      console.log(result);
      res.json({ countUsers: result });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "No data Found" });
    });
});
// get All amount of money
router.get("/get-all-money", (req, res) => {
  UserModel.aggregate([
    {
      $group: {
        _id: null,
        totalQuantity: { $sum: "$price" },
      },
    },
  ])
    .then((result) => {
      res.json({ amount: result });
    })
    .catch((err) => {
      res.json({ amount: [] });
    });
});

// get ten users
router.get("/get-ten-users/:category", async (req, res) => {
  const pageNumber = req.params.category;
  const pageSize = 10;

  const skipCount = (pageNumber - 1) * pageSize;
  UserModel.find()
    .skip(skipCount)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ data: [] });
      console.error(err);
    });
});

// getInformationOf one User by his id
router.get("/get-one-user-byid/:id", (req, res) => {
  let parameter = req.params.id;
  UserModel.find({ _id: parameter })
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      res.json({ data: [] });
    });
});

// get Information of one User by his email
router.get("/get-one-user-byemail/:email", (req, res) => {
  let parameter = req.params.email;
  UserModel.find({ email: parameter })
    .limit(1)
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      res.json({ data: [] });
    });
});

export { router as getInfos };
