import Link from 'next/link'
import styles from './Footer.module.css'
const URL = process.env.NEXT_PUBLIC_APP_URL

export default function Footer() {
  return <footer className={styles.footer}>
    <form action="https://www.paypal.com/donate" method="post" target="_top">
      <input type="hidden" name="business" value="NFAEE7N7D5LLE" />
      <input type="hidden" name="no_recurring" value="0" />
      <input type="hidden" name="item_name" value="Si te gusta el proyecto BuscoBarbie.com y deseas contribuir a su mejora, cualquier donativo es bienvenido." />
      <input type="hidden" name="currency_code" value="EUR" />
      <input type="image" src="https://www.paypalobjects.com/es_ES/ES/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Botón Donar con PayPal" />
      <img alt="" border="0" src="https://www.paypal.com/es_ES/i/scr/pixel.gif" width="1" height="1" />
    </form>

    <div className={styles.linksDiv}>
      <Link href={`${URL}/terms-and-conditions`}><a className={styles.pinkLink}>Condiciones</a></Link>

      <Link href={`${URL}/contact`}><a className={styles.pinkLink}>Contacto</a></Link>

      <div className={styles.links}>
        <Link href={`${URL}/AR`}><a className={styles.pinkLink}>AR</a></Link>
        <Link href={`${URL}/MX`}><a className={styles.pinkLink}>MX</a></Link>
        <Link href={`${URL}/ES`}><a className={styles.pinkLink}>ES</a></Link>
      </div>
    </div>
  </footer>
}