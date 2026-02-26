import express from "express";
// import notesRoutes from "../routes/notesRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connect } from "mongoose";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv"
import cors from "cors"



const app = express();
const PORT = process.env.PORT || 5001
const HOST = "0.0.0.0"
// middleware
// app.use(express.json());
dotenv.config(); 
connectDB();

app.use(cors())

app.use(express.json());

// routes
app.use("/api/auth",authRoutes);
app.use("/api/notes", notesRoutes);

app.listen(PORT,HOST, () => {
  console.log("Server started on PORT:", PORT);
  console.log("Server started on PORT:", HOST);
});
