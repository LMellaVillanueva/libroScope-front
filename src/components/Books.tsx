import { Categorie, type GoogleBook } from '../types'
import BookCard from '../shared/BookCard'
import { useEffect } from 'react'
import { useBookStore } from '../store/book'
import { useLocation } from 'react-router-dom'

type Props = {
    allBooks: GoogleBook[]
    allBooksCellphone: GoogleBook[]
    windowSize: number
}

const Books = ({ windowSize, allBooksCellphone }: Props) => {
    const categorie = useBookStore(state => state.googleBookCategorie)
    const setCategorie = useBookStore(state => state.setCategorie)
    const googleBooks = useBookStore(state => state.googleBooks)
    const getGoogleBooksByCategorie = useBookStore(state => state.getGoogleBooks)
    const communityBooks = useBookStore(state => state.communityBooks)

    const location = useLocation()
    const filterByFooter = location.state

    useEffect(() => {
      if (filterByFooter) {
        setCategorie(filterByFooter)
        window.scrollTo({ top: 0, 'behavior': 'smooth' })
      } else {
        null
      }
    }, [filterByFooter])
    
    useEffect(() => {
        getGoogleBooksByCategorie(categorie)
    }, [categorie])

  return (
    <main className='flex gap-6 px-6 py-8 mt-28 lg:mt-44'>
      {windowSize > 700 && (
        <section className='sticky top-10 h-fit min-w-[220px] bg-white text-black rounded-xl shadow-md p-5 my-8'>
          <h2 className='text-2xl font-semibold mb-4'>Filtros</h2>
          <div className='flex flex-col gap-2'>
            <button id='science_books' className='hover:font-bold' onClick={() => setCategorie(Categorie.SCIENCE_FICTION)}>Ciencia Ficción</button>
            <button className='hover:font-bold' onClick={() => setCategorie(Categorie.ACTION)}>Acción</button>
            <button className='hover:font-bold' onClick={() => setCategorie(Categorie.HORROR)}>Terror</button>
            <button className='hover:font-bold' onClick={() => setCategorie(Categorie.DRAMA)}>Dramático</button>
            <button className='hover:font-bold' onClick={() => setCategorie(Categorie.ADVENTURE)}>Aventura</button>
            <button className='hover:font-bold' onClick={() => setCategorie(Categorie.HISTORY)}>Histórico</button>
            <button className='hover:font-bold' onClick={() => setCategorie(Categorie.SELF_HELP)}>Desarrollo Personal</button>
            <button className='hover:font-bold' onClick={() => setCategorie(Categorie.FANTASY)}>Fantasía</button>
            <button className='hover:font-bold' onClick={() => setCategorie(Categorie.MYSTERY)}>Misterio</button>
            <button className='hover:font-bold' onClick={() => setCategorie(Categorie.COMMUNITY)}>Comunidad</button>
            {categorie !== Categorie.NONE && (
              <button className='text-red-600 hover:font-bold' onClick={() => {setCategorie(Categorie.NONE); window.scrollTo({ top: 0, 'behavior': 'smooth' }); }}>Borrar Filtro</button>
            )}
          </div>
        </section>
      )}
        {/* Contenedor de libros */}
        <section className='flex-1 pb-44'>
          <div className={`grid ${!communityBooks && categorie === Categorie.COMMUNITY ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'} gap-6`}>
            {categorie === Categorie.NONE && (
              allBooksCellphone?.map((oneBook) => (
                <BookCard key={oneBook.id} book={oneBook} />
              ))
            )}
            {categorie !== Categorie.NONE && categorie !== Categorie.COMMUNITY && (
              googleBooks?.map((oneBook) => (
                <BookCard key={oneBook.id} book={oneBook} />
              ))
            )}
            {categorie === Categorie.COMMUNITY && (
              communityBooks ? (communityBooks.map((oneBook) => (
                <BookCard key={oneBook.id_book} book={oneBook} />
              ))) : (
                <main className="h-[60vh]">
                  <h1 className="md:px-20 md:mt-10 md:text-start text-neutral-600 lg:text-base"
                  id="noBooksPublished" 
                  style={{ fontFamily: '"Libre Franklin", sans-serif' }}>No hay libros publicados por la comunidad...</h1>
                </main>
              )
            )}
          </div>
        </section>
      </main>
  )
}

export default Books