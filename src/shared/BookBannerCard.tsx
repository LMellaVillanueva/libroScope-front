import React from 'react'
import type { GoogleBook } from '../types'
import { Link } from 'react-router-dom'

type Props = {
  book: GoogleBook | null
}

const BookBannerCard = ({ book }: Props) => {
  return (
    <main>
      <React.Fragment>
        <Link className='flex items-center justify-evenly'
        to={`/libro/${book?.id}`}
        state={{ book }}>
        <img src={book?.volumeInfo.imageLinks?.smallThumbnail || '/default-cover.png'} 
        className='w-64 h-96 object-cover rounded shadow-md shadow-black hover:scale-105 hover:cursor-pointer transition-all duration-300' 
        width={150} 
        alt={book?.volumeInfo.title} />        
        <h2 className='w-md leading-relaxed text-4xl overflow-y-auto break-words'>{book?.volumeInfo.title}</h2>
        </Link>
      </React.Fragment>
    </main>
  )
}

export default BookBannerCard