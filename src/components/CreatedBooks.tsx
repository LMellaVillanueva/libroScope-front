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
    <main className='flex flex-col gap-10 items-start p-20 mt-20'>
        <h2 className="text-3xl">Libros de {user?.name}:</h2>
        {myBooks && myBooks.length > 0 ? (
        <article className='flex justify-center items-center'>
                {myBooks?.map((oneBook) => (
                    <div key={oneBook.id_book} className='flex justify-center items-center'>
                        <BookCard book={ oneBook }/>
                    </div>
                ))}
        </article>
        ) : (
            <main>
                <h1>No hay Libros publicados...</h1>
            </main>
        )}
    </main>
  )
}

export default CreatedBooks