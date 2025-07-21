import React from 'react'
import type { GoogleBook } from '../types'
import { Link } from 'react-router-dom'

type Props = {
  book: GoogleBook | null
}

const BookLangingCard = ({ book }: Props) => {
  return (
    <main>
      <React.Fragment>
        <Link className='flex flex-col items-center gap-2 hover:scale-105 hover:cursor-pointer transition-all duration-300'
        to={`/libro/${book?.id}`}
        state={{ book }}>
        <img src={book?.volumeInfo.imageLinks?.smallThumbnail || '/default-cover.png'} 
        className='w-28 h-44 object-cover rounded shadow-md shadow-black' 
        width={150} 
        alt={book?.volumeInfo.title} />        
        <h2 className=' h-[100px] overflow-y-auto break-words'>{book?.volumeInfo.title}</h2>
        </Link>
      </React.Fragment>
    </main>
  )
}

export default BookLangingCard