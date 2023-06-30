// ? Librairies
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  useParams,
} from 'react-router-dom';
import { useAppSelector } from '../hook/redux';

// ? Composants
import Root from './Root';
import ErrorPage from './ErrorPage';
import NotFound from '../components/NotFound/NotFound';

import Home from '../components/App/Home/Home';

import Members from '../components/App/Members/Members';
import OneMember from '../components/App/Members/OneMember/OneMember';
import MyProfile from '../components/App/Members/OneMember/MyProfile/MyProfile';

import Projects from '../components/App/Projetcs/Projects';
import OneProject from '../components/App/Projetcs/OneProject/OneProject';
import CreateProject from '../components/App/Projetcs/CreateProject/CreateProject';

import Cgu from '../components/App/Cgu/Cgu';

// ? Fonction
/** //! Fonction pour gérer l'affichage du profil ou de la page membre
 * @param {id} number - ID du membre
 * @param {userId} number - ID du membre connecté
 * @return {JSX.Element} - Affiche MyProfile si les IDs correspondent, OneMember si les IDs sont différents
 * Fonction qui permet de gérer l'affichage du profil ou de la page membre en comparant l'id du membre connecté et l'id de l'URL
 */
function ProfileCondition() {
  const { id } = useParams(); // Récupère l'ID de l'URL
  const userId = useAppSelector((state) => state.user.login.id); // Récupère l'ID du membre connecté

  if (userId === Number(id)) {
    return <MyProfile />; // Affiche MyProfile si les IDs correspondent
  }
  return <OneMember />; // Affiche OneMember si les IDs sont différents
}

// ? Fonction principale
const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      <Route errorElement={<NotFound />}>
        <Route index element={<Home />} />
        <Route path="/cgu" element={<Cgu />} />
        {/* Members */}
        <Route path="/users" element={<Members />} />
        <Route path="/users/:id" element={<ProfileCondition />} />
        {/* Projects */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<OneProject />} />
        <Route path="/create-project" element={<CreateProject />} />
      </Route>
    </Route>
  )
);

export default Router;
