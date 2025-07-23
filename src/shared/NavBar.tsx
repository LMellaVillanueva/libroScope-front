import { Link, useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/user'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { GoogleLogin, googleLogout, type CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import type { GoogleBook, GoogleJwtPayload } from '../types'
import { FiLogOut } from 'react-icons/fi'
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
        const { data } = await axios.post(`http://127.0.0.1:5000/books/search/${event.target.value}/${googleBookCategorie}`)
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
    <main className='flex flex-col w-full absolute top-0 left-0 items-center justify-center z-10'>
      <nav className='flex items-center gap-4 p-1 dark:bg-red-900 w-full text-lg' style={{ backgroundColor: '#080e21' }}>
        <Link className='hover:text-blue-300' to={'/'}>
          <img src={nav_logo} alt="nav_logo" width={300} />
        </Link>
        <div className='flex items-center justify-around w-5/12 text-blue-500'>
          <Link className='hover:text-blue-300' to={'/'}>Inicio</Link>

            <div className='border border-white h-5'></div>

          <Link className='hover:text-blue-300' to={'/libros'}>Libros</Link>

            <div className='border border-white h-5'></div>
          {!dbUser ? ( 
            <React.Fragment>
              <button onClick={() => setLoginModal(true)} className='w-fit font-medium hover:text-blue-300'>Iniciar Sesión</button>
              {/* <div className='border border-white h-5'></div> */}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {user?.admin ? (
                <React.Fragment>
                  <Link className='hover:text-blue-300' to={'/todos_los_libros'}>Libros Publicados</Link>
                  <div className='border border-white h-5'></div>
                </React.Fragment>
              ) : (
                <section className='flex items-center justify-between w-2xs'>
                  <Link className='hover:text-blue-300' to={'/mis_libros'}>Mis Libros</Link>
                    <div className='border border-white h-5'></div>
                  <Link className='hover:text-blue-300' to={'/publicar'}>Publicar libro</Link>
                </section>
              )}
            </React.Fragment>
          )}
        </div>
        <div className='flex items-center gap-8'>
          <form onSubmit={handleBookSearch} className='flex items-center gap-2'>
            <div className='flex items-center w-full max-w-xl h-10 overflow-hidden rounded-full border border-gray-300 bg-white relative'>
              <input 
              className='w-md text-gray-700 placeholder-gray-500 focus:outline-none' 
              onChange={handleChangeBookSearch} 
              value={bookSearch} 
              type="text" 
              placeholder='Título, género, autor...' />
              <button type='submit'>🔍</button>
            </div>
            {bookSearch.length !== 0 && (
              <button className='absolute right-38' style={{ background: 'none' }} onClick={() => setBookSearch('')}>✖️</button>
            )}
          </form>
          {dbUser && (
            <button className='text-white hover:text-blue-300 rounded-full' onClick={() => setConfirmLogout(true)}><FiLogOut size={25} /></button>
          )}
        </div>

          {/* Modal de cerrar sesión */}
          {confirmLogout && (
            <React.Fragment>
              <div className='fixed bg-black opacity-60 inset-0 z-10 w-[100vw] h-[100vh]'></div>
               <div className='fixed m-auto inset-0 rounded-md w-3/12 h-4/12 flex flex-col items-center justify-center p-5 gap-10 z-20 text-2xl bg-neutral-200'>
                 <p className='font-bold'>¿Quieres cerrar sesión?</p>
               <div className='flex justify-center items-center gap-8 w-full text-3xl'>
                <button className='text-gray-500 hover:text-black' onClick={handleLogout}>Sí</button>
                <button className='text-gray-500 hover:text-black' onClick={() => setConfirmLogout(false)}>No</button>
               </div>
              </div>
            </React.Fragment>
          )}

        {/*//!Modal de login */}
          {loginModal && (
            <section className='fixed m-auto inset-0 top-20 w-3/12 h-4/6 p-8 rounded-md flex flex-col justify-around z-10 bg-indigo-950 text-neutral-200' >
              <button className='absolute top-4 right-4' onClick={() => setLoginModal(false)}>X</button>

              <h2 className='font-bold text-2xl'>Inicio de Sesión</h2>

              <form onSubmit={handleLogin} className='flex flex-col items-center justify-between gap-5'>

                <div className='text-left'>
                  <label htmlFor="email">Correo:</label> <br />
                  <input type="email" name='email' onChange={handleChangeLoginInfo} className='border border-neutral-800 w-3xs rounded-md p-0.5' />
                </div>

                <div className='text-left'>
                  <label htmlFor="password">Contraseña:</label> <br />
                  <input type="password" name='password' onChange={handleChangeLoginInfo} className='border border-neutral-800 w-3xs rounded-md p-0.5' />
                </div>

                <button className='text-blue-400 hover:text-blue-300 font-medium' type='submit'>Iniciar Sesión</button>
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

              <span>¿No tienes una cuenta?, <Link className='text-blue-400 hover:text-blue-300' to={'/registro'} onClick={() => setLoginModal(false)} >Regístrate.</Link></span>
            </section>
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