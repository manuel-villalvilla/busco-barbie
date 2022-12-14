import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <meta name="description" content="Busca, encuentra, publica... Todo sobre Barbies"></meta>
                <meta name="keywords" content="Buscador, Barbies, Barbie, Market Place, Publicar, Complementos, Modelos, Rubias, Morenas, Pelirrojas, Segunda Mano"></meta>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}