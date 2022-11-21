import { useEffect, useState } from "react"
import withContext from "../../utils/withContext"
import { getToken } from 'next-auth/jwt'
import retrieveUserWithAds from "../../logic/retrieveUserWithAds"
import styles from './index.module.css'
import MainPanel from './components/MainPanel'
import AdminPanel from "./components/AdminPanel"

function MiPanel({ context: { setSearchHeight }, pack, token }) {
    const [ads, setAds] = useState(pack.ads ? pack.ads : [])
    const [user, setUser] = useState(pack.user ? pack.user : {})
    const [count, setCount] = useState(pack.ads ? pack.ads.length : 0)

    useEffect(() => setSearchHeight(0), [])
    
    return <>
        {
            token.role !== 'admin' ?
                <div className={styles.mainPanel}>
                    <MainPanel user={user} ads={ads} setUser={setUser} setAds={setAds} token={token} count={count} setCount={setCount} />
                </div>
                :
                <AdminPanel token={token}/>
        }
    </>
}

export async function getServerSideProps({ req, res }) {
    const secret = process.env.NEXTAUTH_SECRET
    const token = await getToken({ req, secret })

    if (!token) {
        // TODO check that is not expired
        res.writeHead(307, { Location: '/login' })
        res.end()
        return { props: {} }
    } else if (token.role !== 'admin') {
        const pack = await retrieveUserWithAds(token.tokenFromApi)

        return { props: { pack, token } }
    } else
        return { props: { pack: {}, token } }
}

export default withContext(MiPanel)