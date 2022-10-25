import styles from './Ad.module.css'
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { useEffect, useRef, useState } from 'react'
import Contact from './Contact'
import withContext from '../utils/withContext'
import { CSSTransition } from 'react-transition-group'
import AnimateHeight from 'react-animate-height'

export default withContext(function Ad({ ad, context: { setSearchHeight } }) {
  const [contactHeight, setContactHeight] = useState(0)
  const adContainerRef = useRef(null)
  const contactRef = useRef(null)

  useEffect(() => {
    setSearchHeight(0)
    adContainerRef.current.scrollIntoView()
  }, [])

  const handleAnimationHeightChange = (height) => {
    if (height !== 0) contactRef.current.scrollIntoView()
  }

  const handleContactButtonClick = () => {
    if (contactHeight) setContactHeight(0) 
    else setContactHeight('auto')
  }

  const countryCurrency = (country, price) => {
    if (country === 'MX' || country === 'AR') return `${price}$`
    if (country === 'ES') return `${price}€`
  }

  return <>
    <button type='button' className={styles.backButtonTop} onClick={() => history.back()}>VOLVER</button>
    <div className={styles.adContainer} ref={adContainerRef}>
      {!ad ?
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
          <button className={styles.contactButton} onClick={handleContactButtonClick}>{contactHeight ? 'Cerrar' : 'Contactar'}</button>
          <p className={styles.elapsedTime}>{ad.elapsed}</p>
      <AnimateHeight id='filters-panel' duration={500} height={contactHeight} onHeightAnimationEnd={height => handleAnimationHeightChange(height)}>
        <Contact ref={contactRef} ad={ad} />
      </AnimateHeight></>}
    </div>
    <button type='button' className={styles.backButtonBot} onClick={() => history.back()}>VOLVER</button>
  </>
})