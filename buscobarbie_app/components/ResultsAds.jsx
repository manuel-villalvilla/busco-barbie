import Image from 'next/image'
import Link from 'next/link'
import styles from './ResultsAds.module.css'

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

  const myLoader = ({src, width, quality}) => {
    return `${src}?w=100&q=75`
  }

  return <div className={styles.resultsContainer}>
    <p>Encontrado{count === 1 ? '' : 's'} {count} resultado{count === 1 ? '' : 's'}</p>
    <ul className={styles.resultsList}>
      {currentItems.map(ad => {
        return <Link href={`${ad.location.country}/ads/${ad._id.toString()}`} key={ad._id}>
          <li className={styles.resultsListItem}>
            <div className={styles.resultsAdTitle}>
              <h2>{textHighlight(ad.title)}</h2>
            </div>
            {ad.image.length > 0 && <div className={styles.adImageContainer}><Image src={ad.image[0]} alt='Primera imágen' priority={true} sizes='100vw' layout='responsive' width='100%' height='100%' objectFit='contain' loader={myLoader}/></div>}
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
          </li>
        </Link>
      })}
    </ul>

  </div >
}