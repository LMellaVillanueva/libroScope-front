import React from 'react'
import type { GoogleBook, MyBook } from '../types'
import frontBook from '../assets/imgs/frontBook.png'
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
        onClick={ () => {setSearchedBooks([]); setBookSearch('')} }>
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
          <img src={frontBook} 
          className='object-cover' 
          alt={book?.title} />        
          <article className='flex flex-col justify-between h-56 items-center text-orange-600 absolute mt-20 mr-1.5'>
            <h2 className='text-4xl w-[200px] break-words'>{book?.title}</h2>
            <div className='flex flex-col items-center'>
            <h2>{book?.genre}</h2>
            <h2>{book?.author}</h2>
            </div>
        </article>
      </React.Fragment>

    )}
    </main>
  )
}

export default BookSearchedCard