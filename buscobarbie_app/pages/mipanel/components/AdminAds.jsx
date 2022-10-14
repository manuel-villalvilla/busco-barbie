import { useState, useEffect } from 'react'
import styles from './AdminPanel.module.css'
import AdminAd from './AdminAd'
import { animateScroll as scroll } from 'react-scroll'

export default function ({ ads, setView, token, setData }) {
    const [ad, showAd] = useState(null)

    useEffect(() => scroll.scrollToTop(), [ad])

    return <div className={styles.adsContainer}>
        {!ad ? <><button type="button" className={styles.backButton} onClick={() => setView('main')}>Volver</button>
        <h4>Anuncios sin verificar {ads.length}</h4>
        <ul className={styles.adList}>
            {ads.map((ad, index) => <li key={index} className={styles.listItem}>
                <p onClick={() => showAd(ad)}>{ad._id}</p>
            </li>)}
        </ul></>
        : <AdminAd ad={ad} showAd={showAd} token={token} setData={setData} />}
    </div>
}