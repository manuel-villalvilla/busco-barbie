import styles from './NewAd.module.css'
import Link from 'next/link'
import withContext from '../../../utils/withContext'
import { useEffect, useRef, useState } from 'react'
import { areas, tags, years } from "data"
import newUserAd from '../../../logic/newUserAd'
import Select from 'react-select'
import { components } from 'react-select'
import errorHandler from '../../../utils/publicPublishErrorHandler'
const { modelos, complementos } = tags
const modelosOptions = []
for (const tag of modelos) {
    modelosOptions.push({ value: tag, label: tag })
}
const complementosOptions = []
for (const tag of complementos) {
    complementosOptions.push({ value: tag, label: tag })
}
const imageTypeRegex = /image\/(png|jpg|jpeg|gif)/gm;
const { ES, AR, MX } = areas
const APP_URL = process.env.NEXT_PUBLIC_APP_URL

const Option = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <div className='checkbox-label'>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                    />{" "}
                    <label>{props.label}</label>
                </div>
            </components.Option>
        </div>
    )
}

export default withContext(function NewAd({ context: { country_code }, setView, tokenFromApi, userId, setAds, setCount, setAdsSuccess }) {
    const [error, setError] = useState({
        images: null,
        bottom: null
    })
    const [stateCountry, setStateCountry] = useState(country_code)
    const [stateCategories, setStateCategories] = useState(null)
    const [stateTags, setStateTags] = useState([])
    const [titleRemaining, setTitleRemaining] = useState(30)
    const [remaining, setRemaining] = useState(500)
    const [imageFiles, setImageFiles] = useState([])
    const [images, setImages] = useState([])
    const imagesRef = useRef(null)
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
            Promise.all(promises)
                .then(images => {
                    if (!isCancel) {
                        setImages(images)
                    }
                })
                .catch(reason => {
                    setError({ ...error, images: 'Algo salió mal' }) // REVISAR!!
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
        if (error.images) setError({ ...error, images: null })

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

        try {
            const ads = await newUserAd(tokenFromApi, userId, form, stateCountry, stateTags)
            setAds(ads.data)
            setCount(ads.data.length)
            setView('mainpannel')
            setAdsSuccess('Nuevo anuncio guardado correctamente')
            form.reset()
        } catch (error) {
            if (error.response && error.response.data)
                errorHandler(error.response.data.error, setError)

            else
                errorHandler(error.message, setError)

        }
    }

    return <> <div className={styles.topButtonContainer}><button className={styles.topBackButton} onClick={() => setView('mainpannel')}>VOLVER</button></div>
        <form className={styles.form} encType="multipart/form-data" onSubmit={async (event) => {
            event.preventDefault()

            handleFormSubmit(event)
        }}>
            <h3>NUEVO ANUNCiO:</h3>
            <p>Campos obligatorios <span style={{ color: 'red' }}>*</span></p>

            <div className={styles.countryContainer}>
                <label
                    htmlFor="country"
                    className={styles.countryLabel}>
                    PAÍS:*
                </label>
                <select
                    className={styles.countrySelect}
                    name="country"
                    id="country"
                    value={stateCountry}
                    onChange={e => setStateCountry(e.target.value)}
                >
                    <option value='ES'>España</option>
                    <option value='MX'>México</option>
                    <option value='AR'>Argentina</option>
                </select>
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
                    onChange={event => {
                        const title = event.target.value

                        handleTitleChange(title)
                    }}
                />
                <div className={styles.formText}>{titleRemaining}</div>
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
                    {stateCountry === 'MX' || stateCountry === 'US' ? 'ESTADO:' : 'PROVINCIA:'}<span style={{ color: 'red' }}>*</span>
                </label>
                <select
                    className={styles.provinceSelect}
                    name="province"
                    id="province"
                >
                    <option value='all'>Selecciona un{stateCountry === 'MX' || stateCountry === 'US' ? ' estado' : 'a provincia'}</option>
                    {stateCountry === 'AR' && <>
                        {AR.map(place => <option key={place} value={place === 'Todas' ? 'all' : place}>{place}</option>)}
                    </>
                    }
                    {stateCountry === 'ES' && <>
                        {ES.map(place => <option key={place} value={place === 'Todas' ? 'all' : place}>{place}</option>)}
                    </>
                    }
                    {stateCountry === 'MX' && <>
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
                <div className={styles.formText}>Puedes opcionalmente especificar tu ubicación</div>
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
                <div className={styles.formText}>Se hará público para que te contacten si lo introduces</div>
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
                    <option value='all'>Selecciona una categoría</option>
                    <option value='soldmodels'>Vendo modelos</option>
                    <option value='soldaccessories'>Vendo complementos</option>
                    <option value='searchedmodels'>Busco modelos</option>
                    <option value='searchedaccessories'>Busco complementos</option>
                </select>
            </div>

            <div className={styles.priceContainer}>
                <label htmlFor='price' className={styles.priceLabel}>{stateCategories === 'searchedmodels' || stateCategories === 'searchedaccessories' ? 'PRECIO OFRECIDO:*' : 'PRECIO:*'}</label>
                <div className={styles.negotiableDiv}>
                    <input
                        type='checkbox'
                        name='negotiable'
                        id='negotiable'
                        className={styles.negotiableInput}
                    />
                    <label htmlFor='negotiable' className={styles.negotiableLabel}>¿Negociable?</label>
                </div>
                <input
                    type='number'
                    className={styles.priceInput}
                    name='price'
                    id='price'
                    maxLength={4}
                    required={true}
                />
                <div className={styles.formText}>Sólo números</div>
            </div>

            {(stateCategories === 'soldmodels' || stateCategories === 'searchedmodels') && <>
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
                        placeholder='Selecciona o busca etiquetas'
                        noOptionsMessage={() => <span>No encontrado</span>}
                        loadingMessage={() => <span>Cargando opciones</span>}
                        // blurInputOnSelect={true}
                        isSearchable={true}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                    />
                </div>
            </>
            }
            {(stateCategories === 'soldaccessories' || stateCategories === 'searchedaccessories') &&
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
                        placeholder={'Selecciona o busca etiquetas'}
                        noOptionsMessage={() => <span>No encontrado</span>}
                        loadingMessage={() => <span>Cargando opciones</span>}
                        // blurInputOnSelect={true}
                        isSearchable={true}
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
                <div className={styles.formText}>Máximo 4 imágenes. Se recomienda subirlas en formato vertical</div>
                {error.images && <p className={styles.error}>{error.images}</p>}
            </div>

            <div className={styles.checkboxContainer}>
                <input type="checkbox" id="accept" name="accept" className={styles.checkboxInput} value="accept" required={true} />
                <label className={styles.checkboxLabel} htmlFor="accept">
                    Acepto las <Link
                    href={`${APP_URL}/terms-and-conditions`}
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.termsLink}>Condiciones de Servicio</Link></label>
            </div>
            {error.bottom && <p ref={errorBottomRef} className={styles.error}>{error.bottom}</p>}
            <div className={styles.buttonContainer}>
                <button type='button' className={styles.cancelButton} onClick={() => setView('mainpannel')}>CANCELAR</button>
                <button type='submit' className={styles.submitButton}>GUARDAR</button>
            </div>
        </form>
    </>;
})