import styles from './NewAd.module.css'
import Link from 'next/link'
import withContext from '../../../utils/withContext'
import { useEffect, useRef, useState } from 'react'
import { areas, tags, years } from "data"
import newUserAd from '../../../logic/newUserAd'
import Select from 'react-select'
import { components } from 'react-select'
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

export default withContext(function ({ context: { setSearchHeight, country_code }, setView, tokenFromApi, userId, setAds, setCount }) {
    const [error, setError] = useState({
        title: null,
        body: null,
        province: null,
        area: null,
        phone: null,
        price: null,
        categories: null,
        images: null,
        name: null,
        email: null,
        password: null,
        google: null
    })
    const [stateCategories, setStateCategories] = useState(null)
    const [stateTags, setStateTags] = useState([])
    const [titleRemaining, setTitleRemaining] = useState(30)
    const [remaining, setRemaining] = useState(500)
    const [imageFiles, setImageFiles] = useState([])
    const [images, setImages] = useState([])
    const [success, setSuccess] = useState(null)
    const imagesRef = useRef(null)

    useEffect(() => setSearchHeight(0), [])

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

    const handleFormSubmit = event => {
        const form = event.target

        try {
            newUserAd(tokenFromApi, userId, form, country_code, stateTags)
                .then(ads => {
                    setAds(ads.data)
                    setCount(ads.data.length)
                    setSuccess('Nuevo anuncio guardado correctamente')
                    form.reset()
                })
                .catch(error => {
                    console.log(error)
                })
        } catch (error) {
            // setear errores dependiendo del mensaje
            console.log(error)
        }
    }

    return <> <div className={styles.backButtonContainer}><button className={styles.topBackButton} onClick={() => setView('mainpannel')}>Cancelar</button></div>
        <form className={styles.form} encType="multipart/form-data" onSubmit={async (event) => {
            event.preventDefault()

            handleFormSubmit(event)
        }}>
            <h3>NUEVO ANUNCIO EN <span>{
                country_code === 'AR' ? 'ARGENTINA' :
                    country_code === 'MX' ? 'MÉXICO' :
                        country_code === 'ES' ? 'ESPAÑA' :
                            country_code === 'US' ? 'EE.UU.' : null
            }</span></h3>
            <p>Campos obligatorios <span style={{ color: 'red' }}>*</span></p>

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
                {error.title && <p className={styles.error}>{error.title}</p>}
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
                {error.body && <p className={styles.error}>{error.body}</p>}
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
                {error.province && <p className={styles.error}>{error.province}</p>}
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
                {error.area && <p className={styles.error}>{error.area}</p>}
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
                {error.phone && <p className={styles.error}>{error.phone}</p>}
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
                <div className={styles.formText}>Sólo números</div>
                {error.price && <p className={styles.error}>{error.price}</p>}
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
                    <option value='all'>Todas</option>
                    <option value='modelos'>Modelos</option>
                    <option value='complementos'>Complementos</option>
                </select>
                {error.categories && <p className={styles.error}>{error.categories}</p>}
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
                    Acepto las <Link href={`${APP_URL}/terms-and-conditions`} passHref><a target="_blank" rel="noopener noreferrer" className={styles.termsLink}>Condiciones de Servicio</a></Link></label>
            </div>
            {success && <p className={styles.success}>{success}</p>}
            <div className={styles.buttonContainer}>
                <button type='button' className={styles.cancelButton} onClick={() => setView('mainpannel')}>CANCELAR</button>
                <button type='submit' className={styles.submitButton}>GUARDAR</button>
            </div>
        </form>
    </>
})