import lb_logo from '../assets/imgs/lb_logo.png'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="flex items-center justify-around p-16 text-white" style={{ backgroundColor: '#080e21' }}>

      <section className="flex items-start justify-evenly w-2/3">

         <div className="flex flex-col text-start">
          <h2>Géneros</h2>
          <a className='text-blue-500' href="">Ciencia Ficción</a>
          <a className='text-blue-500' href="">Acción</a>
          <a className='text-blue-500' href="">Terror</a>
          <a className='text-blue-500' href="">Dramático</a>
          <a className='text-blue-500' href="">Aventura</a>
          <a className='text-blue-500' href="">Comunidad</a>
         </div>

         <div className="flex flex-col text-start">
          <h2>Quiénes somos</h2> 
          <a className='text-blue-500' href="">Nuestra Empresa</a>
          <a className='text-blue-500' href="">Sobre Nosotros</a>
         </div>   

        <div className="flex flex-col text-start">
          <h2>Contacto</h2>
          <p>Correo electrónico: mellalucas.v@gmail.com</p>
          {/* <article className='flex justify-evenly pt-2'> */}
            {/* <img src={gh} alt="gh" width={50} />
            <img src={linkedIN} alt="lkdin" width={50} /> */}
            <a className='text-blue-500 w-fit' target='_blank' href="https://portafolio-lucas-mella.vercel.app/">Portafolio</a>
            <a className='text-blue-500 w-fit' target='_blank' href="https://www.linkedin.com/in/lucas-mella-947989231/">LinkedIn</a>
            <a className='text-blue-500 w-fit' target='_blank' href="https://github.com/LMellaVillanueva">GitHub</a>
          {/* </article> */}
        </div>

      </section>

      <section className="flex items-start justify-evenly w-1/3">
      <Link to={'/'}>
        <img src={lb_logo} alt="logo"/>
      </Link>
      </section>

      <p className='absolute mt-72'>Todos los derechos reservados © 2025</p>

    </footer>
  )
}

export default Footer