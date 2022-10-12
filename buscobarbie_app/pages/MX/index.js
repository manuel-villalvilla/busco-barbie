import Home from '../../components/Home'
import retrieveFilteredAds from '../../logic/retrieveFilteredAds'
import { getCookie, setCookie } from 'cookies-next'
import withContext from '../../utils/withContext'
import { useEffect } from 'react'

function MX({ data, page, limit, province, search, categories, country, year, tags, sort, context: { setCountry } }) {
  useEffect(() => {
    if (country !== 'MX')
      setCountry('MX')
  }, [])
  
  return <Home data={data} page={page} limit={limit} province={province} search={search} categories={categories} country='MX' year={year} tags={tags} sort={sort} />
}

export async function getServerSideProps(context) {
  // For initial call, only the country will be provided to the api call
  let { req, res, query: { page = 1, limit = 10, province = null, search = null, categories = null, year = null, tags = null, sort = null } } = context

  const country = getCookie('country', { req, res })
  if (!country || country !== 'MX') {
    setCookie('country', 'MX', { req, res, maxAge: 30 * 24 * 60 * 60 })
  }
  let tags2 = null
  if (typeof tags === 'string') tags2 = tags.split(',')

  try {
    return retrieveFilteredAds('MX', page, limit, province, search, categories, year, tags2, sort)
      .then(data => {
        const arr2 = []
        if (tags) {
          const arr = tags.split(',')
          for (const tag of arr) arr2.push({ label: tag, value: tag })
        }

        return { props: { data, page, limit, province, search, categories, country, year, tags: arr2, sort } }
      })
      .catch(error => { throw new Error(error) })
  } catch (error) {
    throw new Error(error)
  }
}

export default withContext(MX)