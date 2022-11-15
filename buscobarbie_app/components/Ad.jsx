import styles from './Ad.module.css'
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { useEffect, useRef, useState } from 'react'
import Contact from './Contact'
import Report from './Report'
import withContext from '../utils/withContext'
import { setCookie } from 'cookies-next'
import { CSSTransition } from 'react-transition-group'
import AnimateHeight from 'react-animate-height'
import { animateScroll as scroll } from 'react-scroll'

export default withContext(function Ad({ ad, context: { setSearchHeight, favorites } }) {
  const [contactHeight, setContactHeight] = useState(0)
  const [reportHeight, setReportHeight] = useState(0)
  const [stateFavorites, setStateFavorites] = useState(favorites)
  const [stateCategories, setStateCategories] = useState(ad.categories === 'soldmodels' ? 'Venta de modelos' : ad.categories === 'soldaccessories' ? 'Venta de complementos' : ad.categories === 'searchedmodels' ? 'Busco modelos' : ad.categories === 'searchedaccessories' ? 'Busco complementos' : null)
  const contactRef = useRef(null)
  const reportRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      setSearchHeight(0)
      scroll.scrollToTop()
    }, 500)
  }, [])

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

  const handleAnimationHeightChange = (height) => {
    if (height !== 0) contactRef.current.scrollIntoView()
  }

  const handleReportAnimationHeightChange = (height) => {
    if (height !== 0) reportRef.current.scrollIntoView()
  }

  const handleContactButtonClick = () => {
    if (contactHeight) setContactHeight(0)
    else setContactHeight('auto')
  }

  const handleReportButtonClick = () => {
    if (reportHeight) setReportHeight(0)
    else setReportHeight('auto')
  }

  const countryCurrency = (country, price) => {
    if (country === 'MX' || country === 'AR') return `${price}$`
    if (country === 'ES') return `${price}€`
  }

  return <>
    {/* <button type='button' className={styles.backButtonTop} onClick={() => history.back()}>Volver atrás</button> */}
    <div className={styles.adContainer}>
      <div className={styles.favorite}>
        {ad.categories === 'searchedmodels' || ad.categories === 'searchedaccessories' ? <span className={styles.searchLabel}>Busco</span> : <span className={styles.sellLabel}>Vendo</span>}
        {stateFavorites.includes(ad._id) ?
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" onClick={() => handleFavorite(ad._id)} style={{ cursor: 'pointer' }}><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill='red' /></svg>
          :
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" onClick={() => handleFavorite(ad._id)} style={{ cursor: 'pointer' }}><path d="M0 0h24v24H0V0z" fill="none" /><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" fill='red' /></svg>
        }
      </div>
      <div className={styles.title}><h3>{ad.title}</h3></div>
      <div className={styles.header}>
        {ad.image.length > 0 && <>
          <div className={styles.carouselContainer}>
            <Carousel
              renderArrowPrev={(clickHandler, hasPrev, label) => {
                if (hasPrev)
                  return <span title={label} className={styles.arrowLeft} onClick={clickHandler}><span className="material-symbols-outlined" style={{ fontSize: '30px' }}>arrow_back_ios</span></span>
              }}
              renderArrowNext={(clickHandler, hasNext, label) => {
                if (hasNext)
                  return <span title={label} className={styles.arrowRight} onClick={clickHandler}><span className="material-symbols-outlined" style={{ fontSize: '30px' }}>arrow_forward_ios</span></span>
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
              onClickItem={(index, item) => window.open(item.key, '_self').focus()}
            >
              {ad.image.map((image) => {
                return <div key={image}>
                  <img src={image} className={styles.image} />
                </div>
              })}
            </Carousel>
          </div>
          <p>Click en la imagen para ampliarla.</p></>}
        {ad.image.length === 0 && <div className={styles.resultsAdNoImage}><span className="material-icons-outlined" style={{ fontSize: '48px' }}>no_photography</span></div>}
      </div>
      <div className={styles.body}><article>{ad.body}</article></div>
      <div className={styles.footerCategories}>
        {ad.year && <p>Década: <span>{ad.year}</span></p>}
        <p><span className="material-symbols-outlined">category</span>{stateCategories}</p>
        <div className={styles.tagsContainer}>{ad.tags.map((tag, index) => <p key={index}><span className="material-symbols-outlined">category</span>{tag}</p>)}</div>
      </div>
      {ad.location.area && <div className={styles.area}><p>Zona: {ad.location.area}</p></div>}
      <div className={styles.footerPriceProvince}>
        <div className={styles.footerPrice}>
          {(ad.categories === 'searchedmodels' || ad.categories === 'searchedaccessories') && <p className={styles.offers}>Ofrezco</p>}
          <p className={styles.price}>{countryCurrency(ad.location.country, ad.price)}</p>
        </div>
        <div className={styles.footerProvince}><p>{ad.location.province}</p></div>
      </div>
      <button className={styles.contactButton} onClick={handleContactButtonClick}>{contactHeight ? 'Cerrar' : 'Contactar con anunciante'}</button>
      <div className={styles.elapsedReport}>
        <p className={styles.elapsedTime}>{ad.elapsed}</p>
        <button type='button' className={styles.reportButton} onClick={handleReportButtonClick}>{reportHeight ? 'Cerrar' : 'Denunciar'}</button>
      </div>
      <AnimateHeight id='contact-panel' duration={500} height={contactHeight} onHeightAnimationEnd={height => handleAnimationHeightChange(height)}>
        <Contact ref={contactRef} ad={ad} />
      </AnimateHeight>

      <AnimateHeight id='report-panel' duration={500} height={reportHeight} onHeightAnimationEnd={height => handleReportAnimationHeightChange(height)}>
        <Report ref={reportRef} ad={ad} />
      </AnimateHeight>
    </div>
    <button type='button' className={styles.backButtonBot} onClick={() => history.back()}>Volver atrás</button>
  </>
})