import { useEffect, useRef, useState } from "react"
import styles from './AdEdit.module.css'
import Select from 'react-select'
import { components } from 'react-select'
import Link from 'next/link'
import axios from 'axios'
import updateAd from "../../../logic/updateAd"
import updateAdVisibility from "../../../logic/updateAdVisibility"
import { tags, years, areas } from 'data'
import errorHandler from '../../../utils/publicPublishErrorHandler'
const { modelos, complementos } = tags
const APP_URL = process.env.NEXT_PUBLIC_APP_URL
const modelosOptions = []
for (const tag of modelos) {
    modelosOptions.push({ value: tag, label: tag })
}
const complementosOptions = []
for (const tag of complementos) {
    complementosOptions.push({ value: tag, label: tag })
}
const { ES, AR, MX } = areas
const imageTypeRegex = /image\/(png|jpg|jpeg|gif)/gm;
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

export default function AdEdit({ ad, setView, token, setAds, user, setAdsSuccess }) {
    const [stateAd, setAd] = useState(ad)
    const [error, setError] = useState({
        images: null,
        bottom: null
    })
    const [remaining, setRemaining] = useState(500 - ad.body.length)
    const [images, setImages] = useState([])
    const [imageFiles, setImageFiles] = useState([])
    const country_code = stateAd.location.country
    const imagesRef = useRef(null)
    const formRef = useRef(null)
    const firsTimeRef = useRef(true)
    const errorBottomRef = useRef(null)

    useEffect(() => {
        if (!firsTimeRef.current) {
          if (error.bottom) {
            errorBottomRef.current.scrollIntoView()
            setTimeout(() => setError({ images: null, bottom: null }), 10000)
          }
        }
        return () => firsTimeRef.current = false
      }, [error])

    useEffect(() => {
        async function setImages() {
            if (stateAd.image.length) {
                const files = []
                for (let i = 0; i < stateAd.image.length; i++) {
                    const response = await axios.get(stateAd.image[i], { responseType: 'blob' })
                    const name = stateAd.image[i].split('/')
                    const imageFile = new File([response.data], name[name.length - 1], { type: response.data.type })
                    files.push(imageFile)
                }
                const dataTransfer = new DataTransfer()
                for (let j = 0; j < files.length; j++) {
                    dataTransfer.items.add(files[j])
                }
                imagesRef.current.files = dataTransfer.files
                setImageFiles(files)
            }
        }
        setImages()
    }, [])

    useEffect(() => { // to create thumbnails
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
            Promise
                .all(promises)
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

    const handleFormSubmit = async event => {
        if (imageFiles.length) {
            const dataTransfer = new DataTransfer()

            for (let i = 0; i < imageFiles.length; i++) {
                dataTransfer.items.add(imageFiles[i])
            }

            const newFiles = dataTransfer.files

            imagesRef.current.files = newFiles
        } else imagesRef.current.files = null

        const form = event.target
        // setAdsSuccess(null)

        try {
            const ads = await updateAd(form, token.tokenFromApi, user._id, ad._id, stateAd.tags)
            if (Object.keys(ads).length === 0) {
                setError({
                    ...error,
                    bottom: 'Algo salió mal'
                })
            } else {
                setError({
                    images: null,
                    bottom: null
                })
                setAds(ads)
                setAdsSuccess('Guardado correctamente. Tu anuncio está en revisión.')
                setView('mainpannel')
            }
        } catch (error) {
            if (error.response && error.response.data)
                errorHandler(error.response.data.error, setError)

            else
                errorHandler(error.message, setError)
        }
    }

    const handleFileChange = e => {
        const { files } = e.target

        if (files.length > 4) {
            e.target.value = null

            setError({ ...error, images: 'Sólo se permite subir un máximo de 4 imágenes' })

            return
        }

        if (files.length + imageFiles.length > 4) {
            e.target.value = null

            setError({ ...error, images: 'Sólo se permite subir un máximo de 4 imágenes' })

            return
        }

        const validImageFiles = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]

            if (file.type.match(imageTypeRegex) && file.size < 6000000) {
                validImageFiles.push(file)
            }
        }

        if (validImageFiles.length) {
            setImageFiles(current => [...current, ...validImageFiles])

            e.target.value = null

            setError({ ...error, images: null })

            return
        }
        e.target.value = null
        setError({ ...error, images: 'Tipo de imagen no válido o supera los 6MB' })
    }

    const handleDeleteImage = index => {
        const tempImageFiles = imageFiles.slice()

        tempImageFiles.splice(index, 1)

        setImageFiles(tempImageFiles)
    }

    const handleBodyChange = body => {
        const count = body.length

        setRemaining(500 - count)
    }

    const handleVisibilitySwitch = async () => {
        let visibility = formRef.current.visibility.checked
        if (visibility) visibility = 'public'
        else visibility = 'private'
        setError({
            images: null,
            bottom: null
        })
        setAdsSuccess(null)

        try {
            const ads = await updateAdVisibility(visibility, token.tokenFromApi, user._id, ad._id)
            for (const tempAd of ads) {
                if (tempAd._id === ad._id) setAd(tempAd)
            }
            setAds(ads)

        } catch (err) {
            setError({
                ...error,
                bottom: 'Algo salió mal'
            })
        }
    }

    return <> <div className={styles.topButtonContainer}><button className={styles.topBackButton} onClick={() => setView('mainpannel')}>VOLVER</button></div>
        <form ref={formRef} className={styles.form} onSubmit={event => {
            event.preventDefault()

            handleFormSubmit(event)
        }}>
            <p>Campos obligatorios <span style={{ color: 'red' }}>*</span></p>

            <div className={styles.adStatusContainer}>
                <label htmlFor='adStatus' className={styles.adStatusLabel}>ESTADO:</label>
                <div className={styles.statusContainer}>
                    <p className={styles.verifiedText}>{stateAd.verified ? <><span>🟢</span>Verificado</> : <><span>🔴</span>No verificado</>}</p>
                    {stateAd.verified && <label className={styles.switch}>
                        <input
                            type="checkbox"
                            name='visibility'
                            defaultChecked={stateAd.visibility === 'public' ? true : false}
                            onChange={handleVisibilitySwitch}
                        />
                        <span className='slider round'></span>
                    </label>}
                    {stateAd.verified && <p className={styles.verifiedText}>{stateAd.visibility === 'public' ? <><span>🟢</span>Visible</> : <><span>🔴</span>Invisible</>}</p>}
                </div>
            </div>

            <div className={styles.titleContainer}>
                <label htmlFor='title' className={styles.titleLabel}>TÍTULO:<span style={{ color: 'red' }}>*</span></label>
                <input
                    type='text'
                    className={styles.titleInput}
                    name='title'
                    id='title'
                    maxLength={30}
                    required={true}
                    defaultValue={stateAd.title}
                />
            </div>

            <div className={styles.bodyContainer}>
                <label htmlFor='body' className={styles.bodyLabel}>DESCRIPCIÓN:<span style={{ color: 'red' }}>*</span></label>
                <textarea
                    className={styles.bodyInput}
                    name='body'
                    id='body'
                    maxLength={500}
                    rows={6}
                    required={true}
                    defaultValue={stateAd.body}
                    onChange={event => {
                        const body = event.target.value

                        handleBodyChange(body)
                    }}
                />
                <div className={styles.formText}>{remaining}</div>
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
                    defaultValue={stateAd.location.province}
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
                    defaultValue={stateAd.location.area}
                />
                <div className={styles.formText}>Puedes opcionalmente especificar tu ubicación.</div>
            </div>

            <div className={styles.phoneContainer}>
                <label htmlFor='phone' className={styles.phoneLabel}>TELÉFONO:</label>
                <input
                    type='text'
                    className={styles.phoneInput}
                    name='phone'
                    id='phone'
                    maxLength={20}
                    defaultValue={stateAd.phone}
                />
                <div className={styles.formText}>Se hará público para que te contacten si lo introduces.</div>
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
                    defaultValue={stateAd.price}
                />
                <div className={styles.formText}>Sólo números.</div>
            </div>

            <div className={styles.categoriesContainer}>
                <label htmlFor="categories" className={styles.categoriesLabel}>CATEGORÍAS:<span style={{ color: 'red' }}>*</span></label>
                <select
                    className={styles.categoriesSelect}
                    name='categories'
                    id="categories"
                    defaultValue={stateAd.categories}
                    onChange={e => setAd({ ...stateAd, categories: e.target.value, tags: [] })}
                >
                    <option value='all'>Todas</option>
                    <option value='modelos'>Modelos</option>
                    <option value='complementos'>Complementos</option>
                </select>
            </div>

            {stateAd.categories === 'modelos' && <>
                <div className={styles.yearsContainer}>
                    <label htmlFor='year' className={styles.label}>DÉCADA:</label>
                    <select
                        className={styles.yearSelect}
                        name='year' id='year'
                        defaultValue={stateAd.year ? stateAd.year : 'Todas'}
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
                        defaultValue={() => {
                            const arr = []
                            for (const tag of stateAd.tags) arr.push({ label: tag, value: tag })
                            if (arr.length) return arr
                            else return null
                        }}
                        components={{
                            Option
                        }}
                        onChange={selected => {
                            const arr = []
                            for (let i = 0; i < selected.length; i++) arr.push(selected[i].value)
                            setAd({ ...stateAd, tags: arr })
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
            {stateAd.categories === 'complementos' &&
                <div className={styles.tagsContainer}>
                    <label className={styles.label}>ETIQUETAS:</label>
                    <Select
                        className='multiSelect'
                        classNamePrefix='reactSelect'
                        menuPlacement="auto"
                        options={complementosOptions}
                        isMulti
                        name='complementosTags'
                        defaultValue={() => {
                            const arr = []
                            for (const tag of stateAd.tags) arr.push({ label: tag, value: tag })
                            return arr
                        }}
                        components={{
                            Option
                        }}
                        onChange={selected => {
                            const arr = []
                            for (let i = 0; i < selected.length; i++) arr.push(selected[i].value)
                            setAd({ ...stateAd, tags: arr })
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
                <label htmlFor='images' className={styles.imagesLabel}>IMÁGENES:</label>
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
                <div className={styles.imagesText}>Máximo 4 imágenes. Se recomienda subirlas en formato vertical.</div>
                {error.images && <p className={styles.error}>{error.images}</p>}
            </div>

            <div className={styles.checkboxContainer}>
                <input type="checkbox" id="accept" name="accept" className={styles.checkboxInput} value="accept" required={true} />
                <label className={styles.checkboxLabel} htmlFor="accept">
                    Acepto las <Link href={`${APP_URL}/terms-and-conditions`} passHref><a target="_blank" rel="noopener noreferrer" className={styles.termsLink}>Condiciones de Servicio</a></Link></label>
            </div>

            <div className={styles.warningContainer}>
                <p className={styles.formText}>Una vez guardados los cambios, el anuncio dejará de ser público hasta que sea nuevamente verificado.</p>
            </div>

            <div className={styles.buttonContainer}>
                <button type='button' className={styles.cancelButton} onClick={() => setView('mainpannel')}>CANCELAR</button>
                <button type='submit' className={styles.saveButton}>GUARDAR</button>
            </div>
            {error.bottom && <p ref={errorBottomRef} className={styles.error}>{error.bottom}</p>}
        </form>
    </>
}