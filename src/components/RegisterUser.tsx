import React, { useState } from 'react'
import coment from '../assets/imgs/coment.png'
import libro from '../assets/imgs/libro.png'
import pers from '../assets/imgs/pers.png'
import { useUserStore } from '../store/user'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin, googleLogout, type CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import type { GoogleJwtPayload } from '../types'
import api from '../axiosConfig'

const RegisterUser = () => {

  const [registerInfo, setRegisterInfo] = useState({ 
    name: '',
    email: '',
    password: '',
    confirm_password: ''
   })

   const userLogin = useUserStore(state => state.logIn)
   const navigate = useNavigate()

  const handleChangeRegisterInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterInfo({...registerInfo, 
      [event.target.name]: event.target.value
    })
  }

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault()
    if (registerInfo.password !== registerInfo.confirm_password) {
      return window.alert('Las contraseñas no coinciden')
    }

    const { confirm_password, ...dataRegister } = registerInfo

    try {
      const res = await api.post('/user/register', dataRegister)
      if (res.data) {
        const user = {
          id_user: res.data.user_id,
          name: registerInfo.name,
          email: registerInfo.email,
        }
        userLogin(user)
        setRegisterInfo({
          name: '',
          email: '',
          password: '',
          confirm_password: ''
        })
        return navigate('/')
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        return window.alert(error.response.data.errors)
      } else {
        return console.error(error.message)
      }
    }
  }

  return (
    <main className='py-36 px-5 text-neutral-600'>
        <h1 className='text-left px-10 pt-5'
        style={{ fontFamily: '"Libre Franklin", sans-serif' }}>Crea una cuenta en LibroScope:</h1>
        <section className='flex justify-evenly h-96 mt-16'>

          <form onSubmit={handleRegister} className='flex flex-col justify-evenly text-neutral-600 text-xl'>
            <input className='p-0.5 placeholder-neutral-500 border border-black rounded-md w-4/5' type="text" name='name' onChange={handleChangeRegisterInfo} placeholder='Nombre' />
            <input className='p-0.5 placeholder-neutral-500 border border-black rounded-md w-4/5' type="email" name='email' onChange={handleChangeRegisterInfo} placeholder='Correo electrónico' />
            <input className='p-0.5 placeholder-neutral-500 border border-black rounded-md w-4/5' type="password" name='password' onChange={handleChangeRegisterInfo} placeholder='Contraseña' />
            <input className='p-0.5 placeholder-neutral-500 border border-black rounded-md w-4/5' type="password" name='confirm_password' onChange={handleChangeRegisterInfo} placeholder='Confirmar contraseña' />
            <div className='flex justify-center gap-16'>
              <button className='text-neutral-500 hover:font-bold transition-all hover:text-neutral-900 border border-black p-2 rounded-md text-xl min-w-[140px]' type='submit'>Crear cuenta</button>
              <GoogleLogin 
                onSuccess={ async (credentials: CredentialResponse) => {
                  try {
                    if (credentials.credential) {
                      const google_user = jwtDecode<GoogleJwtPayload>(credentials?.credential)
                      const google_register = {
                        name: google_user.name,
                        email: google_user.email,
                        google_id: google_user.sub
                      }
                      const res = await api.post('/user/register', google_register)
                      if (res.data) {
                          const id_user = res.data.user_id
                          const { google_id, ...data_user } = google_register
                          const user = { ...data_user, id_user }
                          userLogin(user)
                          return navigate('/')
                        }
                      } else {
                        return console.error('No se recibió el token de Google')
                      }
                    
                  } catch (error: any) {
                      if (error.response && error.response.data) {
                        window.alert(error.response.data.errors)
                        return googleLogout()
                      } else {
                        return console.error(error.message)
                      }
                    }
                }}
                onError={() => {console.error('Registro fallido')}}
              />
            </div>
          </form>

          <article className='flex flex-col justify-evenly self-baseline border-2 border-black rounded-md w-3/6 h-[50vh]'>
            <div className='flex items-center justify-between gap-10 p-5 text-lg'
            style={{ fontFamily:'"Asap", sans-serif' }}>
              <div className='flex flex-col items-center justify-center drop-shadow-xl drop-shadow-neutral-500'>
                <p className='w-3/5 py-3'>
                  Publica tus 
                  propios libros en
                  nuestra 
                  plataforma!</p>
                <img src={coment} width={150} alt="img1"/>
              </div>
              <div className='flex flex-col items-center justify-center drop-shadow-xl drop-shadow-neutral-600'>
                <p className='w-3/5 py-3'>
                  Lee y/o 
                  compra tus 
                  libros 
                  favoritos.</p>
                <img src={libro} width={150} alt="img2"/>
              </div>
              <div className='flex flex-col items-center drop-shadow-xl drop-shadow-neutral-600 justify-center gap-1'>
                <p className='w-3/5 py-3'>
                  Personalización
                  exculsiva en 
                  nuestra página.</p>
                <img src={pers} width={140} alt="img3"/>
              </div>
            </div>
          </article>

        </section>
    </main>
  )
}

export default RegisterUser