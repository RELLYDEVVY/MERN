import { useForm } from "react-hook-form";
import { User } from "../model/users";
import { SignUpCred } from "../network/note_api";
import * as NoteApi from "../network/note_api";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInput from "./TextInput";
import { useState } from "react";
import { ConflictError } from "../errors/http_errors";

interface SignUpProps {
	onDismiss: () => void;
	onSignUpSuccess: (user: User) => void;
}

const SignUpModal = ({ onDismiss, onSignUpSuccess }: SignUpProps) => {
	const [errorText, setErrorText] = useState<string | null>(null);

	const { register, handleSubmit, formState } = useForm<SignUpCred>();
	const { errors, isSubmitting } = formState;
	const onSubmit = async (creds: SignUpCred) => {
		try {
			const newUser = await NoteApi.signUp(creds);
			onSignUpSuccess(newUser);
		} catch (error) {
			if (error instanceof ConflictError) {
				setErrorText(error.message);
			} else {
				alert(error);
			}
			console.error(error);
		}
	};

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>SignUp</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{errorText && <Alert variant='danger'>{errorText}</Alert>}

				<Form onSubmit={handleSubmit(onSubmit)}>
					<TextInput name='username' label='Username' type='text' placeholder='Username' register={register} registerOptions={{ required: "Required" }} error={errors.username} />
					<TextInput name='password' label='Password' type='password' placeholder='Passsword' register={register} registerOptions={{ required: "Required" }} error={errors.password} />
					<TextInput className='mb-3' name='email' label='Email' type='email' placeholder='Email' register={register} registerOptions={{ required: "Required" }} error={errors.email} />
					<Button type='submit' disabled={isSubmitting} className='butt1'>
						SignUp
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};
export default SignUpModal;
