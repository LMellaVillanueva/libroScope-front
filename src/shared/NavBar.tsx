import { Link, useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/user'
import React, { useState } from 'react'
import axios from 'axios'
import { GoogleLogin, googleLogout, type CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import type { GoogleJwtPayload } from '../types'
import { FiLogOut } from 'react-icons/fi'

const NavBar = () => {

  const [loginModal, setLoginModal] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' })
  const [bookSearch, setbookSearch] = useState('')

  const userLogin = useUserStore(state => state.logIn)
  const userLogout = useUserStore(state => state.logOut)

  const user = useUserStore(state => state.user)
  const navigate = useNavigate()

  const handleChangeLoginInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({...loginInfo, 
      [event.target.name]: event.target.value
    })
  }

  const handleChangeBookSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setbookSearch(event.target.value)
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
        const { data } = await axios.post(`http://127.0.0.1:5000/books/search/${bookSearch}`)
        if (data.matching_books) {
          console.log(data.matching_books)
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
    <nav className='fixed top-0 left-0 w-full h-2/12 flex items-center justify-between p-10 bg-amber-500 z-10'>
        <h1>LibroScope</h1>
        <div className='flex items-center justify-around w-1/2'>
          <Link to={'/'}>Inicio</Link>
          <Link to={'/libros'}>Libros</Link>
          {!user ? ( 
            <button onClick={() => setLoginModal(true)}>Iniciar Sesión</button>
          ) : (
            <React.Fragment>
              <Link to={'/mis_libros'}>Mis Libros</Link>
              <Link to={'/publicar'}>Publicar libro</Link>
            </React.Fragment>
          )}
        </div>
        <div className='flex items-center gap-10'>
          <form onSubmit={handleBookSearch} className='flex'>
            <input className='border border-neutral-600 bg-neutral-700 rounded-md p-1 w-md' onChange={handleChangeBookSearch} type="text" placeholder='Título, género, autor...' />
            <button type='submit'>Buscar</button>
          </form>
          {user && (
            <button className='bg-neutral-800' onClick={() => setConfirmLogout(true)}><FiLogOut size={20} /></button>
          )}
        </div>

          {confirmLogout && (
            <div className='fixed m-auto inset-0 rounded-md w-2/5 h-2/5 flex flex-col items-center justify-center p-5 gap-10 z-10 text-xl bg-neutral-900'>
              <p>¿Quieres cerrar sesión?</p>
            <div className='flex justify-center items-center gap-8 w-full'>
             <button className='bg-red-500' onClick={handleLogout}>Sí</button>
             <button className='bg-neutral-800' onClick={() => setConfirmLogout(false)}>No</button>
            </div>
           </div>
          )}

        {/*//!Modal de login */}
          {loginModal && (
            <section className='fixed m-auto inset-0 w-1/5 h-3/5 p-10 rounded-md flex flex-col justify-around z-10 bg-neutral-900 text-amber-600' >
              <button className='absolute top-4 right-4' onClick={() => setLoginModal(false)}>X</button>

              <h2 className='font-bold text-2xl'>Inicio de Sesión</h2>

              <form onSubmit={handleLogin} className='flex flex-col items-center justify-between h-1/2'>

                <div className='text-left'>
                  <label htmlFor="email">Correo:</label> <br />
                  <input type="email" name='email' onChange={handleChangeLoginInfo} className='border border-neutral-800 w-3xs rounded-md p-0.5' />
                </div>

                <div className='text-left'>
                  <label htmlFor="password">Contraseña:</label> <br />
                  <input type="password" name='password' onChange={handleChangeLoginInfo} className='border border-neutral-800 w-3xs rounded-md p-0.5' />
                </div>

                <button className='w-fit' type='submit'>Iniciar Sesión</button>
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

              <span>¿No tienes una cuenta?, <Link to={'/registro'} onClick={() => setLoginModal(false)} >Regístrate.</Link></span>
            </section>
          )}

    </nav>
  )

}

export default NavBar