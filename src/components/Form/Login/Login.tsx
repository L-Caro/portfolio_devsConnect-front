// ? Librairies
import { useRef, useEffect, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../hook/redux';

// ? Fonctions externes
import { toggleModalLogin } from '../../../store/reducer/log';
import loginUser from '../../../store/actions/login';
import { resetMessage } from '../../../store/reducer/main';

// ? Composants
import Input from '../Input';

// ? Styles
import './style.scss';

// ? Fonction principale
function Login() {
  // ? State
  // Redux
  const isLogged = useAppSelector((state) => state.user.login.logged); // Booléen pour savoir si l'utilisateur est connecté
  // Local
  const [redirectUrl, setRedirectUrl] = useState<string>(''); // Url de redirection après connexion

  // ? useRef
  const modalRef = useRef(null); // Référence pour la modale

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? useNavigate
  const navigate = useNavigate();

  // ? useEffect
  //* useEffect pour fermer la modale si l'utilisateur est connecté
  useEffect(() => {
    if (isLogged) {
      dispatch(toggleModalLogin());
    }
  }, [isLogged, dispatch]);

  //* useEffect pour clic externe à la modale
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        // Si on clique en dehors de la modale
        modalRef.current &&
        !(modalRef.current as Element).contains(event.target as Node)
        // On précise que modalRef.current éun element html (Element)
        // On précise que event.target représente un noeud du DOM (Node)
      ) {
        dispatch(toggleModalLogin());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  // ? Fonctions
  /** //* Fonction pour ouvrir ou fermer la modale de connexion
   * @param {toggleModalLogin} dispatch - Dispatch de l'action pour ouvrir ou fermer la modale
   * Au clic, on dispatch l'action pour ouvrir ou fermer la modale
   */
  const handleLogin = () => {
    dispatch(toggleModalLogin());
  };

  /** //! Accessibilité
   * @param {React.KeyboardEvent<HTMLDivElement>} event - Événement clavier
   * @param {toggleModalLogin} dispatch - Dispatch de l'action pour ouvrir ou fermer la modale
   * * Une div n'est pas un element clickable par défaut.
   * On ajoute un fonction d’accessibilité pour le clavier.
   * Si la touche enter ou espace est pressée, on appelle la fonction handleLogin() juste au dessus.
   */
  const handleLoginKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'enter' || event.key === ' ') {
      handleLogin();
    }
  };

  /** //* Fonction pour récupérer l'URL de redirection
   * @param {URLSearchParams} urlParams - Paramètres de l'URL
   * @param {string} redirect - URL de redirection
   * Au chargement du composant, on récupère l'URL de redirection
   * Si elle existe, on la stocke dans le state redirectUrl
   * Si elle n'existe pas, on laisse le state redirectUrl vide
   */
  // Extrayez l'URL de redirection des paramètres de l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect'); // On récupère la valeur du paramètre redirect (tout ce qui est après le ?redirect dans l'url)
    if (redirect) {
      const cleanRedirect = redirect.slice(10); // On retire le undefined/ de l'url (aucune idée de pourquoi il y est par contre)
      // Si redirect existe
      setRedirectUrl(cleanRedirect); // On met à jour le state redirectUrl
    }
  }, []);

  /** //* Fonction pour rediriger l'utilisateur après connexion
   * @param {boolean} isLogged - Booléen pour savoir si l'utilisateur est connecté
   * @param {string} redirectUrl - URL de redirection
   * Suite à une connexion réussie, on redirige l'utilisateur vers la page d'accueil
   * Le useEffect sert à surveiller les changements de isLogged pour rediriger en fonction de redirectUrl
   */
  useEffect(() => {
    if (isLogged) {
      if (redirectUrl) {
        navigate(redirectUrl);
      }
    }
  }, [isLogged, redirectUrl, navigate, dispatch]);

  /** //* Fonction pour soumettre le formulaire de connexion
   * @param {FormEvent<HTMLFormElement>} event - Événement formulaire
   * @param {FormData} formData - Données du formulaire
   * Au submit, on récupère les données du formulaire et on dispatch l'action de connexion réussie
   * On redirige ensuite vers la page d'accueil
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // On empêche le comportement par défaut du formulaire
    const form = event.currentTarget;
    const formData = new FormData(form);

    dispatch(resetMessage()); // On reset le message flash
    try {
      await dispatch(loginUser(formData)); // Dispatch de l'action de connexion
    } catch (error) {
      console.error(error);
    }
  };

  // ? Rendu JSX
  return (
    <div className="Login">
      <div className="Login--container" ref={modalRef}>
        {' '}
        {/* On ajoute la référence pour la modale */}
        <div className="Login--container--head">
          <h2 className="Login--title">Connexion</h2>
          <div
            className="Login--close"
            role="button"
            tabIndex={0} // On précise que la div est focusable
            onClick={handleLogin} // On appelle la fonction handleLogin() au clic
            onKeyDown={handleLoginKeyDown} // On appelle la fonction handleLoginKeyDown() au clavier
          >
            X
          </div>
        </div>
        <form className="Login--form" onSubmit={handleSubmit}>
          {' '}
          {/* On appelle la fonction handleSubmit() au submit */}
          <Input
            name="email"
            type="email"
            slot="Adresse email"
            placeholder="Adresse Email"
            className="Login--inputText"
          />
          <Input
            name="password"
            type="password"
            slot="Mot de passe"
            placeholder="Mot de passe"
            className="Login--inputText"
          />
          <button type="submit" className="Login--form--submit">
            Se connecter
          </button>
        </form>
        <p>DevsConnect</p>
      </div>
    </div>
  );
}

export default Login;
