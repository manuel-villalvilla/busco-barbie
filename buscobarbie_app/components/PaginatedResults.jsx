import ResultsAds from "./ResultsAds";
import ReactPaginate from 'react-paginate'
import { animateScroll as scroll } from 'react-scroll'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './PaginatedResults.module.css'
import withContext from "../utils/withContext";
import Link from "next/link";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL

function PaginatedResults({ search, page, data, onPageClick, context: { country_code } }) {
    const [copied, setCopied] = useState(null)
    const router = useRouter()

    useEffect(() => {
        if (copied) setTimeout(() => setCopied(null), 5000)
    }, [copied])

    const count = data.count

    const handleShareClick = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Resultados de BuscoBarbie',
                url: `${APP_URL}${router.asPath}`
            }).then(() => {
                return
            }).catch(console.error)
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(`${APP_URL}${router.asPath}`)
            setCopied(true)
        } else return
    }

    return (
        <div className={styles.paginatedAds}>
            {count > 0 ? <><p>Encontrado{count === 1 ? '' : 's'} {count} anuncio{count === 1 ? '' : 's'}</p>
                <button
                    type='button'
                    className={styles.shareButton}
                    onClick={() => handleShareClick()}
                >Compartir<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M18 22q-1.25 0-2.125-.875T15 19q0-.175.025-.363.025-.187.075-.337l-7.05-4.1q-.425.375-.95.587Q6.575 15 6 15q-1.25 0-2.125-.875T3 12q0-1.25.875-2.125T6 9q.575 0 1.1.212.525.213.95.588l7.05-4.1q-.05-.15-.075-.337Q15 5.175 15 5q0-1.25.875-2.125T18 2q1.25 0 2.125.875T21 5q0 1.25-.875 2.125T18 8q-.575 0-1.1-.213-.525-.212-.95-.587L8.9 11.3q.05.15.075.337Q9 11.825 9 12t-.025.362q-.025.188-.075.338l7.05 4.1q.425-.375.95-.588Q17.425 16 18 16q1.25 0 2.125.875T21 19q0 1.25-.875 2.125T18 22Zm0-16q.425 0 .712-.287Q19 5.425 19 5t-.288-.713Q18.425 4 18 4t-.712.287Q17 4.575 17 5t.288.713Q17.575 6 18 6ZM6 13q.425 0 .713-.288Q7 12.425 7 12t-.287-.713Q6.425 11 6 11t-.713.287Q5 11.575 5 12t.287.712Q5.575 13 6 13Zm12 7q.425 0 .712-.288Q19 19.425 19 19t-.288-.712Q18.425 18 18 18t-.712.288Q17 18.575 17 19t.288.712Q17.575 20 18 20Zm0-15ZM6 12Zm12 7Z" /></svg>resultados
                </button></> : null}
            {copied && <span className={styles.copiedMessage}>¡Enlace copiado en el portapapeles!</span>}
            <ReactPaginate
                previousLabel={'Anterior'}
                nextLabel={'Siguiente'}
                breakLabel={'...'}
                breakClassName={styles.breakMe}
                activeClassName={styles.active}
                containerClassName={styles.pagination}
                pageClassName={styles.paginationPage}
                nextClassName={styles.paginationPage}
                previousClassName={styles.paginationPage}
                pageCount={data.totalPages}
                marginPagesDisplayed={1}
                pageRangeDisplayed={0}
                onPageChange={onPageClick}
                disableInitialCallback={true}
                renderOnZeroPageCount={null}
                forcePage={page === 0 ? -1 : page}
            />
            {data.ads.length > 0 && <ResultsAds search={search} currentItems={data.ads} />}
            {data.ads.length === 0 && <div className={styles.noResultsContainer}>
                <p className={styles.notFound}>No se encuentran resultados</p>
                <p className={styles.offer}>¿<span>Buscas</span> o <span>vendes</span> un artículo relacionado con Barbie™? Puedes publicar un anuncio para <span>buscar</span> tu artículo Barbie™ favorito o bien para <span>venderlo</span>. ¡Es gratis!</p>
                <Link href={`${APP_URL}/${country_code}/publicar`} className={styles.link}>Pulsa aquí para publicar un anuncio de búsqueda o venta.</Link>
            </div>}
            {/* <div className={styles.amazonContainer}>
                <iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" width="115" height="240" marginWidth="0" marginHeight="0" scrolling="no" frameBorder="0" src="//rcm-eu.amazon-adsystem.com/e/cm?lt1=_blank&bc1=FFFFFF&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=826608-21&language=es_ES&o=30&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B08LTVFGWL&linkId=f24c51a4d6a6375854c4ed02e77d39da"></iframe>
                <iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" width="115" height="240" marginWidth="0" marginHeight="0" scrolling="no" frameBorder="0" src="//rcm-eu.amazon-adsystem.com/e/cm?lt1=_blank&bc1=FFFFFF&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=826608-21&language=es_ES&o=30&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B07217XP41&linkId=c0a3d6ebcab567c0b764e41c0e9a9576"></iframe>
                <iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" width="115" height="240" marginWidth="0" marginHeight="0" scrolling="no" frameBorder="0" src="//rcm-eu.amazon-adsystem.com/e/cm?lt1=_blank&bc1=FFFFFF&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=826608-21&language=es_ES&o=30&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B09V7J1CGD&linkId=12f67609a7b22dbea4e3ec64dbf4dae3"></iframe>
            </div> */}
            <ReactPaginate
                previousLabel={'Anterior'}
                nextLabel={'Siguiente'}
                breakLabel={'...'}
                breakClassName={styles.breakMe}
                activeClassName={styles.active}
                containerClassName={styles.pagination}
                pageClassName={styles.paginationPage}
                nextClassName={styles.paginationPage}
                previousClassName={styles.paginationPage}
                pageCount={data.totalPages}
                marginPagesDisplayed={1}
                pageRangeDisplayed={0}
                onPageChange={onPageClick}
                disableInitialCallback={true}
                renderOnZeroPageCount={null}
                forcePage={page === 0 ? -1 : page}
            />
            {data.count !== 0 && <button type='button' className={styles.goTopButton} onClick={() => scroll.scrollToTop()}><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7.4 18.4 6 17l6-6 6 6-1.4 1.4-4.6-4.575Zm0-6L6 11l6-6 6 6-1.4 1.4L12 7.825Z" /></svg>Volver arriba<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7.4 18.4 6 17l6-6 6 6-1.4 1.4-4.6-4.575Zm0-6L6 11l6-6 6 6-1.4 1.4L12 7.825Z" /></svg></button>}
        </div>
    );
}

export default withContext(PaginatedResults)