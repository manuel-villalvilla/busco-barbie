import Image from 'next/image'
import Link from 'next/link'
import styles from './ResultsAds.module.css'
// Link prefetch ocurrs in production

export default function ResultsAds({ search, currentItems, count }) {
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

  return <div className={styles.resultsContainer}>
    <p>Encontrado{count === 1 ? '' : 's'} {count} resultado{count === 1 ? '' : 's'}</p>
    <ul className={styles.resultsList}>
      {currentItems.map(ad => {
        return <Link href={`${ad.location.country}/ads/${ad._id.toString()}`} key={ad._id}>
          <li className={styles.resultsListItem}>
              <div className={styles.resultsAdTitle}>
                <h3>{textHighlight(ad.title)}</h3>
              </div>
              <div className={styles.resultsAdImageContainer}>
                {ad.image.length > 0 &&
                  <div className={styles.resultsAdImage}>
                    <Image className={styles.adImage} src={ad.image[0]} layout='fill' alt='Primera imágen' priority={true} sizes='33vw'></Image>
                  </div>}
                {ad.image.length === 0 && <div className={styles.resultsAdNoImage}><p>Sin imágenes</p></div>}
                {ad.image.length > 0 && <span className={styles.imageCount}>{ad.image.length > 1 ? ad.image.length + ' imágenes' : '1 imagen'}</span>}
              </div>
              <div className={styles.resultsAdBody}>{textHighlight(ad.body)}</div>
              <div className={styles.resultsAdFooter}>
                <p className={styles.footerProvince}>{ad.location.province}</p>
                <div className={styles.footerPriceDate}>
                  <p className={styles.footerPrice}>{countryCurrency(ad.location.country, ad.price)}</p>
                  <p className={styles.footerDate}>{ad.elapsed}</p>
                </div>
              </div>
          </li>
        </Link>
      })}
    </ul>

  </div >
}