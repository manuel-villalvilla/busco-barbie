import Image from "next/image";
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import FiltersMenu from './FiltersMenu'
import { useRouter } from 'next/router'
import styles from './Header.module.css'
import { useState, useEffect } from "react";
const URL = process.env.NEXT_PUBLIC_APP_URL

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [])
  return windowSize;
}

export default function Header({ country_code }) {
  const { data: session, status } = useSession()

  const router = useRouter()
  const {
    query: {
      province = null,
      search = null,
      categories = null,
      year = null,
      tags = null,
      sort = null
    }
  } = router

  const tags2 = []
  if (tags) {
    const arr = tags.split(',')
    for (const tag of arr) tags2.push({ label: tag, value: tag })
  }

  const size = useWindowSize()

  const [showFilters, setShowFilters] = useState(true)
  const [showMenu, setShowMenu] = useState(true)
  const [showNews, setShowNews] = useState(true)
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    if (size.width < 900) {
      setShowFilters(false)
      setShowMenu(false)
      setShowButtons(true)
    } else {
      setShowFilters(true)
      setShowMenu(true)
      setShowButtons(false)
    }
  }, [size.width])

  const handleFiltersMenuClick = () => {
    showFilters ? setShowFilters(false) : setShowFilters(true)
  }

  const handleShowMenuClick = () => {
    showMenu ? setShowMenu(false) : setShowMenu(true)
  }

  const handleShowNews = () => {
    showNews ? setShowNews(false) : setShowNews(true)
  }

  return (
    <header className={styles.header}>
      <div className={styles.topHeader}>
        <Link
          href={`${URL}/${country_code}`}
          className={styles.logo}>
          <Image alt='logo de busco barbie'
            src='/logo4.png'
            priority
            fill
            sizes="33vw"
          >
          </Image>
        </Link>

        {showFilters
          ? <div className={styles.filtersDiv}>
            <FiltersMenu
              province={province}
              search={search}
              categories={categories}
              country={country_code}
              year={year}
              tags={tags2}
              sort={sort}
            />
          </div>
          : null}
      </div>

      <div className={styles.middleHeader}>
        {showButtons &&
          <><button
            type='button'
            className={showFilters ? styles.redLink : styles.loginLink}
            onClick={handleFiltersMenuClick}
            aria-expanded={showFilters !== 0}
          >
            {showFilters === true
              ? 'Cerrar buscador'
              : 'Abrir buscador'}
          </button>

            <button
              type='button'
              className={showMenu
                ? styles.redLink
                : styles.loginLink}
              onClick={handleShowMenuClick}
              aria-expanded={showMenu}
            >
              {showMenu
                ? 'Cerrar menú'
                : 'Abrir menú'}
            </button></>}

        {showMenu && <>
          {!session
            ? <Link
              href={`${URL}/login`}
              className={router.asPath === '/login'
                ? styles.pinkLink
                : styles.loginLink}
            >Iniciar sesión
            </Link>
            : <button
              className={styles.loginLink}
              onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}
            >Cerrar sesión
            </button>}

          {!session
            ? <Link
              href={`${URL}/${country_code}/publicar`}
              className={router.asPath === `/${country_code}/publicar`
                ? styles.pinkLink
                : styles.loginLink}
            >Publicar un anuncio
            </Link>
            : <Link
              href={`${URL}/mipanel`}
              className={router.asPath === '/mipanel'
                ? styles.pinkLink
                : styles.loginLink}
            >Mi panel
            </Link>}

          <Link
            href='https://barbiestories.es'
            className={styles.loginLink}
          >Barbiestories
          </Link>

          <Link
            href={`${URL}/favorites`}
            className={router.asPath === '/favorites'
              ? styles.pinkLink
              : styles.loginLink}
          >Mis favoritos
          </Link>
        </>}
      </div>

      {showNews && <div className={styles.bottomHeader}>
        <button
          type='button'
          className={styles.closeScrollBtn}
          onClick={handleShowNews}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
          >
            <path
              d="m8.4 17 3.6-3.6 3.6 3.6 1.4-1.4-3.6-3.6L17 8.4 15.6 7 12 10.6 
              8.4 7 7 8.4l3.6 3.6L7 15.6Zm3.6 5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 
              14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 
              2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 
              22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 
              22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 
              4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"
            />
          </svg>
        </button>

        <div className={styles.scrollContainer}>
          <p className={styles.scrollingText}
          >¡Nueva categoría para artistas!<span>Muy pronto.</span>Pulsa el botón
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
            >
              <path
                fill='rgb(114, 191, 128)'
                d="m8.4 17 3.6-3.6 3.6 3.6 1.4-1.4-3.6-3.6L17 8.4 15.6 7 12 10.6 
                8.4 7 7 8.4l3.6 3.6L7 15.6Zm3.6 5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 
                14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 
                2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 
                22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 
                22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 
                4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"
              />
            </svg>
            para cerrar este mensaje.
          </p>
        </div>

        <button
          type='button'
          className={styles.closeScrollBtn}
          onClick={handleShowNews}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
          >
            <path
              d="m8.4 17 3.6-3.6 3.6 3.6 1.4-1.4-3.6-3.6L17 8.4 15.6 7 12 10.6 
              8.4 7 7 8.4l3.6 3.6L7 15.6Zm3.6 5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 
              14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 
              2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 
              22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 
              22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 
              4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"
            />
          </svg>
        </button>
      </div>}
    </header>
  )
}

