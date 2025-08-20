import { Link, useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/user'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { GoogleLogin, googleLogout, type CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import type { GoogleBook, GoogleJwtPayload } from '../types'
import { FiLogOut, FiX, FiSearch } from 'react-icons/fi'
import { useBookStore } from '../store/book'
import BookSearchedCard from './BookSearchedCard'
import nav_logo from '../assets/imgs/nav_logo.png'

const NavBar = () => {

  const [loginModal, setLoginModal] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' })
  const [bookSearch, setBookSearch] = useState('')
  const [searchedBooks, setSearchedBooks] = useState<GoogleBook[]>([])
  const [dbUser, setDbUser] = useState(false)

  const userLogin = useUserStore(state => state.logIn)
  const userLogout = useUserStore(state => state.logOut)

  const user = useUserStore(state => state.user)
  const navigate = useNavigate()

  const googleBookCategorie = useBookStore(state => state.googleBookCategorie)

  // Validar si el user existe en la base de datos
  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const { data } = await axios(`http://127.0.0.1:5000/user/one_user/${user?.id_user}`)
        if (data.success)  {
         console.log(data.success) 
         setDbUser(true)
        }
      } catch (error: any) {
        userLogout()        
        if (error.response && error.response.data) {
          setDbUser(false)
          return console.log('Error: ', error.response.data.errors)
        } else {
          return console.error(error.message)
        }
      }
    }
    fetchUserById()
  }, [user])

  useEffect(() => {
    if (!bookSearch.length) {
      setSearchedBooks([])
    }
  }, [bookSearch])

  const handleChangeLoginInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({...loginInfo, 
      [event.target.name]: event.target.value
    })
  }

  const handleChangeBookSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setBookSearch(event.target.value)
    try {
      if (bookSearch.length) {
        const { data } = await axios.post(`http://127.0.0.1:5000/books/search/${googleBookCategorie}/${event.target.value}`)
        if (data.matching_books) {
          setSearchedBooks(data.matching_books)
        }
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        return console.log('Error: ', error.response.data.errors)
      } else {
        return console.error(error.message)
      }
    }
  }

  const handleLogin = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()
    try {
      const res = await axios.post('http://127.0.0.1:5000/user/login', loginInfo)
      if (res.data) {
        userLogin(res.data.user)
        setLoginModal(false)
        setLoginInfo({ email: '', password: '' })
        return navigate('/')
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        return console.log('Error: ', error.response.data.errors)
      } else {
        return console.error(error.message)
      }
    }
  }
  
  const handleLogout = () => {
    try {
      useUserStore.persist.clearStorage()
      userLogout()
      setConfirmLogout(false)
    } catch (error) {
      if (error instanceof Error) console.error(error.message)
      }
  }
  
  const handleBookSearch = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()
    try {
      if (bookSearch.length) {
        const { data } = await axios.post(`http://127.0.0.1:5000/books/search/${bookSearch}/${googleBookCategorie}`)
        if (data.matching_books) {
          setSearchedBooks(data.matching_books)
        }
      } else {
        return window.alert('No puede estar vacío!')
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        return console.log('Error: ', error.response.data.errors)
      } else {
        return console.error(error.message)
      }
    }
  }

  return (
    <main className='flex flex-col w-full absolute top-0 left-0 items-center justify-center z-20'>
      <nav className='flex items-center justify-around p-3 w-full text-lg border-b border-b-black' /*style={{ backgroundColor: '#080e21' }}*/>
        <Link to={'/'}>
          <img src={nav_logo} alt="nav_logo" width={250}/>
        </Link>
        <div className='flex items-center gap-12 min-w-md text-neutral-500'>

            <Link className='transition-all hover:text-neutral-900 hover:font-bold min-w-[60px]' to={'/'}>Inicio</Link>
              <div className='border border-black h-5'></div>
            <Link className='transition-all hover:text-neutral-900 hover:font-bold min-w-[60px]' to={'/libros'}>Libros</Link>
              <div className='border border-black h-5'></div>

          {!dbUser && (
            <button onClick={() => setLoginModal(true)} className='transition-all hover:text-neutral-900 hover:font-bold min-w-[120px]'>Iniciar Sesión</button>
          )}

          {dbUser && (
            <React.Fragment>
                {user?.admin ? (
                  <React.Fragment>
                    <Link className='transition-all hover:text-neutral-900 hover:font-bold  min-w-[60px]' to={'/todos_los_libros'}>Libros Publicados</Link>
                    <div className='border border-black h-5'></div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Link className='transition-all hover:text-neutral-900 hover:font-bold  min-w-[88px]' to={'/mis_libros'}>Mis Libros</Link>
                      <div className='border border-black h-5'></div>
                    <Link className='transition-all hover:text-neutral-900 hover:font-bold  min-w-[115px]' to={'/publicar'}>Publicar libro</Link>
                  </React.Fragment>
                )}
            </React.Fragment>
          )}
        </div>

          <form onSubmit={handleBookSearch} className='flex items-center gap-2 w-md'>
            <div className='relative w-full max-w-xl'>
              <input 
                className='w-full h-10 pl-3 pr-10 text-gray-700 placeholder-gray-500 border border-black rounded-md focus:outline-none' 
                onChange={handleChangeBookSearch} 
                value={bookSearch} 
                type="text" 
                placeholder='Título, género, autor...' 
              />
              {/* Contenedor absoluto para los botones */}
              <div className='absolute right-0 top-0 h-full flex items-center gap-1 pr-1'>
                {bookSearch.length !== 0 && (
                  <button 
                    type="button" 
                    onClick={() => setBookSearch('')}
                    className='flex items-center justify-center p-1'
                  >
                    <FiX className='text-black' size={20}/>
                  </button>
                )}
                <button type='submit' className='flex items-center justify-center p-1'>
                  <FiSearch className='text-black' size={20}/>
                </button>
              </div>
            </div>
          </form>

          
          {dbUser && (
            <button 
            className='text-neutral-500 hover:font-bold transition-all hover:text-neutral-950' 
            onClick={() => setConfirmLogout(true)}>
              <FiLogOut size={25} />
            </button>
          )}

          {/* Modal de cerrar sesión */}
          {confirmLogout && (
            <React.Fragment>
              <div className='fixed bg-black opacity-60 inset-0 z-10 w-[100vw] h-[100vh]'></div>
               <div className='fixed m-auto inset-0 rounded-md w-3/12 h-4/12 flex flex-col items-center justify-center p-5 gap-10 z-20 text-2xl bg-neutral-200'>
                 <p className='font-bold text-neutral-600'>¿Quieres cerrar sesión?</p>
               <div className='flex justify-evenly items-center gap-8 w-full text-3xl'>
                <button className='text-neutral-500 hover:font-bold transition-all hover:text-neutral-900 border border-black p-2 rounded-md text-xl w-18' onClick={handleLogout}>Sí</button>
                <button className='text-neutral-500 hover:font-bold transition-all hover:text-neutral-900 border border-black p-2 rounded-md text-xl w-18' onClick={() => setConfirmLogout(false)}>No</button>
               </div>
              </div>
            </React.Fragment>
          )}

      {/*//!Modal de login */}
        {loginModal && (
          <React.Fragment>
            <div className='fixed bg-black opacity-60 inset-0 z-20 w-[100vw] h-[100vh]'></div>
              <section className='fixed m-auto inset-0 top-10 w-3/12 h-4/6 p-8 rounded-md flex flex-col justify-around z-20 bg-neutral-200 text-neutral-200 text' >
              <button className='absolute top-4 right-4 text-black' onClick={() => setLoginModal(false)}><FiX size={25}/></button>

              <h2 className='font-bold text-2xl text-neutral-700'>Inicio de Sesión</h2>

              <form onSubmit={handleLogin} className='flex flex-col items-center justify-between gap-5 text-neutral-600'>

                <div className='text-left'>
                  <label htmlFor="email">Correo:</label> <br />
                  <input type="email" name='email' onChange={handleChangeLoginInfo} className='border border-black w-3xs rounded-md p-0.5' />
                </div>

                <div className='text-left'>
                  <label htmlFor="password">Contraseña:</label> <br />
                  <input type="password" name='password' onChange={handleChangeLoginInfo} className='border border-black w-3xs rounded-md p-0.5' />
                </div>

                <button className='transition-all hover:text-neutral-900 hover:font-bold' type='submit'>Iniciar Sesión</button>
                <GoogleLogin 
                  onSuccess={ async (credentials: CredentialResponse) => {
                    try {
                      if (credentials.credential) {
                        const google_user = jwtDecode<GoogleJwtPayload>(credentials?.credential)
                        const res = await axios.post('http://127.0.0.1:5000/user/login', { email: google_user.email })
                        if (res.data) {
                          userLogin(res.data.user)
                          setLoginModal(false)
                          return navigate('/')
                        }
                      } else {
                        return console.error('No se recibió el token de Google')
                      }
                    }  catch (error: any) {
                      if (error.response && error.response.data) {
                        console.log('Sesión de Google cerrada')
                        console.log('Error: ', error.response.data.errors)
                        return googleLogout()
                      } else {
                        return console.error(error.message)
                      }
                    }
                  }}
                  onError={() => {console.error('Login fallido')}}
                  />
              </form>

              <span className='text-neutral-600'>
                ¿No tienes una cuenta?, <b></b>
                  <Link
                   className='transition-all font-medium text-neutral-700 hover:text-neutral-900 hover:font-bold' to={'/registro'} 
                   onClick={() => setLoginModal(false)}>
                      Regístrate.
                  </Link>
                </span>
            </section>
          </React.Fragment>
          )}

    </nav>
        {/* Searched book's modal in real time */}
        {searchedBooks.length !== 0 && (
          <div className='flex flex-col items-center overflow-y-auto gap-5 p-10 w-1/2 h-[360px] bg-amber-100 text-black'>
          {searchedBooks?.map((oneBook) => (
              <BookSearchedCard book={ oneBook } setSearchedBooks={ setSearchedBooks } setBookSearch={ setBookSearch }/>
            ))}
          </div>
        )}
  </main>
  )

}

export default NavBar