import { User } from "../model/users";
import { useForm } from "react-hook-form";
import { LoginCreds } from "../network/note_api";
import * as NoteApi from "../network/note_api";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInput from "./TextInput";
import { UnauthorizedError } from "../errors/http_errors";
import { useState } from "react";

interface LoginModalProps {
	onDismiss: () => void;
	onLoginSuccess: (user: User) => void;
}
const LoginModal = ({ onDismiss, onLoginSuccess }: LoginModalProps) => {
	const { register, handleSubmit, formState } = useForm<LoginCreds>();
	const { errors, isSubmitting } = formState;
	const [errorText, setErrorText] = useState<string | null>(null);

	const onSubmit = async (creds: LoginCreds) => {
		try {
			const newUser = await NoteApi.login(creds);
			onLoginSuccess(newUser);
		} catch (error) {
			if (error instanceof UnauthorizedError) {
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
				<Modal.Title>Login</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{errorText && <Alert variant='danger'>{errorText}</Alert>}
				<Form onSubmit={handleSubmit(onSubmit)}>
					<TextInput name='username' label='Username' type='text' placeholder='Username' register={register} registerOptions={{ required: "Required" }} error={errors.username} />
					<TextInput className='mb-3' name='password' label='Password' type='password' placeholder='Passsword' register={register} registerOptions={{ required: "Required" }} error={errors.password} />
					<Button type='submit' disabled={isSubmitting} className='butt1'>
						Login
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};
export default LoginModal;
