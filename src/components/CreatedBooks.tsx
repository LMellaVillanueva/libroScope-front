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
    <main className='flex flex-col gap-10 items-start lg:mt-36 md:mt-28 mt-20 text-neutral-600'>
        <h2 className="text-3xl md:px-10 m-auto md:m-0 pt-5 font-light">Libros de {user?.name}:</h2>
        {myBooks && myBooks.length > 0 ? (
        <article className='flex flex-col lg:flex-row w-full lg:w-fit p-1 lg:p-5 justify-center items-center'>
                {myBooks?.map((oneBook) => (
                    <div key={oneBook.id_book} className='flex justify-center items-center p-5 lg:p-5'>
                        <BookCard book={ oneBook }/>
                    </div>
                ))}
        </article>
        ) : (
            <main className="h-[60vh]">
                <h1 className="md:px-20 md:text-base"
                id="noBooksPublished" 
                style={{ fontFamily: '"Libre Franklin", sans-serif' }}>No hay libros publicados...</h1>
            </main>
        )}
    </main>
  )
}

export default CreatedBooks