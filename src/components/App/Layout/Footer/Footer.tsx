// ? Style
import './style.scss';

// ? Fonction principale
function Footer() {
  // ? Rendu JSX
  return (
    <div className="Footer">
      <p className="Footer--contact">Contact: mail</p>
      <p className="Footer--copyright">
        Copyright © 2023 - Tous droits réservés.
      </p>
      <p className="Footer--cgu">CGU</p>
    </div>
  );
}

export default Footer;
