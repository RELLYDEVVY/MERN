import { Card } from "react-bootstrap";
import { Note as NoteModel } from "../model/notes";
import { formatDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";

interface NoteProps {
	note: NoteModel;
	noteClick: (note: NoteModel) => void;
	onDelete: (note: NoteModel) => void;
}

const Note = ({ noteClick, note, onDelete }: NoteProps) => {
	const { title, text, createdAt, updatedAt } = note;
	let newDate: string;
	if (updatedAt > createdAt) {
		newDate = "Updated at " + formatDate(updatedAt);
	} else {
		newDate = "Created at " + formatDate(createdAt);
	}
	return (
		<Card onClick={() => noteClick(note)} className='noteCard'>
			<Card.Body className='cardBody'>
				<Card.Title className='text'>
					<span>{title}</span>{" "}
					<MdDelete
						onClick={(e) => {
							onDelete(note);
							e.stopPropagation();
						}}
					/>
				</Card.Title>
				<Card.Text>{text}</Card.Text>
			</Card.Body>
			<Card.Footer>{newDate}</Card.Footer>
		</Card>
	);
};

export default Note;
