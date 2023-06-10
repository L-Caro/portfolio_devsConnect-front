// ? Librairies
import { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

// ? Permet de relancer le rendu de ce composant à chaque fois que le state de la modale change
import { Switch } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../../hook/redux';

// ? Actions du reducer
import {
  toggleModalLogin,
  toggleModalSignin,
} from '../../../store/reducer/log';
import { signinUser } from '../../../store/reducer/user';

// ? Composants
import Input from '../Input';
import FlashMessage from '../FlashMessage/FlashMessage';

// ? Data
import { technos } from '../../../data/technosPath'; // Pour le choix des technos

// Styles
import './style.scss';

function Signin() {
  const flash = useAppSelector((state) => state.user.message);

  // State pour la selection des technos
  const [selectedTechnos, setSelectedTechnos] = useState([]);
  // State pour le check de open to work
  const [checked, setChecked] = useState(false);

  //! Ref pour la modale
  const modalRef = useRef(null);

  // ! Dispatch
  const dispatch = useAppDispatch();

  //! Navigate
  const navigate = useNavigate();

  //! useEffect pour clic externe à la modale
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Clic en dehors de la modale
        dispatch(toggleModalSignin());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //! Fonction pour fermer la modale avec la croix
  const handleSignin = () => {
    // On dispatch l'action qui va gérer l'ouverture de la modale
    dispatch(toggleModalSignin());
  };
  // * Une div n'est pas un element clickable
  // * Fonction d’accessibilité pour le clavier.
  // * Si la touche enter ou espace est pressée, on appelle la fonction handleClick()
  const handleSigninKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'enter' || event.key === ' ') {
      handleSignin();
    }
  };

  //! Fonction pour la selection des technos
  const handleImageClick = (imageId) => {
    if (selectedTechnos.includes(imageId)) {
      setSelectedTechnos(selectedTechnos.filter((id) => id !== imageId));
    } else {
      setSelectedTechnos([...selectedTechnos, imageId]);
    }
  };
  // * Une div n'est pas un element clickable
  // * Fonction d’accessibilité pour le clavier.
  // * Si la touche enter ou espace est pressée, on appelle la fonction handleClick()
  const handleImageKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'enter' || event.key === ' ') {
      handleImageClick(imageId);
    }
  };

  //! Fonction pour le switch open to work
  const handleSwitch = () => {
    setChecked(!checked);
  };

  //! Fonction pour l'envoie du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    dispatch(signinUser(formData));
    dispatch(toggleModalSignin());
    dispatch(toggleModalLogin());
    // navigate('/');
  };

  return (
    <div className="Signin">
      <div className="Signin--container" ref={modalRef}>
        <div className="Signin--container--head">
          <h2 className="Signin--title">Inscription</h2>
          <div
            className="Signin--close"
            role="button"
            tabIndex={0}
            onClick={handleSignin}
            onKeyDown={handleSigninKeyDown}
          >
            X
          </div>
        </div>
        <form onSubmit={handleSubmit} className="Signin--form">
          <fieldset className="Signin--field">
            <Input name="firstname" type="text" placeholder="Prénom" />
            <Input name="name" type="text" placeholder="Nom" />
            <Input name="pseudo" type="text" placeholder="Pseudo" />
            <Input name="email" type="email" placeholder="Adresse Email" />
            <Input name="password" type="password" placeholder="Mot de passe" />
            <div className="Signin--openToWork">
              <p>Ouvert aux projets</p>
              <Switch
                name="availability"
                checked={checked}
                onChange={handleSwitch}
              />
            </div>
            <label htmlFor="description" className="Signin--inputTextarea">
              A propos de moi
              <textarea name="description" id="description" />
            </label>
          </fieldset>

          <fieldset className="Signin--field">
            <div className="Signin--technos">
              <h3>Mes technos</h3>
              <p>(Plusieurs choix possibles)</p>
              <div className="Signin--techno">
                {technos.map((techno) => (
                  <div className="Signin--inputCheckbox" key={techno.id}>
                    <input
                      type="checkbox"
                      id={techno.id}
                      name={techno.id}
                      value={techno.id}
                    />
                    <label htmlFor={techno.id}>{techno.label}</label>
                    <div
                      role="button"
                      onClick={() => handleImageClick(techno.id)}
                      onKeyDown={handleImageKeyDown}
                      tabIndex={0}
                      className={`Signin--inputCheckbox--img ${
                        selectedTechnos.includes(techno.id) ? 'selected' : ''
                      }`}
                    >
                      <img
                        src={techno.path}
                        title={techno.label}
                        alt={techno.label}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="Signin--cgu">
              <label>
                J&apos;accepte les CGU
                <input
                  type="checkbox"
                  // required
                  id="cgu"
                  name="cgu"
                  value="cgu"
                  className="Signin--inputCheckbox--cgu"
                />
              </label>
            </div>
            <button type="submit" className="Signin--form--submit">
              S&apos;inscrire
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default Signin;
