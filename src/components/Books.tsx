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
    
    useEffect(() => {
        getGoogleBooksByCategorie(categorie)
    }, [categorie])

  return (
    <main className='flex items-start mt-16 relative'>
        <section className='flex flex-col gap-8 h-2/3 mt-28 ml-15 p-5 fixed text-start'>
            <h2 className='text-3xl'>Filtros</h2>
            <div className='flex flex-col'>
                <button onClick={() => setCategorie(Categorie.SCIENCE_FICTION)}>Ciencia Ficción</button>
                <button onClick={() => setCategorie(Categorie.ACTION)}>Acción</button>
                {/* <button onClick={() => setCategorie(Categorie.ROMANCE)}>Romance</button> */}
                <button onClick={() => setCategorie(Categorie.HORROR)}>Terror</button>
                <button onClick={() => setCategorie(Categorie.DRAMA)}>Dramático</button>
                <button onClick={() => setCategorie(Categorie.ADVENTURE)}>Aventura</button>
                <button onClick={() => setCategorie(Categorie.HISTORY)}>Histórico</button>
                <button onClick={() => setCategorie(Categorie.SELF_HELP)}>Desarrollo Personal</button>
                <button onClick={() => setCategorie(Categorie.FANTASY)}>Fantasía</button>
                <button onClick={() => setCategorie(Categorie.MYSTERY)}>Misterio</button>
                <button onClick={() => setCategorie(Categorie.COMMUNITY)}>Comunidad</button>
                {categorie !== Categorie.NONE && <button className='font-bold' onClick={() => setCategorie(Categorie.NONE)}>Borrar Filtro</button>}
            </div>
        </section>
        <article className='flex justify-end mt-32'>
            <section className='grid grid-cols-5 gap-8 min-w-[80%] w-5/6 p-3 py-10 items-center'>
            {categorie === Categorie.NONE ? (
                allBooks?.map((oneBook) => (
                    <div key={oneBook.id} className='flex justify-center items-center'>
                        <BookCard book={ oneBook }/>
                    </div>)
                )) : (
                googleBooks?.map((oneBook) => (
                    <div key={oneBook.id} className='flex justify-center items-center'>
                        <BookCard book={ oneBook }/>
                    </div>
                ))
            )}
            </section>
        </article>
    </main>
  )
}

export default Books