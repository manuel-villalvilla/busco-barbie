export default function (message, setError) {
    if (message === 'title is not a string') {
        setError({
            bottom: 'El formato del título no es válido',
            images: null
        })
    }
    else if (message === 'body is not a string') {
        setError({
            images: null,
            bottom: 'El formato de la descripción no es válido'
        })
    }
    else if (message === 'province not valid') {
        setError({
            images: null,
            bottom: 'Selecciona una provincia o estado'
        })
    }
    else if (message === 'area is not a string') {
        setError({
            images: null,
            bottom: 'Formato de zona no válido'
        })
    }
    else if (message === 'phone number must be min 6 chars long') {
        setError({
            images: null,
            bottom: 'El número de teléfono no tiene suficientes números. Mínimo 6'
        })
    }
    else if (message === 'phone is not a string' || message === 'phone characters not valid') {
        setError({
            images: null,
            bottom: 'El formato del número de teléfono no es válido'
        })
    }
    else if (message === 'wrong categories') {
        setError({
            images: null,
            bottom: 'Selecciona una categoría'
        })
    }
    else if (message === 'name is not a string') {
        setError({
            images: null,
            bottom: 'Formato de nombre no válido'
        })
    }
    else if (message === 'email length is not valid') {
        setError({
            images: null,
            bottom: 'Introduce un email válido con un mínimo de 6 caracteres'
        })
    }
    else if (message === 'email is not valid' || message === 'email is not a string') {
        setError({
            images: null,
            bottom: 'Formato de email no válido'
        })
    }
    else if (message === 'password is not a string' || message === 'password chars not valid') {
        setError({
            images: null,
            bottom: 'Formato de contraseña no válido'
        })
    }
    else if (message === 'user already exists') {
        setError({
            images: null,
            bottom: 'El email introducido ya existe'
        })
    }
    else 
        setError({
            images: null,
            bottom: 'Algo salió mal'
        })
}