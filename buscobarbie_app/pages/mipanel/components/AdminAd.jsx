import styles from './AdminPanel.module.css'
import Image from 'next/image'
import verifyAd from '../../../logic/verifyAd'
import retrieveAdminData from '../../../logic/retrieveAdminData'

export default function AdminAd({ ad, showAd, token, setData }) {
    const handleVerify = async (boolean) => {
        try {
            if (boolean) await verifyAd(true, ad._id, token.tokenFromApi)
            else await verifyAd(false, ad._id, token.tokenFromApi)
            const res = await retrieveAdminData(token.tokenFromApi)
            if (res) setData(res.data.pack)
            showAd(null)
        } catch (error) {
            console.log(error)
        }
    }

    return <><button type='button' className={styles.backButton} onClick={() => showAd(null)}>Volver</button>
        <div className={styles.adContainer}>
            <p>{ad.title}</p>
            <p>{ad.body}</p>
            <p>{ad.location.country}</p>
            <p>{ad.location.province}</p>
            {ad.location.area && <p>{ad.location.area}</p>}
            {ad.phone && <p>{ad.phone}</p>}
            <p>{ad.categories}</p>
            {ad.tags.length && <p>{ad.tags.toString()}</p>}
            <p>{ad.price.number}</p>
            <p>Negociable: {ad.price.negotiable}</p>
            <p>{ad.createdAt}</p>
            <div className={styles.imgDiv}>{ad.image.length && ad.image.map((img, index) => <Image className={styles.adImage} src={img} key={index} layout='fixed' priority={true} width={200} height={400}></Image>)}</div>
            <button type='button' className={styles.adVerifyButton} onClick={() => handleVerify(false)}>Borrar</button>
            <button type='button' className={styles.adVerifyButton} onClick={() => handleVerify(true)}>Verificar</button>
        </div>
    </>
}