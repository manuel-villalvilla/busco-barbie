import { useState, useRef, useEffect } from 'react'
import styles from './Modal.module.css'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'
import contactUser from '../logic/contactUser'
const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY
const API_URL = process.env.NEXT_PUBLIC_API_URL

function Modal({ onCloseButtonClick, ad }) {
    const [isSearching, setIsSearching] = useState(false)
    const [remaining, setRemaining] = useState(500)
    const [error, setError] = useState(null)
    const [modalView, setModalView] = useState('form')
    const captchaRef = useRef(null)

    useEffect(() => {
        if (error) setTimeout(() => setError(null), 5000)
    })

    const handleBodyChange = body => {
        const count = body.length

        setRemaining(500 - count)
    }

    const stopEvent = event => event.stopPropagation()

    const handleFormSubmit = (name, email, body) => {
        try {
            contactUser(name, email, body, ad.user.toString())
                .then(res => {
                    if (res.status === 200) setModalView('thankyou')
                })
        } catch (error) {
            if (error.message === 'name is empty or blank') setError('Introduce un nombre')
            else if (error.message === 'email is empty or blank') setError('Introduce tu email')
            else if (error.message === 'email is not valid') setError('Introduce un email válido')
            else if (error.message === 'body is empty or blank') setError('Escribe un mensaje')
            else console.log(error.message)
        }
    }

    return <div className={styles.modal} onClick={onCloseButtonClick} onTouchStart={stopEvent} onTouchEnd={stopEvent}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>

            {modalView === 'form' && <>
                <button className={styles.closeButton} onClick={onCloseButtonClick}>X</button>
                <div className={styles.title}><h4>Contactar con <span>{ad.name}</span></h4></div>

                <form id='contactForm' className={styles.form} onSubmit={async event => {
                    event.preventDefault()

                    const token = captchaRef.current.getValue()

                    if (token.length === 0) {
                        setError('Tienes que marcar la casilla de "No soy un robot"')
                        captchaRef.current.reset()
                        return
                    }

                    captchaRef.current.reset()

                    await axios.post(`${API_URL}/utils`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                        .then(res => {
                            if (res.data !== 'human') throw new Error('not a human')
                            else {
                                const { name: { value: name }, email: { value: email }, body: { value: body } } = event.target

                                handleFormSubmit(name, email, body)
                            }
                        })
                        .catch(error => { throw new Error(error) })


                }}>
                    <div className={styles.nameContainer}>
                        <label htmlFor='name' className={styles.nameLabel}>NOMBRE:</label>
                        <input
                            type='text'
                            className={styles.nameInput}
                            id='name'
                            name='name'
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
                        >
                        </textarea>
                        <p>{remaining}</p>
                    </div>
                    <div className={styles.recaptcha}>
                        <ReCAPTCHA sitekey={SITE_KEY} ref={captchaRef} />
                    </div>
                </form>

                {error && <p style={{ textAlign: 'center', color: 'red', fontSize: '16px', margin: '0' }}>{error}</p>}
                {ad.phone !== '' && <p className={styles.phoneP}>Si lo prefieres, <span>{ad.name}</span> ha dejado su número de teléfono para facilitarte el contacto: <span>{ad.phone}</span></p>}
                <div className={styles.modalFooter}>
                    <button type='submit' form='contactForm' className={styles.modalSendButton}>Enviar</button>
                </div></>}
            {
                modalView === 'thankyou' && <div className={styles.thankyou}>
                    <h3>¡GRACIAS!</h3>
                    <p>El mensaje se envió correctamente</p>
                    <button type='button' className={styles.goBackButton} onClick={onCloseButtonClick}>Volver</button>
                </div>
            }
        </div>
    </div>
}

export default Modal