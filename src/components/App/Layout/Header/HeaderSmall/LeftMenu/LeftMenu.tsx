// ? Librairies
import { useAppSelector } from '../../../../../../hook/redux';

// ? Composants
import LinksComponent from '../../LinksComponent/LinksComponent';
import LogoutComponent from '../../LogoutComponent/LogoutComponent';
import LogComponent from '../../LogComponent/LogComponent';
import Footer from '../../../Footer/Footer';

// ? Fonction principale
function LeftMenu() {
  // ? State
  // Redux
  const isLogged = useAppSelector((state) => state.user.login.logged); // On récupère la state logged pour savoir si l'utilisateur est connecté
  const isOpen = useAppSelector((state) => state.log.isOpen); // On récupère la state isOpen du reducer log

  // ? Rendu JSX
  return (
    <div
      className={`LeftMenu ${isOpen ? 'active' : ''}`} // On ajoute la classe 'active' si isOpen est true > Gestion de l'animation du menu latéral en css
    >
      <LinksComponent />

      {/** //! Affichage des composants de connexion/inscription ou profil/déconnexion
       * @param {boolean} isLogged - State pour savoir si l'utilisateur est connecté
       * On affiche le composant de connexion/inscription si isLogged est false
       * On affiche le composant de profil/déconnexion si isLogged est true
       */}
      {isLogged ? <LogoutComponent /> : <LogComponent />}
      <Footer />
    </div>
  );
}

export default LeftMenu;
