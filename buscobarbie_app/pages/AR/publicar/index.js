import PublicPublish from "../../../components/PublicPublish"
import { getCookie, setCookie } from 'cookies-next'
import withContext from '../../../utils/withContext'
import { useEffect } from 'react'

export default withContext(function Publicar({ country, context: { setCountry } }) {
    useEffect(() => {
        if (country !== 'AR')
            setCountry('AR')
    }, [])

    return <PublicPublish />
})

export async function getServerSideProps({ req, res }) {
    const country = getCookie('country', { req, res })
    if (!country || country !== 'AR') {
        setCookie('country', 'AR', { req, res, maxAge: 30 * 24 * 60 * 60 })
    }

    return { props: { country } }
}