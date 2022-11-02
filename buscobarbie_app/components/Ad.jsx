import styles from './Ad.module.css'
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { useEffect, useRef, useState } from 'react'
import Contact from './Contact'
import Report from './Report'
import withContext from '../utils/withContext'
import { CSSTransition } from 'react-transition-group'
import AnimateHeight from 'react-animate-height'
import { animateScroll as scroll } from 'react-scroll'

export default withContext(function Ad({ ad, context: { setSearchHeight } }) {
  const [contactHeight, setContactHeight] = useState(0)
  const [reportHeight, setReportHeight] = useState(0)
  const contactRef = useRef(null)
  const reportRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      setSearchHeight(0)
      scroll.scrollToTop()
    }, 500)
  }, [])

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
      {!ad ?
        <p style={{ textAlign: 'center' }}>Lo sentimos, no encontramos el anuncio, o bien no está verificado o publicado</p>
        :
        <>
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
            <p><span className="material-symbols-outlined">category</span>{ad.categories}</p>
            <div className={styles.tagsContainer}>{ad.tags.map((tag, index) => <p key={index}><span className="material-symbols-outlined">category</span>{tag}</p>)}</div>
          </div>
          {ad.location.area && <div className={styles.area}><p>Zona: {ad.location.area}</p></div>}
          <div className={styles.footerPriceProvince}>
            <div className={styles.footerPrice}><p>{countryCurrency(ad.location.country, ad.price)}</p></div>
            <div className={styles.footerProvince}><p>{ad.location.province}</p></div>
          </div>
          <button className={styles.contactButton} onClick={handleContactButtonClick}>{contactHeight ? 'Cerrar' : 'Contactar'}</button>
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
        </>}
    </div>
    <button type='button' className={styles.backButtonBot} onClick={() => history.back()}>Volver atrás</button>
  </>
})