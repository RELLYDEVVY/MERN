import { Button, Form, Modal } from "react-bootstrap";
import { Note } from "../model/notes";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/note_api";
import * as NoteApi from "../network/note_api";
import TextInput from "./TextInput";

interface DialogProps {
	onDissmis: () => void;
	onNoteSaved: (note: Note) => void;
	noteEdit?: Note;
}
const Dialog = ({ noteEdit, onDissmis, onNoteSaved }: DialogProps) => {
	const { register, handleSubmit, formState } = useForm<NoteInput>({
		defaultValues: { title: noteEdit?.title || "", text: noteEdit?.text || "" },
	});
	const onSubmit = async (input: NoteInput) => {
		try {
			let noteResponse: Note;
			if (noteEdit) {
				noteResponse = await NoteApi.updateNote(noteEdit._id, input);
			} else {
				noteResponse = await NoteApi.CreateNote(input);
			}
			onNoteSaved(noteResponse);
		} catch (error) {
			console.error(error);
			alert(error);
		}
	};
	const { errors, isSubmitting } = formState;
	return (
		<Modal show onHide={onDissmis}>
			<Modal.Header closeButton>
				<Modal.Title>{noteEdit ? "Update Note" : "Add note"}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form id='submitForm' onSubmit={handleSubmit(onSubmit)}>
					<TextInput
						label='Title'
						name='title'
						register={register}
						type='text'
						placeholder='Title'
						registerOptions={{
							required: "Required",
							minLength: { value: 1, message: "Title cannot be empty" },
							validate: (value) => value.trim() !== "" || "Title cannot be just whitespace",
						}}
						error={errors.title}
					/>
					<TextInput name='text' label='Text' register={register} type='text' placeholder='Text' rows={5} as='textarea' />
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button type='submit' form='submitForm' disabled={isSubmitting}>
					{noteEdit ? "Update" : "Add Note"}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
export default Dialog;
