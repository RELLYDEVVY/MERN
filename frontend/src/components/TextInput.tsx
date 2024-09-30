import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface Textprops {
	name: string;
	label: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	register: UseFormRegister<any>;
	registerOptions?: RegisterOptions;
	error?: FieldError;
	[x: string]: unknown;
}
const TextInput = ({ name, label, register, registerOptions, error, ...props }: Textprops) => {
	return (
		<Form.Group controlId={name + "=input"}>
			<Form.Label>{label}</Form.Label>
			<Form.Control {...props} {...register(name, registerOptions)} isInvalid={!!error} />
			<Form.Control.Feedback type='invalid'>{error?.message}</Form.Control.Feedback>
		</Form.Group>
	);
};
export default TextInput;
