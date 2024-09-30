import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../model/users";
import LoginView from "./LoginView";
import LogoutView from "./LogoutView";
import { Link } from "react-router-dom";

interface NavBarProps {
	loggedUser: User | null;
	signUpClicked: () => void;
	loginClicked: () => void;
	logoutSuccess: () => void;
}
const NavBar = ({ loggedUser, loginClicked, logoutSuccess, signUpClicked }: NavBarProps) => {
	return (
		<Navbar bg='primary' variant='dark' expand='sm' sticky='top'>
			<Container>
				<Navbar.Brand as={Link} to='/'>
					Cool Notes App
				</Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse aria-controls='main-navbar'>
					<Nav>
						<Nav.Link as={Link} to='/privacy'>
							Privacy
						</Nav.Link>
					</Nav>
					<Nav className='ms-auto'>{loggedUser ? <LoginView user={loggedUser} onLogoutSuccess={logoutSuccess} /> : <LogoutView onLoginClicked={loginClicked} onSignupClicked={signUpClicked} />}</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};
export default NavBar;
