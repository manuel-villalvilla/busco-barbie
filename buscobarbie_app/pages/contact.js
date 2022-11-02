import withContext from '../utils/withContext'
import contactAdmin from '../logic/contactAdmin'
import { useEffect, useState, useRef } from 'react'
import styles from './contact.module.css'
import ReCAPTCHA from 'react-google-recaptcha'
import { animateScroll as scroll } from 'react-scroll'
const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY

export default withContext(function Contact({ context: { searchHeight, setSearchHeight } }) {
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState(null)
    const [view, setView] = useState('contact')
    const firstTime = useRef(true)
    const captchaRef = useRef(null)

    useEffect(() => {
        scroll.scrollToTop()
        if (searchHeight) setSearchHeight(0)
    }, [])

    useEffect(() => {
        if (!firstTime.current) {
            setTimeout(() => setError(null), 5000)
        }
        return () => firstTime.current = false
    }, [error])

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const recaptchaToken = captchaRef.current.getValue()

        if (recaptchaToken.length === 0) {
            captchaRef.current.reset()
            return setError('Tienes que marcar la casilla de "No soy un robot"')
        }

        captchaRef.current.reset()

        const {
            target: {
                contactName: { value: name },
                contactEmail: { value: email },
                contactOptions: { value: option },
                contactMessage: { value: message }
            } } = event

            if (option === 'all') return setError('Selecciona una opción.')

        try {
            const status = await contactAdmin(recaptchaToken, name, email, option, message)
            if (status === 200) setView('thankyou')
        } catch (error) {
            setError('Algo salió mal')
        }
    }

    return <>
        {view === 'contact' && <div className={styles.contactContainer}>
            <h2 className={styles.title}>¿Tienes algo que contarnos?</h2>
            <form className={styles.form} onSubmit={handleFormSubmit}>
            <div className={styles.nameContainer}>
                    <label htmlFor='contactName' className={styles.nameLabel}>NOMBRE:</label>
                    <input
                        className={styles.contactName}
                        type='text'
                        id='contactName'
                        name='contactName'
                        required={true}
                        maxLength={20}
                        size={30}
                    >
                    </input>
                </div>
                <div className={styles.emailContainer}>
                    <label htmlFor='contactEmail' className={styles.emailLabel}>EMAIL:</label>
                    <input
                        className={styles.contactEmail}
                        type='email'
                        id='contactEmail'
                        name='contactEmail'
                        required={true}
                        placeholder={isSearching ? '' : 'miemail@ejemplo.com'}
                        size={30}
                        onFocus={() => setIsSearching(true)}
                        onBlur={() => setIsSearching(false)}
                    >
                    </input>
                </div>
                <div className={styles.optionsContainer}>
                    <label htmlFor='contactOptions' className={styles.optionsLabel}>SELECCIONA UNA OPCIÓN:</label>
                    <select
                        className={styles.contactOptions}
                        id='contactOptions'
                        name='contactOptions'
                    >
                        <option value='all'>Opciones</option>
                        <option value='suggestion'>Tengo una sugerencia</option>
                        <option value='problem'>Tengo un problema</option>
                        <option value='other'>Otras cuestiones</option>
                    </select>
                </div>
                <div className={styles.messageContainer}>
                    <label htmlFor='contactMessage' className={styles.messageLabel}>MENSAJE:</label>
                    <textarea
                        id='contactMessage'
                        className={styles.contactMessage}
                        name='contactMessage'
                        rows={8}
                        required={true}
                        maxLength={500}
                    />
                </div>
                <ReCAPTCHA sitekey={SITE_KEY} ref={captchaRef} />
                {error ? <p className={styles.error}>{error}</p> : null}
                <button
                    type="submit"
                    className={styles.loginButton}
                >Enviar
                </button>
            </form>
        </div>
        }
        {view === 'thankyou' &&
            <div className={styles.thankyouContainer}>
                <h3 className={styles.h3}>¡Gracias! Tu <span>mensaje</span> se ha enviado correctamente.</h3>
                <h4 className={styles.h3}>Trataremos de responder a la mayor brevedad.</h4>
                <button
                    type='button'
                    className={styles.thankyouButton}
                    onClick={() => setView('contact')}
                >Volver
                </button>
            </div>

        }
    </>

})