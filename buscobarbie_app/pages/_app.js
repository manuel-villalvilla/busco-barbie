import '../styles.css'
import { SessionProvider } from 'next-auth/react'
import { getSession } from 'next-auth/react'
import Layout from '../components/Layout'
import Head from 'next/head'
import { getCookie, setCookie } from 'cookies-next'
import App from 'next/app'
import CookieNotice from '../components/CookieNotice'
import { useState } from 'react'
import axios from 'axios'
import logFirstConnection from '../logic/logFirstConnection'
const TOKEN = process.env.NEXT_PUBLIC_FINDIP_TOKEN
const IP = process.env.NEXT_PUBLIC_WAN_IP

function MyApp({ Component, pageProps: { ...pageProps }, country_code, session, cookieAccepted, ip }) {
    const [accepted, setAccepted] = useState(cookieAccepted)
    return <>
        <Head>
            <title>BuscoBarbie.com</title>
            <meta name="description" content="Busca, encuentra, publica... Todo sobre Barbies"></meta>
            <meta name="keywords" content="Buscador, Barbies, Publicar, Complementos, Modelos, Rubias, Morenas, Pelirrojas, Segunda Mano"></meta>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
        </Head>

        {ip === IP ? <SessionProvider session={session}>
            <Layout country_code={country_code}>
                <Component {...pageProps} />
            </Layout>
            {!accepted && <CookieNotice setAccepted={setAccepted} />}
        </SessionProvider> : <p>En construcción. Próximamente...</p>}

    </>
}

MyApp.getInitialProps = async (context) => {
    const { ctx, ctx: { req, res } } = context
    let country_code = getCookie('country', { req, res })
    const session = await getSession(ctx)
    const appProps = await App.getInitialProps(context)
    let cookieAccepted = getCookie('cookieAccepted', { req, res })
    if (!cookieAccepted) cookieAccepted = false
    let ip = null
    
    if (country_code)
        if (req && req.headers) {
            ip = req.headers["x-real-ip"]
            try {
                const res2 = await logFirstConnection(req.headers["x-real-ip"], req.headers["accept-language"], country_code)
                res2.status === 201 ? console.log('Logged IP: ' + req.headers["x-real-ip"] + ' | Locale: ' + req.headers["accept-language"] + ' | Existing cookie country: ' + country_code) :
                    console.log('Not Logged IP: ' + req.headers["x-real-ip"] + ' | Locale: ' + req.headers["accept-language"] + ' | Existing cookie country: ' + country_code)
            } catch (error) {
                console.log(error.message)
            }
        }
    else {
        // Get country code from external API
        if (req && req.headers) {
            ip = req.headers["x-real-ip"]
            try {
                const res = await axios.get(`https://api.findip.net/${req.headers["x-real-ip"]}/?token=${TOKEN}`)
                if (res.status === 200) {
                    country_code = res.data.country.iso_code
                    try {
                        const res2 = await logFirstConnection(req.headers["x-real-ip"], req.headers["accept-language"], country_code)
                        res2.status === 201 ? console.log('Logged IP: ' + req.headers["x-real-ip"] + ' | Locale: ' + req.headers["accept-language"] + ' | New cookie country: ' + res.data.country.iso_code) :
                            console.log('Not Logged IP: ' + req.headers["x-real-ip"] + ' | Locale: ' + req.headers["accept-language"] + ' | New cookie country: ' + res.data.country.iso_code)
                    } catch (error) {
                        console.log(error.message)
                    }

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
                    cookieAccepted,
                    ip
                }
            }
        }
        else country_code = 'ES'

        setCookie('country', country_code, { req, res, maxAge: 30 * 24 * 60 * 60 })

        return {
            ...appProps,
            session,
            country_code,
            cookieAccepted,
            ip
        }
    }

    return {
        ...appProps,
        session,
        country_code,
        cookieAccepted,
        ip
    }
}

export default MyApp
