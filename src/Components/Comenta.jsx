import React from 'react';
import '../CSS_Components/Comenta.css'; 

const Comenta = () => {
  return (
    <section className="comment-section">
      <div className="comment-container">
        <h2 className="comment-title">Agregar un Comentario</h2>
        
        <div className="rating">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>

        <textarea
          className="comment-input"
          placeholder="Escribe tu comentario aquí..."
          rows={4}
        />

        <button className="submit-button">
          Enviar
        </button>
      </div>
    </section>
  );
};

export default Comenta;