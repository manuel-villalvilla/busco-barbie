import styles from './favorites.module.css'
import { getCookie, setCookie } from 'cookies-next'
import { useEffect, useState } from 'react'
import { animateScroll as scroll } from 'react-scroll'
import Link from 'next/link'
import Image from "next/image";
import retrieveFavoriteAds from '../logic/retrieveFavoriteAds'

export default function Favorites({ favorites, ads }) {
  const [stateFavorites, setStateFavorites] = useState(favorites)
  const [stateAds, setStateAds] = useState(ads)

  useEffect(() => {
    scroll.scrollToTop()
  }, [])

  const countryCurrency = (country, price) => {
    if (country === 'MX' || country === 'AR') return `${price}$`
    if (country === 'ES') return `${price}€`
  }

  const removeFavorite = (index) => {
    const arr = []
    for (let i = 0; i < stateFavorites.length; i++) {
      if (i !== index) arr.push(stateFavorites[i])
    }
    const arr2 = []
    for (let j = 0; j < stateAds.length; j++) {
      if (j !== index) arr2.push(stateAds[j])
    }
    setCookie('favorites', arr.toString(), { maxAge: 30 * 24 * 60 * 60 })
    setStateFavorites(arr)
    setStateAds(arr2)
  }

  return (
    <div className={styles.resultsContainer}>
      <ul className={styles.resultsList}>
        {stateAds.length ? stateAds.map((ad, index) => {
          return (
            <li className={styles.resultsListItem} key={index}>
              {ad !== null ? <>
                <div className={styles.favorite}>
                  {ad.categories === 'searchedmodels' || ad.categories === 'searchedaccessories' ? <span className={styles.searchLabel}>Busco</span> : <span className={styles.sellLabel}>Vendo</span>}
                  {stateFavorites.includes(ad._id) ?
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" onClick={() => removeFavorite(index)} style={{ cursor: 'pointer' }}><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill='red' /></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" onClick={() => removeFavorite(index)} style={{ cursor: 'pointer' }}><path d="M0 0h24v24H0V0z" fill="none" /><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" fill='red' /></svg>
                  }
                </div>
                <Link href={`${ad.location.country}/ads/${ad._id.toString()}`} legacyBehavior>
                  <div className={styles.linkDiv}>
                    <div className={styles.resultsAdTitle}>
                      <h3><article>{ad.title}</article></h3>
                    </div>
                    {ad.image.length > 0 && <div>
                      <div className={styles.adImageContainer}>
                        <Image
                          src={ad.image[0]}
                          alt='Primera imágen'
                          priority={true}
                          fill
                          sizes='33vw'
                          style={{
                            width: "100%",
                            objectFit: "contain"
                          }} />
                      </div>
                      <span className={styles.imageCount}>{ad.image.length > 1 ? ad.image.length + ' imágenes' : '1 imagen'}</span>
                    </div>}
                    {ad.image.length === 0 && <div className={styles.resultsAdNoImage}><span className="material-icons-outlined" style={{ fontSize: '48px' }}>no_photography</span></div>}

                    <div className={styles.resultsAdBody}><article className={styles.resultsAdBodyArticle}>{ad.body}</article></div>
                    <p className={styles.footerProvince}><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill='rgb(233, 96, 155)' d="M12 12q.825 0 1.413-.588Q14 10.825 14 10t-.587-1.413Q12.825 8 12 8q-.825 0-1.412.587Q10 9.175 10 10q0 .825.588 1.412Q11.175 12 12 12Zm0 7.35q3.05-2.8 4.525-5.088Q18 11.975 18 10.2q0-2.725-1.738-4.463Q14.525 4 12 4 9.475 4 7.737 5.737 6 7.475 6 10.2q0 1.775 1.475 4.062Q8.95 16.55 12 19.35ZM12 22q-4.025-3.425-6.012-6.363Q4 12.7 4 10.2q0-3.75 2.413-5.975Q8.825 2 12 2t5.587 2.225Q20 6.45 20 10.2q0 2.5-1.987 5.437Q16.025 18.575 12 22Zm0-11.8Z" /></svg>{ad.location.province}</p>

                    <div className={styles.footerPriceDate}>
                      <div className={styles.priceDiv}>
                        {(ad.categories === 'searchedmodels' || ad.categories === 'searchedaccessories') && <p className={styles.offers}>Ofrece</p>}
                        {ad.price.negotiable && <p className={styles.negotiable}>Negociable</p>}
                        <p className={styles.price}>{countryCurrency(ad.location.country, ad.price.number)}</p>
                      </div>
                      <p className={styles.footerDate}>{ad.elapsed}</p>
                    </div>
                  </div>
                </Link></>
                : <><div className={styles.favorite}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" onClick={() => removeFavorite(index)} style={{ cursor: 'pointer' }}><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill='red' /></svg>
                </div>
                  <div className={styles.noAdBody}>
                    <p style={{ textAlign: 'center', margin: 0 }}>Este anuncio no está disponible.</p>
                    <span className={styles.whyLink}>Puede que haya sido borrado, o sea invisible, o esté pasando por el proceso de verificación.</span>
                  </div>
                </>}
            </li>
          );
        }) : <p className={styles.noAds}>Aún no tienes ningún anuncio favorito guardado.</p>}
      </ul>
    </div>
  )
}

export async function getServerSideProps({ req, res }) {
  let favorites = getCookie('favorites', { req, res })
  if (!favorites) return { props: { favorites: [], ads: [] } }
  else {
    try {
      const res = await retrieveFavoriteAds(favorites.split(','))
      if (res.status === 200) {
        if (res.data.length) {
          for (let i = 0; i < res.data.length; i++) {
            const createdAt = res.data[i].createdAt
            const createdParsed = Date.parse(createdAt)
            const nowParsed = Date.parse(new Date)
            const elapsedMili = nowParsed - createdParsed
            const elapsedSecs = Math.round(elapsedMili / 1000)
            const elapsedMins = Math.round(elapsedSecs / 60)
            const elapsedHours = Math.round(elapsedMins / 60)
            const elapsedDays = Math.round(elapsedHours / 24)
            const elapsedMonths = Math.round(elapsedDays / 30)
            const elapsedYears = Math.floor(elapsedMonths / 12)

            if (elapsedDays < 1 && elapsedHours < 1 && elapsedMins < 1) res.data[i].elapsed = `Publicado hace 1 minuto`
            else if (elapsedDays < 1 && elapsedHours < 1) res.data[i].elapsed = `Publicado hace ${elapsedMins === 1 ? '1 minuto' : `${elapsedMins} minutos`}`
            else if (elapsedDays < 1) res.data[i].elapsed = `Publicado hace ${elapsedHours === 1 ? '1 hora' : `${elapsedHours} horas`}`
            else if (elapsedMonths < 1) res.data[i].elapsed = `Publicado hace ${elapsedDays === 1 ? '1 día' : `${elapsedDays} días`}`
            else if (elapsedYears < 1) res.data[i].elapsed = `Publicado hace ${elapsedMonths === 1 ? '1 mes' : `${elapsedMonths} meses`}`
            else res.data[i].elapsed = `Publicado hace ${elapsedYears === 1 ? '1 año' : `${elapsedYears} años`}`
          }
        }
        return { props: { favorites: favorites.split(','), ads: res.data } }
      }
      else return { props: { favorites: favorites.split(','), ads: [] } }

    } catch (error) {
      return { props: { favorites: favorites.split(','), ads: [] } }
    }
  }
}