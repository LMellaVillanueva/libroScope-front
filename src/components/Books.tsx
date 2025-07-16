import { Categorie, type GoogleBook } from '../types'
import BookCard from '../shared/BookCard'
import { useEffect } from 'react'
import { useBookStore } from '../store/book'

type Props = {
    allBooks: GoogleBook[]
}

const Books = ({ allBooks }: Props) => {
    const categorie = useBookStore(state => state.googleBookCategorie)
    const setCategorie = useBookStore(state => state.setCategorie)
    const googleBooks = useBookStore(state => state.googleBooks)
    const getGoogleBooksByCategorie = useBookStore(state => state.getGoogleBooks)
    const communityBooks = useBookStore(state => state.communityBooks)
    
    
    useEffect(() => {
        getGoogleBooksByCategorie(categorie)
    }, [categorie])

  return (
    <main className='flex gap-6 px-6 mt-44'>
      <section className='sticky top-24 h-fit min-w-[220px] bg-white text-black rounded-xl shadow-md p-5'>
        <h2 className='text-2xl font-semibold mb-4'>Filtros</h2>
        <div className='flex flex-col gap-2'>
          <button onClick={() => setCategorie(Categorie.SCIENCE_FICTION)}>Ciencia Ficción</button>
          <button onClick={() => setCategorie(Categorie.ACTION)}>Acción</button>
          <button onClick={() => setCategorie(Categorie.HORROR)}>Terror</button>
          <button onClick={() => setCategorie(Categorie.DRAMA)}>Dramático</button>
          <button onClick={() => setCategorie(Categorie.ADVENTURE)}>Aventura</button>
          <button onClick={() => setCategorie(Categorie.HISTORY)}>Histórico</button>
          <button onClick={() => setCategorie(Categorie.SELF_HELP)}>Desarrollo Personal</button>
          <button onClick={() => setCategorie(Categorie.FANTASY)}>Fantasía</button>
          <button onClick={() => setCategorie(Categorie.MYSTERY)}>Misterio</button>
          <button onClick={() => setCategorie(Categorie.COMMUNITY)}>Comunidad</button>
          {categorie !== Categorie.NONE && (
            <button className='font-bold text-red-600' onClick={() => setCategorie(Categorie.NONE)}>Borrar Filtro</button>
          )}
        </div>
      </section>

      {/* Contenedor de libros */}
      <section className='flex-1'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
          {categorie === Categorie.NONE && (
            allBooks?.map((oneBook) => (
              <BookCard key={oneBook.id} book={oneBook} />
            ))
          )}
          {categorie !== Categorie.NONE && categorie !== Categorie.COMMUNITY && (
            googleBooks?.map((oneBook) => (
              <BookCard key={oneBook.id} book={oneBook} />
            ))
          )}
          {categorie === Categorie.COMMUNITY && (
            communityBooks?.map((oneBook) => (
              <BookCard key={oneBook.id_book} book={oneBook} />
            ))
          )}
        </div>
      </section>
    </main>

  )
}

export default Books