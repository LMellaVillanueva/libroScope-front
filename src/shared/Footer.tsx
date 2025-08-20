import lb_logo from '../assets/imgs/lb_logo.png'
import { Link } from 'react-router-dom'
import { Categorie } from '../types'

const Footer = () => {

  return (
    <footer className="flex lg:flex-row flex-col items-center gap-3 md:gap-0 md:justify-around p-16 text-white" style={{ backgroundColor: '#080e21' }}>

      <section className="flex md:flex-row flex-col items-start justify-between h-[550px] md:h-fit lg:justify-evenly lg:w-2/3 w-full">

         <div className="flex flex-col text-start">
          <h2 className='text-lg'>Géneros</h2>
          <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold' to="/libros" state={Categorie.SCIENCE_FICTION}>Ciencia Ficción</Link>
          <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold' to="/libros" state={Categorie.ACTION}>Acción</Link>
          <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold' to="/libros" state={Categorie.HORROR}>Terror</Link>
          <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold' to="/libros" state={Categorie.DRAMA}>Dramático</Link>
          <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold' to="/libros" state={Categorie.ADVENTURE}>Aventura</Link>
          <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold' to="/libros" state={Categorie.HISTORY}>Histórico</Link>
          <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold' to="/libros" state={Categorie.SELF_HELP}>Desarrollo Personal</Link>
          <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold' to="/libros" state={Categorie.FANTASY}>Fantasía</Link>
          <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold' to="/libros" state={Categorie.MYSTERY}>Misterio</Link>
          <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold' to="/libros" state={Categorie.COMMUNITY}>Comunidad</Link>
         </div>

         <div className="flex flex-col text-start">
          <h2 className='text-lg'>Acerca de Mí</h2> 
          <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold' to={'/perfil'}>Perfil y Proyecto</Link>
         </div>   

        <div className="flex flex-col text-start">
          <h2 className='text-lg'>Contacto</h2>
          <p>Correo electrónico: mellalucas.v@gmail.com</p>
          {/* <article className='flex justify-evenly pt-2'> */}
            {/* <img src={gh} alt="gh" width={50} />
            <img src={linkedIN} alt="lkdin" width={50} /> */}
            <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold w-fit' target='_blank' to="https://portafolio-lucas-mella.vercel.app/">Portafolio</Link>
            <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold w-fit' target='_blank' to="https://www.linkedin.com/in/lucas-mella-947989231/">LinkedIn</Link>
            <Link className='text-blue-500 transition-all hover:text-blue-300 min-w-[200px] hover:font-bold w-fit' target='_blank' to="https://github.com/LMellaVillanueva">GitHub</Link>
          {/* </article> */}
        </div>

      </section>

      <section className="flex items-start justify-evenly md:w-1/2 lg:w-1/3">
      <Link to={'/'}>
        <img src={lb_logo} alt="logo"/>
      </Link>
      </section>

      <p className='lg:absolute lg:mt-72'>Todos los derechos reservados © 2025</p>

    </footer>
  )
}

export default Footer