// Hook pour la lecture des state, avec typage inclus
import { useAppSelector } from '../../../../../hook/redux';

// Composants
import LogComponent from '../LogComponent/LogComponent';
import LinksComponent from '../LinksComponent/LinksComponent';
import Title from '../Title/Title';
import Login from '../../../../Form/Login/Login';
import Signin from '../../../../Form/Signin/signin';

// Fonction principale
function HeaderLarge() {
  // On récupère les state des modales de connexion et d'inscription
  const modalLogin = useAppSelector((state) => state.log.modalLogin);
  const modalSignin = useAppSelector((state) => state.log.modalSignin);

  return (
    <>
      <div className="Header">
        <div>
          <Title />
        </div>
        <LinksComponent />
        <LogComponent />
      </div>
      {/* Si les modales sont true, on les affichent */}
      {modalLogin && <Login />}
      {modalSignin && <Signin />}
    </>
  );
}

export default HeaderLarge;
