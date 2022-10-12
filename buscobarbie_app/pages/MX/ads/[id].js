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
    return {
      props: { ad }
    }
  } catch (error) {
    return {
      props: { ad: {} }
    }
  }
}

export default Id
