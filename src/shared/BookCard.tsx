import React from 'react'
import type { GoogleBook, MyBook } from '../types'
import { Link } from 'react-router-dom'

type Props = {
  book: GoogleBook | MyBook | null
}

const BookCard = ({ book }: Props) => {
  
  //! Si la función devuelve true, quiere decir que es el book es un GoogleBook
  const isGoogleBook = (book: GoogleBook | MyBook | null): book is GoogleBook => {
    //! Los dos !! es para asegurarse que book no sea null ni undefined
    //! Si book tiene una propiedad llamada 'volumeInfo' entonces es verdadero, por lo que retorna true
    return !!book && 'volumeInfo' in book
  }

  return (
    <main>
    {isGoogleBook(book) ? (
      <React.Fragment>
        <Link className='flex flex-col items-center gap-2 hover:scale-105 hover:cursor-pointer transition-all duration-300'
        to={`/libro/${book?.id}`}
        state={{ book }}>
        <img src={book?.volumeInfo.imageLinks?.smallThumbnail || '/default-cover.png'} 
        className='w-44 h-64 object-cover rounded shadow-lg shadow-black' 
        width={150} 
        alt={book?.volumeInfo.title} />        
        <h2 id='scrollSect' className='h-[100px] max-w-44 text-start overflow-y-auto break-words text-black'>{book?.volumeInfo.title}</h2>
        </Link>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <main className='flex flex-col items-center gap-3'>
          <Link className='hover:scale-105 hover:cursor-pointer transition-all duration-300'
          to={`/libro/${book?.id_book}`}
          state={{ book }}>
            <img
            src={`http://127.0.0.1:5000/books/${book?.image_path}`} 
            className='w-44 h-64 object-cover rounded shadow-lg shadow-black'
            alt="Portada" />
          </Link>
            <article className='flex flex-col items-center gap-3 h-[230px] text-orange-600'>
              <h2 className='text-3xl w-xs max-h-[150px] break-words'>{book?.title}</h2>
            </article>
        </main>
      </React.Fragment>

    )}
    </main>
  )
}

export default BookCard