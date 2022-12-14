import styles from './terms-and-conditions.module.css'
import { getCookie } from 'cookies-next'
import Link from 'next/link'
import { animateScroll as scroll } from 'react-scroll'
import { useEffect } from 'react'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export default function TermsAndConditions({ country }) {
    useEffect(() => {
        scroll.scrollToTop()
    }, [])

    return <>
        <div className={styles.container}>
            <h4 className={styles.title}>Términos y Condiciones de uso:</h4>

            <div className={styles.blockContainer}>
                <h5 className={styles.subtitle}>OBJETIVO DEL SITIO</h5>
                <p>Esta aplicación web gratuita de código abierto está construida para facilitar el contacto a coleccionistas o personas que busquen un artículo de segunda mano relacionado con el mundo Barbie™ con
                    otras personas o coleccionistas que ofrezcan estos artículos, y viceversa.
                </p>
                <p>El código de la aplicación se puede encontrar siguiendo el siguiente <Link
                    href='https://github.com/manuel-villalvilla/busco-barbie'
                    passHref
                    className={styles.link}
                    target='_blank'
                    rel='noopener noreferrer'>enlace</Link> a GitHub.</p>
                <p>Si te gusta el proyecto y deseas colaborar económicamente para que siga creciendo, puedes hacer un donativo a través de PayPal siguiendo el siguiente
                    enlace:
                </p>
                <form action="https://www.paypal.com/donate" method="post" target="_top">
                    <input type="hidden" name="business" value="NFAEE7N7D5LLE" />
                    <input type="hidden" name="no_recurring" value="0" />
                    <input type="hidden" name="item_name" value="Si te gusta el proyecto BuscoBarbie.com y deseas contribuir a su mejora, cualquier donativo es bienvenido." />
                    <input type="hidden" name="currency_code" value="EUR" />
                    <input type="image" className={styles.paypalImage} src="https://www.paypalobjects.com/es_ES/ES/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Botón Donar con PayPal" />
                    <img alt="" border="0" src="https://www.paypal.com/es_ES/i/scr/pixel.gif" width="1" height="1" />
                </form>
            </div>

            <div className={styles.blockContainer}>
                <h5 className={styles.subtitle}>COOKIES</h5>
                <p>Esta aplicación web usa cookies para mejorar tu experiencia de navegación.</p>
                <p>La primera cookie que guardamos es la de tu
                    país de procedencia. Se detectará automáticamente si accedes a la aplicación desde cualquiera de los siguientes países:
                    España, México o Argentina. Si accedes desde otro país, se te redireccionará a la sección española de <span>BuscoBarbie.com</span>.
                </p>
                <p>También almacenaremos cookies relativas al inicio de sesión para facilitarte el acceso a tu panel de control. Se guardarán
                    cookies de terceros si eliges iniciar sesión con otros proveedores.
                </p>
                <p>Se guardará también una cookie relativa al Recaptcha V2 de <span>Google</span>.</p>
                <p>En el momento en que selecciones uno o varios anuncios como favoritos, se guardará una cookie que los contenga.</p>
            </div>

            <div className={styles.blockContainer}>
                <h5 className={styles.subtitle}>USO DEL SITIO</h5>
                <p>Encuentra anuncios filtrados utilizando el buscador proporcionado.</p>
                <p>Tienes la opción de copiar el enlace con los resultados de búsqueda en tu portapapeles para compartirlo.</p>
                <p>Para contactar con un anunciante, accede a su anuncio y en la parte inferior del mismo encontrarás un botón llamado Contactar.
                    Si lo pulsas, se abrirá un formulario de contacto, así como también se proporcionará el número de teléfono del anunciante si optó por registrarlo.
                </p>
                <p>Si crees que un anuncio no cumple con nuestras condiciones, puedes reportarlo accediendo al formulario que encontrarás a pie de página de cada anuncio.</p>
                <p>Tienes la opción de publicar <span>gratuitamente</span> en el sitio web de dos formas:</p>
                <ol>
                    <li><p>Si no dispones de una cuenta en <span>BuscoBarbie.com</span> ni en <span>Google</span>, publica tu primer anuncio accediendo al formulario
                        a través del botón <Link href={`${APP_URL}/${country}/publicar`} className={styles.link}>publicar</Link>. Deberás verificar tu usuario siguiendo
                        el enlace que te enviaremos por email en el momento del registro. Una vez verificado el usuario y con acceso a su panel de control, podrá editar, borrar y crear hasta un máximo de 10 anuncios.</p></li>

                    <li><p>Si ya tienes una cuenta en <span>BuscoBarbie.com</span> o en <span>Google</span>, puedes publicar hasta un máximo de 10 anuncios accediendo
                        previamente a tu panel de control a través del botón <Link href={`${APP_URL}/login`} className={styles.link}>iniciar sesión</Link>.</p></li>
                </ol>
                <p>Una vez registrado el anuncio en nuestra base de datos, no se hará público hasta que no pase por el filtro de <span>verificación</span>, en el que se comprobará que cumple
                    con las condiciones expuestas a continuación. El proceso de verificación no debería durar más de unas pocas horas.
                </p>
                <p>Una vez iniciada la sesión y con acceso al panel de control, se podrán editar, borrar y crear nuevos anuncios (máximo 10), así como modificar tu nombre público y tu contraseña
                    si no iniciaste sesión con <span>Google</span>. También se da la opción de borrar la cuenta en su totalidad de forma definitiva. En el menú de edición, si tu anuncio ya es público porque está verificado, se te brinda la opción de modificar su visibilidad
                    haciéndolo público o privado. Ten en cuenta que cada vez que edites o publiques un anuncio, será ocultado hasta que pase de nuevo por el filtro de verificación.
                </p>
                <p>Si pierdes tu contraseña de <span>BuscoBarbie.com</span>, se te da la opción de recuperarla en el panel de <Link href={`${APP_URL}/login`} className={styles.link}>iniciar sesión</Link>.</p>
                <p>Acceso al blog de <Link href={`${APP_URL}/barbiestories`} className={styles.link}>Barbiestories</Link> o pulsando el enlace en la cabecera.</p>
                <p>Puedes guardar anuncios favoritos pulsando en el botón
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" onClick={() => handleFavorite(ad._id)} style={{ cursor: 'pointer' }}><path d="M0 0h24v24H0V0z" fill="none" /><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" fill='red' /></svg>
                    disponible para cada anuncio. Podrás acceder a tus favoritos guardados pulsando en el enlace a pie de página o pulsando <Link href={`${APP_URL}/favorites`} className={styles.link}>aquí</Link>
                </p>
                <p>Si deseas contactar con la administración de <span>BuscoBarbie.com</span>, encontrarás el <Link href={`${APP_URL}/contact`} className={styles.link}>enlace</Link> a pie de página.</p>
                <p>Para acceder a la versión de la plataforma en otro país, sigue los enlaces a pie de página. Ten en cuenta que cada vez que pulses el enlace de un país distinto, se guardará una cookie con dicho país para
                    configurar la aplicación acorde a él.
                </p>
            </div>

            <div className={styles.blockContainer}>
                <h5 className={styles.subtitle}>CONDICIONES DE USO</h5>
                <p>No se validará ningún anuncio que no tenga que ver con la temática Barbie™.</p>
                <p>Sólo se validarán los anuncios que cumplan con las siguientes condiciones:</p>
                <ol>
                    <li><p>Título de no más de 30 caracteres obligatorio.</p></li>
                    <li><p>Descripción del artículo obligatoria. Máximo 500 caracteres. No se aceptarán enlaces a sitios webs de terceros.</p></li>
                    <li><p>Selección obligatoria {country !== 'MX' ? 'de la provincia' : 'del estado'} donde se encuentra el anunciante.</p></li>
                    <li><p>Introduce opcionalmente tu zona o área para especificar tu ubicación. Se hará pública.</p></li>
                    <li><p>Introduce opcionalmente tu número de teléfono. Se hará público.</p></li>
                    <li><p>Precio del artículo obligatorio. Sólo números. Precio opcionalmente negociable.</p></li>
                    <li><p>Selección obligatoria de la categoría del artículo.</p></li>
                    <li><p>Selección opcional de la década de construcción del artículo.</p></li>
                    <li><p>Selección opcional pero recomendada de las etiquetas que clasifiquen el artículo con más precisión.</p></li>
                    <li><p>Selección opcional de un máximo de 4 imágenes. Sus formatos pueden ser JPG, JPEG, PNG o GIF. Tamaño máximo de 6MB por imágen.
                        Pueden tomarse las fotos en el momento si se accede al formulario desde un dispositivo móvil con cámara. Sólo se permitirán fotos de los artículos Barbie™ anunciados.
                    </p></li>
                    <li><p>Nombre de usuario obligatorio. Se hará público. Máximo 20 caracteres.</p></li>
                    <li><p>Email de registro obligatorio y válido. Por motivos de seguridad, nunca se hará público.
                        Se utilizará para: </p>
                        <ol>
                            <li><p>Verificar al usuario enviando un email con un enlace de verificación en el momento del registro.</p></li>
                            <li><p>Para ser contactado por las personas interesadas en el artículo.</p></li>
                            <li><p>Para ser enviadas comunicaciones de <span>BuscoBarbie.com</span> relativas a la validación positiva o negativa del anuncio registrado.</p></li>
                        </ol>
                        <p>Al ser contactado por un usuario interesado en tu artículo, se recibirá un email con el nombre, dirección de email y mensaje del mismo. Los emails de contacto se recibirán siempre desde un dominio de <span>BuscoBarbie.com</span>.</p></li>
                    <li><p>Contraseña obligatoria de entre 8 y 20 caracteres, incluidos !@#$%^&*. Se guardará encriptada en la base de datos.</p></li>
                </ol>
            </div>

            <div className={styles.blockContainer}>
                <h5 id='privacy' className={styles.subtitle}>TRATAMIENTO DE DATOS Y POLÍTICA DE PRIVACIDAD</h5>
                <p>Aquéllos usuarios que inicien sesión a traves de <span>Google</span> o se registren a través del formulario <Link href={`${APP_URL}/${country}/publicar`} className={styles.link}>publicar</Link>, aceptan ceder
                    sus datos a <span>BuscoBarbie.com</span> para almacenarlos en una base de datos y utilizarlos para dar servicio al usuario con las prestaciones de la aplicación.</p>
                <p>El usuario registrado tiene derecho a reclamar o solicitar la eliminación de sus datos, o bien a través del formulario de <Link href={`${APP_URL}/contact`} className={styles.link}>contacto</Link>, o
                    bien eliminando la cuenta desde el panel de control del usuario.</p>
                <p>Para los usuarios que inicien sesión mediante <span>Google</span>, la aplicación solicitará únicamente el <span>nombre</span> de usuario y la dirección de <span>email</span> del usuario en cuestión para registrarlo en <span>BuscoBarbie.com</span>. Estos datos se solicitarán utilizando la API OAuth 2.0 de Google. 
                Se almacenarán en la base de datos de la aplicación y serán utilizados para:</p>
                <ol>
                    <li><p>En cuanto al <span>nombre</span>, se utilizará para que los usuarios tengan a quien dirigirse cuando se contacten entre ellos. Sólo se hará público el nombre y ningún apellido.</p></li>
                    <li><p>En cuanto al <span>email</span>, se utilizará como identificativo para que el usuario pueda iniciar sesión y acceder a los anuncios de su propiedad. También se usará para que los usuarios sean 
                        contactados por otros usuarios a través de los anuncios de la aplicación y para recibir comunicaciones de BuscoBarbie.com. Nunca se hará público.</p></li>
                </ol>
            </div>

            <div className={styles.blockContainer}>
                <h5 className={styles.subtitle}>PROPIEDAD DEL SITIO</h5>
                <p>Esta aplicación web pertenece a Manuel Villalvilla Cañizares con D.N.I. 49009131-H y residencia en Madrid, España.</p>
            </div>
        </div>
            <button type='button' className={styles.bottomButton} onClick={() => scroll.scrollToTop()}><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7.4 18.4 6 17l6-6 6 6-1.4 1.4-4.6-4.575Zm0-6L6 11l6-6 6 6-1.4 1.4L12 7.825Z"/></svg>Volver arriba<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7.4 18.4 6 17l6-6 6 6-1.4 1.4-4.6-4.575Zm0-6L6 11l6-6 6 6-1.4 1.4L12 7.825Z"/></svg></button></>
    
}

export async function getServerSideProps({ req, res }) {
    const country = getCookie('country', { req, res })

    return { props: { country: country ? country : 'ES' } }
}