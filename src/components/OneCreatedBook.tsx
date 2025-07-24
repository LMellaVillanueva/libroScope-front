import { useLocation, useNavigate } from 'react-router-dom'
import type { MyBook } from '../types'
import { useUserStore } from '../store/user'
import { useBookStore } from '../store/book'
import { useEffect, useState } from 'react'

const OneCreatedBook = () => {
    const location = useLocation()
    const state = location.state as { book?: MyBook }
    const navigate = useNavigate()
    const user = useUserStore(state => state.user)
    const elimMyBook = useBookStore(state => state.deleteMyBook)
    const fetchMyBooks = useBookStore(state => state.getBooks)
    const getCommunityBooks = useBookStore(state => state.getCommunityBooks)
    const [bookDeleted, setBookDeleted] = useState(false)

    if (!state.book) return navigate('/mis_libros')

    const book = state.book

    const handleElim = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            await elimMyBook(book?.id_book)
            await fetchMyBooks()
            await getCommunityBooks()
            setBookDeleted(true)
        } catch (error: any) {
            if (error.response && error.response.data) {
              alert(error.response.data.errors)
              console.log('Error: ', error.response.data.errors)
            } else {
              return console.error(error.message)
            }
         }
  }

  useEffect(() => {
    if (bookDeleted) navigate('/mis_libros')
  }, [bookDeleted])


  return (
        <main className='p-5 pb-40 mt-20 flex justify-around items-center py-60 text-neutral-600'>
        <article className='w-2/3 flex items-center justify-evenly'>
            <img className='w-64'
            src={`http://127.0.0.1:5000/books/${book?.image_path}`} 
            alt={book.title} />
            <section className='flex flex-col items-start gap-7 w-1/2'>
            <h2 className='text-3xl text-left'>{book.title}</h2>
                <span className='flex gap-1'>
                    <p className='font-bold'>Autor/es:</p>
                    <p>{book.author}</p>
                </span>
                <span className='flex gap-1'>
                    <p className='font-bold'>Género:</p> 
                    <p>{book.genre}</p>
                </span>
                <span className='flex flex-col items-start gap-2'>
                    <p className='font-bold'>Descripción:</p>
                    <p className='max-h-[220px] overflow-y-auto break-words'>{book.description}</p>
                </span>
                <a href={`http://127.0.0.1:5000/books/${book?.pdf_path}`} target="_blank" rel="noopener noreferrer">
                <button className='font-medium text-2xl text-gray-600 hover:text-black'>Ver Libro</button>
              </a>
              {user?.id_user === book?.user_id && (
                <form className='font-medium text-2xl text-gray-600 hover:text-black' onSubmit={handleElim}>
                  <button type='submit'>Eliminar Libro</button>
                </form>
              )}
              {user?.admin == true && (
                <form className='font-medium text-2xl text-gray-600 hover:text-black' onSubmit={handleElim}>
                  <button type='submit'>Eliminar Libro</button>
                </form>
              )}
            </section>
        </article>
       </main>
  )
}

export default OneCreatedBook