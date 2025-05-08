import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../CSS_Components/Registrate.css';

// Obtener las variables de entorno para la API de Face++
const FACE_API_KEY = import.meta.env?.REACT_APP_FACE_API_KEY || '1wXvLKJrR4vSyyBMEf58aw4MG9_XMb3I';
const FACE_API_SECRET = import.meta.env?.REACT_APP_FACE_API_SECRET || 'sCzhzgXyqz8gY8X99Xe-jKjBJYhjFbPJk0fg';
const FACE_API_ENDPOINT = import.meta.env?.REACT_APP_FACE_API_ENDPOINT || 'https://api-us.faceplusplus.com/facepp/v3';

const Registrate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [facialId, setFacialId] = useState('');
  const [isFaceRegistered, setIsFaceRegistered] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  // Solicitar acceso a la cámara automáticamente cuando el componente se monta
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        console.log("Solicitando permiso de cámara automáticamente al cargar...");
        // Esto desencadenará el diálogo de permisos
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          }
        });
        console.log("Permiso de cámara concedido");
        
        // Inmediatamente detener el stream para no consumir recursos
        mediaStream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.log("Error al solicitar permiso de cámara:", err);
        // No mostramos error aquí, se manejará cuando el usuario intente usar la cámara
      }
    };
    
    // Llamar a la función cuando el componente se monta
    requestCameraPermission();
    
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

  // Iniciar la cámara cuando se hace clic en el botón
  const startCamera = async () => {
    if (!formData.correo || !formData.nombres) {
      setError('Por favor complete el correo y nombres antes del registro facial');
      return;
    }
    
    setIsCapturing(true);
    setError('');
    
    try {
      console.log("Solicitando acceso a la cámara...");
      
      // Detener cualquier stream existente
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      });
      
      // IMPORTANTE: Asegurarse de que el elemento de video existe
      if (videoRef.current) {
        // Asignar el stream
        videoRef.current.srcObject = mediaStream;
        
        // Esperar a que el video esté listo antes de intentar reproducirlo
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => {
              console.log("Video reproduciendo correctamente");
              setStream(mediaStream);
            })
            .catch(err => {
              console.error("Error al reproducir video:", err);
              setError('Error al iniciar la cámara: no se pudo reproducir video');
              setIsCapturing(false);
            });
        };
        
        console.log("Stream asignado al elemento de video");
      } else {
        console.error("Elemento de video no encontrado");
        throw new Error("Elemento de video no encontrado");
      }
    } catch (err) {
      console.error("Error al iniciar la cámara:", err);
      
      if (err.name === 'NotAllowedError') {
        setError('Permiso de cámara denegado. Por favor, permita el acceso a la cámara y recargue la página.');
      } else if (err.name === 'NotFoundError') {
        setError('No se encontró una cámara en este dispositivo.');
      } else if (err.name === 'NotReadableError') {
        setError('La cámara está en uso por otra aplicación.');
      } else {
        setError('Error al acceder a la cámara: ' + err.message);
      }
      
      setIsCapturing(false);
    }
  };

  // Capturar la imagen
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !stream) {
      console.error("No se puede capturar la foto: video, canvas o stream no disponible");
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    try {
      // Establecer dimensiones del canvas según el video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      console.log(`Dimensiones del video: ${video.videoWidth}x${video.videoHeight}`);
      console.log(`Dimensiones del canvas: ${canvas.width}x${canvas.height}`);
      
      // Dibujar el frame actual del video en el canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Obtener la imagen como base64
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9); // 0.9 = 90% de calidad
      setCapturedImage(imageDataUrl);
      
      // Detener el stream de la cámara
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      
      console.log("Imagen capturada exitosamente");
      
      return imageDataUrl.split(',')[1]; // Retornar solo los datos base64 sin el prefijo
    } catch (err) {
      console.error("Error al capturar foto:", err);
      return null;
    }
  };

  // Función para registrar el rostro con Face++
  const handleFacialRegistration = async () => {
    if (!formData.correo || !formData.nombres) {
      setError('Por favor complete el correo y nombres antes del registro facial');
      return;
    }

    try {
      // Primer paso: iniciar la cámara si no está iniciada
      if (!stream) {
        await startCamera();
        return; // Salir para esperar a que la cámara se inicialice
      }
      
      // Si la cámara ya está activa, tomar la foto
      const imageBase64 = takePhoto();
      if (!imageBase64) {
        throw new Error("No se pudo capturar la imagen");
      }
      
      setIsCapturing(true);
      
      // Detectar rostro con Face++
      console.log("Enviando imagen a Face++ para detección...");
      const detectResponse = await fetch(`${FACE_API_ENDPOINT}/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          api_key: FACE_API_KEY,
          api_secret: FACE_API_SECRET,
          image_base64: imageBase64,
          return_landmark: 0,
          return_attributes: 'none'
        })
      });
      
      const detectData = await detectResponse.json();
      console.log("Respuesta de Face++:", detectData);
      
      if (!detectData.faces || detectData.faces.length === 0) {
        throw new Error('NO_FACE_DETECTED');
      }
      
      if (detectData.faces.length > 1) {
        throw new Error('MULTIPLE_FACES');
      }
      
      const faceToken = detectData.faces[0].face_token;
      
      // Guardar FaceToken como identificador único
      setFacialId(faceToken);
      setIsFaceRegistered(true);
      setIsCapturing(false);
      
      return faceToken;
    } catch (error) {
      console.error("Error en registro facial:", error);
      setIsCapturing(false);
      handleFaceAPIError(error);
      return null;
    }
  };

  const handleFaceAPIError = (error) => {
    switch(error.message) {
      case 'NO_FACE_DETECTED':
        setError('No se detectó ningún rostro. Asegúrese de estar bien iluminado y mirando a la cámara.');
        break;
      case 'MULTIPLE_FACES':
        setError('Se detectó más de un rostro. Por favor, asegúrese de ser la única persona en la imagen.');
        break;
      case 'PERMISSION_REFUSED':
        setError('Permiso de cámara denegado. Por favor, permita el acceso a la cámara.');
        break;
      default:
        setError('Error en registro facial: ' + error.toString());
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
      handleFirebaseError(error);
    }
  };

  const handleFirebaseError = (error) => {
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
              {!capturedImage && (
                <video 
                  ref={videoRef} 
                  className="camera-preview" 
                  autoPlay 
                  playsInline 
                  muted
                  style={{
                    width: '100%',
                    height: '240px',
                    backgroundColor: '#000',
                    objectFit: 'cover'
                  }}
                />
              )}
              
              {capturedImage && (
                <img 
                  src={capturedImage} 
                  alt="Imagen capturada" 
                  className="captured-image" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '240px'
                  }}
                />
              )}
              
              {/* Canvas oculto para capturar la imagen */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            
            <button 
              type="button" 
              onClick={handleFacialRegistration}
              className={`facial-registration-btn ${isFaceRegistered ? 'success' : ''}`}
              disabled={!formData.correo || !formData.nombres || isCapturing}
            >
              {isCapturing ? 'Capturando...' : 
              isFaceRegistered ? '✓ Rostro Registrado' : 
              stream ? 'Tomar Foto' : 'Registrar mi Rostro'}
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