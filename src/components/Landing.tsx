import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { useUserStore } from "../store/user"
import type { GoogleBook } from "../types"
import BookCard from "../shared/BookCard"

type Props = {
    books: GoogleBook[] | null
    actualPage: number
    setActualPage: Dispatch<SetStateAction<number>>
    totalPages: number
    bannerBooks: GoogleBook[] | null
}

const Landing = ({ books, actualPage, setActualPage, totalPages, bannerBooks }: Props) => {

  const user = useUserStore(state => state.user)
  //?Índice para mostrar solo un libro en banner
  const [bannerIndex, setBannerIndex] = useState<number>(0)

  const prevBanner = () => {
    if (bannerBooks?.length) {
      setBannerIndex(actual => actual === 0 ? bannerBooks.length - 1 : actual - 1)
    }
  }

  const nextBanner = () => {
    if (bannerBooks?.length) {
      setBannerIndex(actual => actual === bannerBooks.length - 1 ? 0 : actual + 1)
    }
  }

  const prevPage = () => {
             {/* Nunca baja de la página 1*/}
      setActualPage(prevPage => Math.max(prevPage - 1, 1))
    }

    const postPage = () => {
        setActualPage(prevPage => Math.min(prevPage + 1, totalPages))
    }

  //Avance automático de carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      if (bannerBooks?.length) {
        setBannerIndex(actual => actual === bannerBooks?.length - 1 ? 0 : actual + 1)
      }
    }, 7000)
    return () => clearInterval(timer)
  }, [bannerBooks])

  useEffect(() => {
    if (user) {
      console.log('Usuario en estado global', user)
      console.log(useUserStore.getState().user)
    }
      else console.log('No hay usuario')
  }, [user])

  return (
    <main className="mt-52">
      {user && (
        <h2 className="text-left px-10">Bienvenido/a {user?.name}</h2>
      )}
      <h1 className={`text-left px-5 py-1 ${!user && 'mt-10'} `}>Te podría gustar:</h1>
      {bannerBooks && bannerBooks.length > 0 && (
        <article className="flex justify-between items-center bg-amber-950 p-10 m-10 rounded-md">
          {/* <img 
          src={banner} 
          alt="banner" 
          className="w-full h-full object-cover rounded-lg"
          /> */}
          <button onClick={prevBanner}>{'<'}</button>

          <section>
            <BookCard book={bannerBooks[bannerIndex]}/>
          </section>

          <button onClick={nextBanner}>{'>'}</button>
        </article>
      )}

      <div className='flex flex-col justify-center items-center gap-2 py-10'>
        <article className='flex justify-center items-center mt-36'>
            <button onClick={prevPage} disabled={actualPage === 1}> {'<'} </button>
            <section className='grid grid-cols-5 gap-8 w-5/6 p-3 items-center'>
                {books?.map((oneBook) => (
                    <div key={oneBook.id} className='flex justify-center items-center '>
                        <BookCard book={ oneBook }/>
                    </div>
                ))}
            </section>
            <button onClick={postPage} disabled={actualPage === totalPages}> {'>'} </button>
        </article>
        <span className='font-bold'>Página {actualPage} de {totalPages}</span>
      </div>

    </main>
  )
}

export default Landing