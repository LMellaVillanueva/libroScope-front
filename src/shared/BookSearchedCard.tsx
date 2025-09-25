import React from 'react'
import type { GoogleBook, MyBook } from '../types'
import { Link } from 'react-router-dom'

type Props = {
  book: GoogleBook | MyBook | null
  setSearchedBooks: (book: GoogleBook[]) => void
  setBookSearch: (booksearch: string) => void
}

const BookSearchedCard = ({ book, setSearchedBooks, setBookSearch }: Props) => {

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
        <Link className='flex items-center w-md hover:scale-105 hover:cursor-pointer transition-all duration-300 gap-2' 
        to={`/libro/${book?.id}`}
        state={{ book }}
        onClick={ () => {setSearchedBooks([]); setBookSearch('');} }>
          <img src={book?.volumeInfo.imageLinks?.smallThumbnail} 
          className='w-24 h-40 object-cover rounded shadow-md shadow-black' 
          width={50} 
          alt={book?.volumeInfo.title} />        
          <h2 className='break-words w-full'>{book?.volumeInfo.title}</h2>
          <div className='border border-black w-3'></div>
          <div className='flex flex-col items-center gap-2 w-full'>
              {book?.volumeInfo.authors?.map((auth) => (
                <section>
                      <p>{auth}</p>
                  </section>
              ))}
          </div>
        </Link>
        <div className='border border-black w-full mt-5'></div>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Link className='flex items-center w-md hover:scale-105 hover:cursor-pointer transition-all duration-300 gap-2' 
        to={`/libro/${book?.id_book}`}
        state={{ book }}
        onClick={ () => {setSearchedBooks([]); setBookSearch('');} }>
          <img src={book?.image_url} 
          className='w-24 h-40 object-cover rounded shadow-md shadow-black' 
          width={50} 
          alt={book?.title} />        
          <h2 className='break-words w-full'>{book?.title}</h2>
          <div className='border border-black w-3'></div>
          <div className='flex flex-col items-center gap-2 w-full'>
          <p>{book?.author}</p>
          </div>
        </Link>
        <div className='border border-black w-full mt-5'></div>
      </React.Fragment>
    )}
    </main>
  )
}

export default BookSearchedCard