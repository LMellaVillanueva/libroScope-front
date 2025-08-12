import img1 from '../assets/imgs/about_me.png'
import img2 from '../assets/imgs/nav_logo.png'

const Profile = () => {
  return (
    <main className='py-40 px-10 text-neutral-700 flex items-center w-full'>
        <section className='w-1/2 p-6 flex flex-col items-center gap-10'>
            <h2>Sobre Mí</h2>
            <img src={img1} alt="img1" width={200} className='drop-shadow-md drop-shadow-neutral-800'/>
            <p> Mi nombre es Lucas Mella y soy un desarrollador FullStack especializado en React, MySQL y Python.
                Tengo experiencia desarrollando proyectos One Page, con login de Google, permanencia de datos, entre otros. Día a día me formo para profesionalizar mi trabajo y aprender buenas y mejores prácticas. <br />
                Si necesitas ordenar y recordar tus ideas visita mi proyecto: <a href="https://taskify-three-mu.vercel.app/">Taskify</a>.
            </p>
        </section>

        <section className='w-1/2 p-6 flex flex-col items-center gap-10 '>
            <h2>Sobre el Proyecto</h2>
            <img src={img2} alt="img2" width={300} className=''/>
            <p> Este proyecto es un CRUD completo que integra búsqueda con ElasticSearch, recomendaciones de libros tipo Netflix, login con Google y gestión de datos en tiempo real. Publica tus propios libros una vez inicies sesión</p>
        </section>

    </main>
  )
}

export default Profile