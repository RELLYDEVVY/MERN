import { Container } from "react-bootstrap";
import LoginPageView from "../components/LoginPageView";
import LogoutPageView from "../components/LogoutPageView";
import { User } from "../model/users";

interface NotePageProps {
	loggedUser: User | null;
}
const NotePage = ({ loggedUser }: NotePageProps) => {
	return (
		<Container className='contain'>
			<>{loggedUser ? <LoginPageView /> : <LogoutPageView />}</>
		</Container>
	);
};
export default NotePage;
