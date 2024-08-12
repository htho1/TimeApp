import { create } from "zustand";

export const authToken = create(
	(set) => ({
		token: "",
		setToken: (newToken: string) => set({ token: newToken })
	})
);