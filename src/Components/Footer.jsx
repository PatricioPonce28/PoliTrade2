import React from 'react';
import '../CSS_Components/Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="contact-info">
        <span>Contáctanos: </span>
        <a href="mailto:alisson.viracocha@epn.edu.ec" className="email-link">
          alisson.viracocha@epn.edu.ec
        </a>
      </div>

      <div className="copyright">
        © 2024 Poli-Trade. Todos los derechos reservados.
      </div>

      <div className="social-links">
        <a 
          href="https://www.facebook.com/profile.php?id=61568182606659" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-icon facebook"
        >
          <img src="/ImagenesP/Face.png" alt="Facebook" />
        </a>
        <a 
          href="https://www.instagram.com/duck_mc666/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-icon instagram"
        >
          <img src="/ImagenesP/Instagram.png" alt="Instagram" />
        </a>
        <a 
          href="https://api.whatsapp.com/send?phone=593999846455&text=Hola,%20quiero%20m%C3%A1s%20informaci%C3%B3n" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-icon whatsapp"
        >
          <img src="/ImagenesP/Whatsapp.png" alt="WhatsApp" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;