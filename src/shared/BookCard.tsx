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
        <img src={book?.volumeInfo.imageLinks?.smallThumbnail} 
        className='w-40 h-64 object-cover rounded shadow-md shadow-black' 
        width={150} 
        alt={book?.volumeInfo.title} />        
        {!book?.volumeInfo.imageLinks?.smallThumbnail || !book?.volumeInfo.imageLinks?.thumbnail && (
          <p>Sin portada</p>
        )}
        <h2 className=' h-[100px] overflow-y-auto break-words'>{book?.volumeInfo.title}</h2>
        </Link>
      </React.Fragment>
    ) : (
      <React.Fragment>
          <img src={`http://localhost:5000/books/${book?.image_path}`} alt="Portada" />
          <article className='flex flex-col justify-between h-56 items-center text-orange-600 absolute mt-20 mr-1.5'>
            <h2 className='text-4xl w-[200px] break-words'>{book?.title}</h2>
            <div className='flex flex-col items-center'>
            <h2>{book?.genre}</h2>
            <h2>{book?.author}</h2>
            <a href={`http://localhost:5000/books/${book?.pdf_path}`} target="_blank" rel="noopener noreferrer">Ver PDF</a>
            </div>
        </article>
      </React.Fragment>

    )}
    </main>
  )
}

export default BookCard