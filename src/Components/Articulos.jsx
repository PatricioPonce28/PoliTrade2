import React from 'react';
import Header from './Header'; // Asegúrate de que el componente Header exista
import Categoria from './Categoria'; // Asegúrate de que el componente Categoria exista
import Footer from './Footer'; // Asegúrate de que el componente Footer exista
import "../CSS_Components/articulos.css"
const Articulos = () => {
  const Articulo_carrusel = [
    {
      id: 'libros',
      titulo: 'Libros de Inglés',
      infoGeneral: [
        'Material oficial certificado por el CEC-EPN',
        'Disponible para todos los niveles (A1 hasta C1)',
        'Libros en excelente estado y última edición',
        'Incluye acceso a plataforma digital',
      ],
      procesoCompra: [
        'Contacto directo por WhatsApp',
        'Entrega personal dentro del campus',
        'Verificación del estado antes de la compra',
        'Pago en efectivo o transferencia',
      ],
      productos: [
        {
          imagen: '/img_articulos/libro_avanzado.webp',
          alt: 'Nivel C1',
          titulo: 'Libro Nivel Avanzado - C1',
          precio: '$30',
        },
        {
          imagen: '/img_articulos/libro_basico.webp',
          alt: 'Nivel B1',
          titulo: 'Libro Nivel Básico - B1',
          precio: '$25',
        },
      ],
    },
    {
      id: 'herramientas',
      titulo: 'Herramientas',
      infoGeneral: [
        'Herramientas de precisión para laboratorios y talleres',
        'Equipos calibrados y certificados',
        'Disponibles para todas las carreras técnicas',
        'Garantía de funcionamiento',
      ],
      procesoCompra: [
        'Prueba del equipo antes de la compra',
        'Entrega en laboratorios o talleres',
        'Asesoría de uso incluida',
        'Facilidades de pago',
      ],
      productos: [
        {
          imagen: '/img_articulos/balanza_medicion.jpg',
          alt: 'Balanza de Medición',
          titulo: 'Balanza de Medición',
          precio: '$40',
        },
        {
          imagen: '/img_articulos/cinta_metrica.png',
          alt: 'Cinta Métrica',
          titulo: 'Cinta Métrica (50km)',
          precio: '$12',
        },
        {
          imagen: '/img_articulos/pipeta.png',
          alt: 'Pipeta Volumétrica',
          titulo: 'Pipeta Volumétrica',
          precio: '$20',
        },
      ],
    },
    // Asegúrate de añadir las demás categorías aquí de la misma forma...
    {
        id: 'postres',
        titulo: 'Postres',
        infoGeneral: [
            'Productos frescos elaborados diariamente',
            'Opciones vegetarianas y veganas disponibles',
            'Pedidos personalizados con anticipación',
            ' Envases ecológicos'

        ],
        procesoCompra: [
          'Pedidos por WhatsApp o presencial',
          'Entrega en puntos específicos del campus',
          'Opciones de compra al por mayor',
          'Reservas para eventos especiales',
        ],
        productos: [
          {
            imagen: '/img_articulos/manzana.png',
            alt: 'Manzanas caramelada',
            titulo: 'Manzanas caramelada',
            precio: '$4',
          },
          {
            imagen: '/img_articulos/pedidos_personalizados.png',
            alt: 'Capuchino  ',
            titulo: 'Capuchino ',
            precio: '$2',
          },
          {
            imagen: '/img_articulos/caseros.webp',
            alt: 'Helados Caseros',
            titulo: 'Helados Caseros',
            precio: '$2',
          },
        ],
      },  

      {
        id: 'tecnologia',
        titulo: 'tecnologia',
        infoGeneral: [
          'Productos originales con garantía',
          'Accesorios y componentes compatibles',
          'Asesoría técnica incluida',
          'Actualizaciones disponibles',
        ],
        procesoCompra: [
          'Prueba de funcionamiento garantizada',
          'Entrega en cualquier facultad',
          'Soporte post-venta',
          'Opciones de pago',
        ],
        productos: [
          {
            imagen: '/img_articulos/calculadora.jpg',
            alt: 'Calculadora Científica',
            titulo: 'Calculadora Científica',
            precio: '$40',
          },
          {
            imagen: '/img_articulos/audifonos.webp',
            alt: 'Audífonos',
            titulo: 'Audífonos',
            precio: '$12',
          },
          {
            imagen: '/img_articulos/c.png',
            alt: 'Cargadores',
            titulo: 'Cargadores',
            precio: '$20',
          },
          {
            imagen: '/img_articulos/electronica.jpg',
            alt: 'Componentes Electrónicos',
            titulo: 'Componentes Electrónicos',
            precio: '$10',
          },
        ],
      },
      {
        id: 'accesorios',
        titulo: 'Accesorios',
        infoGeneral: [
          'Materiales de alta calidad',
          'Variedad de diseños y colores',
          'Productos para todas las carreras',
          'Personalizaciones disponibles',
        ],
        procesoCompra: [
          'Visualización previa del producto',
          'Entrega inmediata',
          'Cambios y devoluciones',
          'Descuentos por cantidad',
        ],
        productos: [
          {
            imagen: '/img_articulos/esfero.jpg',
            alt: 'Esferos',
            titulo: 'Esferos Multicolor',
            precio: '$3.00',
          },
          {
            imagen: '/img_articulos/escuadras.png',
            alt: 'Escuadras',
            titulo: 'Juego de Escuadras',
            precio: '$2',
          },
          {
            imagen: '/img_articulos/mochilas.png',
            alt: 'Mochilas',
            titulo: 'Mochilas',
            precio: '$10-$20',
          },
        ],
      },
      {
        id: 'variados',
        titulo: 'Variados',
        infoGeneral: [
          'Productos únicos y originales',
          'Artículos de temporada',
          'Opciones personalizables',
          'Novedades semanales',
        ],
        procesoCompra: [
          'Catálogo actualizado constantemente',
          'Apartado de productos',
          'Entregas coordinadas',
          'Precios negociables',
        ],
        productos: [
          {
            imagen: '/img_articulos/pulseras.webp',
            alt: 'Pulseras',
            titulo: 'Pulseras',
            precio: '$4.00',
          },
          {
            imagen: '/img_articulos/llaveros.jpeg',
            alt: 'Llaveros',
            titulo: 'Llaveros',
            precio: '$1.20',
          },
          {
            imagen: '/img_articulos/gafas.jpg',
            alt: 'Gafas',
            titulo: 'Gafas',
            precio: '$20',
          },
        ],
      },






  ];

  return (
    <div>
      
      {Articulo_carrusel.map((categoria) => (
        <Categoria key={categoria.id} {...categoria} />
      ))}
    </div>
  );
};

export default Articulos;
