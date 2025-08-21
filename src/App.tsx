import React, { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Landing from './components/Landing'
import NavBar from './shared/NavBar'
import RegisterUser from './components/RegisterUser'
// import Footer from './shared/Footer'
import PublishBook from './components/PublishBook'
import Books from './components/Books'
import axios from 'axios'
import type { GoogleBook } from './types'
import CreatedBooks from './components/CreatedBooks'
import { useBookStore } from './store/book'
import OneBook from './components/OneBook'
import { useUserStore } from './store/user'
import AllCreatedBooks from './admin/AllCreatedBooks'
import Footer from './shared/Footer'
import AboutMe from './components/AboutMe'

function App() {
  //? User para actualizar el estado de allCretedBooks
  const user = useUserStore(store => store.user)
  const [books, setBooks] = useState<GoogleBook[]>([])
  const [allBooks, setAllBooks] = useState<GoogleBook[]>([])
  const [allBooksForCellphone, setAllBooksForCellphone] = useState<GoogleBook[]>([])
  const fetchMyBooks = useBookStore(state => state.getBooks)
  const myBooks = useBookStore(state => state.myBooks)
  const getCommunityBooks = useBookStore(state => state.getCommunityBooks)

  // Usar el pathname para scrollear cuando navegue
  const { pathname } = useLocation()
  const navigate = useNavigate()
  
  //?Paginación
  const [actualPage, setActualPage] = useState<number>(1)
  const totalBooks = 40
  const booksPerPage = 10
  //?Total de páginas según el total de libros
  const totalPages = Math.ceil( totalBooks / booksPerPage )

  const [windowSize, setWindowSize] = useState<number>(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth)
    //Reajustar el tamaño de la vista al actualizarla
    window.addEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (location.pathname === '/libro/') navigate('/')
  }, [])

  //?Scroll
  useEffect(() => {
    window.scrollTo({ top: 0, 'behavior': 'smooth' })
  }, [pathname])

  //? Books paginados
  useEffect(() => {
    const start = (actualPage - 1) * booksPerPage
    const fetchBooks = async () => {
      try {
        const { data } = await axios(`https://www.googleapis.com/books/v1/volumes?q=fiction&startIndex=${start}&maxResults=${booksPerPage}&key=AIzaSyDNQ631Qv6pa6tyXCeU1xds2mnYL1KYNg8`)
        if (data) {
          setBooks(data.items)
        }
      } catch (error: any) {
        if (error.response) {
          window.alert(error.repsonse.data.errors)
        } else {
          console.error(error.message)
        }
      }
    }
    fetchBooks()
    }, [actualPage])

    //? AllBooks y Banner Books
    useEffect(() => {
      const fetchNoPaginationBooks = async () => {
        try {
          //?Fetch de todos los libros
          const { data } = await axios('https://www.googleapis.com/books/v1/volumes?q=fiction&maxResults=40&key=AIzaSyDNQ631Qv6pa6tyXCeU1xds2mnYL1KYNg8')
          //?Fetch de todos los libros dependiendo del width
          let res = undefined
          if (windowSize < 768) {
            res = await axios('https://www.googleapis.com/books/v1/volumes?q=fiction&maxResults=10&key=AIzaSyDNQ631Qv6pa6tyXCeU1xds2mnYL1KYNg8')
          } else if (windowSize > 768 || windowSize < 800) {
            res = await axios('https://www.googleapis.com/books/v1/volumes?q=fiction&maxResults=9&key=AIzaSyDNQ631Qv6pa6tyXCeU1xds2mnYL1KYNg8')
          } else if (windowSize > 800) {
            res = await axios('https://www.googleapis.com/books/v1/volumes?q=fiction&maxResults=40&key=AIzaSyDNQ631Qv6pa6tyXCeU1xds2mnYL1KYNg8')
          }
          if (res?.data) {
            //?Setear todos los libros para la ruta /libros
            setAllBooks(res?.data.items)
          }
          if (data) {
            setAllBooksForCellphone(data.items)
          }
        } catch (error: any) {
        if (error.response) {
          window.alert(error.repsonse.data.errors)
        } else {
          console.error(error.message)
        }
       }
      }
      fetchNoPaginationBooks()
    }, [])

    //? Fetch libros creados por la comunidad
    useEffect(() => {
      getCommunityBooks()
    }, [user])

    useEffect(() => {
      fetchMyBooks()
    }, [user])
      
  return (
    <React.Fragment>
      <NavBar windowSize={ windowSize }/>
        <Routes>
          {windowSize > 768 ? (
            <Route path='/' element={<Landing books={ books } actualPage={ actualPage } setActualPage={ setActualPage } totalPages={ totalPages }/>}/>  
          ) : (
            <Route path='/' element={<Landing books={ allBooks } actualPage={ actualPage } setActualPage={ setActualPage } totalPages={ totalPages }/>}/>  
          )}
          <Route path='/registro' element={<RegisterUser/>}/>  
          <Route path='/publicar' element={<PublishBook/>}/>  
          <Route path='/libros' element={<Books allBooks={ allBooks } allBooksCellphone={ allBooksForCellphone } windowSize={ windowSize }/>}/>  
          <Route path='/mis_libros' element={<CreatedBooks myBooks={ myBooks }/>}/>
          <Route path='/libro/:id' element={<OneBook/>}/>
          <Route path='/todos_los_libros' element={<AllCreatedBooks/>}/>
          <Route path='/perfil' element={<AboutMe/>}/>
        </Routes>
      <Footer/>
    </React.Fragment>
  )
}

export default App
