import express from "express";
import * as NoteControl from "../controller/notes";

const router = express.Router();
router.get("/", NoteControl.getNotes);
router.get("/:noteId", NoteControl.getNote);
router.post("/", NoteControl.createNote);
router.patch("/:noteId", NoteControl.updateNote);
router.delete("/:noteId", NoteControl.deleteNote);

export default router;
