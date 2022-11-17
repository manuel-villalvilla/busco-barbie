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
          <p>Pulsa aquí para agregar a favoritos →<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" onClick={() => handleFavorite(ad._id)} style={{ cursor: 'pointer' }}><path d="M0 0h24v24H0V0z" fill="none" /><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" fill='red' /></svg></p>
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
          <p>Click en la imagen para verla en su tamaño original.</p></>}
        {ad.image.length === 0 && <div className={styles.resultsAdNoImage}><span className="material-icons-outlined" style={{ fontSize: '48px' }}>no_photography</span></div>}
      </div>
      <div className={styles.body}><article>{ad.body}</article></div>
      <div className={styles.footerCategories}>
        {ad.year && <p>Década: <span>{ad.year}</span></p>}
        <p><span className="material-symbols-outlined">category</span>{stateCategories}</p>
        <div className={styles.tagsContainer}>{ad.tags.map((tag, index) => <p key={index}><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill='rgb(114, 191, 128)' d="m21 12-4.35 6.15q-.275.4-.712.625Q15.5 19 15 19H5q-.825 0-1.413-.587Q3 17.825 3 17V7q0-.825.587-1.412Q4.175 5 5 5h10q.5 0 .938.225.437.225.712.625Zm-2.45 0L15 7H5v10h10ZM5 12v5V7Z"/></svg>{tag}</p>)}</div>
      </div>
      {ad.location.area && <div className={styles.area}><p><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill='rgb(233, 96, 155)' d="M11 22.95v-2q-3.125-.35-5.362-2.587Q3.4 16.125 3.05 13h-2v-2h2q.35-3.125 2.588-5.363Q7.875 3.4 11 3.05v-2h2v2q3.125.35 5.363 2.587Q20.6 7.875 20.95 11h2v2h-2q-.35 3.125-2.587 5.363Q16.125 20.6 13 20.95v2ZM12 19q2.9 0 4.95-2.05Q19 14.9 19 12q0-2.9-2.05-4.95Q14.9 5 12 5 9.1 5 7.05 7.05 5 9.1 5 12q0 2.9 2.05 4.95Q9.1 19 12 19Zm0-3q-1.65 0-2.825-1.175Q8 13.65 8 12q0-1.65 1.175-2.825Q10.35 8 12 8q1.65 0 2.825 1.175Q16 10.35 16 12q0 1.65-1.175 2.825Q13.65 16 12 16Zm0-2q.825 0 1.413-.588Q14 12.825 14 12t-.587-1.413Q12.825 10 12 10q-.825 0-1.412.587Q10 11.175 10 12q0 .825.588 1.412Q11.175 14 12 14Zm0-2Z"/></svg>Zona: {ad.location.area}</p></div>}
      <div className={styles.footerPriceProvince}>
        <div className={styles.footerPrice}>
          {(ad.categories === 'searchedmodels' || ad.categories === 'searchedaccessories') && <p className={styles.offers}>Ofrezco</p>}
          {ad.price.negotiable && <p className={styles.negotiable}>Negociable</p>}
          <p className={styles.price}>{countryCurrency(ad.location.country, ad.price.number)}</p>
        </div>
        <div className={styles.footerProvince}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill='rgb(233, 96, 155)' d="M12 12q.825 0 1.413-.588Q14 10.825 14 10t-.587-1.413Q12.825 8 12 8q-.825 0-1.412.587Q10 9.175 10 10q0 .825.588 1.412Q11.175 12 12 12Zm0 7.35q3.05-2.8 4.525-5.088Q18 11.975 18 10.2q0-2.725-1.738-4.463Q14.525 4 12 4 9.475 4 7.737 5.737 6 7.475 6 10.2q0 1.775 1.475 4.062Q8.95 16.55 12 19.35ZM12 22q-4.025-3.425-6.012-6.363Q4 12.7 4 10.2q0-3.75 2.413-5.975Q8.825 2 12 2t5.587 2.225Q20 6.45 20 10.2q0 2.5-1.987 5.437Q16.025 18.575 12 22Zm0-11.8Z"/></svg>
          <p>{ad.location.province}</p>
        </div>
      </div>
      <div className={styles.elapsedReport}>
        <p className={styles.elapsedTime}>{ad.elapsed}</p>
        <button type='button' className={styles.reportButton} onClick={handleReportButtonClick}>{reportHeight ? 'Cerrar' : <div className={styles.reportContainer}><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill='red' d="M12 17q.425 0 .713-.288Q13 16.425 13 16t-.287-.713Q12.425 15 12 15t-.712.287Q11 15.575 11 16t.288.712Q11.575 17 12 17Zm-1-4h2V7h-2Zm-2.75 8L3 15.75v-7.5L8.25 3h7.5L21 8.25v7.5L15.75 21Zm.85-2h5.8l4.1-4.1V9.1L14.9 5H9.1L5 9.1v5.8Zm2.9-7Z"/></svg>Denunciar</div>}</button>
      </div>
      <button className={styles.contactButton} onClick={handleContactButtonClick}>{contactHeight ? 'Cerrar' : <div className={styles.buttonContent}><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill='rgb(114, 191, 128)' d="M9 14q0-3.75 2.625-6.375T18 5v2q-2.925 0-4.962 2.037Q11 11.075 11 14Zm4 0q0-2.075 1.463-3.538Q15.925 9 18 9v2q-1.25 0-2.125.875T15 14ZM5 6q-.825 0-1.413-.588Q3 4.825 3 4t.587-1.413Q4.175 2 5 2q.825 0 1.412.587Q7 3.175 7 4q0 .825-.588 1.412Q5.825 6 5 6Zm-3 5V8.5q0-.625.438-1.062Q2.875 7 3.5 7h3q1.125 0 1.938-.713Q9.25 5.575 9.45 4.5h2q-.15 1.5-1.1 2.65Q9.4 8.3 8 8.75V11Zm17 6q-.825 0-1.413-.587Q17 15.825 17 15q0-.825.587-1.413Q18.175 13 19 13q.825 0 1.413.587Q21 14.175 21 15q0 .825-.587 1.413Q19.825 17 19 17Zm-3 5v-2.25q-1.4-.45-2.35-1.6-.95-1.15-1.1-2.65h2q.2 1.075 1.012 1.788.813.712 1.938.712h3q.625 0 1.062.438.438.437.438 1.062V22Z"/></svg>Contactar con anunciante</div>}</button>
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