import express from "express";
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from "../controllers/notesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// GET all notes
router.get("/", getAllNotes);

router.get("/:id", getNoteById);

// CREATE note  
router.post("/", createNote);

// UPDATE note
router.put("/:id", updateNote);

// DELETE note
router.delete("/:id", deleteNote);

export default router;
