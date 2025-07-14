import { useEffect } from "react"
import BookCard from "../shared/BookCard"
import type { MyBook } from "../types"
import { useUserStore } from "../store/user"
import { useNavigate } from "react-router-dom"

type Props = {
    myBooks: MyBook[] | null
}

const CreatedBooks = ({ myBooks }: Props) => {
    const user = useUserStore(store => store.user)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) navigate('/')
    }, [user])
    
  return (
    <main className='flex flex-col justify-center items-center gap-2 mt-16'>
        {myBooks && myBooks.length > 0 ? (
        <article className='flex justify-center items-center mt-36'>
            <section className='grid grid-cols-5 gap-8 w-5/6 p-3 items-center'>
                {myBooks?.map((oneBook) => (
                    <div key={oneBook.id_book} className='flex justify-center items-center'>
                        <BookCard book={ oneBook }/>
                    </div>
                ))}
            </section>
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