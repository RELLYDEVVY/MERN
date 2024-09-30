import { useEffect, useState } from "react";
import "./App.css";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import SignUpModal from "./components/SignUpModal";
import { User } from "./model/users";
import * as NoteApi from "./network/note_api";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotePage from "./pages/NotePage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
	const [loggedUser, setloggedUser] = useState<User | null>(null);
	const [showSignup, setshowSignup] = useState(false);
	const [showLogin, setShowlogin] = useState(false);
	useEffect(() => {
		const fetchLoggedUser = async () => {
			try {
				const user = await NoteApi.getAuthUser();
				setloggedUser(user);
			} catch (error) {
				console.error(error);
				setloggedUser(null);
			}
		};
		fetchLoggedUser();
	}, []);

	return (
		<BrowserRouter>
			<div>
				<NavBar loggedUser={loggedUser} loginClicked={() => setShowlogin(true)} logoutSuccess={() => setloggedUser(null)} signUpClicked={() => setshowSignup(true)} />
				<Container>
					<Routes>
						<Route path='/' element={<NotePage loggedUser={loggedUser} />} />
						<Route path='/privacy' element={<PrivacyPage />} />
						<Route path='/*' element={<NotFoundPage />} />
					</Routes>
				</Container>
				{showSignup && (
					<SignUpModal
						onDismiss={() => setshowSignup(false)}
						onSignUpSuccess={(user) => {
							setloggedUser(user);
							setshowSignup(false);
						}}
					/>
				)}
				{showLogin && (
					<LoginModal
						onDismiss={() => setShowlogin(false)}
						onLoginSuccess={(user) => {
							setloggedUser(user);
							setShowlogin(false);
						}}
					/>
				)}
			</div>
		</BrowserRouter>
	);
}

export default App;
