import img1 from '../assets/imgs/about_me.png'
import img2 from '../assets/imgs/nav_logo.png'

const AboutMe = () => {
  return (
    <main className='py-40 px-10 text-neutral-700 flex items-center justify-evenly w-full'>
        <section className='w-2/5 p-6 flex flex-col items-center gap-10'>
            <h2 className='font-bold text-3xl'>Sobre Mí</h2>
            <img src={img1} alt="img1" width={200} className='drop-shadow-2xl drop-shadow-neutral-500'/>
            <p style={{ fontFamily: '"Maven Pro", sans-serif' }}> Soy Lucas Mella, un apasionado del desarrollado web que busca transformar ideas en soluciones sencillas y productos visualmente atractivos. <br /><br />
                Me especializo en React, MySQL y Python, y siempre busco aprender nuevas tecnologías para mejorar la calidad de mis proyectos.
                He desarrollado aplicaciones One Page con login mediante Google, gestión y persistencia de datos para facilitar la experiencia de usuario. Esto me ha llevado día a día a profesionalizar mi trabajo, aprender mejores prácticas y explorar nuevas formas de resolver problemáticas. <br /><br />
                Si quieres conocer otro de mis trabajos, puedes visitar mi proyecto: <a className='text-blue-600 text-lg hover:text-blue-400' href="https://taskify-three-mu.vercel.app/" target='_blank'>Taskify</a>.
            </p>
        </section>

        <section className='w-2/5 p-6 flex flex-col items-center gap-10 '>
            <h2 className='font-bold text-3xl'>Sobre el Proyecto</h2>
            <img src={img2} alt="img2" width={300} className='drop-shadow-2xl drop-shadow-neutral-700'/>
            <p style={{ fontFamily: '"Maven Pro", sans-serif' }}> LibroScope es una plataforma que facilita descubrir y organizar libros de forma inteligente, similar a como Netflix recomienda películas. <br /><br />
              Este proyecto no solo integra un algoritmo de recomendaciones tipo Netflix, sino también tecnologías como ElasticSearch, gestión de datos en tiempo real, login con Google y para los futuros autores, publicar tus propios libros. <br /><br />
              Con base de datos MySQL se gestionan las relaciones de los modelos en el Back-End, utilizando Python como lenguaje. Dicha tecnología también gestiona el algoritmo de recomendaciones que se basa en la categoría de cada libro, la búsqueda de ElasticSearch por medio de una query, validaciones de usuario, entre otros.
            </p>
        </section>

    </main>
  )
}

export default AboutMe