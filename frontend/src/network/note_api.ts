import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../model/notes";
import { User } from "../model/users";

export interface NoteInput {
	title: string;
	text: string;
}

const API_BASE_URL = 'http://localhost:5000';

const fetchData = async (input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(API_BASE_URL + input, {
        ...init,
        credentials: 'include', // This is important for sending cookies
    });
	if (response.ok) {
		return response;
	} else {
		const errorBody = await response.json();
		const errorMessage = errorBody.error;
		if (response.status === 401) {
			throw new UnauthorizedError(errorMessage);
		} else if (response.status === 409) {
			throw new ConflictError(errorMessage);
		} else {
			throw Error("Request failed with status" + response.status + "message" + errorMessage);
		}
	}
};

export const getAuthUser = async (): Promise<User> => {
	const response = await fetchData("/api/users", { method: "GET" });
	return response.json();
};

export interface SignUpCred {
	username: string;
	email: string;
	password: string;
}
export const signUp = async (creds: SignUpCred): Promise<User> => {
	const response = await fetchData("/api/users/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(creds),
	});
	return response.json();
};

export interface LoginCreds {
	username: string;
	password: string;
}
export const login = async (creds: LoginCreds): Promise<User> => {
	const response = await fetchData("/api/users/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(creds),
	});
	return response.json();
};

export const logout = async () => await fetchData("/api/users/logout", { method: "POST" });

export const getNotes = async () => {
	const response = await fetchData("/api/notes", { method: "GET" });
	return response.json();
};

export const CreateNote = async (note: NoteInput): Promise<Note> => {
	const response = await fetchData("/api/notes", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(note),
	});
	return response.json();
};

export const deleteNote = async (noteId: string) =>
	await fetchData("/api/notes/" + noteId, {
		method: "DELETE",
	});

export const updateNote = async (noteId: string, note: NoteInput): Promise<Note> => {
	const response = await fetchData("/api/notes/" + noteId, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(note),
	});
	return response.json();
};
