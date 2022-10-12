import verifyUser from "../logic/verifyUser"
import { useEffect, useState } from 'react'
import Link from 'next/link'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export default function ({ res }) {
    const [view, setView] = useState('ok')

    useEffect(() => {
        if (res === 'notOk') setView('error')
        else if (res === 'ok') setView('ok')
        else if (res === 'alreadyVerified') setView('alreadyVerified')
    }, [])

    return <div className="verify-container">
        {
            view === 'ok' && <h3>Tu usuario ha sido verificado correctamente, ya puedes iniciar sesión</h3>
        }
        {
            view === 'alreadyVerified' && <h3>Usuario ya verificado</h3>
        }
        {
            view === 'error' && <>
                <h3>Hubo un error verificando tu usuario</h3><p>Por favor, inténtalo de nuevo con el enlace que te hemos 
                    enviado por email. Si sigues recibiendo este error, ponte en <Link href={`${APP_URL}/contact`}><a>contacto</a></Link> con nostros.
                </p>
            </>
        }
    </div>
}

export async function getServerSideProps(context) {
    const { query: { id, token } } = context

    if (!id || !token)
        return { props: { res: 'notOk' } }

    const res = await verifyUser(id, token)

    return { props: { res } }
}