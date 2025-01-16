import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS_Components/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: '',
    recordar: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica para enviar los datos del formulario
    console.log('Datos del formulario:', formData);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img 
          src="../ImagenesP/Logo1.png"
          alt="Logo"
          className="logo-image"
        />
        
        <h1>Bienvenido</h1>
        <p className="login-subtitulo">
          Inicia sesión para acceder a Poli Trade
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="correo">Correo Institucional</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          <div className="recordar-container">
            <label className="recordar-label">
              <input
                type="checkbox"
                name="recordar"
                checked={formData.recordar}
                onChange={handleChange}
              />
              <span className="recordar-text">Recordar mi sesión</span>
            </label>
          </div>

          <button type="submit" className="iniciar-sesion-btn">
            Iniciar Sesión
          </button>
        </form>

        <p className="registro-link">
          ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;