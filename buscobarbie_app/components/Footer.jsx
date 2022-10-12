import Link from 'next/link'
const URL = process.env.NEXT_PUBLIC_APP_URL

export default function () {
  return (
    <footer className='footer'>

      <Link href='../terms-and-conditions'><a>Condiciones de uso</a></Link>

      <Link href='../contact'><a>Contacto</a></Link>

      <Link href='../'><a>BuscoBarbie.com</a></Link>
      <div className='links'>
        <Link href={`${URL}/AR`}><a className='home-link'>AR</a></Link>
        <Link href={`${URL}/MX`}><a className='home-link'>MX</a></Link>
        <Link href={`${URL}/ES`}><a className='home-link'>ES</a></Link>
      </div>

    </footer>
  )
}