import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Note as NoteModel } from "../model/notes";
import * as NoteApi from "../network/note_api";
import Dialog from "./Dialog";
import Note from "./Note";

const LoginPageView = () => {
	const [noteDialog, setNoteDialog] = useState(false);
	const [noteEdit, setNoteEdit] = useState<NoteModel | null>(null);
	const [notes, setNote] = useState<NoteModel[]>([]);
	const [loadError, setLoadError] = useState(false);
	const [loadNote, setLoadNote] = useState(true);
	useEffect(() => {
		const loadNotes = async () => {
			try {
				setLoadNote(true);
				setLoadError(false);
				const notes = await NoteApi.getNotes();
				setNote(notes);
			} catch (error) {
				setLoadError(true);
				alert(error);
			} finally {
				setLoadNote(false);
			}
		};
		loadNotes();
	}, []);

	const onNoteDelete = async (note: NoteModel) => {
		try {
			await NoteApi.deleteNote(note._id);
			setNote(notes.filter((existNote) => existNote._id !== note._id));
		} catch (error) {
			console.error(error);
			alert(error);
		}
	};
	const noteGrid = (
		<Row xs={1} md={2} xl={3} className='g-2'>
			{notes
				.slice()
				.reverse()
				.map((note, index) => (
					<Col key={index}>
						<Note noteClick={setNoteEdit} onDelete={onNoteDelete} note={note} />
					</Col>
				))}
		</Row>
	);

	return (
		<>
			<Button className='butt' onClick={() => setNoteDialog(true)}>
				<FaPlus /> Add New Note
			</Button>
			{loadNote && <Spinner className='fix1' animation='border' variant='primary' />}
			{loadError && <p className='fix pip'>Something went wrong please try again later</p>}
			{!loadNote && !loadError && <>{notes.length > 0 ? noteGrid : <div className='fix'>You have no notes available</div>}</>}
			{noteDialog && (
				<Dialog
					onNoteSaved={(newNote) => {
						setNote([...notes, newNote]);
						setNoteDialog(false);
					}}
					onDissmis={() => setNoteDialog(false)}
				/>
			)}
			{noteEdit && (
				<Dialog
					noteEdit={noteEdit}
					onNoteSaved={(updatedNote) => {
						setNote(notes.map((existingNote) => (existingNote._id === updatedNote._id ? updatedNote : existingNote)));
						setNoteEdit(null);
					}}
					onDissmis={() => setNoteEdit(null)}
				/>
			)}
		</>
	);
};
export default LoginPageView;
