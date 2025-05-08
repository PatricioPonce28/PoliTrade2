import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { getFirestore, collection, addDoc, deleteDoc, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../CSS_Components/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [allPublicaciones, setAllPublicaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [nuevaPublicacion, setNuevaPublicacion] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    categoria: ''
  });
  const [editando, setEditando] = useState(null);
  const [joke, setJoke] = useState(null);
  const [loadingJoke, setLoadingJoke] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        cargarPublicaciones();
        cargarTodasLasPublicaciones();
        fetchRandomJoke(); // Cargar un chiste aleatorio al inicio
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Función para obtener un chiste aleatorio de la API
  const fetchRandomJoke = async () => {
    try {
      setLoadingJoke(true);
      const response = await fetch('https://v2.jokeapi.dev/joke/Programming,Miscellaneous?safe-mode');
      const data = await response.json();
      
      if (data.type === 'single') {
        setJoke({
          setup: data.joke,
          delivery: ""
        });
      } else {
        setJoke({
          setup: data.setup,
          delivery: data.delivery
        });
      }
      
      setLoadingJoke(false);
    } catch (error) {
      console.error("Error al cargar chiste:", error);
      setLoadingJoke(false);
    }
  };

  const cargarPublicaciones = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'publicaciones'), where('userId', '==', auth.currentUser.uid))
      );
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPublicaciones(docs);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    }
  };

  const cargarTodasLasPublicaciones = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'publicaciones'));
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllPublicaciones(docs);
    } catch (error) {
      console.error('Error al cargar todas las publicaciones:', error);
    }
  };

  // Esta es la función que faltaba
  const handleCerrarSesion = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const crearPublicacion = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'publicaciones'), {
        ...nuevaPublicacion,
        userId: user.uid,
        userEmail: user.email,
        fecha: new Date().toISOString()
      });
      setNuevaPublicacion({ titulo: '', descripcion: '', precio: '', categoria: '' });
      cargarPublicaciones();
      cargarTodasLasPublicaciones();
    } catch (error) {
      console.error('Error al crear publicación:', error);
    }
  };

  const eliminarPublicacion = async (id) => {
    try {
      await deleteDoc(doc(db, 'publicaciones', id));
      cargarPublicaciones();
      cargarTodasLasPublicaciones();
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
    }
  };

  const actualizarPublicacion = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'publicaciones', editando.id), {
        ...nuevaPublicacion
      });
      setEditando(null);
      setNuevaPublicacion({ titulo: '', descripcion: '', precio: '', categoria: '' });
      cargarPublicaciones();
      cargarTodasLasPublicaciones();
    } catch (error) {
      console.error('Error al actualizar publicación:', error);
    }
  };

  const publicacionesFiltradas = allPublicaciones.filter(pub => 
    pub.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    pub.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
    pub.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="dashboard-main">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="user-welcome">
            <p>Bienvenido, {user?.email}</p>
          </div>
          <button onClick={handleCerrarSesion} className="logout-button">
            Cerrar Sesión
          </button>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Buscar publicaciones..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="dashboard-content">
          <div className="crud-section">
            <div className="crud-card">
              <h2>Crear Publicación</h2>
              <form onSubmit={editando ? actualizarPublicacion : crearPublicacion}>
                <div className="form-group">
                  <input
                    type="text"
                    name="titulo"
                    placeholder="Título"
                    value={nuevaPublicacion.titulo}
                    onChange={(e) => setNuevaPublicacion({...nuevaPublicacion, titulo: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <textarea
                    placeholder="Descripción"
                    value={nuevaPublicacion.descripcion}
                    onChange={(e) => setNuevaPublicacion({...nuevaPublicacion, descripcion: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="number"
                    name="precio"
                    placeholder="Precio"
                    value={nuevaPublicacion.precio}
                    onChange={(e) => setNuevaPublicacion({...nuevaPublicacion, precio: e.target.value})}
                    min="0"
                    step="0.01"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <select
                    value={nuevaPublicacion.categoria}
                    onChange={(e) => setNuevaPublicacion({...nuevaPublicacion, categoria: e.target.value})}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="herramientas">Herramientas</option>
                    <option value="tecnologia">Tecnología</option>
                    <option value="postres">Postres</option>
                    <option value="accesorios">Accesorios</option>
                    <option value="libros_ingles_basico">Libros de Inglés Básicos</option>
                    <option value="libros_ingles_avanzado">Libros de Inglés Avanzado</option>
                    <option value="libros_general">Libros en General</option>
                  </select>
                </div>

                <button type="submit" className="crud-button">
                  {editando ? 'Actualizar' : 'Crear'} Publicación
                </button>
              </form>
            </div>

            {/* Sección del chiste - Justo después del formulario de crear publicación */}
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                padding: '20px',
                margin: '20px 0'
              }}
            >
              <h3 style={{color: 'red', textAlign: 'center', marginTop: 0}}>¡Chiste para desarrolladores!</h3>
              
              {loadingJoke ? (
                <p style={{textAlign: 'center'}}>Cargando chiste...</p>
              ) : joke ? (
                <div
                  style={{
                    padding: '15px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '6px',
                    margin: '15px 0'
                  }}
                >
                  <p><strong>{joke.setup}</strong></p>
                  {joke.delivery && <p style={{marginTop: '15px', fontWeight: 'bold'}}>{joke.delivery}</p>}
                </div>
              ) : (
                <p>No se pudo cargar el chiste.</p>
              )}
              
              <button 
                onClick={fetchRandomJoke} 
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                disabled={loadingJoke}
              >
                Nuevo chiste
              </button>
            </div>

            <div className="crud-card">
              <h2>Publicaciones Disponibles</h2>
              <div className="publicaciones-grid">
                {publicacionesFiltradas.map((pub) => (
                  <div key={pub.id} className="publicacion-item">
                    <h3>{pub.titulo}</h3>
                    <p>{pub.descripcion}</p>
                    <p className="precio">Precio: ${parseFloat(pub.precio).toFixed(2)}</p>
                    <p className="categoria">Categoría: {pub.categoria}</p>
                    <p className="vendedor">Vendedor: {pub.userEmail}</p>
                    {pub.userId === user?.uid && (
                      <div className="buttons-container">
                        <button 
                          onClick={() => {
                            setEditando(pub);
                            setNuevaPublicacion(pub);
                          }}
                          className="edit-button"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => eliminarPublicacion(pub.id)}
                          className="delete-button"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;