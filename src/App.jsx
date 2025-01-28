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
import Dashboard from './Components/Dashboard'

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

// Componente para páginas que requieren Header y Footer
const LayoutWithHeaderFooter = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas con Header y Footer */}
        <Route path="/" element={
          <LayoutWithHeaderFooter>
            <HomePage />
          </LayoutWithHeaderFooter>
        } />
        <Route path="/articulos" element={
          <LayoutWithHeaderFooter>
            <Articulos />
          </LayoutWithHeaderFooter>
        } />
        <Route path="/ofertas" element={
          <LayoutWithHeaderFooter>
            <Off />
          </LayoutWithHeaderFooter>
        } />
        <Route path="/contactos" element={
          <LayoutWithHeaderFooter>
            <Location />
          </LayoutWithHeaderFooter>
        } />
        <Route path="/quienes-somos" element={
          <LayoutWithHeaderFooter>
            <QuienesSomos />
          </LayoutWithHeaderFooter>
        } />
        <Route path="/login" element={
          <LayoutWithHeaderFooter>
            <Login />
          </LayoutWithHeaderFooter>
        } />
        <Route path="/registro" element={
          <LayoutWithHeaderFooter>
            <Registrate />
          </LayoutWithHeaderFooter>
        } />

        {/* Rutas sin Header y Footer */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App


