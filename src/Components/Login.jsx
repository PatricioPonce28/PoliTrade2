import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import '../CSS_Components/Login.css';

// Configuración de Face++
const API_KEY = '1vIyyMFsK6fZDEXoqZuqRWzULeD6EW7J';
const API_SECRET = '7L9iLl8j-z7s9tqmD8n7zRz2ucAtXQf3';
const FACE_API_ENDPOINT = 'https://api-us.faceplusplus.com/facepp/v3';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFacialVerification, setShowFacialVerification] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [debugInfo, setDebugInfo] = useState(''); // Para mostrar información de depuración
  
  const videoRef = useRef(null);
  
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: '',
    recordar: false
  });

  // Iniciar cámara cuando se muestra la verificación facial
  useEffect(() => {
    if (showFacialVerification && videoRef.current) {
      startCamera();
    }
    
    // Limpiar recursos al desmontar
    return () => {
      stopCamera();
    };
  }, [showFacialVerification]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Función para iniciar la cámara
  const startCamera = async () => {
    try {
      setDebugInfo('Iniciando cámara...');
      stopCamera(); // Asegurarse de detener cualquier cámara activa primero
      
      const constraints = { 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => {
            console.error("Error reproduciendo video:", e);
            setDebugInfo(`Error al reproducir video: ${e.message}`);
          });
        };
        setDebugInfo('Cámara iniciada correctamente');
      }
    } catch (err) {
      console.error("Error al iniciar la cámara:", err);
      setError(`Error al acceder a la cámara: ${err.message}`);
      setDebugInfo(`Error cámara: ${err.message}`);
    }
  };

  // Función para detener la cámara
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setDebugInfo('Cámara detenida');
    }
  };

  // Función para capturar imagen
  const captureImage = () => {
    try {
      setDebugInfo('Capturando imagen...');
      if (!videoRef.current) {
        setDebugInfo('Error: No hay elemento de video');
        return null;
      }
      
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      
      // Asegurarse de que el video tenga dimensiones
      if (!video.videoWidth) {
        setDebugInfo('Error: El video no tiene dimensiones');
        return null;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setDebugInfo('Imagen capturada correctamente');
      
      return imageData.split(',')[1]; // Retornar solo la parte de datos base64
    } catch (err) {
      console.error("Error al capturar imagen:", err);
      setDebugInfo(`Error al capturar: ${err.message}`);
      return null;
    }
  };

  // Verificar identidad facial con Face++
  const verifyFace = async () => {
    setLoading(true);
    setError('');
    setDebugInfo('Iniciando verificación facial...');
    
    try {
      // 1. Verificar que tengamos la información del usuario
      if (!userInfo || !userInfo.facialId) {
        throw new Error('No hay información facial disponible');
      }
      
      // 2. Capturar imagen actual
      const imageBase64 = captureImage();
      if (!imageBase64) {
        throw new Error('No se pudo capturar la imagen');
      }
      
      setDebugInfo('Enviando solicitud a Face++ API...');
      
      // 3. Crear FormData para la solicitud
      const formData = new FormData();
      formData.append('api_key', API_KEY);
      formData.append('api_secret', API_SECRET);
      formData.append('face_token1', userInfo.facialId);
      formData.append('image_base64_2', imageBase64);
      
      // 4. Hacer la solicitud a Face++ API
      const response = await fetch(`${FACE_API_ENDPOINT}/compare`, {
        method: 'POST',
        body: formData
      });
      
      // 5. Verificar respuesta HTTP
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la respuesta: ${response.status} ${errorText}`);
      }
      
      // 6. Procesar respuesta
      const result = await response.json();
      setDebugInfo(`Respuesta recibida: ${JSON.stringify(result)}`);
      
      // 7. Verificar confianza
      if (result.confidence && result.confidence >= 70) {
        setDebugInfo('¡Verificación exitosa! Redirigiendo...');
        
        // Guardar info en localStorage si está marcado
        if (formData.recordar) {
          localStorage.setItem('userEmail', formData.correo);
        }
        
        // Redirigir después de un breve retraso
        setTimeout(() => {
          navigate('/Dashboard');
        }, 1500);
      } else {
        throw new Error(`Verificación fallida: confianza ${result.confidence || 0}% (menor a 70%)`);
      }
    } catch (err) {
      console.error("Error en verificación facial:", err);
      setError(`Error en verificación: ${err.message}`);
      setDebugInfo(`Error verificación: ${err.message}`);
      setLoading(false);
    }
  };

  // Primera etapa: login con correo y contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setDebugInfo('Iniciando autenticación...');
    
    try {
      // 1. Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.correo,
        formData.contrasena
      );
      
      setDebugInfo(`Usuario autenticado: ${userCredential.user.uid}`);
      
      // 2. Obtener datos del usuario desde Firestore
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (!userDoc.exists()) {
        setDebugInfo('No se encontraron datos del usuario en Firestore');
        throw new Error("No se encontraron datos del usuario");
      }
      
      const userData = userDoc.data();
      setDebugInfo(`Datos obtenidos: ${JSON.stringify(userData)}`);
      
      // 3. Verificar si tiene facialId
      if (!userData.facialId) {
        setDebugInfo('Usuario sin identificación facial');
        throw new Error("Este usuario no tiene registro facial");
      }
      
      // 4. Guardar información y mostrar pantalla de verificación
      setUserInfo(userData);
      setShowFacialVerification(true);
      setLoading(false);
      
    } catch (err) {
      console.error("Error en autenticación:", err);
      setDebugInfo(`Error: ${err.message}`);
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos');
      } else if (err.code === 'auth/user-not-found') {
        setError('Usuario no encontrado');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Intenta más tarde.');
      } else {
        setError(`Error: ${err.message}`);
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img 
          src="../ImagenesP/Logo1.png"
          alt="Logo"
          className="logo-image"
          onError={(e) => {
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiPlBvbGlUcmFkZTwvdGV4dD48L3N2Zz4=";
          }}
        />
        
        {!showFacialVerification ? (
          // Formulario de login normal
          <>
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
              
              <button 
                type="submit" 
                className="iniciar-sesion-btn"
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </form>
            
            <p className="registro-link">
              ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
            </p>
          </>
        ) : (
          // Pantalla de verificación facial
          <div className="facial-verification">
            <h2>Verificación Facial</h2>
            <p>Por favor, mire a la cámara para verificar su identidad</p>
            
            {error && (
              <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>
                {error}
              </p>
            )}
            
            <div className="camera-container">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            
            <button 
              onClick={verifyFace}
              className="verificar-btn"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginTop: '10px'
              }}
            >
              {loading ? 'Verificando...' : 'Verificar Identidad'}
            </button>
            
            <button 
              onClick={() => {
                stopCamera();
                setShowFacialVerification(false);
              }}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginTop: '10px'
              }}
            >
              Volver
            </button>
            
            {/* Sección de debug que puedes eliminar en producción */}
            <div className="debug-info" style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
              <p>Estado: {debugInfo}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;