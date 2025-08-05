import { useLocation } from 'react-router-dom'
import type { GoogleBook } from '../types'
import { useEffect, useState } from 'react'
import axios from 'axios'
import BookRecommendCard from '../shared/BookRecommendCard'
import { Link } from 'react-router-dom'

const OneBook = () => {
    const location = useLocation()
    const state = location.state as { book?: GoogleBook }
    const [recommendBooks, setRecommendBooks] = useState<GoogleBook[]>([])

    // Validar si existe el state
    if (!state?.book) {
        return <h1>No se encontró el libro</h1>
    }

    const book = state.book

    useEffect(() => {
        const fetchRecommendBooks = async () => {
            try {
                const { data } = await axios.post('http://127.0.0.1:5000/books/recommend', book)
                if (data.recommend_books) {
                    setRecommendBooks(data.recommend_books)
                }
                
            } catch (error: any) {
            if (error.response && error.response.data) {
              alert(error.response.data.errors)
              console.log('Error: ', error.response.data.errors)
            } else {
              return console.error(error.message)
            }
        }
    }
    fetchRecommendBooks()
    }, [])

  return (
    <main className='p-5 pb-40 mt-40 flex justify-around items-center text-neutral-600'>
        <Link 
  to={'/libros'} 
  className='self-start text-4xl inline-block hover:scale-130'>{'<'}</Link>

        <article className='w-full flex items-start justify-evenly'>
            <img className='w-64 self-baseline'
            src={book.volumeInfo.imageLinks?.smallThumbnail} 
            alt={book.volumeInfo?.title} />
            <section className='flex flex-col items-start gap-7 w-1/2'>
            <h2 className='text-3xl text-left'>{book.volumeInfo?.title}</h2>
                <span className='flex gap-1'>
                    <p className='font-bold'>Autor/es:</p>
                    <p>{book.volumeInfo?.authors?.join(', ') || 'Libro sin información'}</p>
                </span>
                <span className='flex gap-1'>
                    <p className='font-bold'>Género:</p> 
                    <p>{book.volumeInfo?.categories?.join(', ') || 'Libro sin información'}</p>
                </span>
                <span className='flex flex-col items-start gap-2'>
                    <p className='font-bold'>Descripción:</p>
                    <p className={`${!recommendBooks.length ? 'max-h-[300px] overflow-y-auto break-words' : ''}`}>{book.volumeInfo?.description || 'Libro sin información'}</p>
                </span>
            </section>
        {/* Recomendaciones */}
        {recommendBooks.length > 0 && (
            <article className='flex flex-col items-center'>
                <h2>Te podría interesar:</h2>
            <section className='flex flex-col gap-10 w-full p-10'>
            {recommendBooks.map((book) => (
                <BookRecommendCard book={book}/>
            ))}
            </section>
        </article>
        )}
        </article>
    </main>
  )
}

export default OneBook