import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import '../CSS_Components/Registrate.css';

const Registrate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [facialId, setFacialId] = useState('');
  const [isFaceRegistered, setIsFaceRegistered] = useState(false);
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      stream.getTracks().forEach(track => track.stop());
      
      return canvas.toDataURL('image/jpeg').split(',')[1]; // Devuelve base64 sin el prefijo
    } catch (error) {
      console.error("Error al capturar imagen:", error);
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
      
      // 2. Detectar rostro y crear FaceToken
      const detectResponse = await fetch(`${FACE_API_ENDPOINT}/detect`, {
        method: 'POST',
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
      
      // 3. Crear FaceSet (opcional, para agrupar rostros)
      // 4. Guardar FaceToken como identificador único
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
        setError('No se detectó ningún rostro');
        break;
      case 'MULTIPLE_FACES':
        setError('Se detectó más de un rostro');
        break;
      case 'PERMISSION_REFUSED':
        setError('Permiso de cámara denegado');
        break;
      default:
        setError('Error en registro facial: ' + error.toString());
    }
  };

  // Función para guardar datos en Firestore
  const saveUserData = async (userId, facialId) => {
    try {
      await setDoc(doc(db, "users", userId), {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        facialId: facialId,
        createdAt: new Date().toISOString(),
        lastLogin: null
      });
      console.log("Datos de usuario guardados en Firestore");
    } catch (error) {
      console.error("Error guardando datos en Firestore:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
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
      
      // 2. Guardar datos adicionales en Firestore
      await saveUserData(userCredential.user.uid, facialId);
      
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
          {/* ... (resto del formulario permanece igual) ... */}
          
          <div className="form-group">
            <label>Autenticación Facial</label>
            <button 
              type="button" 
              onClick={handleFacialRegistration}
              className={`facial-registration-btn ${isFaceRegistered ? 'success' : ''}`}
              disabled={!formData.correo || !formData.nombres}
            >
              {isFaceRegistered ? '✓ Rostro Registrado' : 'Registrar mi Rostro'}
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