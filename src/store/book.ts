import { create } from "zustand";
import { type GoogleBook, type MyBook, Categorie } from "../types";
import { useUserStore } from "./user";
import api from "../axiosConfig";
import axios from "axios";

interface State {
    myBooks: MyBook[] | null
    googleBooks: GoogleBook[] | null
    googleBookCategorie: Categorie
    communityBooks : MyBook[] | null
    getCommunityBooks: () => Promise<void>
    getBooks: () => Promise<void>
    getGoogleBooks: (categorie: Categorie | null) => Promise<void>
    setCategorie: (categorie: Categorie) => void
    deleteMyBook: (id: number | undefined) => Promise<void>
    setMyBooks: () => void
}

export const useBookStore = create<State>((set) => ({
    myBooks: null,
    googleBooks: null,
    googleBookCategorie: Categorie.NONE,
    communityBooks: null,
    getBooks: async (): Promise<void> => {
        const user = useUserStore.getState().user
        if (user) {
            const { data } = await api(`/books/all_books/${user.id_user}`)
            if (data) {
                set({ myBooks: data.books })
            }
        }
    },
    getCommunityBooks: async () => {
        try {
            const { data } = await api('/books/all_books')
            if (data) {
                set({ communityBooks: data.all_books })
            }
        } catch (error) {
            if (error instanceof Error) {
                return console.error(error.message)
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
    },
    deleteMyBook: async (id): Promise<void> => {
        try {
            const { data } = await api.post(`/books/elim/${id}`)
            if (data.success) {
                alert(data.success)
                set((state => ({ 
                    myBooks: state.myBooks?.filter(book => book.id_book !== id),
                    communityBooks: state.communityBooks?.filter(book => book.id_book !== id)
                 })))
            }
        } catch (error: any) {
        if (error.response && error.response.data) {
          console.error(error.response.data.errors)
          console.error(error.message)
        } else {
          return console.error(error.message)
        }
      }
    },
    setMyBooks: () => {
        set({ myBooks: null })
    }
}))
