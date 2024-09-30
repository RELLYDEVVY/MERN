import { Button, Navbar } from "react-bootstrap";
import { User } from "../model/users";
import * as NoteApi from "../network/note_api";

interface LoginViewProps {
	user: User;
	onLogoutSuccess: () => void;
}
const LoginView = ({ user, onLogoutSuccess }: LoginViewProps) => {
	const logout = async () => {
		try {
			await NoteApi.logout();
			onLogoutSuccess();
		} catch (error) {
			alert(error);
			console.error(error);
		}
	};
	return (
		<>
			<Navbar.Text className='me-2'>SIgned in as {user.username}</Navbar.Text>
			<Button onClick={logout}>Log out</Button>
		</>
	);
};
export default LoginView;
