import React from 'react';
import '../CSS_Components/Categories.css'; 

const Categories = () => {
  return (
    <section className="categories-section">
      <h2 className="categories-title">Si lo estás buscando, aquí lo encontrarás.</h2>

      <div>
        {/* Primera fila - Libros */}
        <div className="categories-grid">
        {/* Fila 1 - Libros */}
        <div className="category-item">
          <img src="/ImagenesP/Libro1.jpg" alt="Inglés Avanzado" />
          <div className="category-label">Avanzado</div>
          <div className="category-content">
            <h3 className="category-name">Inglés Avanzado</h3>
            <ul>
              <li>Material oficial CEC</li>
              <li>Nivel B2/C1</li>
              <li>Incluye audio digital</li>
              <li>Excelente estado</li>
            </ul>
          </div>
        </div>

        <div className="category-item">
          <img src="/ImagenesP/Libro2.avif" alt="Inglés Básico" />
          <div className="category-label">Básico</div>
          <div className="category-content">
            <h3 className="category-name">Inglés Básico</h3>
            <ul>
              <li>Material para principiantes</li>
              <li>Nivel A1/A2</li>
              <li>Ejercicios prácticos</li>
              <li>Ideal para primer nivel</li>
            </ul>
          </div>
        </div>

        <div className="category-item">
          <img src="/ImagenesP/Libros3.jpg" alt="Libros Varios" />
          <div className="category-label">Variado</div>
          <div className="category-content">
            <h3 className="category-name">Libros Varios</h3>
            <ul>
              <li>Múltiples materias</li>
              <li>Literatura clásica</li>
              <li>Material complementario</li>
              <li>Precios accesibles</li>
            </ul>
          </div>
        </div>

        </div>
        </div>
        
        {/* Segunda fila - Herramientas y más */}
        <div className="categories-grid-second">
          <div className="category-item">
          <img src="/ImagenesP/Fexometro.jpeg" alt="Herramientas" />
          <div className="category-label">Herramientas</div>
          <div className="category-content">
            <h3 className="category-name">Herramientas</h3>
            <ul>
              <li>Instrumentos de medición</li>
              <li>Herramientas de precisión</li>
              <li>Material de laboratorio</li>
              <li>Equipos especializados</li>
            </ul>
          </div>
        </div>

        <div className="category-item">
          <img src="/ImagenesP/Tecni.jpg" alt="Tecnología" />
          <div className="category-label">Tecnología</div>
          <div className="category-content">
            <h3 className="category-name">Tecnología</h3>
            <ul>
              <li>Calculadoras científicas</li>
              <li>Accesorios electrónicos</li>
              <li>Gadgets útiles</li>
              <li>Componentes varios</li>
            </ul>
          </div>
        </div>

        <div className="category-item">
          <img src="/ImagenesP/Postres.PNG" alt="Postres" />
          <div className="category-label">Postres</div>
          <div className="category-content">
            <h3 className="category-name">Postres</h3>
            <ul>
              <li>Productos caseros</li>
              <li>Galletas artesanales</li>
              <li>Postres personalizados</li>
              <li>Precios estudiantiles</li>
            </ul>
          </div>
        </div>

        <div className="category-item">
          <img src="/ImagenesP/Accesorios.jfif" alt="Accesorios" />
          <div className="category-label">Accesorios</div>
          <div className="category-content">
            <h3 className="category-name">Accesorios</h3>
            <ul>
              <li>Útiles escolares</li>
              <li>Artículos de papelería</li>
              <li>Artículos diversos</li>
              <li>Accesorios varios</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;