import { useRouter } from 'next/router'
import PaginatedResults from './PaginatedResults'
import { useState, useEffect, useRef } from 'react'
import { animateScroll as scroll } from 'react-scroll'
import withContext from '../utils/withContext'

function Home({ data, page, province, search, categories, country, year, tags, sort, context: { setSearchHeight, searchHeight } }) {
  const [stateData, setStateData] = useState(data)
  const router = useRouter()
  const storageRef = useRef(true)

  useEffect(() => {
    setTimeout(() => {
      if (searchHeight) setSearchHeight(0)
      scroll.scrollToTop()
    }, 500)
  }, [page])

  /* Re-render component with fresh data. This useEffect is prevented from running on first render */
  useEffect(() => {
    if (!storageRef.current) {
      setStateData(data)
    }
    return () => { storageRef.current = false }
  }, [data])

  const handlePageClick = (event) => {
    const query = new (function() {
      this.page = event.selected + 1
      if (province) this.province = province
      if (categories) this.categories = categories
      if (search) this.search = search
      if (year) this.year = year
      if (tags && tags.length) {
        const arr = []
        for (const tag of tags) arr.push(tag.value)
        this.tags = arr.toString()
      }
      if (sort) this.sort = sort
    })
    router.push({
      pathname: `/${country}`,
      query
    }, undefined, { scroll: false })
  }

  return <PaginatedResults search={search} page={page - 1} data={stateData} onPageClick={handlePageClick} />
}

export default withContext(Home)