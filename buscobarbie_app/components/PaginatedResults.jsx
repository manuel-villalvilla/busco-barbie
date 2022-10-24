import ResultsAds from "./ResultsAds";
import ReactPaginate from 'react-paginate'
import { animateScroll as scroll } from 'react-scroll'

function PaginatedItems({ search, page, data, onPageClick }) { // search solo se envia a ResultsAds
    return (
        <div className="paginated-ads">
            <ReactPaginate
                previousLabel={'Anterior'}
                nextLabel={'Siguiente'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                activeClassName={'active'}
                containerClassName={'pagination'}
                pageClassName={'pagination-page'}
                nextClassName={'pagination-page'}
                previousClassName={'pagination-page'}

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
                breakClassName={'break-me'}
                activeClassName={'active'}
                containerClassName={'pagination'}
                pageClassName={'pagination-page'}
                nextClassName={'pagination-page'}
                previousClassName={'pagination-page'}

                pageCount={data.totalPages}
                marginPagesDisplayed={1}
                pageRangeDisplayed={0}
                onPageChange={onPageClick}
                disableInitialCallback={true}
                renderOnZeroPageCount={null}
                forcePage={page}
            />
            <button type='button' className="gotop-button" onClick={() => scroll.scrollToTop()}>Volver arriba</button>
        </div>
    );
}

export default PaginatedItems