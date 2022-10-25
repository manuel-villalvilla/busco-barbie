import retrieveAdWithId from '../../../logic/retrieveAdWithId'
import Ad from '../../../components/Ad'

const Id = ({ ad }) => {
  return <Ad ad={ad}/>
}

export async function getStaticPaths(context) {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export async function getStaticProps(context) {
  const { params: { id } } = context
  try {
    const ad = await retrieveAdWithId('MX', id)
    if (ad) {
      const createdAt = ad.createdAt
      const createdParsed = Date.parse(createdAt)
      const nowParsed = Date.parse(new Date)
      const elapsedMili = nowParsed - createdParsed
      const elapsedSecs = Math.round(elapsedMili / 1000)
      const elapsedMins = Math.round(elapsedSecs / 60)
      const elapsedHours = Math.round(elapsedMins / 60)
      const elapsedDays = Math.round(elapsedHours / 24)
      const elapsedMonths = Math.round(elapsedDays / 30)
      const elapsedYears = Math.floor(elapsedMonths / 12)

      if (elapsedDays < 1 && elapsedHours < 1 && elapsedMins < 1) ad.elapsed = `Publicado hace 1 minuto`
      else if (elapsedDays < 1 && elapsedHours < 1) ad.elapsed = `Publicado hace ${elapsedMins === 1 ? '1 minuto' : `${elapsedMins} minutos`}`
      else if (elapsedDays < 1) ad.elapsed = `Publicado hace ${elapsedHours === 1 ? '1 hora' : `${elapsedHours} horas`}`
      else if (elapsedMonths < 1) ad.elapsed = `Publicado hace ${elapsedDays === 1 ? '1 día' : `${elapsedDays} días`}`
      else if (elapsedYears < 1) ad.elapsed = `Publicado hace ${elapsedMonths === 1 ? '1 mes' : `${elapsedMonths} meses`}`
      else ad.elapsed = `Publicado hace ${elapsedYears === 1 ? '1 año' : `${elapsedYears} años`}`
    }
    return {
      props: { ad }
    }
  } catch (error) {
    return {
      props: { ad: null }
    }
  }
}

export default Id
