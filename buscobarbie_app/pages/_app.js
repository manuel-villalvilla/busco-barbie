import '../styles.css'
import { Cairo_Play } from '@next/font/google'
const cairo = Cairo_Play({ subsets: ['latin'] })
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

function MyApp({ Component, pageProps: { ...pageProps }, country_code, session, cookieAccepted, ip, favorites }) {
    const [accepted, setAccepted] = useState(cookieAccepted)
    return <>
        <style jsx global>
            {`
                button {
                    font-family: ${cairo.style.fontFamily}, cursive;
                }

                input {
                    font-family: ${cairo.style.fontFamily}, cursive;
                }

                textarea {
                    font-family: ${cairo.style.fontFamily}, cursive;
                }
            `}
        </style>
        <Head>
            <title>BuscoBarbie.com</title>
        </Head>

        <div className={cairo.className}>
            {/* {ip === IP ? <SessionProvider session={session}>
            <Layout country_code={country_code} favorites={favorites}>
                <Component {...pageProps} />
            </Layout>
            {!accepted && <CookieNotice setAccepted={setAccepted} />}
            </SessionProvider> : <p>En construcción...</p>} */}

            <SessionProvider session={session}>
                <Layout country_code={country_code} favorites={favorites}>
                    <Component {...pageProps} />
                </Layout>
                {!accepted && <CookieNotice setAccepted={setAccepted} />}
            </SessionProvider>
        </div>
    </>
}

MyApp.getInitialProps = async (context) => {
    const { ctx, ctx: { req, res } } = context

    let country_code = getCookie('country', { req, res })

    const session = await getSession(ctx)

    const appProps = await App.getInitialProps(context)

    let cookieAccepted = getCookie('cookieAccepted', { req, res })
    if (!cookieAccepted) cookieAccepted = false

    let favorites = getCookie('favorites', { req, res })
    if (!favorites) favorites = []
    else favorites = favorites.split(',')

    let ip = null

    if (country_code) {
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
    } else {
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
                    ip,
                    favorites
                }
            }
        } else country_code = 'ES'

        setCookie('country', country_code, { req, res, maxAge: 30 * 24 * 60 * 60 })

        return {
            ...appProps,
            session,
            country_code,
            cookieAccepted,
            ip,
            favorites
        }
    }

    return {
        ...appProps,
        session,
        country_code,
        cookieAccepted,
        ip,
        favorites
    }
}

export default MyApp
