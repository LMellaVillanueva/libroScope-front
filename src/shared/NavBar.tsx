import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user";
import React, { useEffect, useState } from "react";
import {
  GoogleLogin,
  googleLogout,
  type CredentialResponse,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Categorie, type GoogleBook, type GoogleJwtPayload } from "../types";
import { FiLogOut, FiX, FiSearch, FiMenu } from "react-icons/fi";
import { useBookStore } from "../store/book";
import BookSearchedCard from "./BookSearchedCard";
import nav_logo from "../assets/imgs/nav_logo.png";
import api from "../axiosConfig";

type Props = {
  windowSize: number;
};

const NavBar = ({ windowSize }: Props) => {
  const [loginModal, setLoginModal] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [bookSearch, setBookSearch] = useState("");
  const [searchedBooks, setSearchedBooks] = useState<GoogleBook[]>([]);
  const [dbUser, setDbUser] = useState(false);

  const userLogin = useUserStore((state) => state.logIn);
  const userLogout = useUserStore((state) => state.logOut);

  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation()

  const googleBookCategorie = useBookStore(
    (state) => state.googleBookCategorie
  );

  //Modal para Borrar Filtro
  const [categorie, setCategorie] = useState(false)
  const categorieState = useBookStore(state => state.googleBookCategorie)

  useEffect(() => {
    if (categorieState !== Categorie.NONE) setCategorie(true)
  }, [categorieState])

  //View de celulares
  const [burguerMenu, setBurgerMenu] = useState(false);

  // Validar si el user existe en la base de datos
  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const { data } = await api(`/user/one_user/${user?.id_user}`);
        if (data.success) {
          setDbUser(true);
        }
      } catch (error: any) {
        userLogout();
        if (error.response && error.response.data) {
          setDbUser(false);
        } else {
          return console.error(error.message);
        }
      }
    };
    fetchUserById();
  }, [user]);

  useEffect(() => {
    if (!bookSearch.length) {
      setSearchedBooks([]);
    }
  }, [bookSearch]);

  const handleChangeLoginInfo = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginInfo({ ...loginInfo, [event.target.name]: event.target.value });
  };

  const handleChangeBookSearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBookSearch(event.target.value);
    try {
      if (bookSearch.length) {
        const { data } = await api.post(`/books/search/${googleBookCategorie}/${event.target.value}`);
        if (data.matching_books) {
          setSearchedBooks(data.matching_books);
        }
      }
    } catch (error: any) {
      if (error instanceof Error) return console.error(error.message);
    }
  };

  const handleLogin = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      const res = await api.post("/user/login",loginInfo);
      if (res.data) {
        userLogin(res.data.user);
        setLoginModal(false);
        setLoginInfo({ email: "", password: "" });
        return navigate("/");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        // return window.alert(error.response.data.errors);
      } else {
        return console.error(error.message);
      }
    }
  };

  const handleLogout = () => {
    try {
      useUserStore.persist.clearStorage();
      userLogout();
      setConfirmLogout(false);
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  const handleBookSearch = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      if (bookSearch.length) {
        const { data } = await api.post(`/books/search/${bookSearch}/${googleBookCategorie}`);
        if (data.matching_books) {
          setSearchedBooks(data.matching_books);
        }
      } else {
        // return window.alert("No puede estar vacío!");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        // return window.alert(error.response.data.errors);
      } else {
        return console.error(error.message);
      }
    }
  };

  return (
    <React.Fragment>
      <main
        className="flex flex-col w-full absolute top-0 left-0 items-center justify-center z-20"
        style={{ fontFamily: '"Space Grotesk", sans-serif' }}
      >
        {windowSize > 700 ? (
          <nav
            className="flex items-center justify-around p-3 w-full text-lg border-b border-b-black lg:justify-evenly md:justify-center" /*style={{ backgroundColor: '#080e21' }}*/
          >
            <Link to={"/"}>
              <img src={nav_logo} alt="nav_logo" width={250} />
            </Link>

            <div className="flex items-center gap-12 min-w-md text-neutral-500 lg:gap-12 md:justify-center md:gap-3">
              <Link
                className="transition-all hover:text-neutral-900 hover:font-bold min-w-[60px]"
                to={"/"}
              >
                Inicio
              </Link>
              <div className="border border-black h-5"></div>
              <Link
                className="transition-all hover:text-neutral-900 hover:font-bold min-w-[60px]"
                to={"/libros"}
              >
                Libros
              </Link>
              <div className="border border-black h-5"></div>

              {!dbUser && (
                <button
                  onClick={() => setLoginModal(true)}
                  className="transition-all hover:text-neutral-900 hover:font-bold min-w-[120px]"
                >
                  Iniciar Sesión
                </button>
              )}

              {dbUser && (
                <React.Fragment>
                  {user?.admin ? (
                    <React.Fragment>
                      <Link
                        className="transition-all hover:text-neutral-900 hover:font-bold  min-w-[60px]"
                        to={"/todos_los_libros"}
                      >
                        Libros Publicados
                      </Link>
                      <div className="border border-black h-5"></div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Link
                        className="transition-all hover:text-neutral-900 hover:font-bold  min-w-[88px]"
                        to={"/mis_libros"}
                      >
                        Mis Libros
                      </Link>
                      <div className="border border-black h-5"></div>
                      <Link
                        className="transition-all hover:text-neutral-900 hover:font-bold  min-w-[115px]"
                        to={"/publicar"}
                      >
                        Publicar libro
                      </Link>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </div>

            <form
              onSubmit={handleBookSearch}
              className="flex items-center gap-2 lg:w-md md:w-xs md:pr-3 lg:pr-0"
            >
              <div className="relative w-full max-w-xl md:max-w-md">
                <input
                  className="w-full h-10 pl-3 pr-10 text-gray-700 placeholder-gray-500 border border-black rounded-md focus:outline-none"
                  onChange={handleChangeBookSearch}
                  value={bookSearch}
                  type="text"
                  placeholder="Título, género, autor..."
                />
                {/* Contenedor absoluto para los botones */}
                <div className="absolute right-0 top-0 h-full flex items-center gap-1 pr-1">
                  {bookSearch.length !== 0 && (
                    <button
                      type="button"
                      onClick={() => setBookSearch("")}
                      className="flex items-center justify-center p-1"
                    >
                      <FiX className="text-black" size={20} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex items-center justify-center p-1"
                  >
                    <FiSearch className="text-black" size={20} />
                  </button>
                </div>
              </div>
            </form>

            {dbUser && (
              <button
                className="text-neutral-500 hover:font-bold transition-all hover:text-neutral-950"
                onClick={() => setConfirmLogout(true)}
              >
                <FiLogOut size={25} />
              </button>
            )}

            {/* Modal de cerrar sesión */}
            {confirmLogout && (
              <React.Fragment>
                <div className="fixed bg-black opacity-60 inset-0 z-10 w-[100vw] h-[100vh]"></div>
                <div className="fixed m-auto inset-0 rounded-md w-3/12 h-4/12 flex flex-col items-center justify-center p-5 gap-10 z-20 text-2xl bg-neutral-200">
                  <p className="font-bold text-neutral-600">
                    ¿Quieres cerrar sesión?
                  </p>
                  <div className="flex justify-evenly items-center gap-8 w-full text-3xl">
                    <button
                      className="text-neutral-500 hover:font-bold transition-all hover:text-neutral-900 border border-black p-2 rounded-md text-xl w-18"
                      onClick={handleLogout}
                    >
                      Sí
                    </button>
                    <button
                      className="text-neutral-500 hover:font-bold transition-all hover:text-neutral-900 border border-black p-2 rounded-md text-xl w-18"
                      onClick={() => setConfirmLogout(false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              </React.Fragment>
            )}
          </nav>
        ) : (
          // !View de celulares 
          <React.Fragment>
            <section className={`flex items-center justify-between ${dbUser ? 'w-5/6' : 'w-3/4'} mt-5`}>
              <FiMenu
                size={30}
                className="self-center hover:cursor-pointer text-black"
                onClick={() => setBurgerMenu(true)}
              />
              <form
                onSubmit={handleBookSearch}
                className="flex items-center gap-2 lg:w-md md:w-xs md:pr-3 lg:pr-0"
              >
                <div className="relative w-full max-w-xl md:max-w-md">
                  <input
                    className="w-full h-10 pl-3 pr-10 text-gray-700 placeholder-gray-500 border border-black rounded-md focus:outline-none"
                    onChange={handleChangeBookSearch}
                    value={bookSearch}
                    type="text"
                    placeholder="Título, género, autor..."
                  />
                  {/* Contenedor absoluto para los botones */}
                  <div className="absolute right-0 top-0 h-full flex items-center gap-1 pr-1">
                    {bookSearch.length !== 0 && (
                      <button
                        type="button"
                        onClick={() => setBookSearch("")}
                        className="flex items-center justify-center p-1"
                      >
                        <FiX className="text-black" size={20} />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex items-center justify-center p-1"
                    >
                      <FiSearch className="text-black" size={20} />
                    </button>
                  </div>
                </div>
              </form>
              {dbUser && (
                <button
                  className="text-neutral-500 hover:font-bold transition-all hover:text-neutral-950"
                  onClick={() => setConfirmLogout(true)}
                >
                  <FiLogOut size={25} />
                </button>
              )}
            </section>
              <div className="border-b border-b-black w-full py-2"></div>

            {/* //!Burguer activo */}
            {burguerMenu && (
              <React.Fragment>
                <nav
                  className="absolute w-full flex flex-col gap-3 left-0 top-22 z-20 text-3xl border-b-2 border-b-black rounded-3xl"
                  style={{ backgroundColor: "#eeeeee" }}
                >
                  <FiX
                    size={30}
                    className="hover:cursor-pointer ml-5 text-black"
                    onClick={() => setBurgerMenu(false)}
                  />
                  <div className="flex flex-col items-start gap-5 md:min-w-md text-neutral-800">
                    <div className="border border-black w-full"></div>
                    <Link
                      className="transition-all hover:text-neutral-900 hover:font-bold min-w-[60px] pl-5"
                      to={"/"}
                      onClick={() => setBurgerMenu(false)}
                    >
                      Inicio
                    </Link>
                    <div className="border border-black w-full"></div>
                    <Link
                      className="transition-all hover:text-neutral-900 hover:font-bold min-w-[60px] pl-5"
                      to={"/libros"}
                      onClick={() => setBurgerMenu(false)}
                    >
                      Libros
                    </Link>
                    <div className="border border-black w-full"></div>

                    {!dbUser && (
                      <React.Fragment>
                        <button
                        onClick={() => setLoginModal(true)}
                        className="transition-all hover:text-neutral-900 hover:font-bold min-w-[120px] pl-5"
                        >
                          Iniciar Sesión
                        </button>
                        <div className="border border-black w-full"></div>
                      </React.Fragment>
                    )}

                    {dbUser && (
                      <React.Fragment>
                        {user?.admin ? (
                          <React.Fragment>
                            <Link
                              className="transition-all hover:text-neutral-900 hover:font-bold  min-w-[60px] pl-5"
                              to={"/todos_los_libros"}
                            >
                              Libros Publicados
                            </Link>
                            <div className="border border-black w-full"></div>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <Link
                              className="transition-all hover:text-neutral-900 hover:font-bold  min-w-[88px] pl-5"
                              to={"/mis_libros"}
                              onClick={() => setBurgerMenu(false)}
                            >
                              Mis Libros
                            </Link>
                            <div className="border border-black w-full"></div>
                            <Link
                              className="transition-all hover:text-neutral-900 hover:font-bold  min-w-[115px] pl-5"
                              to={"/publicar"}
                              onClick={() => setBurgerMenu(false)}
                            >
                              Publicar libro
                            </Link>
                            <div className="border border-black w-full"></div>
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                    {location.pathname === '/libros' && (
                      <div className='flex flex-col items-start w-full gap-9 text-3xl pb-5'>
                        <h2 className="pl-5 font-bold ">Filtros</h2>
                        <Link 
                        className='transition-all hover:text-neutral-900 hover:font-bold pl-5' 
                        to="/libros" 
                        state={Categorie.SCIENCE_FICTION}
                        onClick={() => {setBurgerMenu(false); setCategorie(true)}}>Ciencia Ficción</Link>
                        <Link 
                        className='transition-all hover:text-neutral-900 hover:font-bold pl-5' 
                        to="/libros" 
                        state={Categorie.ACTION}
                        onClick={() => {setBurgerMenu(false); setCategorie(true)}}>Acción</Link>
                        <Link 
                        className='transition-all hover:text-neutral-900 hover:font-bold pl-5' 
                        to="/libros" 
                        state={Categorie.HORROR}
                        onClick={() => {setBurgerMenu(false); setCategorie(true)}}>Terror</Link>
                        <Link 
                        className='transition-all hover:text-neutral-900 hover:font-bold pl-5' 
                        to="/libros" 
                        state={Categorie.DRAMA}
                        onClick={() => {setBurgerMenu(false); setCategorie(true)}}>Dramático</Link>
                        <Link 
                        className='transition-all hover:text-neutral-900 hover:font-bold pl-5' 
                        to="/libros" 
                        state={Categorie.ADVENTURE}
                        onClick={() => {setBurgerMenu(false); setCategorie(true)}}>Aventura</Link>
                        <Link 
                        className='transition-all hover:text-neutral-900 hover:font-bold pl-5' 
                        to="/libros" 
                        state={Categorie.HISTORY}
                        onClick={() => {setBurgerMenu(false); setCategorie(true)}}>Histórico</Link>
                        <Link 
                        className='transition-all hover:text-neutral-900 hover:font-bold pl-5' 
                        to="/libros" 
                        state={Categorie.SELF_HELP}
                        onClick={() => {setBurgerMenu(false); setCategorie(true)}}>Desarrollo Personal</Link>
                        <Link 
                        className='transition-all hover:text-neutral-900 hover:font-bold pl-5' 
                        to="/libros" 
                        state={Categorie.FANTASY}
                        onClick={() => {setBurgerMenu(false); setCategorie(true)}}>Fantasía</Link>
                        <Link 
                        className='transition-all hover:text-neutral-900 hover:font-bold pl-5' 
                        to="/libros" 
                        state={Categorie.MYSTERY}
                        onClick={() => {setBurgerMenu(false); setCategorie(true)}}>Misterio</Link>
                        <Link 
                        className='transition-all hover:text-neutral-900 hover:font-bold pl-5' 
                        to="/libros" 
                        state={Categorie.COMMUNITY}
                        onClick={() => {setBurgerMenu(false); setCategorie(true)}}>Comunidad</Link>
                        {!categorie && (
                          <div className="border border-black w-full"></div>
                        )}
                      </div>
                    )}
                    {categorie && location.pathname === '/libros' && (
                      <React.Fragment>
                        <Link 
                        to={'/libros'}
                        className='text-red-600 hover:font-bold text-3xl pl-5' 
                        state={Categorie.NONE}
                        onClick={() => { setCategorie(false); setBurgerMenu(false); window.scrollTo({ top: 0, 'behavior': 'smooth' }); }}>Borrar Filtro</Link>
                        <div className="border border-black w-full"></div>
                      </React.Fragment>
                    )}
                  </div>

                  <Link to={"/"} className="m-auto" onClick={() => setBurgerMenu(false)}>
                    <img src={nav_logo} alt="nav_logo" width={330} />
                  </Link>
                </nav>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
        {/*//!Modal de cerrar sesión */}
        {confirmLogout && (
          <React.Fragment>
            <div className="fixed bg-black opacity-60 inset-0 z-20 w-[100vw] h-[100vh]"></div>
            <div className="fixed m-auto inset-0 rounded-md lg:w-3/12 w-2/3 lg:h-4/12 h-1/3 flex flex-col items-center justify-center p-5 gap-10 z-30 text-2xl bg-neutral-200">
              <p className="font-bold text-neutral-600">
                ¿Quieres cerrar sesión?
              </p>
              <div className="flex justify-evenly items-center gap-8 w-full text-3xl">
                <button
                  className="text-neutral-500 hover:font-bold transition-all hover:text-neutral-900 border border-black p-2 rounded-md text-xl w-18"
                  onClick={() => {handleLogout(); setBurgerMenu(false)}}
                >
                  Sí
                </button>
                <button
                  className="text-neutral-500 hover:font-bold transition-all hover:text-neutral-900 border border-black p-2 rounded-md text-xl w-18"
                  onClick={() => setConfirmLogout(false)}
                >
                  No
                </button>
              </div>
            </div>
          </React.Fragment>
        )}
        {/*//!Modal de login */}
        {loginModal && (
          <React.Fragment>
            <div className="fixed bg-black opacity-60 inset-0 z-20 w-[100vw] h-[100vh]"></div>
            <section className="fixed m-auto inset-0 top-10 lg:w-1/4 w-3/4 lg:h-4/6 h-2/3 p-8 rounded-md flex flex-col justify-around z-20 bg-neutral-200 text-neutral-200 text">
              <button
                className="absolute top-4 right-4 text-black"
                onClick={() => setLoginModal(false)}
              >
                <FiX size={25} />
              </button>

              <h2 className="font-bold text-2xl text-neutral-700">
                Inicio de Sesión
              </h2>

              <form
                onSubmit={handleLogin}
                className="flex flex-col items-center justify-between gap-5 text-neutral-600"
              >
                <div className="text-left">
                  <label htmlFor="email">Correo:</label> <br />
                  <input
                    type="email"
                    name="email"
                    onChange={handleChangeLoginInfo}
                    className="border border-black w-3xs rounded-md p-0.5"
                  />
                </div>

                <div className="text-left">
                  <label htmlFor="password">Contraseña:</label> <br />
                  <input
                    type="password"
                    name="password"
                    onChange={handleChangeLoginInfo}
                    className="border border-black w-3xs rounded-md p-0.5"
                  />
                </div>

                <button
                  className="transition-all hover:text-neutral-900 hover:font-bold"
                  type="submit"
                >
                  Iniciar Sesión
                </button>
                <GoogleLogin
                  onSuccess={async (credentials: CredentialResponse) => {
                    try {
                      if (credentials.credential) {
                        const google_user = jwtDecode<GoogleJwtPayload>(
                          credentials?.credential
                        );
                        const res = await api.post("/user/login",{ email: google_user.email });
                        if (res.data) {
                          userLogin(res.data.user);
                          setLoginModal(false);
                          setBurgerMenu(false)
                          return navigate("/");
                        }
                      } else {
                        return console.error(
                          "No se recibió el token de Google"
                        );
                      }
                    } catch (error: any) {
                      if (error.response && error.response.data) {
                        window.alert(error.response.data.errors);
                        return googleLogout();
                      } else {
                        return console.error(error.message);
                      }
                    }
                  }}
                  onError={() => {
                    console.error("Login fallido");
                  }}
                />
              </form>

              <span className="text-neutral-600 text-[1.25rem]">
                ¿No tienes una cuenta?, <b></b>
                <Link
                  className="transition-all font-medium text-neutral-700 hover:text-neutral-900 hover:font-bold"
                  to={"/registro"}
                  onClick={() => {setLoginModal(false); setBurgerMenu(false)}}
                >
                  Regístrate aquí.
                </Link>
              </span>
            </section>
          </React.Fragment>
        )}

        {/*//!Searched book's modal in real time */}
        {searchedBooks.length !== 0 && (
          <div className="flex flex-col items-center overflow-y-auto gap-5 p-10 w-1/2 h-[360px] bg-amber-100 text-black">
            {searchedBooks?.map((oneBook) => (
              <BookSearchedCard
                book={oneBook}
                setSearchedBooks={setSearchedBooks}
                setBookSearch={setBookSearch}
              />
            ))}
          </div>
        )}
      </main>
    </React.Fragment>
  );
};

export default NavBar;
