import { useState, useRef, useEffect, forwardRef } from 'react'
import styles from './Report.module.css'
import ReCAPTCHA from 'react-google-recaptcha'
import reportAd from '../logic/reportAd'
const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY

function Report({ ad }, ref) {
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

        const { select: { value: select }, body: { value: body } } = event.target

        const token = captchaRef.current.getValue()

        if (token.length === 0) {
            setError('Tienes que marcar la casilla de "No soy un robot"')
            captchaRef.current.reset()
            return
        }

        if (select === 'all') return setError('Tienes que elegir una razón.')

        captchaRef.current.reset()

        try {
            const res = await reportAd(token, select, body, ad._id.toString())
            if (res.status === 200) setModalView('thankyou')
            else setError('Algo salió mal')
        } catch (error) {
            if (error.message === 'body is empty or blank') setError('Escribe un mensaje')
            else if (error.message === 'select not valid') setError('Razón no válida')
            else setError('Algo salió mal')
        }
    }

    return <div className={styles.modalContent} ref={ref}>
        <hr style={{ width: '100%', border: '1px solid rgb(233, 96, 155)' }} />
        {modalView === 'form' && <>
            <div className={styles.title}><h4>Reportar este anuncio:</h4></div>

            <form id='reportForm' className={styles.form} onSubmit={event => handleFormSubmit(event)}>

                <div className={styles.selectContainer}>
                    <label htmlFor='select' className={styles.selectLabel}>RAZÓN:</label>
                    <select
                        className={styles.select}
                        name='select'
                    >
                        <option value='all'>Selecciona</option>
                        <option value='unappropriate'>Contenido inapropiado</option>
                        <option value='falseAd'>Anuncio falso</option>
                        <option value='others'>Otra razón</option>
                    </select>
                </div>
                <div className={styles.bodyContainer}>
                    <label htmlFor='body' className={styles.bodyLabel}>APORTA MÁS INFORMACIÓN:</label>
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
                    form='reportForm'
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
                <p>Tu denuncia se ha recibido correctamente. Pronto iniciaremos una investigación.</p>
            </div>
        }
    </div>
}

export default forwardRef(Report)