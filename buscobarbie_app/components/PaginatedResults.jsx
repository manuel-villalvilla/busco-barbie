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
                <Link href={`${APP_URL}/${country_code}/publicar`}><a className={styles.link}>Pulsa aquí para <span>publicar</span> un anuncio de búsqueda o venta.</a></Link>
            </div>}
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