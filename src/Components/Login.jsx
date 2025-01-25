import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../CSS_Components/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.correo,
        formData.contrasena
      );
      
      if (formData.recordar) {
        // Implementar persistencia de sesión
        localStorage.setItem('userEmail', formData.correo);
      }

      console.log('Usuario autenticado:', userCredential.user);
      navigate('/dashboard'); // Ajusta esta ruta según tu aplicación
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Usuario no encontrado');
          break;
        case 'auth/wrong-password':
          setError('Contraseña incorrecta');
          break;
        case 'auth/invalid-email':
          setError('Correo electrónico inválido');
          break;
        default:
          setError('Error al iniciar sesión');
      }
    }
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

        {error && (
          <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="correo">Correo</label>
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