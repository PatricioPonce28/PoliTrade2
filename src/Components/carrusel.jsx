import React, { useState } from 'react';

const carrusel = ({ productos }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? productos.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === productos.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="carousel-container">
      <div className="carousel">
        {productos.map((producto, index) => (
          <div
            key={index}
            className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
          >
            <img src={producto.imagen} alt={producto.alt} />
            <div className="product-info">
              <h4>{producto.titulo}</h4>
              <div className="price">{producto.precio}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control prev" onClick={handlePrev}>
        ❮
      </button>
      <button className="carousel-control next" onClick={handleNext}>
        ❯
      </button>
    </div>
  );
};

export default carrusel;