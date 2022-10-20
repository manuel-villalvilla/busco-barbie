import styles from './PublicPublish.module.css'
import Link from 'next/link'
import withContext from '../utils/withContext'
import { useEffect, useRef, useState } from 'react'
import { areas, tags, years } from "data"
import registerUserWithAd from '../logic/registerUserWithAd'
import ReCAPTCHA from 'react-google-recaptcha'
import Select from 'react-select'
import { components } from 'react-select'
import errorHandler from '../utils/publicPublishErrorHandler'
const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY
const imageTypeRegex = /image\/(png|jpg|jpeg|gif)/gm;
const charsString = 'abcdefghijklmnñopqrstuvwxyzáéíóúÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890!@#$%^&*'
const chars = charsString.split('')
const { ES, AR, MX } = areas
const APP_URL = process.env.NEXT_PUBLIC_APP_URL
const { modelos, complementos } = tags
const modelosOptions = []
for (const tag of modelos) {
  modelosOptions.push({ value: tag, label: tag })
}
const complementosOptions = []
for (const tag of complementos) {
  complementosOptions.push({ value: tag, label: tag })
}
const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  )
}

export default withContext(function ({ context: { setSearchHeight, country_code } }) {
  const [error, setError] = useState({
    images: null,
    bottom: null
  })
  const [remaining, setRemaining] = useState(500)
  const [titleRemaining, setTitleRemaining] = useState(30)
  const [isSearching, setIsSearching] = useState(false)
  const [randomPassword, setRandomPassword] = useState(null)
  const [imageFiles, setImageFiles] = useState([])
  const [view, setView] = useState('form')
  const [images, setImages] = useState([])
  const [stateCategories, setStateCategories] = useState(null)
  const [stateTags, setStateTags] = useState([])
  const firsTimeRef = useRef(true)
  const passwordRef = useRef(null)
  const imagesRef = useRef(null)
  const captchaRef = useRef(null)
  const errorBottomRef = useRef(null)
  const errorImagesRef = useRef(null)

  useEffect(() => setSearchHeight(0), [])

  useEffect(() => {
    if (!firsTimeRef.current) {
      if (error.images || error.bottom) {
        if (error.images) errorImagesRef.current.scrollIntoView()
        else if (error.bottom) errorBottomRef.current.scrollIntoView()
        setTimeout(() => setError({ images: null, bottom: null }), 10000)
      }
    }
    return () => firsTimeRef.current = false
  }, [error])

  useEffect(() => {
    const fileReaders = []
    let isCancel = false

    if (imageFiles.length) {
      const promises = imageFiles.map(file => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader()

          fileReaders.push(fileReader)

          fileReader.onload = (e) => {
            const { result } = e.target
            if (result) {
              resolve(result)
            }
          }

          fileReader.onabort = () => {
            reject(new Error("File reading aborted"))
            setError({ ...error, images: 'Hubo un problema al leer el archivo' })
          }

          fileReader.onerror = () => {
            reject(new Error("Failed to read file"))
            setError({ ...error, images: 'Hubo un problema al leer el archivo' })
          }

          fileReader.readAsDataURL(file)
        })
      })
      Promise.all(promises)
        .then(images => {
          if (!isCancel) {
            setImages(images)
          }
        })
        .catch(reason => {
          setError({ ...error, images: reason }) // REVISAR!!
        })
    } else {
      setImages([])
    }
    return () => { // component did unmount
      isCancel = true
      fileReaders.forEach(fileReader => {
        if (fileReader.readyState === 1) {
          fileReader.abort()
        }
      })
    }
  }, [imageFiles])

  const handleBodyChange = body => {
    const count = body.length

    setRemaining(500 - count)
  }

  const handleTitleChange = title => {
    const count = title.length

    setTitleRemaining(30 - count)
  }

  const handleFileChange = e => {
    const { files } = e.target

    if (files.length > 4) {
      e.target.value = null

      setError({ ...error, images: 'Sólo se permite subir un máximo de 4 imágenes' })

      return
    }

    setError({ ...error, images: null })

    const validImageFiles = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (file.type.match(imageTypeRegex) && file.size < 6000000) {
        validImageFiles.push(file)
      }
    }

    if (validImageFiles.length) {
      setImageFiles(validImageFiles)

      return
    }
    e.target.value = null
    setError({ ...error, images: 'Tipo de imagen no válido o supera los 6MB' })
  }

  const handleDeleteImage = index => {
    const dataTransfer = new DataTransfer()

    const tempImageFiles = imageFiles.slice()

    tempImageFiles.splice(index, 1)

    for (let i = 0; i < tempImageFiles.length; i++) {
      dataTransfer.items.add(tempImageFiles[i])
    }

    const newFiles = dataTransfer.files

    imagesRef.current.files = newFiles

    setImageFiles(tempImageFiles)
  }

  const handleRandomPassword = () => {
    let randomPassword = ''

    for (let i = 0; i < 12; i++) {
      randomPassword += chars[Math.floor(Math.random() * chars.length)]
    }

    setRandomPassword(randomPassword)

    passwordRef.current.value = randomPassword
  }

  const handleFormSubmit = async event => {
    const token = captchaRef.current.getValue()
    const form = event.target

    if (token.length === 0) {
      setError({ ...error, bottom: 'Tienes que marcar la casilla de "No soy un robot"' })
      captchaRef.current.reset()
      return
    }

    captchaRef.current.reset()

    try {
      await registerUserWithAd(token, form, country_code, stateTags)

      setView(form.email.value)
      form.reset()

    } catch (error) {
      if (error.response && error.response.data)
        errorHandler(error.response.data.error, setError)
      else
        errorHandler(error.message, setError)
    }
  }

  return <div className={styles.container}> {view === 'form' && <>
    <div className={styles.firstQuestionContainer}>
      <h3 className={styles.firstQuestion}>¿Ya tienes cuenta en <span>BuscoBarbie.com</span> o <span>Google</span>?</h3>
      <p>Si es así, <Link href={`${APP_URL}/login`} passHref><a className={styles.link}>pulsa aquí</a></Link> para publicar un anuncio desde tu panel de control.</p>
    </div>

    <form className={styles.form} encType="multipart/form-data" onSubmit={async (event) => {
      event.preventDefault()

      handleFormSubmit(event)
    }}>
      <h4>NUEVO ANUNCIO EN <span>{
        country_code === 'AR' ? 'ARGENTINA' :
          country_code === 'MX' ? 'MÉXICO' :
            country_code === 'ES' ? 'ESPAÑA' :
              country_code === 'US' ? 'EE.UU.' : null
      }</span></h4>
      <p>Campos obligatorios <span style={{ color: 'red' }}>*</span></p>

      <div className={styles.titleContainer} id='titleContainer'>
        <label htmlFor='title' className={styles.titleLabel}>TÍTULO:<span style={{ color: 'red' }}>*</span></label>
        <input
          type='text'
          className={styles.titleInput}
          name='title'
          id='title'
          maxLength={30}
          required={true}
          onChange={event => {
            const title = event.target.value

            handleTitleChange(title)
          }}
        />
        <p className={styles.formText}>{titleRemaining}</p>
      </div>

      <div className={styles.bodyContainer}>
        <label htmlFor='body' className={styles.bodyLabel}>DESCRIPCIÓN:<span style={{ color: 'red' }}>*</span></label>
        <textarea
          className={styles.bodyInput}
          name='body'
          id='body'
          maxLength={500}
          required={true}
          rows={6}
          onChange={event => {
            const body = event.target.value

            handleBodyChange(body)
          }}
        />
        <p className={styles.formText}>{remaining}</p>
      </div>

      <div className={styles.provinceContainer}>
        <label
          htmlFor="province"
          className={styles.provinceLabel}>
          {country_code === 'MX' || country_code === 'US' ? 'ESTADO:' : 'PROVINCIA:'}<span style={{ color: 'red' }}>*</span>
        </label>
        <select
          className={styles.provinceSelect}
          name="province"
          id="province"
        >
          {country_code === 'AR' && <>
            {AR.map(place => <option key={place} value={place === 'Todas' ? 'all' : place}>{place}</option>)}
          </>
          }
          {country_code === 'ES' && <>
            {ES.map(place => <option key={place} value={place === 'Todas' ? 'all' : place}>{place}</option>)}
          </>
          }
          {country_code === 'MX' && <>
            {MX.map(place => <option key={place} value={place === 'Todas' ? 'all' : place}>{place}</option>)}
          </>
          }
        </select>
      </div>

      <div className={styles.areaContainer}>
        <label htmlFor='area' className={styles.areaLabel}>ZONA:</label>
        <input
          type='text'
          className={styles.areaInput}
          name='area'
          id='area'
          maxLength={50}
        />
        <p className={styles.formText}>Puedes opcionalmente especificar tu ubicación</p>
      </div>

      <div className={styles.phoneContainer}>
        <label htmlFor='phone' className={styles.phoneLabel}>TELÉFONO:</label>
        <input
          type='text'
          className={styles.phoneInput}
          name='phone'
          id='phone'
          maxLength={20}
        />
        <p className={styles.formText}>Se hará público para que te contacten si lo introduces</p>
      </div>

      <div className={styles.priceContainer}>
        <label htmlFor='price' className={styles.priceLabel}>PRECIO:<span style={{ color: 'red' }}>*</span></label>
        <input
          type='number'
          className={styles.priceInput}
          name='price'
          id='price'
          maxLength={4}
          required={true}
        />
        <p className={styles.formText}>Sólo números</p>
      </div>

      <div className={styles.categoriesContainer}>
        <label htmlFor="categories" className={styles.categoriesLabel}>CATEGORÍAS:<span style={{ color: 'red' }}>*</span></label>
        <select
          className={styles.categoriesSelect}
          name='categories'
          id="categories"
          onChange={e => {
            setStateCategories(e.target.value)
            setStateTags([])
          }}
        >
          <option value='all'>Selecciona</option>
          <option value='modelos'>Modelos</option>
          <option value='complementos'>Complementos</option>
        </select>
      </div>

      {stateCategories === 'modelos' && <>
        <div className={styles.yearsContainer}>
          <label htmlFor='year' className={styles.label}>DÉCADA:</label>
          <select
            className={styles.yearSelect}
            name='year' id='year'
          >
            {years.map((year, index) => <option key={index} value={year}>{year}</option>)}
          </select>
        </div>

        <div className={styles.tagsContainer}>
          <label className={styles.label}>ETIQUETAS:</label>
          <Select
            className='multiSelect'
            classNamePrefix='reactSelect'
            menuPlacement="auto"
            options={modelosOptions}
            isMulti
            name='modelosTags'
            components={{
              Option
            }}
            onChange={selected => {
              const arr = []
              for (let i = 0; i < selected.length; i++) arr.push(selected[i].value)
              setStateTags(arr)
            }}
            instanceId='modelos-select'
            placeholder='Selecciona...'
            noOptionsMessage={() => <span>No encontrado</span>}
            loadingMessage={() => <span>Cargando opciones</span>}
            // blurInputOnSelect={true}
            isSearchable={false}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
          />
        </div>
      </>
      }
      {stateCategories === 'complementos' &&
        <div className={styles.tagsContainer}>
          <label className={styles.label}>ETIQUETAS</label>
          <Select
            className='multiSelect'
            classNamePrefix='reactSelect'
            menuPlacement="auto"
            options={complementosOptions}
            isMulti
            name='complementosTags'
            components={{
              Option
            }}
            onChange={selected => {
              const arr = []
              for (let i = 0; i < selected.length; i++) arr.push(selected[i].value)
              setStateTags(arr)
            }}
            instanceId='complementos-select'
            placeholder={'Selecciona...'}
            noOptionsMessage={() => <span>No encontrado</span>}
            loadingMessage={() => <span>Cargando opciones</span>}
            // blurInputOnSelect={true}
            isSearchable={false}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
          />
        </div>

      }

      <div className={styles.imagesContainer}>
        <label className={styles.imagesLabel}>IMÁGENES:</label>
        <label htmlFor='images' className={styles.imagesButton}>AÑADIR FOTOS
        <input
          className={styles.imagesInput}
          type='file'
          name='images'
          id='images'
          accept='image/*'
          multiple={true}
          onChange={handleFileChange}
          ref={imagesRef}
        />
        </label>
        {images.length > 0 &&
          <div className={styles.imagePreview}>
            {
              images.map((image, idx) => {
                return <div className={styles.thumbsContainer} key={idx}>
                  <img src={image} alt='' height={150} width={75} />
                  <button type='button' className={styles.deleteImageButton} onClick={() => handleDeleteImage(idx)}>x</button>
                </div>
              })
            }
          </div>
        }
        <p className={styles.formText}>Máximo 4 imágenes. Se recomienda subirlas en formato vertical</p>
        {error.images && <p ref={errorImagesRef} className={styles.error}>{error.images}</p>}
      </div>

      <div className={styles.nameContainer}>
        <label htmlFor='name' className={styles.nameLabel}>NOMBRE:<span style={{ color: 'red' }}>*</span></label>
        <input
          type='text'
          className={styles.nameInput}
          name='name'
          id='name'
          maxLength={20}
          required={true}
        />
      </div>

      <div className={styles.emailContainer}>
        <label htmlFor='email' className={styles.emailLabel}>
          EMAIL:<span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type='email'
          className={styles.emailInput}
          name='email'
          id='email'
          minLength={6}
          maxLength={40}
          placeholder={isSearching ? '' : 'mi-email@ejemplo.com'}
          onFocus={() => setIsSearching(true)}
          onBlur={() => setIsSearching(false)}
          required={true}
        />
        <p className={styles.formText}>No se hará público</p>
      </div>

      <div className={styles.passwordContainer}>
        <label htmlFor='password' className={styles.passwordLabel}>NUEVA CONTRASEÑA:<span style={{ color: 'red' }}>*</span></label>
        <button type='button' className={styles.randomPasswordButton} onClick={handleRandomPassword}>ALEATORIA</button>
        <input
          type={randomPassword ? 'text' : 'password'}
          ref={passwordRef}
          className={styles.passwordInput}
          name='password'
          id='password'
          minLength={8}
          maxLength={20}
          required={true}
        />
        <p className={styles.formText}>Entre 8 y 20 caracteres, incluidos: !@#$%^&*</p>
      </div>
      <ReCAPTCHA sitekey={SITE_KEY} ref={captchaRef} />
      <div className={styles.checkboxContainer}>
        <input type="checkbox" id="accept" name="accept" className={styles.checkboxInput} value="accept" required={true} />
        <label className={styles.checkboxLabel} htmlFor="accept">
          Acepto las <Link href={`${APP_URL}/terms-and-conditions`} passHref><a target="_blank" rel="noopener noreferrer" className={styles.termsLink}>Condiciones de Servicio</a></Link></label>
      </div>
      {error.bottom && <p ref={errorBottomRef} className={styles.error}>{error.bottom}</p>}
      <button type='submit' className={styles.submitButton}>Enviar</button>
    </form></>}
    {
      view !== 'form' &&
      <>
        <h3>¡Gracias por registrarte en <span>BuscoBarbie.com</span>!</h3>
        <p>Se ha enviado un correo a <span>{view}</span> con un enlace de verificación para que puedas iniciar sesión. ¡No olvides comprobar tu bandeja de spam!</p>
      </>
    }
  </div>
})