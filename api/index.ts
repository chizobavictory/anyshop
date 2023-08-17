import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";

dotenv.config();
const app = express();
const port = process.env.PORT;
const db = process.env.MONGO_URL || "";

mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connection Successfull"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
