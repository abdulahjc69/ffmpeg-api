#!/usr/bin/env python3
"""Generate the complete POI_GALLERIES JS block to inject into index.html."""
import hashlib

def wm(filename, width=800):
    fn = filename.replace(' ', '_')
    h = hashlib.md5(fn.encode('utf-8')).hexdigest()
    return f"https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{fn}/{width}px-{fn}"

GALLERIES = {
    'Mezquita-catedral_de_Córdoba': [
        ('Mosque_Cathedral_of_Cordoba.jpg', 'Vista exterior de la Mezquita-Catedral', 'Exterior view of the Mosque-Cathedral'),
        ('Mezquita_de_Cordoba_-_Hypostyle_hall.jpg', 'Bosque de columnas bicolores', 'Hypostyle hall with bicolor arches'),
        ('Cordoba_Mosque_(3769700946).jpg', 'Arcos de herradura nazaríes', 'Horseshoe arches inside'),
        ('Mezquita-Catedral_de_Córdoba_-_Interior_(3).jpg', 'Interior de la nave central', 'Central nave interior'),
        ('Cordoba_mezquita_bn_retouched.jpg', 'Arcos dobles en blanco y negro', 'Double arches in black and white'),
    ],
    'Medina_Azahara': [
        ('Medina_Azahara_Salón_rico_2.jpg', 'Salón del Trono restaurado', 'Restored Throne Room'),
        ('Medina_Azahara_-_panoramio_(1).jpg', 'Ruinas del palacio califal', 'Ruins of the caliphal palace'),
        ('Medina_Azahara_-_panoramio_(2).jpg', 'Patios y jardines del yacimiento', 'Courtyards and gardens'),
        ('Medina_Azahara_Gate.jpg', 'Puerta principal de acceso', 'Main entrance gate'),
    ],
    'Calleja_de_las_Flores': [
        ('Calleja_de_las_Flores_(Córdoba).jpg', 'Callejón con geranios y la Mezquita al fondo', 'Alley with geraniums and Mosque in background'),
        ('Calleja_de_las_flores_Cordoba.jpg', 'Fachadas encaladas y flores', 'Whitewashed facades and flowers'),
        ('Calle_de_la_Flor_Cordoba.jpg', 'Rincón típico cordobés', 'Typical Córdoba corner'),
    ],
    'Puente_romano_de_Córdoba': [
        ('Puente_Romano_-_Córdoba_(2).jpg', 'Puente romano al atardecer con la Mezquita', 'Roman bridge at sunset with the Mosque'),
        ('Cordoba_Roman_Bridge_2015_01.jpg', 'Vista desde la orilla del Guadalquivir', 'View from the Guadalquivir bank'),
        ('Puente_romano_Cordoba.jpg', 'Arcos del puente y torre Calahorra', 'Bridge arches and Calahorra tower'),
        ('Torre_Calahorra_y_Puente_Romano_Cordoba.jpg', 'Torre de la Calahorra al fondo', 'Calahorra tower in background'),
    ],
    'Sinagoga_de_Córdoba': [
        ('Cordoba_Synagogue.jpg', 'Interior de la sinagoga medieval', 'Interior of the medieval synagogue'),
        ('Sinagoga_Cordoba_2.jpg', 'Yeserías mudéjares e inscripciones hebreas', 'Mudéjar plasterwork and Hebrew inscriptions'),
        ('Sinagoga_de_Cordoba_interior.jpg', 'Detalles de la decoración nazarí', 'Details of Nasrid decoration'),
    ],
    'Alcázar_de_los_Reyes_Cristianos_de_Córdoba': [
        ('Alcazar_de_Cordoba_jardines.jpg', 'Jardines del Alcázar con fuentes', 'Alcázar gardens with fountains'),
        ('Alcazar_reyes_cristianos_cordoba.jpg', 'Torres y murallas del Alcázar', 'Towers and walls of the Alcázar'),
        ('Alcazardelosreyescristianos.jpg', 'Vista aérea del palacio', 'Aerial view of the palace'),
        ('Cordoba_Alcazar_gardens.jpg', 'Estanque y cipreses en los jardines', 'Pond and cypress trees in gardens'),
    ],
    'Torre_de_la_Calahorra': [
        ('Torre_Calahorra_Córdoba.jpg', 'Torre de la Calahorra desde el puente', 'Calahorra tower from the bridge'),
        ('Torre_de_la_Calahorra_Cordoba.jpg', 'Fortaleza almohade del siglo XII', '12th-century Almohad fortress'),
        ('Cordoba_torre_calahorra.jpg', 'Vista nocturna de la torre', 'Nighttime view of the tower'),
    ],
    'Palacio_de_Viana': [
        ('Palacio_de_Viana_(Córdoba)_-_Patio_de_la_Capilla.jpg', 'Patio de la Capilla con fuente', 'Chapel Courtyard with fountain'),
        ('Palacio_de_Viana_-_Patio_del_Naranjo.jpg', 'Patio de los Naranjos en flor', 'Orange tree courtyard in bloom'),
        ('Viana_Palace_Cordoba.jpg', 'Fachada renacentista del palacio', 'Renaissance facade of the palace'),
    ],
    'Plaza_de_la_Corredera': [
        ('Plaza_de_la_Corredera_(Córdoba).jpg', 'Pórticos y balcones de la plaza mayor', 'Arcades and balconies of the main square'),
        ('Plaza_Corredera_Cordoba.jpg', 'Mercado matinal en la plaza', 'Morning market in the square'),
        ('Corredera_square_Cordoba.jpg', 'Vista general de la única plaza mayor andaluza', 'General view of the only Andalusian main square'),
    ],
    'Baños_del_Alcázar_Califal': [
        ('Banos_del_alcazar_califal_cordoba.jpg', 'Bóvedas estrelladas de los baños califales', 'Star-vaulted ceilings of the caliphal baths'),
        ('Hammam_califal_cordoba.jpg', 'Interior de las termas árabes', 'Interior of the Arab baths'),
        ('Alcazar_califal_banos_Cordoba.jpg', 'Sala fría de los baños', 'Cold room of the baths'),
    ],
    # SEVILLA
    'Giralda': [
        ('Giralda_Sevilla.jpg', 'La Giralda vista desde la calle', 'The Giralda seen from the street'),
        ('Giralda_Sevilla_2.jpg', 'Torre almohade con campanario cristiano', 'Almohad tower with Christian belfry'),
        ('Seville_-_La_Giralda.jpg', 'Rampas interiores de la Giralda', 'Interior ramps of the Giralda'),
        ('Giralda_close_up.jpg', 'Detalles en sebka del cuerpo almohade', 'Sebka lattice details of the Almohad body'),
    ],
    'Catedral_de_Sevilla': [
        ('Seville_Cathedral.jpg', 'Catedral de Sevilla, la más grande del gótico', 'Seville Cathedral, the largest Gothic'),
        ('Seville_Cathedral_interior.jpg', 'Interior de la nave central', 'Interior of the central nave'),
        ('Cathedral_of_Seville_-_Retablo_Mayor.jpg', 'Retablo mayor dorado', 'Golden main altarpiece'),
        ('Sepulcro_de_Cristóbal_Colón_(Sevilla).jpg', 'Sepulcro de Cristóbal Colón', 'Tomb of Christopher Columbus'),
    ],
    'Real_Alcázar_de_Sevilla': [
        ('Real_Alcazar_of_Seville_-_Patio_de_las_Doncellas.jpg', 'Patio de las Doncellas con reflejos en el agua', 'Patio de las Doncellas with water reflections'),
        ('Salon_de_los_Embajadores_Sevilla.jpg', 'Salón de los Embajadores con cúpula dorada', 'Hall of the Ambassadors with golden dome'),
        ('Real_Alcazar_Sevilla_gardens.jpg', 'Jardines del Alcázar con fuentes', 'Alcázar gardens with fountains'),
        ('Seville_Alcazar_palace.jpg', 'Fachada mudéjar del palacio', 'Mudéjar facade of the palace'),
        ('Alcazar_de_Sevilla_portada.jpg', 'Portada principal del Alcázar', 'Main entrance of the Alcázar'),
    ],
    'Torre_del_Oro': [
        ('Torre_del_Oro_-_Sevilla.jpg', 'Torre del Oro junto al Guadalquivir', 'Torre del Oro beside the Guadalquivir'),
        ('Torre_del_Oro_Seville.jpg', 'Torre almohade del siglo XIII', '13th-century Almohad tower'),
        ('Torre_del_Oro_Sevilla_noche.jpg', 'La Torre del Oro iluminada de noche', 'Torre del Oro illuminated at night'),
    ],
    'Plaza_de_España_(Sevilla)': [
        ('Plaza_de_España_-_Sevilla_(1).jpg', 'Hemiciclo completo de la Plaza de España', 'Full semicircle of Plaza de España'),
        ('Plaza_de_España_Sevilla_canales.jpg', 'Canal con barcas y azulejos', 'Canal with boats and tiles'),
        ('Plaza_de_España_azulejos.jpg', 'Bancos azulejados con escudos provinciales', 'Tiled benches with provincial shields'),
        ('Plaza_Espana_Seville_sunset.jpg', 'Atardecer dorado en la plaza', 'Golden sunset at the square'),
    ],
    'Triana_(Sevilla)': [
        ('Puente_de_Triana_Sevilla.jpg', 'Puente de Triana sobre el Guadalquivir', 'Triana bridge over the Guadalquivir'),
        ('Triana_Sevilla_calle_Betis.jpg', 'Calle Betis con vistas a la Torre del Oro', 'Betis street with views of Torre del Oro'),
        ('Triana_ceramics_Sevilla.jpg', 'Cerámica tradicional del barrio de Triana', 'Traditional ceramics from Triana'),
        ('Mercado_de_Triana.jpg', 'Mercado de Triana en el antiguo castillo', 'Triana market in the old castle'),
    ],
    'Casa_de_Pilatos': [
        ('Casa_de_Pilatos_Sevilla_patio.jpg', 'Patio principal con fuente renacentista', 'Main courtyard with Renaissance fountain'),
        ('Casa_Pilatos_Seville.jpg', 'Arcos mudéjares y azulejos', 'Mudéjar arches and tiles'),
        ('Casa_de_Pilatos_Sevilla_2.jpg', 'Galería alta del palacio', 'Upper gallery of the palace'),
    ],
    'Metropol_Parasol': [
        ('Metropol_Parasol_Sevilla.jpg', 'Las Setas desde la plaza de la Encarnación', 'Las Setas from Plaza de la Encarnación'),
        ('Metropol_Parasol_interior.jpg', 'Estructura de madera desde el interior', 'Wooden structure from inside'),
        ('Metropol_Parasol_pasarela.jpg', 'Pasarela superior con vistas a Sevilla', 'Upper walkway with views over Seville'),
        ('Metropol_Parasol_night.jpg', 'Las Setas iluminadas de noche', 'Las Setas illuminated at night'),
    ],
    'Archivo_General_de_Indias': [
        ('Archivo_de_Indias_Sevilla.jpg', 'Fachada renacentista del Archivo de Indias', 'Renaissance facade of the Archive of the Indies'),
        ('Archivo_General_de_Indias_interior.jpg', 'Galerías con legajos históricos', 'Galleries with historical documents'),
        ('Archivo_Indias_patio.jpg', 'Patio interior del edificio', 'Interior courtyard of the building'),
    ],
    'Barrio_de_Santa_Cruz_(Sevilla)': [
        ('Barrio_Santa_Cruz_Sevilla.jpg', 'Callejón encalado del barrio judío', 'Whitewashed alley in the Jewish quarter'),
        ('Santa_Cruz_Sevilla_naranjos.jpg', 'Patio con naranjos y fuente', 'Courtyard with orange trees and fountain'),
        ('Barrio_de_Santa_Cruz_Sevilla_2.jpg', 'Rejas con flores y fachadas blancas', 'Grilled windows with flowers and white walls'),
    ],
    # GRANADA
    'Alhambra': [
        ('La_Alhambra_granada.jpg', 'La Alhambra con Sierra Nevada al fondo', 'The Alhambra with Sierra Nevada in background'),
        ('Alhambra_-_Palacios_nazaries.jpg', 'Palacios nazaríes de la Alhambra', 'Nasrid Palaces of the Alhambra'),
        ('Alhambra_interior_Patio_de_los_Arrayanes.jpg', 'Patio de los Arrayanes con estanque', 'Arrayanes courtyard with pond'),
        ('Granada_Alhambra_November_2015_007.jpg', 'Torres y murallas rojas de la Alhambra', 'Red towers and walls of the Alhambra'),
        ('Alhambra_night.jpg', 'La Alhambra iluminada de noche', 'The Alhambra illuminated at night'),
    ],
    'Patio_de_los_Leones': [
        ('Patio_de_los_leones.jpg', 'Los doce leones de mármol en la fuente', 'The twelve marble lions of the fountain'),
        ('Patio_de_los_Leones_Alhambra.jpg', 'Arquería del patio con mocárabes', 'Courtyard arcade with muqarnas'),
        ('Leones_alhambra.jpg', 'Detalle de los leones de mármol', 'Detail of the marble lions'),
        ('Patio_de_los_leones_2018.jpg', 'Vista cenital del patio restaurado', 'Overhead view of the restored courtyard'),
    ],
    'Generalife': [
        ('Generalife_gardens_granada.jpg', 'Jardines del Generalife con cipreses', 'Generalife gardens with cypress trees'),
        ('Acequia_Court_Generalife_granada.jpg', 'Patio de la Acequia con surtidores', 'Acequia courtyard with water jets'),
        ('Generalife_Granada_2.jpg', 'Vista de la Alhambra desde el Generalife', 'View of the Alhambra from Generalife'),
        ('Generalife_patio_flores.jpg', 'Jardín de la sultana en primavera', "Sultan's garden in spring"),
    ],
    'Albaicín': [
        ('Albaicin_Granada.jpg', 'Barrio del Albaicín con la Alhambra al fondo', 'Albaicín neighborhood with Alhambra in background'),
        ('Albaicín_calles.jpg', 'Calles empedradas del barrio morisco', 'Cobblestone streets of the Moorish quarter'),
        ('Granada_Albaicin_panorama.jpg', 'Panorámica del Albaicín desde el aire', 'Panoramic view of the Albaicín from above'),
        ('Albaicin_night_granada.jpg', 'El Albaicín de noche con la Alhambra', 'The Albaicín at night with the Alhambra'),
    ],
    'Sacromonte': [
        ('Sacromonte_Granada.jpg', 'Cuevas del Sacromonte en la ladera', 'Sacromonte caves on the hillside'),
        ('Sacromonte_cuevas.jpg', 'Entrada a una cueva gitana decorada', 'Entrance to a decorated gypsy cave'),
        ('Sacromonte_panorama.jpg', 'Vista del Sacromonte y el Darro', 'View of Sacromonte and the Darro river'),
    ],
    'Mirador_de_San_Nicolás': [
        ('Mirador_San_Nicolas_Granada.jpg', 'La Alhambra desde el mirador de San Nicolás', 'The Alhambra from San Nicolás viewpoint'),
        ('San_Nicolas_mirador_sunset.jpg', 'Atardecer con Sierra Nevada nevada', 'Sunset with snowy Sierra Nevada'),
        ('Mirador_de_San_Nicolas_turistas.jpg', 'El mirador más famoso de Granada', 'The most famous viewpoint in Granada'),
    ],
    'Madraza_de_Granada': [
        ('Madraza_de_Granada.jpg', 'Fachada exterior de la madraza nazarí', 'Exterior facade of the Nasrid madrasa'),
        ('Madraza_interior_Granada.jpg', 'Interior del oratorio con mihrab', 'Interior of the oratory with mihrab'),
        ('Madraza_Granada_detalle.jpg', 'Yeserías policromadas del siglo XIV', 'Polychrome plasterwork from the 14th century'),
    ],
    'Capilla_Real_de_Granada': [
        ('Capilla_Real_Granada.jpg', 'Fachada gótica de la Capilla Real', 'Gothic facade of the Royal Chapel'),
        ('Capilla_Real_interior_Granada.jpg', 'Interior con el sepulcro de los Reyes Católicos', 'Interior with the tomb of the Catholic Monarchs'),
        ('Capilla_Real_rejas.jpg', 'Reja plateresca que separa el presbiterio', 'Plateresque grill separating the presbytery'),
    ],
    'Catedral_de_Granada': [
        ('Catedral_de_Granada.jpg', 'Fachada renacentista de la Catedral de Granada', 'Renaissance facade of Granada Cathedral'),
        ('Catedral_Granada_interior.jpg', 'Interior de la rotonda renacentista', 'Interior of the Renaissance rotunda'),
        ('Catedral_Granada_2.jpg', 'Capilla Mayor con retablo dorado', 'Main chapel with golden altarpiece'),
    ],
    'Monasterio_de_la_Cartuja_de_Granada': [
        ('Cartuja_Granada_sacristia.jpg', 'Sacristía de la Cartuja, barroco extremo', 'Cartuja sacristy, extreme Baroque'),
        ('Cartuja_de_Granada.jpg', 'Fachada e iglesia del monasterio', 'Monastery facade and church'),
        ('Cartuja_interior_Granada.jpg', 'Interior churrigueresco de la iglesia', 'Churrigueresque interior of the church'),
    ],
    'Corral_del_Carbón': [
        ('Corral_del_Carbon_Granada.jpg', 'Arco de entrada nazarí del Corral del Carbón', 'Nasrid entrance arch of the Corral del Carbón'),
        ('Corral_del_Carbon_patio.jpg', 'Patio interior de la alhóndiga nazarí', 'Inner courtyard of the Nasrid alhóndiga'),
        ('Corral_Carbon_Granada_2.jpg', 'Galerías de madera del siglo XIV', '14th-century wooden galleries'),
    ],
    # RONDA
    'Puente_Nuevo_de_Ronda': [
        ('Puente_Nuevo_de_Ronda.jpg', 'Puente Nuevo sobre el Tajo de Ronda', 'Puente Nuevo over the Ronda Gorge'),
        ('Ronda_Puente_Nuevo_2.jpg', 'El Tajo a 100 metros bajo el puente', 'The gorge 100 meters below the bridge'),
        ('Puente_nuevo_Ronda_atardecer.jpg', 'El puente iluminado al atardecer', 'The bridge illuminated at sunset'),
        ('Ronda_panorama.jpg', 'Panorámica de Ronda con el Tajo', 'Panoramic view of Ronda with the gorge'),
    ],
    'Plaza_de_toros_de_Ronda': [
        ('Plaza_de_toros_de_Ronda.jpg', 'La plaza de toros más antigua de España', "Spain's oldest bullring"),
        ('Ronda_bullring_interior.jpg', 'Interior del ruedo de Ronda (1785)', 'Interior of the Ronda bullring (1785)'),
        ('Plaza_Toros_Ronda_2.jpg', 'Arcos del patio de cuadrillas', 'Arches of the bullring courtyard'),
    ],
    'Baños_árabes_de_Ronda': [
        ('Banos_arabes_Ronda.jpg', 'Bóvedas estrelladas de los baños árabes', 'Star-vaulted ceilings of the Arab baths'),
        ('Ronda_hamman_interior.jpg', 'Sala templada de los baños nazaríes', 'Warm room of the Nasrid baths'),
        ('Banos_arabes_Ronda_2.jpg', 'Los mejor conservados de la península', 'Best preserved baths in the Iberian Peninsula'),
    ],
    'Casa_del_Rey_Moro': [
        ('Casa_del_Rey_Moro_Ronda.jpg', 'Jardines de la Casa del Rey Moro', 'Gardens of the Casa del Rey Moro'),
        ('Casa_Rey_Moro_mina.jpg', 'Mina de agua que baja al Tajo', 'Water mine descending to the gorge'),
        ('Casa_del_Rey_Moro_fachada.jpg', 'Fachada del palacio nazarí', 'Facade of the Nasrid palace'),
    ],
    'Tajo_de_Ronda': [
        ('Tajo_de_Ronda.jpg', 'El Tajo de Ronda, grieta natural de 100 metros', 'Ronda Gorge, 100-meter natural cleft'),
        ('Ronda_tajo_panorama.jpg', 'Vista del Tajo desde el mirador', 'View of the gorge from the viewpoint'),
        ('Tajo_ronda_desde_abajo.jpg', 'El río Guadalevín en el fondo del Tajo', 'The Guadalevín river at the bottom of the gorge'),
    ],
    'Iglesia_de_Santa_María_la_Mayor_(Ronda)': [
        ('Iglesia_Santa_Maria_Mayor_Ronda.jpg', 'Iglesia de Santa María la Mayor en Ronda', 'Church of Santa María la Mayor in Ronda'),
        ('Santa_Maria_Ronda_interior.jpg', 'Interior con el mihrab musulmán conservado', 'Interior with the preserved Muslim mihrab'),
        ('Santa_Maria_la_Mayor_Ronda_2.jpg', 'Torre campanario de la iglesia', 'Bell tower of the church'),
    ],
    'Palacio_de_Mondragón': [
        ('Palacio_Mondragon_Ronda.jpg', 'Patio mudéjar del Palacio de Mondragón', 'Mudéjar courtyard of Palacio de Mondragón'),
        ('Mondragon_palace_Ronda.jpg', 'Jardines colgantes con vistas a la sierra', 'Hanging gardens with mountain views'),
        ('Palacio_Mondragon_fachada.jpg', 'Fachada renacentista del palacio nazarí', 'Renaissance facade of the Nasrid palace'),
    ],
    # MÁLAGA
    'Alcazaba_de_Málaga': [
        ('Alcazaba_de_Málaga.jpg', 'La Alcazaba de Málaga sobre la ciudad', 'The Alcazaba of Málaga above the city'),
        ('Alcazaba_Malaga_interior.jpg', 'Patios y jardines interiores de la Alcazaba', 'Inner courtyards and gardens of the Alcazaba'),
        ('Alcazaba_Malaga_2.jpg', 'Torres defensivas de la fortaleza nazarí', 'Defensive towers of the Nasrid fortress'),
        ('Alcazaba_Malaga_patio.jpg', 'Patio de los Naranjos de la Alcazaba', 'Orange tree courtyard of the Alcazaba'),
    ],
    'Castillo_de_Gibralfaro': [
        ('Castillo_de_Gibralfaro_Malaga.jpg', 'Castillo de Gibralfaro desde el mar', 'Castillo de Gibralfaro from the sea'),
        ('Gibralfaro_castle_Malaga_2.jpg', 'Murallas del castillo y la bahía de Málaga', 'Castle walls and bay of Málaga'),
        ('Gibralfaro_Malaga_panorama.jpg', 'Panorámica de la Costa del Sol desde Gibralfaro', 'Panoramic view of the Costa del Sol from Gibralfaro'),
    ],
    'Catedral_de_la_Encarnación_de_Málaga': [
        ('Catedral_Malaga.jpg', 'La Manquita de Málaga con su torre incompleta', 'La Manquita of Málaga with its incomplete tower'),
        ('Catedral_Malaga_interior.jpg', 'Interior renacentista de la catedral', 'Renaissance interior of the cathedral'),
        ('Catedral_Malaga_2.jpg', 'Nave central de la catedral de Málaga', 'Central nave of Málaga Cathedral'),
    ],
    'Museo_Picasso_Málaga': [
        ('Museo_Picasso_Malaga.jpg', 'Palacio de Buenavista, sede del Museo Picasso', 'Palacio de Buenavista, home of Picasso Museum'),
        ('Museo_Picasso_Malaga_exterior.jpg', 'Fachada renacentista con yacimiento fenicio', 'Renaissance facade with Phoenician archaeological site'),
        ('Museo_Picasso_interior.jpg', 'Obras de Picasso en el palacio del siglo XVI', 'Picasso works in the 16th-century palace'),
    ],
    'Teatro_romano_de_Málaga': [
        ('Teatro_romano_Malaga.jpg', 'Teatro romano del siglo I a.C. en Málaga', '1st-century BC Roman theatre in Málaga'),
        ('Teatro_romano_Malaga_2.jpg', 'Gradas romanas al pie de la Alcazaba', 'Roman seating at the foot of the Alcazaba'),
        ('Teatro_Romano_Malaga_vista.jpg', 'Vista del teatro y la Alcazaba superpuesta', 'View of theatre with Alcazaba superimposed'),
    ],
    'Centre_Pompidou_Málaga': [
        ('Centre_Pompidou_Malaga.jpg', 'Cubo multicolor del Centre Pompidou en el puerto', 'Multicolor cube of Centre Pompidou at the port'),
        ('Pompidou_Malaga_interior.jpg', 'Arte contemporáneo en primera línea de mar', 'Contemporary art on the seafront'),
        ('Centre_Pompidou_Malaga_2.jpg', 'El cubo de colores desde el paseo marítimo', 'The color cube from the seafront promenade'),
    ],
    'Mercado_de_Atarazanas': [
        ('Mercado_Atarazanas_Malaga.jpg', 'Puerta nazarí del antiguo arsenal', 'Nasrid gate of the former arsenal'),
        ('Atarazanas_interior_Malaga.jpg', 'Interior del mercado con la vidriera', 'Market interior with the stained-glass window'),
        ('Mercado_Atarazanas_vidriera.jpg', 'Gran vidriera con vistas a Málaga', 'Large stained-glass window with views of Málaga'),
    ],
    'Casa_Natal_de_Pablo_Picasso': [
        ('Casa_Natal_Picasso_Malaga.jpg', 'Casa natal de Pablo Picasso en la Plaza de la Merced', 'Birthplace of Pablo Picasso on Plaza de la Merced'),
        ('Picasso_birthplace_Malaga.jpg', 'Interior del apartamento familiar', 'Interior of the family apartment'),
        ('Casa_Picasso_museo.jpg', 'Exposición con los primeros dibujos de Picasso', "Exhibition with Picasso's first drawings"),
    ],
    # TOLEDO
    'Catedral_de_Santa_María_de_Toledo': [
        ('Cathedral_Toledo.jpg', 'Fachada oeste de la Catedral de Toledo', 'West facade of Toledo Cathedral'),
        ('Toledo_Cathedral_interior.jpg', 'Interior del coro con sillería gótica', 'Interior choir with Gothic stalls'),
        ('Catedral_Toledo_transparente.jpg', 'El Transparente barroco de la catedral', 'The Baroque Transparente of the cathedral'),
        ('Toledo_cathedral_nave.jpg', 'Nave central del gótico hispánico', 'Central nave of Hispanic Gothic'),
    ],
    'Sinagoga_de_Santa_María_la_Blanca': [
        ('Sinagoga_Santa_Maria_Blanca_Toledo.jpg', 'Interior de Santa María la Blanca con capiteles', 'Interior of Santa María la Blanca with capitals'),
        ('Santa_Maria_Blanca_Toledo.jpg', 'Columnas y arcos de herradura mudéjares', 'Columns and horseshoe arches in Mudéjar style'),
        ('Sinagoga_Blanca_Toledo.jpg', 'Exterior de la antigua sinagoga medieval', 'Exterior of the former medieval synagogue'),
    ],
    'Sinagoga_del_Tránsito': [
        ('Sinagoga_del_Transito_Toledo.jpg', 'Interior de la Sinagoga del Tránsito', 'Interior of the Sinagoga del Tránsito'),
        ('Sinagoga_Transito_exterior.jpg', 'Exterior mudéjar de la sinagoga', 'Mudéjar exterior of the synagogue'),
        ('Sinagoga_del_Transito_yeserias.jpg', 'Yeserías mudéjares con inscripciones hebreas', 'Mudéjar plasterwork with Hebrew inscriptions'),
    ],
    'Mezquita_del_Cristo_de_la_Luz': [
        ('Cristo_de_la_Luz_Toledo.jpg', 'Mezquita del Cristo de la Luz, siglo X', 'Mosque of Cristo de la Luz, 10th century'),
        ('Cristo_de_la_Luz_interior.jpg', 'Interior de la mezquita califal', 'Interior of the caliphal mosque'),
        ('Cristo_Luz_Toledo_2.jpg', 'Arquerías de herradura del interior', 'Horseshoe arcades of the interior'),
    ],
    'Alcázar_de_Toledo': [
        ('Alcazar_de_Toledo.jpg', 'Alcázar de Toledo sobre la colina', 'Alcázar of Toledo on the hilltop'),
        ('Alcazar_Toledo_interior.jpg', 'Patio de Carlos V en el Alcázar', 'Carlos V courtyard in the Alcázar'),
        ('Alcazar_Toledo_panorama.jpg', 'Vista del Alcázar desde el Tajo', 'View of the Alcázar from the Tagus'),
    ],
    'Museo_del_Greco': [
        ('Museo_del_Greco_Toledo.jpg', 'Casa-Museo de El Greco en el barrio judío', 'El Greco House-Museum in the Jewish quarter'),
        ('El_Greco_Toledo_museum.jpg', 'Interior con obras originales del pintor', 'Interior with original paintings'),
        ('Vista_y_plano_de_Toledo_El_Greco.jpg', 'Vista y Plano de Toledo (El Greco, 1610)', 'View and Plan of Toledo (El Greco, 1610)'),
    ],
    'Monasterio_de_San_Juan_de_los_Reyes': [
        ('San_Juan_de_los_Reyes_Toledo.jpg', 'Claustro gótico flamígero de San Juan de los Reyes', 'Flamboyant Gothic cloister of San Juan de los Reyes'),
        ('San_Juan_Reyes_Toledo_iglesia.jpg', 'Iglesia con cadenas de prisioneros liberados', 'Church with chains of liberated prisoners'),
        ('San_Juan_Reyes_exterior.jpg', 'Fachada exterior del monasterio', 'Exterior facade of the monastery'),
    ],
    'Puerta_de_Bisagra_Nueva': [
        ('Puerta_de_Bisagra_Toledo.jpg', 'Puerta de Bisagra con el águila imperial', 'Bisagra Gate with the imperial eagle'),
        ('Bisagra_Toledo_2.jpg', 'Arco mudéjar de la puerta monumental', 'Mudéjar arch of the monumental gate'),
        ('Puerta_Bisagra_Toledo.jpg', 'La puerta principal de la ciudad de Toledo', 'The main city gate of Toledo'),
    ],
    'Puente_de_Alcántara_(Toledo)': [
        ('Puente_de_Alcantara_Toledo.jpg', 'Puente de Alcántara sobre el Tajo', 'Alcántara Bridge over the Tagus'),
        ('Toledo_Puente_Alcantara.jpg', 'El puente con la ciudad al fondo', 'The bridge with the city in the background'),
        ('Alcantara_bridge_Toledo_2.jpg', 'Torre árabe en el extremo del puente', 'Arab tower at the end of the bridge'),
    ],
    'Mirador_del_Valle': [
        ('Mirador_del_Valle_Toledo.jpg', 'Panorámica de Toledo desde el Mirador del Valle', 'Panorama of Toledo from the Valle viewpoint'),
        ('Toledo_panorama.jpg', 'Toledo completa sobre el Tajo al atardecer', 'Full Toledo over the Tagus at sunset'),
        ('Mirador_Valle_Toledo_2.jpg', 'El skyline histórico de Toledo', 'The historic skyline of Toledo'),
    ],
    # MADRID
    'Palacio_Real_de_Madrid': [
        ('Palacio_Real_de_Madrid.jpg', 'Fachada principal del Palacio Real de Madrid', 'Main facade of the Royal Palace of Madrid'),
        ('Palacio_Real_Madrid_interior.jpg', 'Salón del Trono con pinturas de Tiépolo', "Throne Room with Tiepolo's paintings"),
        ('Palacio_Real_Madrid_jardines.jpg', 'Jardines de Sabatini frente al palacio', 'Sabatini Gardens in front of the palace'),
        ('Madrid_Palacio_Real_2.jpg', 'Vista aérea del palacio y la catedral', 'Aerial view of palace and cathedral'),
    ],
    'Museo_del_Prado': [
        ('Museo_del_Prado_Madrid.jpg', 'Fachada neoclásica del Museo del Prado', 'Neoclassical facade of the Prado Museum'),
        ('Museo_Prado_interior.jpg', 'Salas del Prado con Velázquez y Goya', 'Prado halls with Velázquez and Goya'),
        ('Las_Meninas_Velazquez.jpg', 'Las Meninas de Velázquez (1656)', 'Las Meninas by Velázquez (1656)'),
        ('Museo_Prado_2.jpg', 'El edificio Villanueva del Prado', 'The Villanueva building of the Prado'),
    ],
    'Plaza_Mayor_de_Madrid': [
        ('Plaza_Mayor_de_Madrid.jpg', 'Plaza Mayor de Madrid con la Casa de la Panadería', 'Plaza Mayor de Madrid with the Casa de la Panadería'),
        ('Plaza_Mayor_Madrid_noche.jpg', 'La Plaza Mayor iluminada de noche', 'Plaza Mayor illuminated at night'),
        ('Plaza_Mayor_Madrid_2.jpg', 'Estatua ecuestre de Felipe III en el centro', 'Equestrian statue of Philip III in the center'),
    ],
    'Puerta_del_Sol': [
        ('Puerta_del_Sol_Madrid.jpg', 'Puerta del Sol, kilómetro cero de España', 'Puerta del Sol, kilometer zero of Spain'),
        ('El_oso_y_el_madroño_Madrid.jpg', 'El Oso y el Madroño, símbolo de Madrid', 'The Bear and the Strawberry Tree, Madrid symbol'),
        ('Puerta_del_Sol_noche.jpg', 'Puerta del Sol de noche con el reloj', 'Puerta del Sol at night with the clock'),
    ],
    'Templo_de_Debod': [
        ('Templo_de_Debod_Madrid.jpg', 'Templo de Debod al atardecer en Madrid', 'Temple of Debod at sunset in Madrid'),
        ('Templo_Debod_reflejo.jpg', 'Reflejo del templo egipcio en el estanque', 'Reflection of the Egyptian temple in the pond'),
        ('Templo_de_Debod_2.jpg', 'El templo del siglo II a.C. en Madrid', 'The 2nd century BC temple in Madrid'),
    ],
    'Museo_Nacional_Centro_de_Arte_Reina_Sofía': [
        ('Museo_Reina_Sofia_Madrid.jpg', 'Fachada del Museo Reina Sofía', 'Facade of the Reina Sofía Museum'),
        ('Guernica_Picasso.jpg', 'Guernica de Picasso (1937)', 'Guernica by Picasso (1937)'),
        ('Reina_Sofia_interior.jpg', 'Salas de arte contemporáneo español', 'Halls of Spanish contemporary art'),
    ],
    'Parque_del_Buen_Retiro': [
        ('Parque_del_Retiro_Madrid.jpg', 'Estanque del Retiro con el monumento a Alfonso XII', 'Retiro pond with the Alfonso XII monument'),
        ('Palacio_de_Cristal_Retiro.jpg', 'Palacio de Cristal en el Parque del Retiro', 'Crystal Palace in Retiro Park'),
        ('Parque_Retiro_Madrid_2.jpg', 'Barcas en el estanque del Retiro', 'Rowboats on the Retiro pond'),
        ('Retiro_park_roses.jpg', 'Rosaleda en primavera en el Retiro', 'Rose garden in spring at the Retiro'),
    ],
    'Catedral_de_la_Almudena': [
        ('Catedral_de_la_Almudena_Madrid.jpg', 'Catedral de la Almudena frente al Palacio Real', 'Almudena Cathedral opposite the Royal Palace'),
        ('Almudena_interior_Madrid.jpg', 'Interior neogótico con techos pintados', 'Neo-Gothic interior with painted ceilings'),
        ('Almudena_cripta.jpg', 'Cripta románica de la catedral', 'Romanesque crypt of the cathedral'),
    ],
    'Plaza_de_la_Villa': [
        ('Plaza_de_la_Villa_Madrid.jpg', 'Plaza de la Villa con la Torre de los Lujanes', 'Plaza de la Villa with the Tower of the Lujanes'),
        ('Casa_de_Cisneros_Madrid.jpg', 'Casa de Cisneros, plateresco madrileño', 'Casa de Cisneros, Madrid Plateresque'),
        ('Plaza_Villa_Madrid_2.jpg', 'El antiguo centro de la villa de Mayrit', 'The old center of the town of Mayrit'),
    ],
    'Mezquita_central_de_Madrid': [
        ('Mezquita_Central_Madrid.jpg', 'Mezquita Central de Madrid en la M-30', 'Central Mosque of Madrid on the M-30'),
        ('Islamic_Cultural_Center_Madrid.jpg', 'Centro Cultural Islámico de Madrid', 'Islamic Cultural Centre of Madrid'),
        ('Mezquita_Madrid_interior.jpg', 'Interior de la sala de oración', 'Interior of the prayer hall'),
    ],
    'Muralla_árabe_de_Madrid': [
        ('Muralla_arabe_Madrid.jpg', 'Restos de la muralla árabe junto al Palacio Real', 'Remains of the Arab wall next to the Royal Palace'),
        ('Muralla_arabiga_Madrid.jpg', 'Paño de muralla del siglo IX de Mayrit', '9th-century wall section of Mayrit'),
        ('Muralla_arabe_Madrid_jardines.jpg', 'Jardines de la muralla árabe en verano', 'Arab wall gardens in summer'),
    ],
    # LA ALPUJARRA
    'Pampaneira': [
        ('Pampaneira_Granada.jpg', 'Pampaneira, pueblo blanco de La Alpujarra', 'Pampaneira, white village of La Alpujarra'),
        ('Pampaneira_2.jpg', 'Calle típica con chimeneas troncocónicas', 'Typical street with truncated-cone chimneys'),
        ('Pampaneira_jarapa.jpg', 'Jarapas tradicionales en los balcones', 'Traditional jarapa textiles on balconies'),
        ('Pampaneira_vista.jpg', 'Vista del pueblo y el barranco de Poqueira', 'View of village and Poqueira gorge'),
    ],
    'Bubión': [
        ('Bubion_Granada.jpg', 'Bubión sobre el Barranco de Poqueira', 'Bubión above the Poqueira gorge'),
        ('Bubion_casas.jpg', 'Casas de launa del pueblo morisco', 'Launa-roofed houses of the Moorish village'),
        ('Bubion_Alpujarra.jpg', 'El pueblo de Bubión entre terrazas de olivos', 'Bubión village among olive terraces'),
    ],
    'Capileira': [
        ('Capileira_Granada.jpg', 'Capileira, el pueblo más alto del Poqueira', 'Capileira, the highest village in Poqueira'),
        ('Capileira_Mulhacen.jpg', 'El Mulhacén nevado visto desde Capileira', 'Snow-capped Mulhacén seen from Capileira'),
        ('Capileira_2.jpg', 'Calles empedradas y terrazas de la Alpujarra', 'Cobblestone streets and terraces of La Alpujarra'),
    ],
    'Trevélez': [
        ('Trevelez_Granada.jpg', 'Trevélez, el pueblo más alto de España', 'Trevélez, the highest village in Spain'),
        ('Trevelez_jamon.jpg', 'Secaderos de jamón serrano en Trevélez', 'Curing sheds for Serrano ham in Trevélez'),
        ('Trevelez_2.jpg', 'Los tres barrios escalonados de Trevélez', 'The three terraced neighbourhoods of Trevélez'),
    ],
    'Lanjarón': [
        ('Lanjaron_Granada.jpg', 'Lanjarón, puerta de la Alpujarra', 'Lanjarón, gateway to La Alpujarra'),
        ('Lanjaron_balneario.jpg', 'Balneario histórico de aguas medicinales', 'Historic spa with medicinal waters'),
        ('Lanjaron_2.jpg', 'El pueblo y su castillo árabe en ruinas', 'The village and its ruined Arab castle'),
    ],
    'Barranco_de_Poqueira': [
        ('Barranco_de_Poqueira.jpg', 'El Barranco de Poqueira con los tres pueblos', 'Poqueira gorge with the three white villages'),
        ('Poqueira_valley.jpg', 'Valle glaciar de la Sierra Nevada', 'Glacial valley of the Sierra Nevada'),
        ('Barranco_Poqueira_senderismo.jpg', 'Rutas de senderismo por el Barranco de Poqueira', 'Hiking trails through the Poqueira gorge'),
    ],
}

# Build the JS const
lines = ['const POI_GALLERIES = {']
for wiki_key, images in GALLERIES.items():
    lines.append(f"  {repr(wiki_key)}: [")
    for filename, cap_es, cap_en in images:
        url = wm(filename)
        lines.append(f"    {{ url: {repr(url)}, caption: {repr(cap_es)}, caption_en: {repr(cap_en)} }},")
    lines.append("  ],")
lines.append("};")

print('\n'.join(lines))
print(f"\n// Total POIs with static galleries: {len(GALLERIES)}")
