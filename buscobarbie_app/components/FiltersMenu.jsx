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
    return new function () {
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
    }
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

  return (
    <div className={styles.pannel}>
      <form
        className={styles.form}
        ref={formRef}
        onSubmit={event => {
          event.preventDefault()
        }}
      >
        <div className={styles.clearBtnCont}>
          <button type='button' className={styles.clearBtn} onClick={handleClearInputs}>Reiniciar filtros</button>
        </div>
        <div className={styles.sortContainer}>
          <label htmlFor="sortFilter" className={styles.label}>Ordenar resultados por:</label>
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
            <option value='lastPublished'>Más recientes</option>
            <option value='firstPublished'>Más antiguos</option>
            <option value='priceDes'>Precio descendente</option>
            <option value='priceAsc'>Precio ascendente</option>
          </select>
        </div>

        <div className={styles.provinceContainer}>
          <label
            htmlFor="provinceFilter"
            className={styles.label}>
            {country === 'MX' ? 'Estado:' : 'Provincia:'}
          </label>
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
            <option value='all'>Todas</option>
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
        </div>

        <div className={styles.searchContainer}>
          <label htmlFor="searchFilter" className={styles.searchLabel}>Búsqueda por palabras:</label>
          <input
            placeholder={isSearching ? '' : "Introduce tu búsqueda"}
            className={styles.searchTextInput}
            type='text'
            ref={searchRef}
            maxLength={30}
            name='search'
            id="searchFilter"
            defaultValue={search ? search : ''}
            onBlur={() => setIsSearching(false)}
            onFocus={() => setIsSearching(true)}
            onChange={e => {
              if (timeoutId)
                clearTimeout(timeoutId)

              const id = setTimeout(() => {
                setStateFormValues({ ...stateFormValues, search: e.target.value })
                handleFormOnChange(queryConstructor({ ...stateFormValues, search: e.target.value }))
              }, 500)

              setTimeoutId(id)
            }}
          />
          {stateFormValues.search && <button type='button' className={styles.deleteSearchButton} onClick={() => {
            setStateFormValues({ ...stateFormValues, search: '' })
            handleFormOnChange(queryConstructor({ ...stateFormValues, search: '' }))
          }}>X</button>}
        </div>

        <div className={styles.categoriesContainer}>
          <label htmlFor="categoriesFilter" className={styles.label}>Categorías:</label>
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
            <option value='all'>Todas</option>
            <option value='soldmodels'>Modelos en venta</option>
            <option value='soldaccessories'>Complementos en venta</option>
            <option value='searchedmodels'>Modelos en búsqueda</option>
            <option value='searchedaccessories'>Complementos en búsqueda</option>
          </select>
        </div>

        {categories === null && <p>Selecciona una <span>categoría</span> para ver los filtros avanzados</p>}

        {(categories === 'soldmodels' || categories === 'searchedmodels') && <>
          <div className={styles.yearsContainer}>
            <label htmlFor='year' className={styles.label}>Década</label>
            <div className={styles.years}>
              <select
                className={styles.yearSelect}
                name='year' id='year'
                value={stateFormValues.year ? stateFormValues.year : 'Todas'}
                onChange={e => {
                  setStateFormValues({ ...stateFormValues, year: e.target.value })
                  handleFormOnChange(queryConstructor({ ...stateFormValues, year: e.target.value }))
                }}
              >
                {years.map((year, index) => <option key={index} value={year}>{year}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.tagsContainer}>
            <label className={styles.label}>Etiquetas</label>
            <div className={styles.tags}>
              <Select
                className='multiSelect'
                classNamePrefix='reactSelect'
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
                placeholder='Selecciona...'
                noOptionsMessage={() => <span>No encontrado</span>}
                loadingMessage={() => <span>Cargando opciones</span>}
                // blurInputOnSelect={true}
                isSearchable={false}
              />
            </div>
          </div>
        </>
        }
        {(categories === 'soldaccessories' || categories === 'searchedaccessories') &&
          <div className={styles.tagsContainer}>
            <label className={styles.label}>Etiquetas</label>
            <div className={styles.tags}>
              <Select
                className='multiSelect'
                classNamePrefix='reactSelect'
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
                placeholder={'Selecciona...'}
                noOptionsMessage={() => <span>No encontrado</span>}
                loadingMessage={() => <span>Cargando opciones</span>}
                // blurInputOnSelect={true}
                isSearchable={false}
              />
            </div>
          </div>
        }


      </form>
    </div>)
}