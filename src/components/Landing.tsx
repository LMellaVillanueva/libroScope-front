import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { useUserStore } from "../store/user"
import type { GoogleBook } from "../types"
import BookBannerCard from "../shared/BookBannerCard"
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
    }, 4000)
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
    <main className="mt-36 flex flex-col gap-10 text-neutral-600">
      <div>
        {user && (
          <h2 className="text-left px-10 pt-5">Bienvenido/a {user?.name}</h2>
        )}
        <h1 className={`text-left px-5 py-1 ${!user && 'mt-10'} `}>Te podría gustar:</h1>
      </div>
      {bannerBooks && bannerBooks.length > 0 && (
        <article className="flex justify-between py-8 px-3 items-center rounded-md" /*style={{ backgroundColor: '#d2a4ff' }}*/>
          <section className="w-full">
            <BookBannerCard book={bannerBooks[bannerIndex]}/>
          </section>
        </article>
      )}
          <div className="flex items-center justify-baseline gap-4 mx-auto">
            <button onClick={() => setBannerIndex(0)} className={`w-3 h-3 rounded-full ${bannerIndex === 0 ? 'bg-black' : 'bg-gray-400'} hover:bg-gray-400`}></button>
            <button onClick={() => setBannerIndex(1)} className={`w-3 h-3 rounded-full ${bannerIndex === 1 ? 'bg-black' : 'bg-gray-400'} hover:bg-gray-400`}></button>
            <button onClick={() => setBannerIndex(2)} className={`w-3 h-3 rounded-full ${bannerIndex === 2 ? 'bg-black' : 'bg-gray-400'} hover:bg-gray-400`}></button>
            <button onClick={() => setBannerIndex(3)} className={`w-3 h-3 rounded-full ${bannerIndex === 3 ? 'bg-black' : 'bg-gray-400'} hover:bg-gray-400`}></button>
            <button onClick={() => setBannerIndex(4)} className={`w-3 h-3 rounded-full ${bannerIndex === 4 ? 'bg-black' : 'bg-gray-400'} hover:bg-gray-400`}></button>
          </div>

      <div className='flex flex-col gap-5 items-center p-10'>
        <article className='flex justify-between w-full items-center mt-10'>
            <button className="p-2 pt-1 text-xl rounded-full text-black hover:bg-indigo-950 hover:text-neutral-200" onClick={prevPage} disabled={actualPage === 1}> {'<<'} </button>
            <section className='grid grid-cols-5 p-5 gap-20 items-center'>
                {books?.map((oneBook) => (
                    <div key={oneBook.id} className='flex justify-center items-center'>
                        <BookCard book={ oneBook }/>
                    </div>
                ))}
            </section>
            <button className="p-2 pt-1 text-xl rounded-full text-black hover:bg-indigo-950 hover:text-neutral-200" onClick={postPage} disabled={actualPage === totalPages}> {'>>'} </button>
        </article>
        <span className='font-bold'>Página {actualPage} de {totalPages}</span>
      </div>

    </main>
  )
}

export default Landing