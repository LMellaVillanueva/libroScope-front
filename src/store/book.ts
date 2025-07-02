import { create } from "zustand";
import type { MyBook } from "../types";
import axios from "axios";
import { useUserStore } from "./user";

interface State {
    myBooks: MyBook[] | null
    getBooks: () => Promise<void>
}

export const useBookStore = create<State>((set) => ({
    myBooks: null,
    getBooks: async (): Promise<void> => {
        const user = useUserStore.getState().user
        if (user) {
            const { data } = await axios(`http://127.0.0.1:5000/books/all_books/${user.id_user}`)
            if (data) {
                set({ myBooks: data.books })
            }
        }
    }
}))
