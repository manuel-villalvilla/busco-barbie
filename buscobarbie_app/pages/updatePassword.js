import { verify } from 'jsonwebtoken'
import { useRef, useState } from 'react'
import styles from './updatePassword.module.css'
import updatePassword from '../logic/updatePassword'
import Link from 'next/link'
import { getToken } from 'next-auth/jwt'
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET
const APP_URL = process.env.NEXT_PUBLIC_APP_URL
const charsString = 'abcdefghijklmnñopqrstuvwxyzáéíóúÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890!@#$%^&*'
const chars = charsString.split('')

export default function UpdatePassword({ token, id }) {
    const [randomPassword, setRandomPassword] = useState(null)
    const [error, setError] = useState(null)
    const [view, setView] = useState('form')
    const password1Ref = useRef(null)
    const password2Ref = useRef(null)

    const handleRandomPassword = () => {
        let randomPassword = ''

        for (let i = 0; i < 12; i++) {
            randomPassword += chars[Math.floor(Math.random() * chars.length)]
        }

        setRandomPassword(randomPassword)

        password1Ref.current.value = randomPassword
        password2Ref.current.value = randomPassword
    }

    const handleFormSubmit = async event => {
        const { target: { password1: { value: password1 }, password2: { value: password2 } } } = event
        if (password1 !== password2) return setError('Las contraseñas deben coincidir')

        try {
            await updatePassword(token, id, password1, password2)
            setView('thankyou')
        } catch (error) {
            setError('Algo salió mal actualizando tu contraseña')
        }
    }
    return <>
        {view === 'form' &&
            <form className={styles.form} onSubmit={event => {
                event.preventDefault()

                handleFormSubmit(event)
            }}>
                <h3>Reestablece tu contraseña</h3>
                <div className={styles.pass1Container}>
                    <label htmlFor='password1' className={styles.passwordLabel}>NUEVA CONTRASEÑA:<span style={{ color: 'red' }}>*</span></label>
                    <button type='button' className={styles.randomPasswordButton} onClick={handleRandomPassword}>ALEATORIA</button>
                    <input
                        type={randomPassword ? 'text' : 'password'}
                        ref={password1Ref}
                        name='password1'
                        id='password1'
                        maxLength={20}
                        minLength={8}
                        className={styles.passwordInput}
                        required={true}
                    />
                </div>
                <div className={styles.pass2Container}>
                    <label htmlFor='password2' className={styles.passwordLabel}>REPETIR CONTRASEÑA:<span style={{ color: 'red' }}>*</span></label>
                    <input
                        type={randomPassword ? 'text' : 'password'}
                        name='password2'
                        id='password2'
                        maxLength={20}
                        minLength={8}
                        className={styles.passwordInput}
                        required={true}
                        ref={password2Ref}
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type='submit' className={styles.submitButton}>Enviar</button>
            </form>
        }
        {view === 'thankyou' && <>
            <h3 className={styles.thankyouMessage}>¡Gracias! Tu <span className={styles.span}>contraseña</span> se ha actualizado correctamente y ya puedes iniciar sesión con ella</h3>
            <Link href={`${APP_URL}/login`}><a className={styles.loginLink}>Iniciar sesión</a></Link>
        </>
        }
    </>
}

export async function getServerSideProps(context) {
    const { query: { id, token }, req, res } = context
    const secret = process.env.NEXTAUTH_SECRET
    const sessionToken = await getToken({ req, secret })

    if (sessionToken) {
        res.writeHead(307, { Location: '/' })
        res.end()
        return { props: {} }
    }

    try {
        const payload = verify(token, JWT_SECRET)
        if (payload.sub !== id) {
            res.writeHead(307, { Location: '/' })
            res.end()
            return { props: {} }
        }
        return { props: { token, id } }
    } catch (error) {
        res.writeHead(307, { Location: '/' })
        res.end()
        return { props: {} }
    }
}

