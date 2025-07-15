import React from 'react'
import type { GoogleBook, MyBook } from '../types'
import { Link } from 'react-router-dom'
import { useBookStore } from '../store/book'

type Props = {
  book: GoogleBook | MyBook | null
}

const BookCard = ({ book }: Props) => {
  const elimMyBook = useBookStore(state => state.deleteMyBook)
  //! Si la función devuelve true, quiere decir que es el book es un GoogleBook
  const isGoogleBook = (book: GoogleBook | MyBook | null): book is GoogleBook => {
    //! Los dos !! es para asegurarse que book no sea null ni undefined
    //! Si book tiene una propiedad llamada 'volumeInfo' entonces es verdadero, por lo que retorna true
    return !!book && 'volumeInfo' in book
  }

  const handleElim = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (!isGoogleBook(book)){
        await elimMyBook(book?.id_book)
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

  return (
    <main>
    {isGoogleBook(book) ? (
      <React.Fragment>
        <Link className='flex flex-col items-center gap-2 hover:scale-105 hover:cursor-pointer transition-all duration-300'
        to={`/libro/${book?.id}`}
        state={{ book }}>
        <img src={book?.volumeInfo.imageLinks?.smallThumbnail || '/default-cover.png'} 
        className='w-40 h-64 object-cover rounded shadow-md shadow-black' 
        width={150} 
        alt={book?.volumeInfo.title} />        
        <h2 className=' h-[100px] overflow-y-auto break-words'>{book?.volumeInfo.title}</h2>
        </Link>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <main className='flex flex-col items-center'>
          <img
          className='w-32 h-[200px] object-cover' 
          src={`http://localhost:5000/books/${book?.image_path}`} 
          alt="Portada" />
            <article className='flex flex-col justify-evenly items-center h-[230px] text-orange-600'>
              <h2 className='text-2xl w-xs max-h-[150px] break-words'>{book?.title}</h2>
              <div className='flex flex-col items-center'>
              <h2>Género: {book?.genre}</h2>
              <h2>Autor: {book?.author}</h2>
              <a href={`http://localhost:5000/books/${book?.pdf_path}`} target="_blank" rel="noopener noreferrer">
                <button>Ver Libro</button>
              </a>
              <form onSubmit={handleElim}>
                <button type='submit'>Eliminar Libro</button>
              </form>
              </div>
            </article>
        </main>
      </React.Fragment>

    )}
    </main>
  )
}

export default BookCard