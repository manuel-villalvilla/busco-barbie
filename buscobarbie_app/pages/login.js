import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import withContext from '../utils/withContext'
import { getToken } from 'next-auth/jwt'
import { useEffect, useState, useRef } from 'react'
import styles from './login.module.css'
import recoverPassword from '../logic/recoverPassword'
import GoogleButton from 'react-google-button'
import ReCAPTCHA from 'react-google-recaptcha'
const URL = process.env.NEXT_PUBLIC_APP_URL
const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY

export default withContext(function SignIn({ context: { setSearchHeight } }) {
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [view, setView] = useState('login')
  const router = useRouter()
  const emailRef = useRef(null)
  const firstTime = useRef(true)
  const captchaRef = useRef(null)

  useEffect(() => setSearchHeight(0), [])

  useEffect(() => {
    if (!firstTime.current) {
      setTimeout(() => setError(null), 5000)
    }
    return () => firstTime.current = false
  }, [error])

  const handleFormSubmit = async (event) => {
    event.preventDefault()

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: event.target.loginEmail.value,
        password: event.target.loginPassword.value
      })
      if (res.ok) router.push(`${URL}/mipanel`)
      else if (res.status === 401 || res.status === 400 || res.status === 403) {
        if (res.error === 'email is empty or blank') setError('Introduce tu email')
        else if (res.error === 'email is not valid') setError('Email no válido')
        else if (res.error === 'password length is less than 8 characters') setError('La contraseña debe tener al menos 8 caracteres')
        else if (res.error === 'password is empty or blank') setError('Introduce tu contraseña')
        else if (res.error === 'password chars not valid') setError('Contraseña con caracteres inválidos')
        else if (res.error === 'unauthorized google account sign in') setError('Debes iniciar sesión a través de Google')
        else if (res.error === 'unverified user') setError('Usuario no verificado')
        else setError('Email o contraseña incorrectos')
      }
    } catch (error) {
      setError('Algo salió mal')
    }
  }

  const handleForgottenClick = () => {
    setView('forgotten')
  }

  const handleForgottenSubmit = async event => {
    event.preventDefault()

    const token = captchaRef.current.getValue()

    if (token.length === 0) {
      setError('Tienes que marcar la casilla de "No soy un robot"')
      captchaRef.current.reset()
      return
    }

    captchaRef.current.reset()

    const { target: { forgottenLoginEmail: { value: email } } } = event

    try {
      const res = await recoverPassword(token, email)
      if (res.status === 200) setView('thankyou')
      else setError('Algo salió mal enviando el email. Por favor, inténtalo de nuevo.')
    } catch (error) {
      setError('Algo salió mal enviando el email. Por favor, inténtalo de nuevo.')
    }
  }

  return <>
    {view === 'login' && <div className={styles.loginContainer}>
      <h3 className={styles.title}>Inicio de sesión</h3>
      <GoogleButton
        type='dark'
        label='Inicia sesión con Google'
        onClick={async () => {
          await signIn('google', { redirect: false })
        }}
      />
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.emailContainer}>
          <label htmlFor='loginEmail' className={styles.emailLabel}>EMAIL:</label>
          <input
            className={styles.loginEmail}
            type='email'
            id='loginEmail'
            name='loginEmail'
            required={true}
            placeholder={isSearching ? '' : 'miemail@ejemplo.com'}
            size={30}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setIsSearching(false)}
          >
          </input>
        </div>
        <div className={styles.passwordContainer}>
          <label htmlFor='loginPassword' className={styles.passwordLabel}>CONTRASEÑA:</label>
          <input
            type='password'
            id='loginPassword'
            className={styles.loginPassword}
            name='loginPassword'
            minLength={8}
            maxLength={20}
            size={30}
            required={true}
          />
        </div>
        {error ? <p className={styles.error}>{error}</p> : null}
        <button
          type='button'
          className={styles.forgottenButton}
          onClick={handleForgottenClick}
        >¿Has olvidado tu contraseña?
        </button>

        <button
          type="submit"
          className={styles.loginButton}
        >Acceder
        </button>
      </form>
    </div>
    }
    {view === 'forgotten' && <div className={styles.loginContainer}>
      <h3 className={styles.title}>Reestablecer contraseña</h3>
      <form className={styles.forgottenForm} onSubmit={handleForgottenSubmit}>
        <div className={styles.forgottenEmailContainer}>
          <label htmlFor='forgottenLoginEmail' className={styles.forgottenEmailLabel}>EMAIL:</label>
          <input
            ref={emailRef}
            className={styles.forgottenLoginEmail}
            type='email'
            id='forgottenLoginEmail'
            name='forggotenLoginEmail'
            placeholder={isSearching ? '' : 'miemail@ejemplo.com'}
            size={30}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setIsSearching(false)}
          >
          </input>
          <p className={styles.formText}>Te enviaremos un email con las instrucciones para reestablecer tu contraseña. Los usuarios registrados a través de otras plataformas, por ejemplo Google, no recibirán ningún email y tendrán que recuperar su contraseña a través de su proveedor.</p>
        </div>
        <ReCAPTCHA sitekey={SITE_KEY} ref={captchaRef} />
        {error ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.buttonsContainer}>
          <button
            type="button"
            className={styles.forgottenCancelButton}
            onClick={() => setView('login')}
          >Cancelar
          </button>

          <button
            type="submit"
            className={styles.forgottenSendButton}
          >Enviar
          </button>
        </div>
      </form>
    </div>
    }
    {view === 'thankyou' &&
      <div className={styles.thankyouContainer}>
        <h3 className={styles.h3}>¡Gracias! Se ha enviado un correo a <span className={styles.h3span}>{emailRef.current ? emailRef.current.value : null}</span> con las instrucciones para reestablecer tu contraseña</h3>
        <button
          type='button'
          className={styles.thankyouButton}
          onClick={() => setView('login')}
        >Volver
        </button>
      </div>

    }
  </>

})

export async function getServerSideProps({ req, res }) {
  const secret = process.env.NEXTAUTH_SECRET
  const token = await getToken({ req, secret })

  if (token) {
    //TODO check that is not expired

    res.writeHead(307, { Location: '/mipanel' })
    res.end()
    return { props: {} }

  } else {
    return { props: {} }
  }
}