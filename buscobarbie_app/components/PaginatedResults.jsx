import ResultsAds from "./ResultsAds";
import ReactPaginate from 'react-paginate'
import { animateScroll as scroll } from 'react-scroll'
import styles from './PaginatedResults.module.css'
import withContext from "../utils/withContext";
import Link from "next/link";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL

function PaginatedResults({ search, page, data, onPageClick, context: { country_code } }) {
    return (
        <div className={styles.paginatedAds}>
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
                forcePage={page}
            />
            {data.ads.length > 0 && <ResultsAds search={search} currentItems={data.ads} count={data.count} />}
            {data.ads.length === 0 && <div className={styles.noResultsContainer}>
                <p className={styles.notFound}>No se encuentran resultados</p>
                <p className={styles.offer}>¿<span>Buscas</span> o <span>vendes</span> un artículo relacionado con Barbie™? Puedes publicar un anuncio para <span>buscar</span> tu artículo Barbie™ favorito o bien para <span>venderlo</span>. ¡Es gratis!</p>
                <Link href={`${APP_URL}/${country_code}/publicar`} className={styles.link}>Pulsa aquí para <span>publicar</span> un anuncio de búsqueda o venta.</Link>
            </div>}
            <div className={styles.amazonContainer}>
                <iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" width="115" height="240" marginWidth="0" marginHeight="0" scrolling="no" frameBorder="0" src="//rcm-eu.amazon-adsystem.com/e/cm?lt1=_blank&bc1=FFFFFF&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=826608-21&language=es_ES&o=30&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B08LTVFGWL&linkId=f24c51a4d6a6375854c4ed02e77d39da"></iframe>
                <iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" width="115" height="240" marginWidth="0" marginHeight="0" scrolling="no" frameBorder="0" src="//rcm-eu.amazon-adsystem.com/e/cm?lt1=_blank&bc1=FFFFFF&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=826608-21&language=es_ES&o=30&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B09Q6D7BD1&linkId=b11c07544b7fd6ec685ec5674689599f"></iframe>
                <iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" width="115" height="240" marginWidth="0" marginHeight="0" scrolling="no" frameBorder="0" src="//rcm-eu.amazon-adsystem.com/e/cm?lt1=_blank&bc1=FFFFFF&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=826608-21&language=es_ES&o=30&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B000KSLPS8&linkId=0c39518c665a08d1dbda07e8d59cdfc9"></iframe>
            </div>
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
                forcePage={page}
            />
            {data.count !== 0 && <button type='button' className={styles.goTopButton} onClick={() => scroll.scrollToTop()}>Volver arriba</button>}
        </div>
    );
}

export default withContext(PaginatedResults)