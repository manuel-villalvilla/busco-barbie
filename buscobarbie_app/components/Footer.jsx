import Link from 'next/link'
import styles from './Footer.module.css'
import { SocialIcon } from 'react-social-icons'
import Image from 'next/image'
const URL = process.env.NEXT_PUBLIC_APP_URL

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.socials}>
        <SocialIcon url='https://twitter.com/buscobarbie_com' style={{ height: 25, width: 25 }} />
        <SocialIcon url='https://es-es.facebook.com/lizysusbarbies' style={{ height: 25, width: 25 }} />
        <SocialIcon url='https://buscobarbie.com/contact' style={{ height: 25, width: 25 }} network='email' />
        <form style={{ display: 'flex' }} action="https://www.paypal.com/donate" method="post" target="_top">
          <input type="hidden" name="business" value="NFAEE7N7D5LLE" />
          <input type="hidden" name="no_recurring" value="0" />
          <input type="hidden" name="item_name" value="Si te gusta el proyecto BuscoBarbie.com y deseas contribuir a su mejora, cualquier donativo es bienvenido." />
          <input type="hidden" name="currency_code" value="EUR" />
          <input type="image" src="https://www.paypalobjects.com/es_ES/ES/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Botón Donar con PayPal" className={styles.paypalImage} />
          <Image alt="" border="0" src="https://www.paypal.com/es_ES/i/scr/pixel.gif" width="1" height="1" />
        </form>
      </div>

      <div className={styles.linksDiv}>
        <Link href={`${URL}/terms-and-conditions`} className={styles.pinkLink}>Condiciones</Link>

        <Link href={`${URL}/contact`} className={styles.pinkLink}>Contacto</Link>

        <div className={styles.links}>
          <Link href={`${URL}/AR`} className={styles.pinkLink}>AR</Link>
          <Link href={`${URL}/MX`} className={styles.pinkLink}>MX</Link>
          <Link href={`${URL}/ES`} className={styles.pinkLink}>ES</Link>
        </div>
      </div>
      <p>Este portal se encuentra en constante desarrollo. Por favor, ten paciencia si alguna vez está deshabilitado para su actualización. No llevará más de unas pocas horas. Si encuentras algun error y deseas comunicarlo, puedes hacerlo utilizando el formulario de contacto. Gracias.</p>
    </footer>
  );
}