// ? Librairies
import { useAppSelector, useAppDispatch } from '../../../../../../hook/redux';

// ? Fonctions externes
import { toggleIsOpen } from '../../../../../../store/reducer/log';

// ? Style
import './style.scss';

// ? Fonction principale
function Burger() {
  // ? State
  // Redux
  const isOpen = useAppSelector((state) => state.log.isOpen); // On récupère la state isOpen du reducer log

  // ? dispatch
  const dispatch = useAppDispatch();

  // ? Fonctions
  /** //* Gestion du burger
   * @param {void} handleClick - On ouvre ou ferme le burger
   * Au clic sur le burger, on ouvre ou ferme le burger
   */
  const handleClick = () => {
    dispatch(toggleIsOpen()); // On lance la fonction toggleIsOpen() du reducer log
  };
  /** //! Accessibilité
   * Une div n'est pas un element clickable par défaut.
   * @param {React.KeyboardEvent<HTMLDivElement>} event - event du clavier
   * On ajoute un fonction d’accessibilité pour le clavier.
   * Si la touche enter ou espace est pressée, on appelle la fonction handleClick() juste au dessus.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'enter' || event.key === ' ') {
      handleClick();
    }
  };

  // ? Rendu JSX
  return (
    <div
      className={`burger ${isOpen ? 'open' : ''}`} // On ajoute la classe 'open' si isOpen est true > Gestion de l'animation du burger en css
      role="button" // On donne un role de bouton à la div (pour l'accessibilité)
      onClick={handleClick} // Au clic sur le burger, on lance la fonction handleClick() juste au dessus
      tabIndex={0} // On rend la div focusable (pour l'accessibilité)
      onKeyDown={handleKeyDown} // Au clavier sur le burger, on lance la fonction handleKeyDown() juste au dessus
    >
      <div className={`btn ${isOpen ? 'active' : ''}`}>
        {' '}
        {/* On ajoute la classe 'active' si isOpen est true > Gestion de l'animation du burger en css */}
        <div className="lines" />
        <div className="lines" />
        <div className="lines" />
      </div>
    </div>
  );
}

export default Burger;
