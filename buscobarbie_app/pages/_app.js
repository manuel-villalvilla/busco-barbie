import '../styles.css'
import { SessionProvider } from 'next-auth/react'
import { getSession } from 'next-auth/react'
import Layout from '../components/Layout'
import Loader from '../components/Loader'
import Head from 'next/head'
import { getCookie, setCookie } from 'cookies-next'
import App from 'next/app'

function myApp({ Component, pageProps: { ...pageProps }, country_code, session }) {
    return <>
        <Head>
            <title>BuscoBarbie.com</title>
            <link rel="icon" href="/favicon.png" />
        </Head>

        <SessionProvider session={session}>
            <Layout country_code={country_code} >
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    </>
}

myApp.getInitialProps = async (context) => {
    const { ctx, ctx: { req, res } } = context
    const country_code = getCookie('country', { req, res })
    const session = await getSession(ctx)
    const appProps = await App.getInitialProps(context)

    if (!country_code) {
        /* TO IMPLEMENT TO GET COUNTRY_CODE. INVESTIGATE LOCALE
        const ipSpain = '81.43.200.106'
        const ipMexico = '131.72.228.24'
        const res = await axios.get('https://geolocation-db.com/json/')
        let country_code
        const res = await axios.get('https://ipwho.is/131.72.228.24')
        if (res.data.country_code)
            if (res.data.country_code !== 'ES' && res.data.country_code !== 'AR' && res.data.country_code !== 'MX')
                country_code = 'ES'

            else
                country_code = res.data.country_code
        */
        const countries = ['ES', 'MX', 'AR']
        const country_code = countries[Math.floor(Math.random() * 3)]
        setCookie('country', country_code, { req, res, maxAge: 30 * 24 * 60 * 60 })
        return {
            ...appProps,
            session,
            country_code
        }
    }

    return {
        ...appProps,
        session,
        country_code
    }
}

export default myApp
