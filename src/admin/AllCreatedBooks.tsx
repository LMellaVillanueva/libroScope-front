import BookCard from '../shared/BookCard'
import { useUserStore } from '../store/user'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/book'

const AllCreatedBooks = () => {
    const user = useUserStore(state => state.user)
    const communityBooks = useBookStore(state => state.communityBooks)
    const navigate = useNavigate()
    if (!user?.admin) {
        navigate('/')
    }
  return (
    <main className='mt-44'>
        <section className='flex-1'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
            {communityBooks && communityBooks.length > 0 ?(
              (communityBooks?.map((oneBook) => (
                  <BookCard key={oneBook.id_book} book={oneBook} />
                ))
              )) : (
                <h1>Ningún libro publicado</h1>
            )}
          </div>
        </section>
    </main>
  )
}

export default AllCreatedBooks