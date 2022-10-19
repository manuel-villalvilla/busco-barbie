import Image from 'next/image'
import Link from 'next/link'
// Link prefetch ocurrs in production

export default function ResultsAds({ search, currentItems, count }) {
  const elapsedTime = (creationDate) => {
    const createdParsed = Date.parse(creationDate)
    const nowParsed = Date.parse(new Date)
    const elapsedMili = nowParsed - createdParsed
    const elapsedSecs = Math.round(elapsedMili / 1000)
    const elapsedMins = Math.round(elapsedSecs / 60)
    const elapsedHours = Math.round(elapsedMins / 60)
    const elapsedDays = Math.round(elapsedHours / 24)
    const elapsedMonths = Math.round(elapsedDays / 30)
    const elapsedYears = Math.floor(elapsedMonths / 12)

    if (elapsedDays < 1 && elapsedHours < 1 && elapsedMins < 1) return `Publicado hace 1 minuto`
    else if (elapsedDays < 1 && elapsedHours < 1) return `Publicado hace ${elapsedMins === 1 ? '1 minuto' : `${elapsedMins} minutos`}`
    else if (elapsedDays < 1) return `Publicado hace ${elapsedHours === 1 ? '1 hora' : `${elapsedHours} horas`}`
    else if (elapsedMonths < 1) return `Publicado hace ${elapsedDays === 1 ? '1 día' : `${elapsedDays} días`}`
    else if (elapsedYears < 1) return `Publicado hace ${elapsedMonths === 1 ? '1 mes' : `${elapsedMonths} meses`}`
    else return `Publicado hace ${elapsedYears === 1 ? '1 año' : `${elapsedYears} años`}`
  }

  const countryCurrency = (country, price) => {
    if (country === 'MX' || country === 'AR') return `${price}$`
    if (country === 'ES') return `${price}€`
  }

  const textHighlight = (body) => {
    if (!search)
      return <article className='results-ad-body-article'>{body}</article>

    const parts = body.split(new RegExp(`(${search})`, 'i')) // If separator is a regular expression that contains capturing parentheses ( ), matched results are included in the array.

    return <article className='results-ad-body-article'>{parts.map((part, i) =>
      <span key={i} style={part.toLowerCase() === search.toLowerCase() ? { backgroundColor: 'rgb(233, 96, 155)', color: 'white' } : {}}>{part}</span>)}
    </article>
  }

  return <div className="results-container">
    <p>Encontrado{count === 1 ? '' : 's'} {count} resultado{count === 1 ? '' : 's'}</p>
    <ul className="results-list">
      {currentItems.map(ad => {
        return <Link href={`${ad.location.country}/ads/${ad._id.toString()}`} key={ad._id}>
          <li className='results-list-item'>
              <div className="results-ad-title">
                <h3>{textHighlight(ad.title)}</h3>
              </div>
              <div className="results-ad-image-container">
                {ad.image.length > 0 &&
                  <div className="results-ad-image">
                    <Image className='ads-image' src={ad.image[0]} layout='fill' priority={true} sizes='33vw'></Image>
                  </div>}
                {ad.image.length === 0 && <div className='results-ad-noimage'><p>Sin imágenes</p></div>}
                {ad.image.length > 0 && <span className='image-count'>{ad.image.length > 1 ? ad.image.length + ' imágenes' : '1 imagen'}</span>}
              </div>
              <div className="results-ad-body">{textHighlight(ad.body)}</div>
              <div className="results-ad-footer">
                <p className='footer-province'>{ad.location.province}</p>
                <div className="footer-price-date">
                  <p className='footer-price'>{countryCurrency(ad.location.country, ad.price)}</p>
                  <p className='footer-date'>{elapsedTime(ad.createdAt)}</p>
                </div>
              </div>
          </li>
        </Link>
      })}
    </ul>

  </div >
}