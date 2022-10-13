import { useEffect, useState } from "react"
import withContext from "../../utils/withContext"
import { getToken } from 'next-auth/jwt'
import retrieveUserWithAds from "../../logic/retrieveUserWithAds"
import retrieveAdminData from "../../logic/retrieveAdminData"
import styles from './index.module.css'
import MainPanel from './components/MainPanel'

function mipanel({ context: { setSearchHeight }, pack, token }) {
    const [ads, setAds] = useState(pack.ads)
    const [user, setUser] = useState(pack.user)
    const [count, setCount] = useState(pack.ads.length)

    useEffect(() => setSearchHeight(0), [])

    return <div className={styles.mainPanel}>
        {
            token.role !== 'admin' ?
                <MainPanel user={user} ads={ads} setUser={setUser} setAds={setAds} token={token} count={count} setCount={setCount} />
                :
                "hola admin"
        }
    </div>
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
    } else {
        const pack = await retrieveAdminData(token.tokenFromApi)

        return { props: { pack, token } }
    }

}

export default withContext(mipanel)