import lb_logo from '../assets/imgs/lb_logo.png'
import { Link } from 'react-router-dom'

const Footer = () => {

  // const navToBooks = () => {
  //   const categorie = document.getElementById('science_books')
    
  // }

  return (
    <footer className="flex items-center justify-around p-16 text-white" style={{ backgroundColor: '#080e21' }}>

      <section className="flex items-start justify-evenly w-2/3">

         <div className="flex flex-col text-start">
          <h2>Géneros</h2>
          <Link className='text-blue-500' to="">Ciencia Ficción</Link>
          <Link className='text-blue-500' to="">Acción</Link>
          <Link className='text-blue-500' to="">Terror</Link>
          <Link className='text-blue-500' to="">Dramático</Link>
          <Link className='text-blue-500' to="">Aventura</Link>
          <Link className='text-blue-500' to="">Histórico</Link>
          <Link className='text-blue-500' to="">Desarrollo Personal</Link>
          <Link className='text-blue-500' to="">Fantasía</Link>
          <Link className='text-blue-500' to="">Misterio</Link>
          <Link className='text-blue-500' to="">Comunidad</Link>
         </div>

         <div className="flex flex-col text-start">
          <h2>Acerca de Mí</h2> 
          <Link className='text-blue-500' to={'/perfil'}>Perfil y Proyecto</Link>
         </div>   

        <div className="flex flex-col text-start">
          <h2>Contacto</h2>
          <p>Correo electrónico: mellalucas.v@gmail.com</p>
          {/* <article className='flex justify-evenly pt-2'> */}
            {/* <img src={gh} alt="gh" width={50} />
            <img src={linkedIN} alt="lkdin" width={50} /> */}
            <Link className='text-blue-500 w-fit' target='_blank' to="https://portafolio-lucas-mella.vercel.app/">Portafolio</Link>
            <Link className='text-blue-500 w-fit' target='_blank' to="https://www.linkedin.com/in/lucas-mella-947989231/">LinkedIn</Link>
            <Link className='text-blue-500 w-fit' target='_blank' to="https://github.com/LMellaVillanueva">GitHub</Link>
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