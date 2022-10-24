import Link from 'next/link'
import styles from './Footer.module.css'
const URL = process.env.NEXT_PUBLIC_APP_URL

export default function () {
  return (
    <footer className={styles.footer}>
      <Link href={`${URL}/terms-and-conditions`}><a className={styles.pinkLink}>Condiciones de uso</a></Link>

      <Link href={`${URL}/contact`}><a className={styles.pinkLink}>Contacto</a></Link>

      <div className={styles.links}>
        <Link href={`${URL}/AR`}><a className={styles.pinkLink}>AR</a></Link>
        <Link href={`${URL}/MX`}><a className={styles.pinkLink}>MX</a></Link>
        <Link href={`${URL}/ES`}><a className={styles.pinkLink}>ES</a></Link>
      </div>

    </footer>
  )
}