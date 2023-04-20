import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { verifyToken } from "./middleware/auth.js";
import serverless from 'serverless-http';

import authRoutes from "./routes/auth.js";
import pantryRoutes from "./routes/pantry.js";
import shoppingListRoutes from "./routes/shoppinglist.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
const router = express.Router();
router.use(express.json());
router.use(helmet());
router.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
router.use(morgan("common"));
router.use(bodyParser.json({ limit: "30mb", extended: true }));
router.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
router.use(cors());

/* ROUTES */
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/pantry", verifyToken, pantryRoutes);
router.use("/api/v1/shoppinglist", verifyToken, shoppingListRoutes);
router.use("*", (req, res) => res.status(404).json({ message: "Not Found" }));

/* MONGOOSE */

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() =>
        router.listen(process.env.PORT, () =>
            console.log(`Server running on port: ${PORT}`)
        )
    )
    .catch((error) => console.log(error.message));


router.get('/demo', (req,  res) => {
    res.json({
        'message': 'Hello World!'
    })
})


app.use('./.netlify/functions/api', router)
module.exports.handler = serverless(app);
