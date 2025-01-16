import React from 'react';
import '../CSS_Components/Footer.css';

const Footer = () => {
  return (
    <div className="new-footer">
      <div className="footer-content">
        <div className="footer-contact">
          <p>Contáctanos:</p>
          <a href="mailto:alisson.viracocha@epn.edu.ec" className="footer-email">
            alisson.viracocha@epn.edu.ec
          </a>
        </div>
        
        <div className="footer-social">
          <a href="https://www.facebook.com/profile.php?id=61568182606659" 
             target="_blank" 
             rel="noopener noreferrer">
            <img src="/ImagenesP/Face.png" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/duck_mc666/" 
             target="_blank" 
             rel="noopener noreferrer">
            <img src="/ImagenesP/Instagram.png" alt="Instagram" />
          </a>
          <a href="https://api.whatsapp.com/send?phone=593999846455&text=Hola,%20quiero%20m%C3%A1s%20informaci%C3%B3n" 
             target="_blank" 
             rel="noopener noreferrer">
            <img src="/ImagenesP/Whatsapp.png" alt="WhatsApp" />
          </a>
        </div>

        <div className="footer-copyright">
          © 2024 Poli-Trade. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default Footer;