import { getCookie } from 'cookies-next'

function Index() {
    return <div></div>
}

export async function getServerSideProps({ req, res }) {
    const country = getCookie('country', { req, res })

    res.writeHead(307, { Location: country ? country : 'ES' })
    res.end()
    
    return { props: {} }
}

export default Index