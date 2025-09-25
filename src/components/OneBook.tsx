import { useLocation, useNavigate } from 'react-router-dom'
import type { GoogleBook, MyBook } from '../types'
import { useEffect, useState } from 'react'
import api from '../axiosConfig'
import BookRecommendCard from '../shared/BookRecommendCard'
import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa'
import { useUserStore } from '../store/user'
import { useBookStore } from '../store/book'

type Props = {
  windowSize: number
}

const OneBook = ({ windowSize }: Props) => {
    const location = useLocation()
    const navigate = useNavigate()
    const state = location.state as { book?: GoogleBook | MyBook }
    const book = state.book
    const [recommendBooks, setRecommendBooks] = useState<GoogleBook[]>([])
    const user = useUserStore(state => state.user)
    const elimMyBook = useBookStore(state => state.deleteMyBook)
    const fetchMyBooks = useBookStore(state => state.getBooks)
    const getCommunityBooks = useBookStore(state => state.getCommunityBooks)    
    const [bookDeleted, setBookDeleted] = useState(false)

    const isGoogleBook = (book: GoogleBook | MyBook | undefined ): book is GoogleBook => {
      return !!book && 'volumeInfo' in book
    }

    useEffect(() => {
      if (!book) navigate('/mis_libros')
    }, [book])  

    const handleElim = async () => {
        if (!isGoogleBook(book)) {
          const confirmElim = window.confirm('¿Quieres eliminar este libro?')
          if (confirmElim) {
            try {
              await elimMyBook(book?.id_book)
              await fetchMyBooks()
              await getCommunityBooks()
              setBookDeleted(true)
            } catch (error: any) {
              if (error.response && error.response.data) {
                setBookDeleted(true)
              } else {
                return console.error(error.message)
              }
            }
          }
        }  
    }

    useEffect(() => {
      if (bookDeleted) navigate('/mis_libros')
    }, [bookDeleted])

     useEffect(() => {
         const fetchRecommendBooks = async () => {
             try {
                 const { data } = await api.post('/books/recommend', book)
                 if (data.recommend_books) {
                     setRecommendBooks(data.recommend_books)
                 }
             } catch (error: any) {
             if (error.response && error.response.data) {
               console.log(error.response.data.errors)
             } else {
               return console.error(error.message)
             }
         }
     }
     fetchRecommendBooks()
     }, [])

  return (
    <main className='p-5 text-neutral-600'>
    {isGoogleBook(book) ? (
        <main className='pb-40 lg:mt-36 md:mt-28 mt-20 flex justify-around items-center'>
            <button className='self-start' onClick={() => navigate(-1)}>
            <FaArrowLeft size={35} className='transition-transform hover:scale-120 absolute md:relative'/>
            </button>
            <article className='w-full flex flex-col lg:flex-row items-center lg:items-start justify-evenly gap-8 lg:gap-0'>
                <img className='w-3xs lg:w-64 lg:self-baseline'
                src={book.volumeInfo.imageLinks?.smallThumbnail} 
                alt={book.volumeInfo?.title} />
                    {windowSize < 900 && (
                      <h2 className='text-3xl text-center lg:text-left font-bold'>{book.volumeInfo?.title}</h2>
                    )}
                    <section className='flex flex-col items-center md:items-start gap-7 lg:w-1/2 text-lg'>
                    {windowSize > 900 && (
                      <h2 className='text-4xl text-left font-bold'>{book.volumeInfo?.title}</h2>
                    )}
                    {book.accessInfo.webReaderLink && (
                    <span className='flex items-center gap-2 transition-all text-neutral-600 font-medium text-2xl hover:text-neutral-900 hover:font-bold'>
                      <a href={book.accessInfo.webReaderLink} target='a_blank' className='min-w-[102px]'>Ver Libro</a> 
                      <FaExternalLinkAlt/>
                    </span>
                    )}
                    <span className='flex gap-1'>
                        <p className='font-bold'>Autor/es:</p>
                        <p>{book.volumeInfo?.authors?.join(', ') || 'Libro sin información.'}</p>
                    </span>
                    <span className='flex gap-1'>
                        <p className='font-bold'>Género:</p> 
                        <p>{book.volumeInfo?.categories?.join(', ') || 'Libro sin información.'}</p>
                    </span>
                    <span className='flex flex-col items-start gap-2'>
                        <p className='font-bold'>Descripción:</p>
                        <p id='scrollSect' className={`${!recommendBooks.length ? 'max-h-[300px] overflow-y-auto break-words' : 'max-h-110 lg:max-h-fit overflow-y-auto lg:overflow-y-visible break-words lg:break-normal'}`}>{book.volumeInfo?.description || 'Libro sin información.'}</p>
                    </span>
                </section>
            {/* Recomendaciones */}
            {recommendBooks.length > 0 && (
                <article className='flex flex-col items-center'>
                    <h2 className='font-semibold text-xl'>Te podría interesar:</h2>
                <section className='flex flex-col gap-10 w-full p-10'>
                {recommendBooks.map((book) => (
                    <BookRecommendCard key={book.id} book={book}/>
                ))}
                </section>
            </article>
            )}
          </article>
        </main>
        ) : (
          <main className='pb-40 lg:mt-36 md:mt-28 mt-20 flex justify-around items-center'>
            <button className='self-start' onClick={() => navigate(-1)}>
              <FaArrowLeft size={35} className='transition-transform hover:scale-120 absolute md:relative'/>
            </button>
            <article className='w-full flex flex-col lg:flex-row items-center lg:items-start justify-evenly gap-8 lg:gap-0'>
              <img 
                className='w-3xs lg:w-64 lg:self-baseline'
                src={book?.image_url} 
                alt={book?.title} 
              />
              {windowSize < 900 && (
                <h2 className='text-3xl max-w-4/5 text-center font-bold max-h-[300px] overflow-y-auto break-words'>{book?.title}</h2>
              )}
              <section className='flex flex-col items-center lg:items-start gap-7 lg:w-1/2 text-lg'>
                {windowSize > 900 && (
                  <h2 className='text-4xl text-left font-bold'>{book?.title}</h2>
                )}
                <a 
                  href={book?.pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className='flex items-center gap-2 transition-all text-neutral-600 font-medium text-2xl hover:text-neutral-900 hover:font-bold'
                >
                  Ver Libro <FaExternalLinkAlt/>
                </a>
                <span className='flex gap-1'>
                  <p className='font-bold'>Autor:</p>
                  <p>{book?.author || 'Libro sin información'}</p>
                </span>
                <span className='flex gap-1'>
                  <p className='font-bold'>Género:</p>
                  <p className='max-w-4/5 text-center max-h-[300px] overflow-y-auto break-words'>{book?.genre || 'Libro sin información'}</p>
                </span>
                <span className='flex items-start gap-2'>
                  <p className='font-bold'>Descripción:</p>
                  <p 
                    id='scrollSect' 
                    className='max-h-[300px] max-w-[200px] lg:max-w-fit overflow-y-auto break-words'
                  >
                    {book?.description || 'Libro sin información'}
                  </p>
                </span>
                {user?.id_user === book?.user_id && (
                    <button 
                    className='font-medium text-2xl text-red-500 hover:text-red-400' 
                    type='submit'
                    onClick={() => handleElim()}>Eliminar Libro</button>
                )}
                {user?.admin == true && (
                    <button 
                    className='font-medium text-2xl text-red-500 hover:text-red-400' 
                    type='submit'
                    onClick={() => handleElim()}>Eliminar Libro</button>
                )}
              </section>
            </article>
          </main>
        )}
    </main>
  )
}

export default OneBook