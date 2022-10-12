const modelos = 'Fashionistas,Made to move,Collector,Signature,Extra,Ken,Profesiones,Deportistas,Cantantes,Cine,Muñecas del mundo,Curvy,Princesas,Mujeres inspiradoras,Sirenas,Looks,Silkstone,Fashion fever,Afroamericanas,Asiáticas,BMR,Malibu,Barbie Style,Día de los Muertos,Ballet wishes,Blonde,Brunette,Dark,Ginger,Pink,Purple,Butterfly art,Palm Beach,Sensation,Surf,Sun Jewell,Barbiecore,Familia Corazón,Totally hair,Cheerleader,Fairytopia,Wedding,Back to school,Royalty,Ooaks,Repaints,Híbridas,Felices fiestas,Happy birthday'
const complementos = 'Casas,Coches,Motos,Caravanas,Bicicletas,Acampadas,Outfit,Bolsos,Zapatos,Gafas,Joyas,Sets,Decoración'

const tags = {
    modelos: modelos.split(',').sort(),
    complementos: complementos.split(',').sort()
}

module.exports = tags