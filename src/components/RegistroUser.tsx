import React, { useState } from 'react'
import coment from '../assets/imgs/coment.png'
import libro from '../assets/imgs/libro.png'
import pers from '../assets/imgs/pers.png'
import axios from 'axios'
import { useUserStore } from '../store/user'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin, googleLogout, type CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import type { GoogleJwtPayload } from '../types'

const RegistroUser = () => {

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
      return console.error('Las contraseñas no coinciden')
    }

    const { confirm_password, ...dataRegister } = registerInfo

    try {
      const res = await axios.post('http://127.0.0.1:5000/user/register', dataRegister)
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
        return console.log('Error: ', error.response.data.errors)
      } else {
        return console.error(error.message)
      }
    }
  }

  return (
    <main>
        <h1 className='text-left mb-20 lg:mt-24 px-5'>Crea una cuenta en LibroScope</h1>
        <section className='flex justify-evenly h-96'>

          <form onSubmit={handleRegister} className='flex flex-col justify-evenly' >
            <input type="text" name='name' onChange={handleChangeRegisterInfo} placeholder='Nombre' />
            <input type="email" name='email' onChange={handleChangeRegisterInfo} placeholder='Correo electrónico' />
            <input type="password" name='password' onChange={handleChangeRegisterInfo} placeholder='Contraseña' />
            <input type="password" name='confirm_password' onChange={handleChangeRegisterInfo} placeholder='Confirmar contraseña' />
            <div className='flex justify-center gap-16'>
              <button type='submit'>Crear cuenta</button>
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
                      const res = await axios.post('http://127.0.0.1:5000/user/register', google_register)
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
                        console.log('Sesión de Google cerrada')
                        console.log('Error: ', error.response.data.errors)
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

          <article className='flex flex-col justify-evenly self-baseline w-3/6'>
            <div className='flex items-center justify-between gap-10 border p-5 rounded-lg'>
              <div className='flex flex-col items-center justify-center'>
                <p className='w-2/5'>
                  Publica tus 
                  propios libros en
                  nuestra 
                  plataforma</p>
                <img src={coment} width={150} alt="img1" />
              </div>
              <div className='flex flex-col items-center justify-center'>
                <p className='w-2/5'>
                  Comenta y
                  valora tus
                  libros favoritos</p>
                <img src={libro} width={150} alt="img2" />
              </div>
              <div className='flex flex-col items-center justify-center gap-1'>
                <p className='w-2/5'>
                  Personalización
                  exculsiva en 
                  nuestra página </p>
                <img src={pers} width={140} alt="img3" />
              </div>
            </div>
          </article>

        </section>
    </main>
  )
}

export default RegistroUser