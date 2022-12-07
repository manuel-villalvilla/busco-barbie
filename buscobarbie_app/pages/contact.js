import contactAdmin from '../logic/contactAdmin'
import { useEffect, useState, useRef } from 'react'
import styles from './contact.module.css'
import ReCAPTCHA from 'react-google-recaptcha'
import { animateScroll as scroll } from 'react-scroll'
const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY

export default function Contact() {
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState(null)
    const [view, setView] = useState('contact')
    const firstTime = useRef(true)
    const captchaRef = useRef(null)

    useEffect(() => {
        scroll.scrollToTop()
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
            <h3 className={styles.title}>
                <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path fill='rgb(114, 191, 128)' d="M22 42v-3h17V23.8q0-2.9-1.25-5.575Q36.5 15.55 34.4 13.5t-4.8-3.275Q26.9 9 24 9q-2.9 0-5.6 1.225-2.7 1.225-4.8 3.275-2.1 2.05-3.35 4.725T9 23.8V36H8q-1.65 0-2.825-1.175Q4 33.65 4 32v-4q0-1.15.55-2.025T6 24.55l.15-2.65q.45-3.65 2.075-6.6 1.625-2.95 4.05-5t5.45-3.175Q20.75 6 24 6q3.3 0 6.325 1.125 3.025 1.125 5.425 3.2t4.025 5Q41.4 18.25 41.85 21.85l.15 2.6q.9.45 1.45 1.325.55.875.55 1.925v4.6q0 1.1-.55 1.95-.55.85-1.45 1.3V39q0 1.25-.875 2.125T39 42Zm-4-14.5q-.6 0-1.05-.45-.45-.45-.45-1.1 0-.6.45-1.025.45-.425 1.1-.425.6 0 1.025.425.425.425.425 1.075 0 .6-.425 1.05-.425.45-1.075.45Zm12 0q-.6 0-1.05-.45-.45-.45-.45-1.1 0-.6.45-1.025.45-.425 1.1-.425.6 0 1.025.425.425.425.425 1.075 0 .6-.425 1.05-.425.45-1.075.45Zm-17.95-2.6q-.2-2.95.825-5.35 1.025-2.4 2.75-4.075Q17.35 13.8 19.6 12.9q2.25-.9 4.5-.9 4.55 0 7.65 2.875 3.1 2.875 3.8 7.175-4.7-.05-8.275-2.525T21.75 13.1q-.8 4.05-3.375 7.175T12.05 24.9Z" /></svg>
                Contacto
                <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path fill='rgb(233, 96, 155)' d="M22 42v-3h17V23.8q0-2.9-1.25-5.575Q36.5 15.55 34.4 13.5t-4.8-3.275Q26.9 9 24 9q-2.9 0-5.6 1.225-2.7 1.225-4.8 3.275-2.1 2.05-3.35 4.725T9 23.8V36H8q-1.65 0-2.825-1.175Q4 33.65 4 32v-4q0-1.15.55-2.025T6 24.55l.15-2.65q.45-3.65 2.075-6.6 1.625-2.95 4.05-5t5.45-3.175Q20.75 6 24 6q3.3 0 6.325 1.125 3.025 1.125 5.425 3.2t4.025 5Q41.4 18.25 41.85 21.85l.15 2.6q.9.45 1.45 1.325.55.875.55 1.925v4.6q0 1.1-.55 1.95-.55.85-1.45 1.3V39q0 1.25-.875 2.125T39 42Zm-4-14.5q-.6 0-1.05-.45-.45-.45-.45-1.1 0-.6.45-1.025.45-.425 1.1-.425.6 0 1.025.425.425.425.425 1.075 0 .6-.425 1.05-.425.45-1.075.45Zm12 0q-.6 0-1.05-.45-.45-.45-.45-1.1 0-.6.45-1.025.45-.425 1.1-.425.6 0 1.025.425.425.425.425 1.075 0 .6-.425 1.05-.425.45-1.075.45Zm-17.95-2.6q-.2-2.95.825-5.35 1.025-2.4 2.75-4.075Q17.35 13.8 19.6 12.9q2.25-.9 4.5-.9 4.55 0 7.65 2.875 3.1 2.875 3.8 7.175-4.7-.05-8.275-2.525T21.75 13.1q-.8 4.05-3.375 7.175T12.05 24.9Z" /></svg>
            </h3>
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
                <ReCAPTCHA sitekey={SITE_KEY} ref={captchaRef} theme='dark' />
                {error ? <p className={styles.error}>{error}</p> : null}
                <button
                    type="submit"
                    className={styles.loginButton}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm8-7L4 8v10h16V8Zm0-2 8-5H4ZM4 8V6v12Z" />
                    </svg>
                    Enviar
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
}

export async function getServerSideProps(context) {
    return { props: {} }
}