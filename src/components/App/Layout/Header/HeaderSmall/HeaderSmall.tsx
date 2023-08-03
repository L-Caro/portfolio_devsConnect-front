// ? Librairies
import { useAppSelector } from '../../../../../hook/redux';

// ? Composants
import Burger from './Burger/Burger';
import Title from '../Title/Title';
import LeftMenu from './LeftMenu/LeftMenu';
import Login from '../../../../Form/Login/Login';
import Signin from '../../../../Form/Signin/signin';

// ? Fonction principale
function HeaderSmall() {
  // ? State
  // Redux
  const modalLogin = useAppSelector((state) => state.log.modalLogin); // On récupère la state modalLogin pour la gestion de la modale
  const modalSignin = useAppSelector((state) => state.log.modalSignin); // On récupère la state modalSignin pour la gestion de la modale

  // ? Rendu JSX
  return (
    <>
      <div className="Header">
        <Burger />
        <Title />
      </div>
      <LeftMenu />
      {modalLogin && <Login />}
      {modalSignin && <Signin />}
    </>
  );
}

export default HeaderSmall;
