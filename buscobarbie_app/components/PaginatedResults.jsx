import ResultsAds from "./ResultsAds";
import ReactPaginate from 'react-paginate'
import { animateScroll as scroll } from 'react-scroll'
import styles from './PaginatedResults.module.css'

function PaginatedResults({ forwardRef, search, page, data, onPageClick }) { // search solo se envia a ResultsAds
    return (
        <div className={styles.paginatedAds} ref={forwardRef}>
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
            {data.ads.length === 0 && <p style={{ textAlign: 'center' }}>No se encuentran resultados</p>}
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

export default PaginatedResults