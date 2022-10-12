import { getCookie } from 'cookies-next'
import axios from 'axios'

function index() {

    return <div></div>
}

export async function getServerSideProps({ req, res }) {
    const country = getCookie('country', { req, res })

    // if (!country) {
    //     /* TO IMPLEMENT TO GET COUNTRY_CODE. INVESTIGATE LOCALE
    //     const ipSpain = '81.43.200.106'
    //     const ipMexico = '131.72.228.24'
    //     const res = await axios.get('https://geolocation-db.com/json/')
    //     let country_code
    //     const res = await axios.get('https://ipwho.is/131.72.228.24')
    //     if (res.data.country_code)
    //         if (res.data.country_code !== 'ES' && res.data.country_code !== 'AR' && res.data.country_code !== 'MX')
    //             country_code = 'ES'

    //         else
    //             country_code = res.data.country_code
    //     */
    //     const countries = ['ES', 'MX', 'AR']
    //     const country_code = countries[Math.floor(Math.random() * 3)]
    //     setCookie('country', country_code, { req, res, maxAge: 30 * 24 * 60 * 60 })
    //     res.writeHead(307, { Location: `${country_code}/home` })
    //     res.end()
    //     return { props: {} }
    // }
    res.writeHead(307, { Location: country })
    res.end()
    return { props: {} }
}

export default index