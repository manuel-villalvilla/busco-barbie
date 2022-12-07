import { useState, useRef, useEffect, forwardRef } from 'react'
import styles from './Contact.module.css'
import ReCAPTCHA from 'react-google-recaptcha'
import contactUser from '../logic/contactUser'
const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY

function Contact({ ad }, ref) {
    const [isSearching, setIsSearching] = useState(false)
    const [remaining, setRemaining] = useState(500)
    const [error, setError] = useState(null)
    const [modalView, setModalView] = useState('form')
    const captchaRef = useRef(null)

    useEffect(() => {
        if (error) setTimeout(() => setError(null), 5000)
    }, [error])

    const handleBodyChange = body => {
        const count = body.length

        setRemaining(500 - count)
    }

    const handleFormSubmit = async event => {
        event.preventDefault()

        const { name: { value: name }, email: { value: email }, body: { value: body } } = event.target

        const token = captchaRef.current.getValue()

        if (token.length === 0) {
            setError('Tienes que marcar la casilla de "No soy un robot"')
            captchaRef.current.reset()
            return
        }

        captchaRef.current.reset()

        try {
            const res = await contactUser(token, name, email, body, ad.user.toString())
            if (res.status === 200) setModalView('thankyou')
            else setError('Algo salió mal')
        } catch (error) {
            if (error.message === 'name is empty or blank') setError('Introduce un nombre')
            else if (error.message === 'email is empty or blank') setError('Introduce tu email')
            else if (error.message === 'email is not valid') setError('Introduce un email válido')
            else if (error.message === 'body is empty or blank') setError('Escribe un mensaje')
            else setError('Algo salió mal')
        }
    }

    return <div className={styles.modalContent} ref={ref}>
        <hr style={{ width: '100%', border: '1px solid rgb(233, 96, 155)' }} />
        {modalView === 'form' && <>
            <div className={styles.title}><h4>Contactar con <span>{ad.name}</span></h4></div>

            {ad.phone !== '' && <div className={styles.phoneP}>
                <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M13 46q-1.2 0-2.1-.9-.9-.9-.9-2.1V5q0-1.2.9-2.1.9-.9 2.1-.9h22q1.2 0 2.1.9.9.9.9 2.1v38q0 1.2-.9 2.1-.9.9-2.1.9Zm0-4.5V43h22v-1.5Zm0-3h22v-29H13Zm0-32h22V5H13Zm0 0V5v1.5Zm0 35V43Z" /></svg>
                <p>{ad.phone}</p>
            </div>}

            <form id='contactForm' className={styles.form} onSubmit={event => handleFormSubmit(event)}>
                <div className={styles.nameContainer}>
                    <label htmlFor='name' className={styles.nameLabel}>NOMBRE:</label>
                    <input
                        type='text'
                        className={styles.nameInput}
                        id='name'
                        name='name'
                        required={true}
                    >
                    </input>
                </div>
                <div className={styles.emailContainer}>
                    <label htmlFor='email' className={styles.emailLabel}>EMAIL:</label>
                    <input
                        type='email'
                        className={styles.emailInput}
                        id='email'
                        name='email'
                        placeholder={isSearching ? '' : 'miemail@ejemplo.com'}
                        onFocus={() => setIsSearching(true)}
                        onBlur={() => setIsSearching(false)}
                        required={true}
                    >
                    </input>
                </div>
                <div className={styles.bodyContainer}>
                    <label htmlFor='body' className={styles.bodyLabel}>MENSAJE:</label>
                    <textarea
                        id='body'
                        className={styles.bodyInput}
                        name='body'
                        rows={8}
                        maxLength={500}
                        onChange={event => {
                            const body = event.target.value

                            handleBodyChange(body)
                        }}
                        required={true}
                    >
                    </textarea>
                    <p>{remaining}</p>
                </div>
                <div className={styles.recaptcha}>
                    <ReCAPTCHA sitekey={SITE_KEY} ref={captchaRef} theme='dark' />
                </div>
            </form>

            {error && <p style={{ textAlign: 'center', color: 'red', fontSize: '16px', margin: '0' }}>{error}</p>}
            <div className={styles.modalFooter}>
                <button
                    type='submit'
                    form='contactForm'
                    className={styles.modalSendButton}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm8-7L4 8v10h16V8Zm0-2 8-5H4ZM4 8V6v12Z" />
                    </svg>
                    Enviar
                </button>
            </div></>}
        {
            modalView === 'thankyou' && <div className={styles.thankyou}>
                <h3>¡GRACIAS!</h3>
                <p>El mensaje se envió correctamente</p>
            </div>
        }
    </div>
}

export default forwardRef(Contact)