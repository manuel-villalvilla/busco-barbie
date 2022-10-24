import Home from '../../components/Home'
import retrieveFilteredAds from '../../logic/retrieveFilteredAds'
import { getCookie, setCookie } from 'cookies-next'
import withContext from '../../utils/withContext'
import { useEffect } from 'react'

function AR({ data, page, limit, province, search, categories, country, year, tags, sort, context: { setCountry } }) {
  useEffect(() => {
    if (country !== 'AR')
      setCountry('AR')
  }, [])
  
  return <Home data={data} page={page} limit={limit} province={province} search={search} categories={categories} country='AR' year={year} tags={tags} sort={sort} />
}

export async function getServerSideProps(context) {
  // For initial call, only the country will be provided to the api call
  let { req, res, query: { page = 1, limit = 10, province = null, search = null, categories = null, year = null, tags = null, sort = null } } = context

  const country = getCookie('country', { req, res })
  if (!country || country !== 'AR') {
    setCookie('country', 'AR', { req, res, maxAge: 30 * 24 * 60 * 60 })
  }
  let tags2 = null
  if (typeof tags === 'string') tags2 = tags.split(',')

  try {
    return retrieveFilteredAds('AR', page, limit, province, search, categories, year, tags2, sort)
      .then(data => {
        const arr2 = []
        if (tags) {
          const arr = tags.split(',')
          for (const tag of arr) arr2.push({ label: tag, value: tag })
        }
        if (data.ads.length) {
          for (let i = 0; i < data.ads.length; i++) {
            const createdAt = data.ads[i].createdAt
            const createdParsed = Date.parse(createdAt)
            const nowParsed = Date.parse(new Date)
            const elapsedMili = nowParsed - createdParsed
            const elapsedSecs = Math.round(elapsedMili / 1000)
            const elapsedMins = Math.round(elapsedSecs / 60)
            const elapsedHours = Math.round(elapsedMins / 60)
            const elapsedDays = Math.round(elapsedHours / 24)
            const elapsedMonths = Math.round(elapsedDays / 30)
            const elapsedYears = Math.floor(elapsedMonths / 12)

            if (elapsedDays < 1 && elapsedHours < 1 && elapsedMins < 1) data.ads[i].elapsed = `Publicado hace 1 minuto`
            else if (elapsedDays < 1 && elapsedHours < 1) data.ads[i].elapsed = `Publicado hace ${elapsedMins === 1 ? '1 minuto' : `${elapsedMins} minutos`}`
            else if (elapsedDays < 1) data.ads[i].elapsed = `Publicado hace ${elapsedHours === 1 ? '1 hora' : `${elapsedHours} horas`}`
            else if (elapsedMonths < 1) data.ads[i].elapsed = `Publicado hace ${elapsedDays === 1 ? '1 día' : `${elapsedDays} días`}`
            else if (elapsedYears < 1) data.ads[i].elapsed = `Publicado hace ${elapsedMonths === 1 ? '1 mes' : `${elapsedMonths} meses`}`
            else data.ads[i].elapsed = `Publicado hace ${elapsedYears === 1 ? '1 año' : `${elapsedYears} años`}`
          }
        }

        return { props: { data, page, limit, province, search, categories, country, year, tags: arr2, sort } }
      })
      .catch(error => { throw new Error(error) })
  } catch (error) {
    throw new Error(error)
  }
}

export default withContext(AR)