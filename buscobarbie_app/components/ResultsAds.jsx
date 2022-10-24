import Image from 'next/image'
import Link from 'next/link'
// Link prefetch ocurrs in production

export default function ResultsAds({ search, currentItems, count }) {
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
                    <Image className='ads-image' src={ad.image[0]} layout='fill' alt='Primera imágen' priority={true} sizes='33vw'></Image>
                  </div>}
                {ad.image.length === 0 && <div className='results-ad-noimage'><p>Sin imágenes</p></div>}
                {ad.image.length > 0 && <span className='image-count'>{ad.image.length > 1 ? ad.image.length + ' imágenes' : '1 imagen'}</span>}
              </div>
              <div className="results-ad-body">{textHighlight(ad.body)}</div>
              <div className="results-ad-footer">
                <p className='footer-province'>{ad.location.province}</p>
                <div className="footer-price-date">
                  <p className='footer-price'>{countryCurrency(ad.location.country, ad.price)}</p>
                  <p className='footer-date'>{ad.elapsed}</p>
                </div>
              </div>
          </li>
        </Link>
      })}
    </ul>

  </div >
}