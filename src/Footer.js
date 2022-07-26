import React from 'react';
import Heart from './img/heart.png';
import './Footer.css';

function Footer(){
  return (
    <footer className="footer">
      <section className="copy">
        Copyright © 2022 - MITXPRO
      </section>
      <section className="author">
        Made with <img src={Heart} alt="Love"/> for <a href="https://github.com/arturomsoberanes" target="_blank" rel="noopener">Arturo Soberanes</a>
      </section>
    </footer>
  );
}

export default Footer;
