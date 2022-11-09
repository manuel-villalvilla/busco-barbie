import Image from 'next/image'
import Link from 'next/link'
import styles from './ResultsAds.module.css'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withContext from '../utils/withContext'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export default withContext(function ResultsAds({ search, currentItems, count, context: { favorites } }) {
  const [copied, setCopied] = useState(null)
  const [stateFavorites, setStateFavorites] = useState(favorites)
  const router = useRouter()

  useEffect(() => {
    if (copied) setTimeout(() => setCopied(null), 5000)
  }, [copied])

  const countryCurrency = (country, price) => {
    if (country === 'MX' || country === 'AR') return `${price}$`
    if (country === 'ES') return `${price}€`
  }

  const textHighlight = (body) => {
    if (!search)
      return <article className={styles.resultsAdBodyArticle}>{body}</article>

    const parts = body.split(new RegExp(`(${search})`, 'i')) // If separator is a regular expression that contains capturing parentheses ( ), matched results are included in the array.

    return <article className={styles.resultsAdBodyArticle}>{parts.map((part, i) =>
      <span key={i} style={part.toLowerCase() === search.toLowerCase() ? { backgroundColor: 'rgb(233, 96, 155)', color: 'white' } : {}}>{part}</span>)}
    </article>
  }

  const handleFavorite = (id) => {
    if (!stateFavorites.includes(id)) {
      setCookie('favorites', [...stateFavorites, id].toString(), { maxAge: 30 * 24 * 60 * 60 })
      setStateFavorites([...stateFavorites, id])
    } else {
      const arr = stateFavorites.filter(value => {
        return value !== id
      })
      setCookie('favorites', arr.toString(), { maxAge: 30 * 24 * 60 * 60 })
      setStateFavorites(arr)
    }
  }

  return <div className={styles.resultsContainer}>
    <p>Encontrado{count === 1 ? '' : 's'} {count} resultado{count === 1 ? '' : 's'}</p>
    <button
      type='button'
      className={styles.shareButton}
      onClick={() => {
        navigator.clipboard.writeText(`${APP_URL}${router.asPath}`)
        setCopied(true)
      }}
    >Compartir enlace de resultados
    </button>
    {copied && <span className={styles.copiedMessage}>¡Enlace copiado en el portapapeles!</span>}
    <ul className={styles.resultsList}>
      {currentItems.map(ad => {
        return <li className={styles.resultsListItem} key={ad._id}>
          <div className={styles.favorite}>
            {stateFavorites.includes(ad._id) ?
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" onClick={() => handleFavorite(ad._id)} style={{ cursor: 'pointer' }}><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill='red' /></svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" onClick={() => handleFavorite(ad._id)} style={{ cursor: 'pointer' }}><path d="M0 0h24v24H0V0z" fill="none" /><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" fill='red' /></svg>
            }
          </div>
          <Link href={`${ad.location.country}/ads/${ad._id.toString()}`}>
            <div className={styles.linkDiv}>
              <div className={styles.resultsAdTitle}>
                <h2>{textHighlight(ad.title)}</h2>
              </div>
              {ad.image.length > 0 && <div className={styles.adImageContainer}><Image src={ad.image[0]} alt='Primera imágen' priority={true} sizes='100vw' layout='responsive' width='100%' height='100%' objectFit='cover' /></div>}
              {ad.image.length === 0 && <div className={styles.resultsAdNoImage}><span className="material-icons-outlined" style={{ fontSize: '48px' }}>no_photography</span></div>}
              {ad.image.length > 0 && <span className={styles.imageCount}>{ad.image.length > 1 ? ad.image.length + ' imágenes' : '1 imagen'}</span>}

              <div className={styles.resultsAdBody}>{textHighlight(ad.body)}</div>
              <div className={styles.resultsAdFooter}>
                <p className={styles.footerProvince}>{ad.location.province}</p>
                <div className={styles.footerPriceDate}>
                  <p className={styles.footerPrice}>{countryCurrency(ad.location.country, ad.price)}</p>
                  <p className={styles.footerDate}>{ad.elapsed}</p>
                </div>
              </div>
            </div>
          </Link>
        </li>
      })}
    </ul>
  </div>
})