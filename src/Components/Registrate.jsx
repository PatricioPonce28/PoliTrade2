import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../CSS_Components/Registrate.css';

// Obtener las variables de entorno para la API de Face++
const FACE_API_KEY = import.meta.env?.REACT_APP_FACE_API_KEY;
const FACE_API_SECRET = import.meta.env?.REACT_APP_FACE_API_SECRET;
const FACE_API_ENDPOINT = import.meta.env?.REACT_APP_FACE_API_ENDPOINT || 'https://api-us.faceplusplus.com/facepp/v3';

const Registrate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [facialId, setFacialId] = useState('');
  const [isFaceRegistered, setIsFaceRegistered] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Función para capturar imagen desde la cámara
  const captureImage = async () => {
    try {
      setIsCapturing(true);
      console.log("Solicitando acceso a la cámara...");
      
      // Especificar más opciones para la cámara
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"  // Cámara frontal
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Acceso a la cámara concedido:", stream);
      
      // Crear elementos para mostrar vista previa
      const videoPreview = document.createElement('video');
      videoPreview.srcObject = stream;
      videoPreview.className = 'camera-preview';
      videoPreview.setAttribute('autoplay', 'true');
      videoPreview.setAttribute('playsinline', 'true');  // Importante para iOS
      
      const previewContainer = document.getElementById('camera-container');
      if (!previewContainer) {
        console.error("No se encontró el contenedor de la cámara");
        throw new Error('CONTAINER_NOT_FOUND');
      }
      
      previewContainer.innerHTML = '';
      previewContainer.appendChild(videoPreview);
      
      // Esperar a que el video se cargue
      return new Promise((resolve) => {
        videoPreview.onloadedmetadata = async () => {
          try {
            await videoPreview.play();
            console.log("Video reproduciendo correctamente");
            
            // Esperar un poco para que la cámara se estabilice
            await new Promise(resolveTimer => setTimeout(resolveTimer, 1000));
            
            const canvas = document.createElement('canvas');
            canvas.width = videoPreview.videoWidth;
            canvas.height = videoPreview.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoPreview, 0, 0, canvas.width, canvas.height);
            
            // Detener el stream de la cámara
            stream.getTracks().forEach(track => track.stop());
            
            // Mostrar la imagen capturada
            const capturedImg = document.createElement('img');
            capturedImg.src = canvas.toDataURL('image/jpeg');
            capturedImg.className = 'captured-image';
            previewContainer.innerHTML = '';
            previewContainer.appendChild(capturedImg);
            
            setIsCapturing(false);
            console.log("Imagen capturada exitosamente");
            resolve(canvas.toDataURL('image/jpeg').split(',')[1]);
          } catch (error) {
            console.error("Error durante la captura:", error);
            setIsCapturing(false);
            throw error;
          }
        };
        
        videoPreview.onerror = (error) => {
          console.error("Error al cargar el video:", error);
          setIsCapturing(false);
          throw error;
        };
      });
    } catch (error) {
      setIsCapturing(false);
      console.error("Error al capturar imagen:", error);
      
      if (error.name === 'NotAllowedError') {
        alert('Permiso de cámara denegado. Por favor, permita el acceso a la cámara.');
        throw new Error('PERMISSION_REFUSED');
      } else if (error.name === 'NotFoundError') {
        alert('No se ha encontrado cámara en este dispositivo.');
        throw new Error('CAMERA_NOT_FOUND');
      } else if (error.name === 'NotReadableError') {
        alert('La cámara está siendo utilizada por otra aplicación.');
        throw new Error('CAMERA_IN_USE');
      }
      
      alert('Error al acceder a la cámara: ' + error.message);
      throw error;
    }
  };

  // Función para registrar el rostro con Face++
  const handleFacialRegistration = async () => {
    try {
      if (!formData.correo || !formData.nombres) {
        setError('Por favor complete el correo y nombres antes del registro facial');
        return;
      }

      // 1. Capturar imagen
      const imageBase64 = await captureImage();
      
      // 2. Detectar rostro y crear FaceToken con Face++
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
      
      return faceToken;
    } catch (error) {
      console.error("Error en registro facial:", error);
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
          src="../ImagenesP/Logo1.png"
          alt="Logo"
          className="logo-image"
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
            <div id="camera-container" className="camera-container"></div>
            <button 
              type="button" 
              onClick={handleFacialRegistration}
              className={`facial-registration-btn ${isFaceRegistered ? 'success' : ''}`}
              disabled={!formData.correo || !formData.nombres || isCapturing}
            >
              {isCapturing ? 'Capturando...' : 
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