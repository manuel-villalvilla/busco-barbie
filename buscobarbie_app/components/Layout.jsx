import Header from './Header'
import Footer from './Footer'
import Context from '../utils/Context'
import { useState } from 'react'

export default function Layout({ children, country_code, favorites }) {
    const [country, setCountry] = useState(country_code)

    return <Context.Provider value={{ setCountry, country_code: country, favorites }}>
        <div className="container">
            <Header country_code={country} />
            <main className='main'>{children}</main>
            <Footer />
        </div>
    </Context.Provider>
}