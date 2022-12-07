import { useRouter } from "next/router"
import React, { useRef, useState, useEffect } from "react"
import { areas } from "data"
import styles from './FiltersMenu.module.css'
import { tags, years } from 'data'
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
const APP_URL = process.env.NEXT_PUBLIC_APP_URL

const forbiddenChars = '<,>,{,},[,],/,^'
const forbiddenArray = forbiddenChars.split(',')

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
const { ES, AR, MX } = areas

const selectStyle = {
  container: base => {
    return {
      ...base,
      width: '100%'
    }
  },
  control: base => {
    return {
      ...base,
      boxShadow: 'none',
      backgroundColor: 'rgba(0,0,0,.5)',
      borderRadius: '10px',
      minHeight: '50px',
      border: '2px solid rgb(133,133,133)',
      borderRadius: '10px 100px / 120px',
      "&:hover": {
        border: '2px solid rgb(133,133,133)',
        boxShadow: 'none',
        cursor: 'pointer'
      },
    }
  },
  option: (base, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...base,
      backgroundColor: isFocused ? 'black' : 'rgba(0,0,0,.5)',
      color: 'white',
      fontSize: '18px'
    }
  },
  menu: base => {
    return {
      ...base,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
  },
  multiValue: base => {
    return {
      ...base,
      fontSize: '18px',
      backgroundColor: 'black',
      border: '1px solid rgb(133,133,133)',
      borderRadius: '10px'
    }
  },
  multiValueLabel: base => {
    return {
      ...base,
      color: '#fff',
    }
  },
  multiValueRemove: base => {
    return {
      ...base,
      fontSize: '18px',
      backgroundColor: 'transparent',
      color: 'red',
      "&:hover": {
        backgroundColor: 'transparent',
        cursor: 'pointer'
      }
    }
  },
  input: base => {
    return {
      ...base,
      color: 'white',
      height: '35px',
      display: 'flex',
      alignItems: 'center'
    }
  },
  placeholder: base => {
    return {
      ...base,
      color: '#fff',
      fontSize: '20px',
      textAlign: 'center'
    }
  },
  // indicatorSeparator: state => ({
  //   display: 'none',
  // }),
  // indicatorsContainer: (provided, state) => ({
  //   ...provided,
  //   minHeight: '50px'
  // }),
  valueContainer: (provided, state) => ({
    ...provided,
    minHeight: '50px',
    padding: '5px',
  }),
}

export default function FiltersMenu({ country, province, search, categories, year, tags, sort }) {
  const [timeoutId, setTimeoutId] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [stateFormValues, setStateFormValues] = useState({
    province,
    categories,
    search,
    year,
    tags,
    sort
  })
  const cancelFirst1 = useRef(true)
  const cancelFirst2 = useRef(true)
  const formRef = useRef(null)
  const searchRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (!cancelFirst1.current) {
      if (formRef.current.search.value !== search)
        formRef.current.search.value = search
      setStateFormValues({ ...stateFormValues, search })
    }
    return () => cancelFirst1.current = false
  }, [search])

  useEffect(() => {
    if (!cancelFirst2.current) {
      setStateFormValues({
        ...stateFormValues,
        province,
        categories,
        year,
        tags,
        sort
      })
    }
    return () => cancelFirst2.current = false
  }, [province, categories, year, tags, sort])

  const queryConstructor = (params) => {
    const year = () => {
      if (params.year === 'Todas') return false
      else if (params.year !== 'Todas' && params.year !== null) return true
      else return false
    }
    return new (function () {
      if (params.province && params.province !== 'all') this.province = params.province
      if (params.categories && params.categories !== 'all') this.categories = params.categories
      if (params.search) this.search = params.search
      if (year()) this.year = params.year
      if (params.tags && params.tags.length) {
        const arr = []
        for (const tag of params.tags) arr.push(tag.value)
        this.tags = arr.toString()
      }
      if (params.sort && params.sort !== 'lastPublished') this.sort = params.sort
    });
  }

  const handleFormOnChange = (query) => {
    router.push({
      pathname: `/${country}`,
      query
    }, undefined, { scroll: false })
  }

  const handleClearInputs = () => {
    handleFormOnChange(queryConstructor({
      province: 'all',
      categories: 'all',
      search: null,
      year: null,
      tags: null,
      sort: null
    }))
  }

  const handleSearchChange = e => {
    if (timeoutId)
      clearTimeout(timeoutId)

    const text = e.target.value
    for (const char of text) {
      if (forbiddenArray.includes(char)) return
    }

    const id = setTimeout(() => {
      setStateFormValues({ ...stateFormValues, search: text })
      handleFormOnChange(queryConstructor({ ...stateFormValues, search: text }))
    }, 500)

    setTimeoutId(id)
  }

  return <form
    className={styles.form}
    ref={formRef}
    onSubmit={event => {
      event.preventDefault()
    }}
  >
    <select
      className={styles.sortSelect}
      name='country'
      id='country'
      value={country ? country : 'ES'}
      onChange={e => {
        router.push(`${APP_URL}/${e.target.value}`)
      }}
    >
      <option value='ES'>España</option>
      <option value='MX'>México</option>
      <option value='AR'>Argentina</option>
    </select>

    <select
      className={styles.provinceSelect}
      name="province"
      id="provinceFilter"
      value={stateFormValues.province ? stateFormValues.province : 'all'}
      onChange={e => {
        setStateFormValues({ ...stateFormValues, province: e.target.value })
        handleFormOnChange(queryConstructor({ ...stateFormValues, province: e.target.value }))
      }}
    >
      <option value='all'>{country !== "MX" ? 'Provincia' : 'Estado'}</option>
      {country === 'AR' && <>
        {AR.map(place => <option key={place} value={place}>{place}</option>)}
      </>
      }
      {country === 'ES' && <>
        {ES.map(place => <option key={place} value={place}>{place}</option>)}
      </>
      }
      {country === 'MX' && <>
        {MX.map(place => <option key={place} value={place}>{place}</option>)}
      </>
      }
    </select>

    <select
      className={styles.sortSelect}
      name='sort'
      id="sortFilter"
      value={stateFormValues.sort ? stateFormValues.sort : 'lastPublished'}
      onChange={e => {
        setStateFormValues({
          ...stateFormValues,
          sort: e.target.value
        })
        handleFormOnChange(queryConstructor({
          ...stateFormValues,
          sort: e.target.value
        }))
      }}
    >
      <option value='lastPublished'>Los más recientes</option>
      <option value='firstPublished'>Los más antiguos</option>
      <option value='priceDes'>Precio descendente</option>
      <option value='priceAsc'>Precio ascendente</option>
    </select>

    <div className={styles.categoriesContainer}>
      <select
        className={styles.categoriesSelect}
        name='categories'
        id="categoriesFilter"
        value={stateFormValues.categories ? stateFormValues.categories : 'all'}
        onChange={e => {
          setStateFormValues({
            province: stateFormValues.province,
            categories: e.target.value,
            search: null,
            year: null,
            tags: null,
            sort: stateFormValues.sort
          })
          handleFormOnChange(queryConstructor({
            province: stateFormValues.province,
            categories: e.target.value,
            search: null,
            year: null,
            tags: null,
            sort: stateFormValues.sort
          }))
        }}
      >
        <option value='all'>Categorías</option>
        <option value='soldmodels'>Modelos en venta</option>
        <option value='soldaccessories'>Complementos en venta</option>
        <option value='searchedmodels'>Modelos en búsqueda</option>
        <option value='searchedaccessories'>Complementos en búsqueda</option>
      </select>
      {categories === null && <p>Selecciona una <span>categoría</span> para ver los filtros avanzados</p>}
    </div>

    <input
      placeholder={isSearching ? '' : "Escribe tu búsqueda"}
      className={styles.searchTextInput}
      type='text'
      ref={searchRef}
      maxLength={30}
      name='search'
      id="searchFilter"
      defaultValue={search ? search : ''}
      onBlur={() => setIsSearching(false)}
      onFocus={() => setIsSearching(true)}
      onChange={e => handleSearchChange(e)}
    />
    {/* {stateFormValues.search && <button type='button' className={styles.deleteSearchButton} onClick={() => {
        setStateFormValues({ ...stateFormValues, search: '' })
        handleFormOnChange(queryConstructor({ ...stateFormValues, search: '' }))
      }}>X</button>} */}

    {(categories === 'soldmodels' || categories === 'searchedmodels') && <>

      <select
        className={styles.yearSelect}
        name='year' id='year'
        value={stateFormValues.year ? stateFormValues.year : 'Todas'}
        onChange={e => {
          setStateFormValues({ ...stateFormValues, year: e.target.value })
          handleFormOnChange(queryConstructor({ ...stateFormValues, year: e.target.value }))
        }}
      >
        {years.map((year, index) => <option key={index} value={year}>{year === 'Todas' ? 'Década' : year}</option>)}
      </select>



      <Select
        menuPlacement="auto"
        options={modelosOptions}
        isMulti
        name='modelosTags'
        value={stateFormValues.tags}
        components={{
          Option
        }}
        onChange={selected => {
          setStateFormValues({ ...stateFormValues, tags: selected })
          handleFormOnChange(queryConstructor({ ...stateFormValues, tags: selected }))
        }}
        instanceId='modelos-select'
        placeholder='Selecciona o busca etiquetas'
        noOptionsMessage={() => <span>No encontrado</span>}
        loadingMessage={() => <span>Cargando opciones</span>}
        // blurInputOnSelect={true}
        isSearchable={true}
        styles={selectStyle}
      />

    </>
    }

    {(categories === 'soldaccessories' || categories === 'searchedaccessories') &&

      <Select
        menuPlacement="auto"
        options={complementosOptions}
        isMulti
        name='complementosTags'
        value={stateFormValues.tags}
        components={{
          Option
        }}
        onChange={selected => {
          setStateFormValues({ ...stateFormValues, tags: selected })
          handleFormOnChange(queryConstructor({ ...stateFormValues, tags: selected }))
        }}
        instanceId='complementos-select'
        placeholder={'Selecciona o busca etiquetas'}
        noOptionsMessage={() => <span>No encontrado</span>}
        loadingMessage={() => <span>Cargando opciones</span>}
        // blurInputOnSelect={true}
        isSearchable={true}
        styles={selectStyle}
      />

    }
    <button type='button' className={styles.clearBtn} onClick={handleClearInputs}><svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M22.55 41.9q-6.15-.5-10.35-5.05Q8 32.3 8 26.05q0-3.85 1.775-7.25t4.975-5.55l2.15 2.15q-2.8 1.65-4.35 4.525Q11 22.8 11 26.05q0 5 3.3 8.65 3.3 3.65 8.25 4.2Zm3 0v-3q5-.6 8.25-4.225 3.25-3.625 3.25-8.625 0-5.45-3.775-9.225Q29.5 13.05 24.05 13.05h-1l3 3-2.15 2.15-6.65-6.65L23.9 4.9l2.15 2.15-3 3h1q6.7 0 11.35 4.675 4.65 4.675 4.65 11.325 0 6.25-4.175 10.8Q31.7 41.4 25.55 41.9Z" /></svg></button>
  </form>

}