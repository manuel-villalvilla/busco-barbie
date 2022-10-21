import styles from './Ad.module.css'
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { useEffect, useState } from 'react'
import Contact from './Contact'
import withContext from '../utils/withContext'
import { CSSTransition } from 'react-transition-group'
import AnimateHeight from 'react-animate-height'
import Scroll from 'react-scroll'
const scroller = Scroll.animateScroll

export default withContext(function Ad({ ad, context: { setSearchHeight } }) {
  const [contactHeight, setContactHeight] = useState(0)

  useEffect(() => setSearchHeight(0), [])

  const handleContactButtonClick = () => {
    if (contactHeight) setContactHeight(0) 
    else {
      setContactHeight('auto')
      scroller.scrollMore(600)
    }

  }

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

    if (elapsedDays < 1 && elapsedHours < 1 && elapsedMins < 1) return `Publicado hace ${elapsedSecs} segundos`
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

  return <>
    <div className={styles.adContainer}>
      {Object.keys(ad).length === 0 ?
        <p style={{ textAlign: 'center' }}>Lo sentimos, no encontramos el anuncio, o bien no está verificado o publicado</p>
        :
        <>
          <div className={styles.title}><h3>{ad.title}</h3></div>
          <div className={styles.header}>
            {ad.image.length > 0 &&
              <Carousel
                renderArrowPrev={(clickHandler, hasPrev, label) => {
                  if (hasPrev)
                    return <button title={label} className={styles.arrowLeft} onClick={clickHandler}>-</button>
                }}
                renderArrowNext={(clickHandler, hasNext, label) => {
                  if (hasNext)
                    return <button title={label} className={styles.arrowRight} onClick={clickHandler}>+</button>
                }}
                renderIndicator={(onClickHandler, isSelected, index, label) => {
                  if (isSelected) {
                    return (
                      <li
                        className={styles.indicatorStylesSelected}
                        aria-label={`Selected: ${label} ${index + 1}`}
                        title={`Selected: ${label} ${index + 1}`}
                      />
                    )
                  }
                  return (
                    <li
                      className={styles.indicatorStyles}
                      onClick={onClickHandler}
                      onKeyDown={onClickHandler}
                      value={index}
                      key={index}
                      role="button"
                      tabIndex={0}
                      title={`${label} ${index + 1}`}
                      aria-label={`${label} ${index + 1}`}
                    />
                  )
                }}
                dynamicHeight={true}
                showThumbs={false}
                statusFormatter={(currentItem, total) => <span className={styles.statusIndicator}>{currentItem} de {total}</span>}
                onClickItem={(index, item) => window.open(item.key, '_blank').focus()}
              >
                {ad.image.map((image) => {
                  return <div key={image}>
                    <img src={image} />
                  </div>
                })}
              </Carousel>}
            {ad.image.length === 0 && <p>Sin imágenes</p>}
          </div>
          <div className={styles.body}><article>{ad.body}</article></div>
          {ad.location.area && <div className={styles.area}><p>Zona: {ad.location.area}</p></div>}
          <div className={styles.footerCategories}>
            {ad.year && <p>Década: <span>{ad.year}</span></p>}
            <p><span>#</span>{ad.categories}</p>
            <div className={styles.tagsContainer}>{ad.tags.map((tag, index) => <p key={index}><span>#</span>{tag}</p>)}</div>
          </div>
          <div className={styles.footerPriceProvince}>
            <div className={styles.footerPrice}><p>{countryCurrency(ad.location.country, ad.price)}</p></div>
            <div className={styles.footerProvince}><p>{ad.location.province}</p></div>
          </div>
          <button className={styles.contactButton} onClick={() => handleContactButtonClick()}>{contactHeight ? 'Cerrar' : 'Contactar'}</button>
          <p className={styles.elapsedTime}>{elapsedTime(ad.createdAt)}</p>
        </>}
      <AnimateHeight id='filters-panel' duration={500} height={contactHeight}>
        <Contact onCloseButtonClick={handleContactButtonClick} ad={ad} />
      </AnimateHeight>
    </div>

  </>
})