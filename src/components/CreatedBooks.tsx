import { useEffect } from "react"
import BookCard from "../shared/BookCard"
import type { MyBook } from "../types"
import { useUserStore } from "../store/user"
import { useNavigate } from "react-router-dom"
import { useBookStore } from "../store/book"

type Props = {
    myBooks: MyBook[] | null
}

const CreatedBooks = ({ myBooks }: Props) => {
    const user = useUserStore(store => store.user)
    const setMyBooks = useBookStore(store => store.setMyBooks)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            setMyBooks()
            navigate('/')
        } 
    }, [user])
    
  return (
    <main className='flex flex-col gap-10 items-start mt-36 text-neutral-600'>
        <h2 className="text-3xl px-10 pt-5 font-light">Libros de {user?.name}:</h2>
        {myBooks && myBooks.length > 0 ? (
        <article className='flex justify-center items-center'>
                {myBooks?.map((oneBook) => (
                    <div key={oneBook.id_book} className='flex justify-center items-center'>
                        <BookCard book={ oneBook }/>
                    </div>
                ))}
        </article>
        ) : (
            <main className="h-[60vh]">
                <h1 className="px-20">No hay Libros publicados...</h1>
            </main>
        )}
    </main>
  )
}

export default CreatedBooks