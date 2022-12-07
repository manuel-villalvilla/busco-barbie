import Link from 'next/link'
import styles from './CookieNotice.module.css'
import { setCookie } from 'cookies-next'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export default function CookieNotice({ setAccepted }) {
    const handleAcceptButton = () => {
        setCookie('cookieAccepted', true, { maxAge: 30 * 24 * 60 * 60 })
        setAccepted(true)
    }

    return (
        <div className={styles.container}>
            <div className={styles.subContainer}>
                <p>Esta aplicación web utiliza cookies para mejorar tu experiencia de navegación.
                    Mediante el uso de la misma, aceptas el uso de cookies detallado en las <Link href={`${APP_URL}/terms-and-conditions`} className={styles.link}>condiciones de uso</Link>.
                </p>
                <button type='button' className={styles.button} onClick={handleAcceptButton}>ENTENDIDO<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M18 21H7V8l7-7 1.25 1.25q.175.175.288.475.112.3.112.575v.35L14.55 8H21q.8 0 1.4.6.6.6.6 1.4v2q0 .175-.05.375t-.1.375l-3 7.05q-.225.5-.75.85T18 21Zm-9-2h9l3-7v-2h-9l1.35-5.5L9 8.85ZM9 8.85V19ZM7 8v2H4v9h3v2H2V8Z"/></svg></button>
            </div>
        </div>
    );
}