import "dotenv/config"; // loads variables from .env file
import express from "express";
import * as paypal from "./paypal-api.js";
import cors from "cors";
import morgan from "morgan";
// mongoose
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
// database Changes
import { UserModel } from "./db/Users.js";
// routers
import { adminRouter } from "./router/admin.js";
import { getInfos } from "./router/getUsersInfos.js";
import { updating } from "./router/updating.js";
// verify token

const { PORT = 8888 } = process.env;
const app = express();
// connect to the databse

const DATABASE = process.env.MONGODB_URL;

mongoose
  .connect(DATABASE)
  .then((result) =>
    app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}/`);
    })
  )
  .catch((err) => {
    console.error(err);
  });

// middlewares
app.use(morgan("dev"));
// app.use(express.static("public"));
app.use(cors());

// parse post params sent in body in json format
app.use(express.json());

// setting orders

app.post("/server/create-paypal-order", async (req, res) => {
  try {
    const order = await paypal.createOrder(req.body);
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

app.post("/server/capture-paypal-order", async (req, res) => {
  const { orderID } = req.body;
  try {
    const captureData = await paypal.capturePayment(orderID);
    res.json({ captureData });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// verifing the amdin user
app.use("/", adminRouter);

app.use("/new-crypto-subscription", async (req, res) => {
  const details = req.body;
  const newTransaction = new UserModel(details);
  newTransaction
    .save()
    .then((result) => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.use("/new-paypal-subscription", async (req, res) => {
  const details = req.body;
  const username = details.data.payer.name.given_name;
  const email = details.data.payer.email_address;
  const country = details.data.payer.address.country_code;
  const months = details.months;
  const price = details.price;

  const newTransaction = new UserModel({
    payment_method: "PayPal",
    username,
    country,
    email,
    months,
    price,
    process: "pending",
  })
    .save()
    .then((result) => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.error(err);
    });
});
import { verifyToken } from "./router/admin.js";

// admin handling
app.use("/", verifyToken, getInfos);

// updating orders
app.use("/update", verifyToken, updating);
