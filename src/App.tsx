import React, { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import NavBar from './shared/NavBar'
import RegistroUser from './components/RegistroUser'
// import Footer from './shared/Footer'
import PublicarLibro from './components/PublicarLibro'
import Books from './components/Books'
import axios from 'axios'
import type { GoogleBook } from './types'
import CreatedBooks from './components/CreatedBooks'
import { useBookStore } from './store/book'
import OneBook from './components/OneBook'

function App() {
  const [books, setBooks] = useState<GoogleBook[]>([])
  const [allBooks, setAllBooks] = useState<GoogleBook[]>([])
  const [bannerBooks, setBannerBooks] = useState<GoogleBook[]>([])
  const fetchMyBooks = useBookStore(state => state.getBooks)
  const myBooks = useBookStore(state => state.myBooks)
  
  //?Paginación
  const [actualPage, setActualPage] = useState<number>(1)
  const totalBooks = 40
  const booksPerPage = 10
  //?Total de páginas según el total de libros
  const totalPages = Math.ceil( totalBooks / booksPerPage )
  
  useEffect(() => {
    const start = (actualPage - 1) * booksPerPage
    const fetchBooks = async () => {
      try {
        const { data } = await axios(`https://www.googleapis.com/books/v1/volumes?q=fiction&startIndex=${start}&maxResults=${booksPerPage}&key=AIzaSyDNQ631Qv6pa6tyXCeU1xds2mnYL1KYNg8`)
        if (data) {
          setBooks(data.items)
        }
      } catch (error) {
        if (error instanceof Error) console.log(error.message)
      }
    }
    fetchBooks()
    }, [actualPage])

    useEffect(() => {
      const fetchNoPaginationBooks = async () => {
        try {
          //?Fetch de todos los libros
          const res = await axios('https://www.googleapis.com/books/v1/volumes?q=fiction&maxResults=40&key=AIzaSyDNQ631Qv6pa6tyXCeU1xds2mnYL1KYNg8')

          //?Fetch de 5 libros para el banner
          const res5 = await axios('https://www.googleapis.com/books/v1/volumes?q=romantic&maxResults=5&key=AIzaSyDNQ631Qv6pa6tyXCeU1xds2mnYL1KYNg8')
           if (res.data) {
            //?Setear todos los libros para la ruta /libros
            setAllBooks(res.data.items)
          }
          if (res5.data) {
            setBannerBooks(res5.data.items)
          }
        } catch (error) {
          if (error instanceof Error) console.log(error.message)
        }
      }
      fetchNoPaginationBooks()
    }, [])

    useEffect(() => {
      fetchMyBooks()
    }, [])
    console.log(allBooks)
      
  return (
    <React.Fragment>
      <NavBar/>
        <Routes>
          <Route path='/' element={<Landing books={ books } actualPage={ actualPage } setActualPage={ setActualPage } totalPages={ totalPages } bannerBooks={ bannerBooks }/>}/>  
          <Route path='/registro' element={<RegistroUser/>}/>  
          <Route path='/publicar' element={<PublicarLibro/>}/>  
          <Route path='/libros' element={<Books allBooks={ allBooks }/>}/>  
          <Route path='/mis_libros' element={<CreatedBooks myBooks={ myBooks }/>}/>
          <Route path='/libro/:id' element={<OneBook/>}/>
        </Routes>
        {/* <Footer/> */}
    </React.Fragment>
  )
}

export default App
