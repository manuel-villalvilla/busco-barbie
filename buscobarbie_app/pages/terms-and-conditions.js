import styles from './terms-and-conditions.module.css'
import { getCookie } from 'cookies-next'
import Link from 'next/link'
import { animateScroll as scroll } from 'react-scroll'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export default function ({ country }) {
    return <div className={styles.container}>
        <h4 className={styles.title}>Términos y Condiciones de uso:</h4>
        <div className={styles.blockContainer}>
            <h5 className={styles.subtitle}>OBJETIVO DEL SITIO</h5>
            <p>Esta aplicación web está construida para facilitar el contacto a personas que busquen un artículo de segunda mano relacionado con el mundo Barbie™ con 
                personas que publiquen artículos de segunda mano cuya temática sea el mundo Barbie™.
            </p>
            <p></p>
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
        </div>
        <div className={styles.blockContainer}>
            <h5 className={styles.subtitle}>USO DEL SITIO</h5>
            <p>Encuentra anuncios filtrados utilizando el buscador proporcionado.</p>
            <p>Para contactar con un anunciante, accede a su anuncio y en la parte inferior del mismo encontrarás un botón llamado Contactar. 
                Si lo pulsas, se abrirá un formulario de contacto, así como también se proporcionará el número de teléfono del anunciante si optó por registrarlo.
            </p>
            <p>Tienes la opción de publicar <span>gratuitamente</span> en el sitio web de dos formas:</p>
            <ol>
                <li><p>Si no dispones de una cuenta en <span>BuscoBarbie.com</span> ni en <span>Google</span>, publica tu primer anuncio accediendo al formulario
                a través del botón <Link href={`${APP_URL}/${country}/publicar`}><a className={styles.link}>publicar</a></Link>. Deberás verificar tu usuario siguiendo 
                el enlace que te enviaremos por email en el momento del registro. Una vez verificado el usuario y con acceso a su panel de control, podrá editar, borrar y crear hasta un máximo de 10 anuncios.</p></li>

                <li><p>Si ya tienes una cuenta en <span>BuscoBarbie.com</span> o en <span>Google</span>, puedes publicar hasta un máximo de 10 anuncios accediendo 
                previamente a tu panel de control a través del botón <Link href={`${APP_URL}/login`}><a className={styles.link}>iniciar sesión</a></Link>.</p></li>
            </ol>
            <p>Una vez registrado el anuncio en nuestra base de datos, no se hará público hasta que no pase por el filtro de <span>verificación</span>, en el que se comprobará que cumple 
                con las condiciones expuestas a continuación. El proceso de verificación no debería durar más de unas pocas horas.
            </p>
            <p>Una vez iniciada la sesión y con acceso al panel de control, se podrán editar, borrar y crear nuevos anuncios (máximo 10), así como modificar tu nombre público y tu contraseña 
                si no iniciaste sesión con <span>Google</span>. También se da la opción de borrar la cuenta en su totalidad de forma definitiva. En el menú de edición, si tu anuncio ya es público porque está verificado, se te brinda la opción de modificar su visibilidad 
                haciéndolo público o privado. Ten en cuenta que cada vez que edites o publiques un anuncio, será ocultado hasta que pase de nuevo por el filtro de verificación.
            </p>
            <p>Si pierdes tu contraseña de <span>BuscoBarbie.com</span>, se te da la opción de recuperarla en el panel de <Link href={`${APP_URL}/login`}><a className={styles.link}>iniciar sesión</a></Link>.</p>
            <p>Acceso al blog de <Link href={`${APP_URL}/barbiestories`}><a className={styles.link}>Barbiestories</a></Link> o pulsando el enlace en la cabecera.</p>
            <p>Si deseas contactar con la administración de <span>BuscoBarbie.com</span>, encontrarás el <Link href={`${APP_URL}/contact`}><a className={styles.link}>enlace</a></Link> a pie de página.</p>
            <p>Para acceder a la versión de la plataforma en otro país, sigue los enlaces a pie de página. Ten en cuenta que cada vez que pulses en enlace de un país distinto, se guardará una cookie con el país para 
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
                <li><p>Precio del artículo obligatorio. Sólo números.</p></li>
                <li><p>Selección obligatoria de la categoría del artículo.</p></li>
                <li><p>Selección opcional de la década de construcción del artículo.</p></li>
                <li><p>Selección opcional pero recomendada de las etiquetas que clasifiquen más precisamente el artículo.</p></li>
                <li><p>Selección opcional de un máximo de 4 imágenes. Sus formatos pueden ser JPG, JPEG, PNG o GIF. Tamaño máximo de 6MB por imágen. 
                    Pueden tomarse las fotos en el momento si se accede al formulario desde un dispositivo móvil con cámara. Sólo se permitirán fotos de los artículos Barbie™ anunciados.
                </p></li>
                <li><p>Nombre de usuario obligatorio. Se hará público. Máximo 20 caracteres.</p></li>
                <li><p>Email de registro obligatorio y válido. Por motivos de seguridad, nunca se hará público. 
                    Se utilizará para: </p>
                    <ol>
                        <li><p>Verificar al usuario enviando un email con un enlace de verificación en el momento del registro.</p></li>
                        <li><p>Para ser contactado por las personas interesadas en el artículo.</p></li>
                        <li><p>Para ser enviado comunicaciones de <span>BuscoBarbie.com</span> relativas a la validación positiva o negativa del anuncio registrado.</p></li>
                    </ol>
                    <p>Al ser contactado por un usuario interesado en tu artículo, se recibirá un email con el nombre, dirección de email y mensaje del mismo. Los emails de contacto se recibirán siempre desde un dominio de <span>BuscoBarbie.com</span>.</p></li>
                <li><p>Contraseña obligatoria de entre 8 y 20 caracteres, incluidos !@#$%^&*</p></li>
            </ol>
        </div>
        <div className={styles.blockContainer}>
            <h5 className={styles.subtitle}>TRATAMIENTO DE DATOS</h5>
            <p>Aquéllos usuarios que inicien sesión a traves de <span>Google</span> o se registren a través del formulario <Link href={`${APP_URL}/${country}/publicar`}><a className={styles.link}>publicar</a></Link>, aceptan ceder 
            sus datos a <span>BuscoBarbie.com</span> para almacenarlos en una base de datos y utilizarlos para dar servicio al usuario con las prestaciones de la aplicación.</p>
            <p>El usuario registrado tiene derecho a reclamar o solicitar la eliminación de sus datos, o bien a través del formulario de <Link href={`${APP_URL}/contact`}><a className={styles.link}>contacto</a></Link> o 
            bien eliminando la cuenta desde el panel de control del usuario.</p>
            <p>Para los usuarios registrados mediante <span>Google</span>, sólo almacenaremos el nombre y la dirección de email proporcionados por esta plataforma. Se recuerda que por motivos de seguridad, la dirección de email nunca se hará pública.</p>
        </div>
        <div className={styles.blockContainer}>
            <h5 className={styles.subtitle}>PROPIEDAD DEL SITIO</h5>
            <p>Esta aplicación web pertenece a Manuel Villalvilla Cañizares con D.N.I. 49009131-H y residencia en Serranillos del Valle, Madrid, España.</p>
        </div>
        <button type='button' className={styles.bottomButton} onClick={() => scroll.scrollToTop()}>Volver arriba</button>
    </div>
}

export async function getServerSideProps({ req, res }) {
    const country = getCookie('country', { req, res })

    return { props: { country: country ? country : 'ES' } }
}