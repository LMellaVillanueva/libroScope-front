import gh from '../assets/imgs/gh.png'
import linkedIN from '../assets/imgs/linkedIN.png'

const Footer = () => {
  return (
    <footer className="bg-neutral-900 flex items-center justify-around p-16">

      <section className="flex items-start justify-evenly w-2/3">

         <div className="flex flex-col text-start">
          <h2>Géneros</h2>
          <a href="">Ciencia Ficción</a>
          <a href="">Acción</a>
          <a href="">Terror</a>
          <a href="">Dramático</a>
          <a href="">Aventura</a>
          <a href="">Comunidad</a>
         </div>

         <div className="flex flex-col text-start">
          <h2>Quiénes somos</h2> 
          <a href="">Nuestra Empresa</a>
          <a href="">Sobre Nosotros</a>
         </div>   

        <div className="flex flex-col text-start gap-3">
          <h2>Contacto</h2>
          <p>Correo electrónico: mellalucas.v@gmail.com</p>
          <article className='flex justify-evenly pt-2'>
            <img src={gh} alt="gh" width={50} />
            <img src={linkedIN} alt="lkdin" width={50} />
          </article>
        </div>

      </section>

      <section className="flex items-start justify-evenly w-1/3">
        <h1>Libroscope</h1>
      </section>

      <p className='absolute mt-52'>Todos los derechos reservados © 2025</p>

    </footer>
  )
}

export default Footer