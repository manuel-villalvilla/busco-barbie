import Link from 'next/link'
import styles from './CookieNotice.module.css'
import { setCookie } from 'cookies-next'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export default function ({ setAccepted }) {
    const handleAcceptButton = () => {
        setCookie('cookieAccepted', true, { maxAge: 30 * 24 * 60 * 60 })
        setAccepted(true)
    }

    return <div className={styles.container}>
        <p>Esta aplicación web usa cookies para mejorar tu experiencia de navegación.
            Mediante el uso de la aplicación, aceptas el uso de cookies detallado en nuestras <Link href={`${APP_URL}/terms-and-conditions`}><a className={styles.link}>condiciones</a></Link>.
        </p>
        <button type='button' className={styles.button} onClick={handleAcceptButton}>ENTENDIDO</button>
    </div>
}