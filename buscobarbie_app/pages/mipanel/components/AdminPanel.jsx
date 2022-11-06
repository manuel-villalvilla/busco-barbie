import { useState, useEffect } from "react"
import retrieveAdminData from '../../../logic/retrieveAdminData'
import styles from './AdminPanel.module.css'
import AdminAds from "./AdminAds"
import AdminUsers from "./AdminUsers"
import AdminBlog from "./AdminBlog"

export default function AdminPanel({ token }) {
    const [data, setData] = useState({})
    const [view, setView] = useState('main')

    useEffect(() => {
        let id
        if (token.role === 'admin') {
            async function fetchData() {
                try {
                    const res = await retrieveAdminData(token.tokenFromApi)
                    setData(res.data.pack)
                } catch (error) {
                    console.log(error)
                }
            }
            fetchData()
            id = setInterval(() => fetchData(), 10000)
        }
        return () => clearInterval(id)
    }, [])

    return <>
        {
            view === 'main' &&
            <div className={styles.container}>
                <h4>HOLA ADMIN</h4>
                <p className={styles.title}>Tienes {data.uAdsCount} anuncios y {data.uUsersCount} usuarios sin verificar</p>
                <p>Modo construcción {construction ? 'activado' : 'desactivado'}</p>
                <div className={styles.buttonsContainer}>
                    <button type='button' className={styles.button} onClick={() => setView('ads')}>ANUNCIOS</button>
                    <button type='button' className={styles.button} onClick={() => setView('users')}>USUARIOS</button>
                    <button type='button' className={styles.button} onClick={() => setView('blog')}>BLOG</button>
                </div>
            </div>
        }

        {
            view === 'ads' && <AdminAds ads={data.uAds} setView={setView} token={token} setData={setData} />
        }
        {
            view === 'users' && <AdminUsers users={data.uUsers} setView={setView} />
        }
        {
            view === 'blog' && <AdminBlog setView={setView} />
        }
    </>
}