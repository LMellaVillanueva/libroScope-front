import { create } from "zustand";
import { type GoogleBook, type MyBook, Categorie } from "../types";
import axios from "axios";
import { useUserStore } from "./user";

interface State {
    myBooks: MyBook[] | null
    googleBooks: GoogleBook[] | null
    getBooks: () => Promise<void>
    getGoogleBooks: (categorie: Categorie | null) => Promise<void>
    googleBookCategorie: Categorie
    setCategorie: (categorie: Categorie) => void
}

export const useBookStore = create<State>((set) => ({
    myBooks: null,
    googleBooks: null,
    googleBookCategorie: Categorie.NONE,
    getBooks: async (): Promise<void> => {
        const user = useUserStore.getState().user
        if (user) {
            const { data } = await axios(`http://127.0.0.1:5000/books/all_books/${user.id_user}`)
            if (data) {
                set({ myBooks: data.books })
            }
        }
    },
    getGoogleBooks: async (categorie): Promise<void> => {
        const { data } = await axios(`https://www.googleapis.com/books/v1/volumes?q=subject:${categorie}&maxResults=40&key=AIzaSyDNQ631Qv6pa6tyXCeU1xds2mnYL1KYNg8`)
        if (data) {
            set({ googleBooks: data.items })
        }
    },
    setCategorie: (categorie: Categorie) => {
        set({ googleBookCategorie: categorie })
    }
}))
