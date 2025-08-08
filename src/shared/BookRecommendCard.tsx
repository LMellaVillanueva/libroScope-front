import React from 'react'
import type { GoogleBook } from '../types'
import { Link } from 'react-router-dom'

type Props = {
    book: GoogleBook | null
}

const BookRecommendCard = ({ book }: Props) => {
  return (
    <React.Fragment>
        <Link className='flex flex-col items-center gap-2 hover:scale-105 hover:cursor-pointer transition-all duration-300'
        to={`/libro/${book?.id}`}
        state={{ book }}>
        <img src={book?.volumeInfo.imageLinks?.smallThumbnail} 
        className='w-28 h-44 object-cover rounded shadow-md shadow-black' 
        width={150} 
        alt={book?.volumeInfo.title} />        
        {!book?.volumeInfo.imageLinks?.smallThumbnail || !book?.volumeInfo.imageLinks?.thumbnail && (
            <p>Sin portada</p>
        )}
        <h2 className='max-h-[100px] max-w-[200px] overflow-y-auto break-words font-bold text-lg'>{book?.volumeInfo.title}</h2>
        </Link>
    </React.Fragment>
  )
}

export default BookRecommendCard