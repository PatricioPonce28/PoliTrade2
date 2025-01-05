import React, { useState, useEffect } from 'react';
import '../CSS_Components/Off.css'; 

const Off = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const offers = [
    {
      image: '/ImagenesP/Off1.jpeg',
      title: 'Alquier de Casilleros'
    },
    {
      image: '/ImagenesP/Off2.jpg',
      title: 'Inscripciones Abiertas'
    },
    {
      image: '/ImagenesP/Off3.PNG',
      title: 'Audífonos Monster XKT20'
    },
    {
      image: '/ImagenesP/Off4.PNG',
      title: 'Parlante Inalámbrico LENOVO K30'
    },
    {
      image: '/ImagenesP/Off5.PNG',
      title: 'Parlante Inalámbrico LENOVO K30'
    }
  ];

  const testimonials = [
    {
      name: 'Ana María',
      career: 'Ingeniería en Sistemas',
      comment: 'Encontré los libros que necesitaba a excelentes precios. La plataforma es muy fácil de usar y los vendedores son muy amables.'
    },
    {
      name: 'Carlos López',
      career: 'Mecatrónica',
      comment: 'Pude conseguir mis herramientas de laboratorio a mitad de precio. ¡Excelente iniciativa para los estudiantes!'
    },
    {
      name: 'Diana Torres',
      career: 'Química',
      comment: 'Los materiales de segunda mano están en perfecto estado. Me ayudó mucho a ahorrar en este semestre.'
    },
    {
      name: 'Juan Pérez',
      career: 'Ingeniería Civil',
      comment: 'El alquiler de casilleros es super conveniente. Ya no tengo que cargar todos mis materiales todo el día.'
    },
    {
      name: 'María Sánchez',
      career: 'Ingeniería Ambiental',
      comment: 'Los precios son muy accesibles y la comunidad es muy colaborativa. Me encanta el ambiente de intercambio entre estudiantes.'
    },
    {
      name: 'Roberto Gómez',
      career: 'Ingeniería Eléctrica',
      comment: 'Excelente para encontrar calculadoras y equipos especializados. Me han sacado de apuros varias veces.'
    },
    {
      name: 'Valentina Ruiz',
      career: 'Arquitectura',
      comment: 'He podido vender materiales que ya no uso y comprar otros que necesito. Es una plataforma muy útil para reciclar recursos.'
    },
    {
      name: 'Gabriel Mora',
      career: 'Ingeniería en Software',
      comment: 'Los gadgets tecnológicos están a muy buen precio. La comunicación con los vendedores es rápida y efectiva.'
    },
    {
      name: 'Camila Vega',
      career: 'Geología',
      comment: 'He encontrado libros especializados que son difíciles de conseguir en otros lugares. ¡Muy recomendado!'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === offers.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [offers.length]);

  return (
    <section className="offers-section">
      <h2 className="offers-title">Ofertas</h2>
      
      <div className="carousel-container">
        <div 
          className="carousel-track" 
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {offers.map((offer, index) => (
            <div key={index} className="carousel-slide">
              <img src={offer.image} alt={offer.title} />
            </div>
          ))}
        </div>
      </div>

      <div className="testimonials-container">
        <h3 className="testimonials-title">Lo que dicen nuestros usuarios</h3>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-comment">{testimonial.comment}</p>
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.career}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Off;