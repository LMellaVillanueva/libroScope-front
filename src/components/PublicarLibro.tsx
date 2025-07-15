import React, { useEffect, useRef, useState } from 'react'
import { useUserStore } from '../store/user'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/book'

const PublicarLibro = () => {
    const user = useUserStore(state => state.user)
    const fetchMyBooks = useBookStore(state => state.getBooks)
    const navigate = useNavigate()
    //Subida de PDF e imagen
    const [pdf, setPdf] = useState<File | null>(null)
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    //Setear el pdf e image en null
    const pdfRef = useRef<HTMLInputElement | null>(null)
    const imageRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (!user) navigate('/')
    }, [user])

    useEffect(() => {
      return () => {
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview)
        }
      }
    }, [imagePreview])

    const [bookInfo, setBookinfo] = useState({
        title:'',
        author: '',
        genre: '',
        user_id: user?.id_user,
        description: ''
    })

    const handleChangeBookInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBookinfo({...bookInfo, 
          [event.target.name]: event.target.value
        })
    }

    const handlePublish = async (event: React.FormEvent) => {
        event.preventDefault()
        if (!pdf || !image) return alert('Debes subir la información de tu libro!')

        const formData = new FormData()
        formData.append('title', bookInfo.title)
        formData.append('author', bookInfo.author)
        formData.append('genre', bookInfo.genre)
        formData.append('user_id', String(bookInfo.user_id))
        formData.append('description', String(bookInfo.description))
        formData.append('pdf', pdf)
        formData.append('image', image)

        try {

            const res = await axios.post('http://127.0.0.1:5000/books/publish', formData)
            if (res.data) {
              fetchMyBooks()
              window.alert('Libro creado con éxito')
              setBookinfo({
                title:'',
                author: '',
                genre: '',
                description: '',
                user_id: user?.id_user,
              })
              setImagePreview('')
              if (pdfRef.current) pdfRef.current.value = ''
              if (imageRef.current) imageRef.current.value = ''
            }
        } catch (error: any) {
      if (error.response && error.response.data) {
        alert(error.response.data.errors)
        console.log('Error: ', error.response.data.errors)
      } else {
        return console.error(error.message)
      }
     }
    }

    // Previsualización de la portada
    const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null
      setImage(file)
      if (file) {
        const previewUrl = URL.createObjectURL(file)
        setImagePreview(previewUrl)
      } else {
        setImagePreview(null)
      }
    }

    
  return (
    <main>
        <h2 className='text-left mt-20 px-10'>{user?.name},</h2>
        <h1 className='text-left px-5 py-1'>Publica tu propio libro:</h1>

        <section className='flex justify-around pt-10'>
            <form onSubmit={handlePublish} className='flex flex-col justify-center items-center w-1/5 gap-8'>
                <div className='flex justify-between w-full text-xl'>
                    <label htmlFor="">Título:</label>
                    <input type="text" name='title' onChange={handleChangeBookInfo} value={bookInfo.title} />
                </div>
                <div className='flex justify-between w-full text-xl'>
                    <label htmlFor="">Autor:</label>
                    <input type="text" name='author' onChange={handleChangeBookInfo} value={bookInfo.author} />
                </div>
                <div className='flex justify-between w-full text-xl'>
                    <label htmlFor="">Género:</label>
                    <input type="text" name='genre' onChange={handleChangeBookInfo} value={bookInfo.genre} />
                </div>
                <div className='flex justify-between w-full text-xl'>
                    <label htmlFor="">Descripción:</label>
                    <input type="text" name='description' onChange={handleChangeBookInfo} value={bookInfo.description} />
                </div>
                <div>
                    <label htmlFor="">Sube aquí tu libro PDF:</label>
                    <input ref={pdfRef} type="file" accept='application/pdf' onChange={(event) => {setPdf(event.target.files?.[0] || null)}} required />
                </div>
                <div>
                    <label htmlFor="">Selecciona tu portada:</label>
                    <input ref={imageRef} type="file" accept='image/*' onChange={handleChangeImage} />
                </div>
                <button type='submit'>Publicar libro</button>
            </form>

            <article className='relative flex flex-col justify-around items-start w-sm h-[500px] p-8 border-2 rounded-md'>
                {!bookInfo.title ? (
                    <h1 className='self-center'>Título</h1>
                ) : (
                    <h1 className='max-w-xs max-h-64 overflow-hidden hover:overflow-y-auto break-words'>{bookInfo.title}</h1>
                )}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="portada"
                    className="w-full h-full object-cover absolute top-0 left-0 opacity-45"
                  />
                )}
              <div className='flex flex-col items-start gap-5 max-h-[500px]'>

                <div className='flex gap-2 text-lg max-h-20 overflow-auto'>
                  <p>Autor:</p>
                  <p className='max-w-3xs break-words'>{bookInfo.author}</p>
                </div>

                <div className='flex gap-2 text-lg max-h-20 overflow-auto'>
                  <p>Género:</p>
                  <p className='max-w-3xs break-words'>{bookInfo.genre}</p>
                </div>

                <div className='flex gap-2 text-lg max-h-20 overflow-auto'>
                  <p>Descripción:</p>
                  <p className='max-w-[200px] break-words'>{bookInfo.description}</p>
                </div>

              </div>
            </article>

        </section>
    </main>
  )
}

export default PublicarLibro