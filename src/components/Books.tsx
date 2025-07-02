import type { GoogleBook } from '../types'
import BookCard from '../shared/BookCard'

type Props = {
    allBooks: GoogleBook[]
}

const Books = ({ allBooks }: Props) => {

  return (
    <main className='flex flex-col justify-center items-center gap-2 mt-16'>
        <article className='flex justify-center items-center mt-36'>
            <section className='grid grid-cols-5 gap-8 w-5/6 p-3 items-center'>
                {allBooks?.map((oneBook) => (
                    <div key={oneBook.id} className='flex justify-center items-center'>
                        <BookCard book={ oneBook }/>
                    </div>
                ))}
            </section>
        </article>
    </main>
  )
}

export default Books