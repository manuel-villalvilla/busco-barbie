import styles from './MainPanel.module.css'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import updateUser from "../../../logic/updateUser"
import deleteAd from '../../../logic/deleteAd'
import AdEdit from "../components/AdEdit"
import NewAd from './NewAd'
import { animateScroll as scroll } from 'react-scroll'
const URL = process.env.NEXT_PUBLIC_APP_URL

export default function ({ user, ads, setUser, setAds, token, count, setCount }) {
    const [ad, setAd] = useState(null)
    const [adId, setAdId] = useState(null) // aqui se guarda el id del anuncio
    const [adsError, setAdsError] = useState(null)
    const [adsSuccess, setAdsSuccess] = useState(null)
    const [userError, setUserError] = useState(null)
    const [userSuccess, setUserSuccess] = useState(null)
    const [view, setView] = useState('mainpannel')
    const [unverified, setUnverified] = useState(false)
    const notFirstRef = useRef(true)
    const notFirstRef1 = useRef(true)

    useEffect(() => {
        if (!notFirstRef.current) {
            setTimeout(() => {
                if (adsSuccess) setAdsSuccess(null)
                if (adsError) setAdsError(null)
                if (userError) setUserError(null)
                if (userSuccess) setUserSuccess(null)
            }, 5000)
        }
        return () => notFirstRef.current = false
    }, [adsError, adsSuccess, userError, userSuccess])

    useEffect(() => {
        if (!notFirstRef1.current) scroll.scrollToTop()
        return () => { notFirstRef1.current = false }
    }, [view])

    useEffect(() => {
        for (const ad of ads) {
            if (ad.verified === false) return setUnverified(true)
        }
    }, [])

    const handleDeleteClick = async () => {
        try {
            const ads = await deleteAd(user._id, adId, token.tokenFromApi)
            setAds(ads)
            setCount(ads.length)
            setAdId(null)
            setView('mainpannel')
            setAdsSuccess('Borrado correctamente')
        } catch (error) {
            setAdsError('Algo salió mal borrando el anuncio')
        }
    }

    const handleFormSubmit = async event => {
        const { target: { name: { value: name }, password1: { value: pass1 }, password2: { value: pass2 } } } = event

        if (pass1 !== pass2) return setAdsError('Las contraseñas deben coincidir')

        try {
            const res = await updateUser(user._id, token.tokenFromApi, name, pass1, pass2)
            setUser(res.data)
            setAdsError(null)
            setUserSuccess('Guardado correctamente')
        } catch (error) {
            setUserError('Algo salió mal guardando tus datos')
        }
    }
    return <>
        {view === 'mainpannel' && <>
            <div className={styles.titleContainer}>
                <h3>¡Hola <span>{user.name}</span>!</h3>
            </div>
            <div className={styles.adsContainer}>
                <label htmlFor="ad-div" className={styles.adsLabel}>MIS ANUNCIOS:</label>
                {ads.length ? ads.map(ad => {
                    return <div className={styles.adDiv} id='ad-div' key={ad._id.toString()}>
                        <div className={styles.adTitle}><p>{ad.title}</p></div>
                        <div className={styles.adLink}>{ad.verified ? <Link href={`${URL}/${ad.location.country}/ads/${ad._id.toString()}`} passHref><a className={styles.adLinkA}>Enlace</a></Link> : <span>🔴</span>}</div>
                        <div className={styles.adButtons}>
                            <button
                                type='button'
                                className={styles.editButton}
                                onClick={() => {
                                    setAd(ad)
                                    setView('adedit')
                                }}
                            >EDITAR
                            </button>
                            <button
                                type='button'
                                className={styles.deleteButton}
                                onClick={() => {
                                    setAdId(ad._id)
                                    setView('confirmmodal')
                                }}
                            >BORRAR
                            </button>
                        </div>
                    </div>
                }) : <div className={styles.adDiv}><p className={styles.noads}>Aún no tienes anuncios</p></div>}
                {adsError && <p className={styles.error}>{adsError}</p>}
                {adsSuccess && <p className={styles.success}>{adsSuccess}</p>}
                {unverified ? <p className={styles.unverified}>🔴 Anuncio no verificado aún</p> : null}
                <div className={styles.newAdButtonDiv}>
                    <button
                        type='button'
                        className={styles.newAdButton}
                        onClick={() => {
                            if (count >= 10) setAdsError('Has alcanzado el límite de 10 anuncios')
                            else setView('newad')
                        }}
                    >NUEVO ANUNCIO
                    </button>
                </div>

                <label htmlFor="user-form" className={styles.userLabel}>MIS DATOS:</label>
                <form id='user-form' className={styles.form} onSubmit={event => {
                    event.preventDefault()

                    handleFormSubmit(event)
                }}>
                    <div className={styles.userDiv}>
                        <label htmlFor="name" className={styles.labels}>NOMBRE:</label>
                        <input
                            type='text'
                            className={styles.nameInput}
                            defaultValue={user.name}
                            name='name'
                            id='name'
                            maxLength={20}
                            required
                        />
                    </div>
                    <div className={styles.emailDiv}>
                        <label htmlFor="email" className={styles.labels}>EMAIL:</label>
                        <input
                            type='email'
                            className={styles.emailInput}
                            defaultValue={user.email}
                            name='email'
                            id='email'
                            maxLength={30}
                            disabled={true}
                        />
                    </div>
                    <p className={styles.emailNote}>No se permite editar email</p>
                    <div className={styles.passwordDiv}>
                        <label htmlFor="password1" className={styles.labels}>NUEVA CONTRASEÑA:</label>
                        <input
                            type='password'
                            className={styles.passwordInput}
                            name='password1'
                            id='password1'
                            maxLength={20}
                            minLength={8}
                            // required
                            disabled={user.role === 'google' ? true : false}
                        />
                    </div>
                    {user.role === 'google' ? <p className={styles.passwordNote}>Edita tu contraseña en tu cuenta de Google</p> : <p className={styles.passwordNote}>Entre 8 y 20 caracteres, incluidos: !@#$%^&*</p>}
                    <div className={styles.password2Div}>
                        <label htmlFor="password2" className={styles.labels}>REPETIR CONTRASEÑA:</label>
                        <input
                            type='password'
                            className={styles.password2Input}
                            name='password2'
                            id='password2'
                            maxLength={20}
                            minLength={8}
                            // required
                            disabled={user.role === 'google' ? true : false}
                        />
                    </div>
                    {userError && <p className={styles.error}>{userError}</p>}
                    {userSuccess && <p className={styles.success}>{userSuccess}</p>}
                    <button type='submit' className={styles.formButton}>GUARDAR</button>
                </form>
            </div>
        </>
        }
        {
            view === 'confirmmodal' && <div className={styles.modal}>
                <div className={styles.modalContent}>
                    <h4>¿Seguro que deseas <span>borrar</span> este anuncio?</h4>
                    <div className={styles.modalButtonsContainer}>
                        <button className={styles.saveButton} type='button' onClick={() => handleDeleteClick()}>Borrar</button>
                        <button className={styles.cancelButton} type='button' onClick={() => {
                            setAdId(null)
                            setView('mainpannel')
                        }}>Cancelar</button>
                    </div>
                </div>
            </div>
        }
        {
            view === 'adedit' && <AdEdit ad={ad} user={user} setView={setView} token={token} setAds={setAds} setAdsSuccess={setAdsSuccess} />
        }
        {
            view === 'newad' && <NewAd setView={setView} tokenFromApi={token.tokenFromApi} userId={user._id} setAds={setAds} setCount={setCount} />
        }
    </>

}