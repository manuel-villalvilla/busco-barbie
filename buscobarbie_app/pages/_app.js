import '../styles.css'
import { SessionProvider } from 'next-auth/react'
import { getSession } from 'next-auth/react'
import Layout from '../components/Layout'
import Loader from '../components/Loader'
import Head from 'next/head'
import { getCookie, setCookie } from 'cookies-next'
import App from 'next/app'
import CookieNotice from '../components/CookieNotice'
import { useState } from 'react'
import axios from 'axios'
const TOKEN = process.env.NEXT_PUBLIC_FINDIP_TOKEN

function MyApp({ Component, pageProps: { ...pageProps }, country_code, session, cookieAccepted }) {
    const [accepted, setAccepted] = useState(cookieAccepted)
    return <>
        <Head>
            <title>BuscoBarbie.com</title>
            <link rel="icon" href="/favicon.png" />
        </Head>

        <SessionProvider session={session}>
            <Layout country_code={country_code} >
                <Component {...pageProps} />
            </Layout>
            {!accepted && <CookieNotice setAccepted={setAccepted} />}
        </SessionProvider>
    </>
}

MyApp.getInitialProps = async (context) => {
    const { ctx, ctx: { req, res } } = context
    if (req && req.headers) {
        console.log('IP: ' + req.headers["x-real-ip"] + ' ' + req.headers["accept-language"])
    }
    let country_code = getCookie('country', { req, res })
    const session = await getSession(ctx)
    const appProps = await App.getInitialProps(context)

    let cookieAccepted = getCookie('cookieAccepted', { req, res })
    if (!cookieAccepted) cookieAccepted = false

    if (!country_code) {
        // Get country code from external API
        if (req && req.headers) {
            try {
                const res = await axios.get(`https://api.findip.net/${req.headers["x-real-ip"]}/?token=${TOKEN}`)
                if (res.status === 200) {
                    country_code = res.data.country.iso_code
                    if (country_code !== 'MX' && country_code !== 'ES' && country_code !== 'AR') country_code = 'ES'
                }
                else country_code = 'ES'
            } catch (error) {
                country_code = 'ES'
                
                setCookie('country', country_code, { req, res, maxAge: 30 * 24 * 60 * 60 })

                return {
                    ...appProps,
                    session,
                    country_code,
                    cookieAccepted
                }
            }
        }
        else country_code = 'ES'

        setCookie('country', country_code, { req, res, maxAge: 30 * 24 * 60 * 60 })

        return {
            ...appProps,
            session,
            country_code,
            cookieAccepted
        }
    }

    return {
        ...appProps,
        session,
        country_code,
        cookieAccepted
    }
}

export default MyApp
