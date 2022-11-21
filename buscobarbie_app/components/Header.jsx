import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import AnimateHeight from 'react-animate-height'
import FiltersMenu from './FiltersMenu'
import { useRouter } from 'next/router'
import styles from './Header.module.css'
import withContext from '../utils/withContext'
const URL = process.env.NEXT_PUBLIC_APP_URL

export default withContext(function Header({ context: { setSearchHeight, searchHeight }, country_code }) {
  const { data: session, status } = useSession() // el token lo usare para las siguientes llamadas a api
  const router = useRouter()
  const { query: { province = null, search = null, categories = null, year = null, tags = null, sort = null } } = router
  const tags2 = []
  if (tags) {
    const arr = tags.split(',')
    for (const tag of arr) tags2.push({ label: tag, value: tag })
  }

  const handleFiltersMenuClick = () => {
    searchHeight === 0 ? setSearchHeight('auto') : setSearchHeight(0)
  }

  return <div className={styles.container}>
    <div className={styles.headerFilters}>
      <header className={styles.header}>
          <Link href={`${URL}/${country_code}`}><a className={styles.logo}><Image alt='logo de busco barbie' src='/logo4.png' layout='fill' priority></Image></a></Link>
        <div className={styles.sessionButtons}>
          <div className={styles.noSession}>
            <Link href={`${URL}/barbiestories`}><a className={styles.loginLink}>Barbiestories</a></Link>
            {!session ? <Link href={`${URL}/login`}><a className={styles.loginLink}>Iniciar sesión</a></Link> : <button className={styles.loginLink} onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}>Desconexión</button>}
          </div>
          <div className={styles.buttons}>
            <button
              type='button'
              className={styles.buscarButton}
              onClick={handleFiltersMenuClick}
              aria-expanded={searchHeight !== 0}
              aria-controls='filters-panel'
            >
              {searchHeight !== 0 ? 'Cerrar buscador' : 'Buscador'}
            </button>
            {!session ? <Link href={`${URL}/${country_code}/publicar`}><a className={styles.publicarLink}>Publicar</a></Link> : <Link href={`${URL}/mipanel`}><a className={styles.mipanelLink}>Mi panel</a></Link>}
          </div>
        </div>

      </header>

      <AnimateHeight id='filters-panel' duration={500} height={searchHeight}>
        <FiltersMenu province={province} search={search} categories={categories} country={country_code} year={year} tags={tags2} sort={sort} />
      </AnimateHeight>


    </div>

  </div>
})

