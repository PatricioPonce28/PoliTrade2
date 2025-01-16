import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './Components/Header'
import Welcome from './Components/Welcome'
import Categories from './Components/Categories'
import Off from './Components/Off'
import Comenta from './Components/Comenta'
import Footer from './Components/Footer'
import Location from './Components/Location'
import Articulos from './Components/Articulos'
import QuienesSomos from './Components/Quiensomos'
import Login from './Components/Login'
import Registrate from './Components/Registrate'

const HomePage = () => {
  return (
    <>
      <Welcome />
      <Categories />
      <Off />
      <Comenta />
      <Location />
    </>
  )
}

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articulos" element={<Articulos />} />
        <Route path="/ofertas" element={<Off />} />
        <Route path="/contactos" element={<Location />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registrate />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App



