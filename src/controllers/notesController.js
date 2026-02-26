import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(notes);
  } catch (error) {
    console.log("Error in notesController", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id, // 🔥 SECURITY CHECK
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content, userId: req.user.id });

    await newNote.save();
    res.status(201).json({ message: "Note created successfully" });
  } catch (error) {
    console.log("Error in createNote controller", error);
    res.status(500).json({ message: "Interval server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id, // 🔥 prevents hacking
      },
      { title, content },
      { new: true },
    );
    if (!updateNote)
      return res.status(404).json({ message: "data note found" });
    res.status(200).json({ message: "Note updates successfully" });
  } catch (error) {
    console.log("Error in updatenotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const deleteNote = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleteNote) return res.status(404).json({ message: "Data not found" });
    res.status(204).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.log("Error in delete Controller", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}
