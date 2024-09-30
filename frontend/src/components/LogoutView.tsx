import { Button } from "react-bootstrap";

interface LogoutViewProps {
	onSignupClicked: () => void;
	onLoginClicked: () => void;
}
const LogoutView = ({ onLoginClicked, onSignupClicked }: LogoutViewProps) => {
	return (
		<>
			<Button onClick={onSignupClicked}>Sign up</Button>
			<Button onClick={onLoginClicked}>Login in</Button>
		</>
	);
};
export default LogoutView;
