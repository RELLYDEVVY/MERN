import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../../utils/assertIsDefined";

interface createNoteBody {
	title?: string;
	text?: string;
}
interface updateNoteBody {
	title?: string;
	text?: string;
}
interface updateNoteParams {
	noteId: string;
}
export const getNotes: RequestHandler = async (req, res, next) => {
	const authUserId = req.session.userId;
	try {
		assertIsDefined(authUserId);
		const notes = await NoteModel.find({ userId: authUserId }).exec();
		res.status(200).json(notes);
	} catch (error) {
		next(error);
	}
};

export const getNote: RequestHandler = async (req, res, next) => {
	const noteId = req.params.noteId;
	const authUserId = req.session.userId;
	try {
		assertIsDefined(authUserId);
		if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, "Invalid note id");
		const note = await NoteModel.findById(noteId).exec();
		if (!note) throw createHttpError(404, "Note not found");
		if (!note.userId.equals(authUserId)) {
			throw createHttpError(401, "You cannot access this note");
		}
		res.status(200).json(note);
	} catch (error) {
		next(error);
	}
};

export const createNote: RequestHandler<unknown, unknown, createNoteBody, unknown> = async (req, res, next) => {
	const title = req.body.title;
	const text = req.body.text;
	const authUserId = req.session.userId;
	try {
		assertIsDefined(authUserId);
		if (!title) throw createHttpError(400, "Note must have a title");
		const newNote = await NoteModel.create({
			userId: authUserId,
			title: title,
			text: text,
		});
		res.status(201).json(newNote);
	} catch (error) {
		next(error);
	}
};

export const updateNote: RequestHandler<updateNoteParams, unknown, updateNoteBody, unknown> = async (req, res, next) => {
	const newTitle = req.body.title;
	const newText = req.body.text;
	const noteId = req.params.noteId;
	const authUserId = req.session.userId;
	try {
		assertIsDefined(authUserId);
		const note = await NoteModel.findById(noteId).exec();
		if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, "Invalid note id");
		if (!newTitle) throw createHttpError(400, "Note must have a title");
		if (!note) throw createHttpError(404, "note not found");
		if (!note.userId.equals(authUserId)) {
			throw createHttpError(401, "You cannot access this note");
		}
		note.title = newTitle;
		note.text = newText;
		const updatedNote = await note.save();
		res.status(200).json(updatedNote);
	} catch (error) {
		next(error);
	}
};

export const deleteNote: RequestHandler = async (req, res, next) => {
	const noteId = req.params.noteId;
	const authUserId = req.session.userId;

	try {
		assertIsDefined(authUserId);

		const note = await NoteModel.findById(noteId).exec();
		if (!mongoose.isValidObjectId(noteId)) throw createHttpError(400, "Invalid note id");
		if (!note) throw createHttpError(404, "note not found");
		if (!note.userId.equals(authUserId)) {
			throw createHttpError(401, "You cannot access this note");
		}
		await note.deleteOne();
		// Send success response
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};
