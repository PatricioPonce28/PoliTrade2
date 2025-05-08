import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../CSS_Components/Registrate.css';

const API_KEY = '1vIyyMFsK6fZDEXoqZuqRWzULeD6EW7J';
const API_SECRET = '7L9iLl8j-z7s9tqmD8n7zRz2ucAtXQf3';
const FACE_API_ENDPOINT = 'https://api-us.faceplusplus.com/facepp/v3';

const Registrate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [facialId, setFacialId] = useState('');
  const [isFaceRegistered, setIsFaceRegistered] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const [message, setMessage] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  // Iniciar la cámara al cargar el componente, similar al código de tus compañeros
  useEffect(() => {
    startCamera();
    
    // Limpiar al desmontar
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Función para iniciar la cámara (como en el código de tus compañeros)
  const startCamera = async () => {
    try {
      console.log("Iniciando cámara...");
      
      // Detener cualquier stream existente
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        console.log("Cámara iniciada correctamente");
        setStream(mediaStream);
      }
    } catch (err) {
      console.error("Error al iniciar la cámara:", err);
      setError('Error al acceder a la cámara. Verifica los permisos.');
    }
  };

  // Función para capturar la imagen (similar al código de tus compañeros)
  const captureFace = async () => {
    try {
      if (!videoRef.current) return null;
      
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      return canvas.toDataURL('image/jpeg').split(',')[1];
    } catch (err) {
      console.error("Error al capturar imagen:", err);
      setError('Error al capturar la imagen');
      return null;
    }
  };

  // Función para registrar el rostro (usando el approach de tus compañeros)
  const handleFacialRegistration = async () => {
    if (!formData.correo || !formData.nombres) {
      setError('Por favor complete el correo y nombres antes del registro facial');
      return;
    }

    setIsCapturing(true);
    setError('');
    
    try {
      const imageBase64 = await captureFace();
      
      if (!imageBase64) {
        throw new Error('No se pudo capturar la imagen');
      }
      
      // Usar FormData como en el código de tus compañeros
      const formData = new FormData();
      formData.append('api_key', API_KEY);
      formData.append('api_secret', API_SECRET);
      formData.append('image_base64', imageBase64);
      
      const response = await fetch(`${FACE_API_ENDPOINT}/detect`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      console.log("Respuesta API Registro:", data);
      
      if (data.faces && data.faces.length > 0) {
        const faceToken = data.faces[0].face_token;
        
        // Guardar el token y marcar como registrado
        setFacialId(faceToken);
        setIsFaceRegistered(true);
        setMessage('¡Rostro registrado exitosamente!');
        
        return faceToken;
      } else {
        throw new Error('No se detectó ningún rostro. Verifica la iluminación y posición.');
      }
    } catch (error) {
      console.error("Error en registro facial:", error);
      setError('Error al registrar el rostro: ' + error.message);
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.nombres || !formData.apellidos || !formData.correo || !formData.contrasena) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!isFaceRegistered) {
      setError('Debe completar el registro facial');
      return;
    }

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.correo,
        formData.contrasena
      );
      
      // 2. En lugar de guardar en Firestore, solo mostramos un mensaje de éxito
      console.log("Usuario registrado con ID:", userCredential.user.uid);
      console.log("Datos del usuario:", {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        facialId: facialId
      });
      
      // 3. Redirigir al login
      navigate('/login');
    } catch (error) {
      console.error("Error en registro completo:", error);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Este correo ya está registrado');
          break;
        case 'auth/invalid-email':
          setError('Correo electrónico inválido');
          break;
        case 'auth/weak-password':
          setError('La contraseña debe tener al menos 6 caracteres');
          break;
        default:
          setError('Error al crear la cuenta: ' + error.message);
      }
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-form">
        <img 
          src="/ImagenesP/Logo1.png" 
          alt="Logo"
          className="logo-image"
          onError={(e) => {
            console.error("Error al cargar la imagen del logo:", e);
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiPlBvbGlUcmFkZTwvdGV4dD48L3N2Zz4="; // Imagen SVG de respaldo
          }}
        />
        
        <h1>Únete a Poli Trade</h1>
        <p className="registro-subtitulo">
          Registro con autenticación facial segura
        </p>

        {error && (
          <p className="error-message">{error}</p>
        )}
        
        {message && (
          <p className="success-message">{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombres">Nombres</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="apellidos">Apellidos</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
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
            
            <div className="form-group">
              <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmarContrasena"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group facial-auth-section">
            <label>Autenticación Facial</label>
            <div className="camera-container">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="camera-preview"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            
            <button 
              type="button" 
              onClick={handleFacialRegistration}
              className={`facial-registration-btn ${isFaceRegistered ? 'success' : ''}`}
              disabled={isCapturing}
            >
              {isCapturing ? 'Procesando...' : 
               isFaceRegistered ? '✓ Rostro Registrado' : 'Registrar mi Rostro'}
            </button>
            
            <p className="facial-hint">
              Debe permitir el acceso a la cámara para el registro facial
            </p>
          </div>

          <button 
            type="submit" 
            className="crear-cuenta-btn"
            disabled={!isFaceRegistered}
          >
            Completar Registro
          </button>
        </form>

        <p className="login-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Registrate;
