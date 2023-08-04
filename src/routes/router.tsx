// ? Librairies
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  useParams,
  Navigate,
} from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hook/redux';
import { useEffect } from 'react';
import { fetchOneProject } from '../store/reducer/projects';

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
import MyProject from '../components/App/Projetcs/OneProject/MyProject/MyProject';

import Cgu from '../components/App/Cgu/Cgu';

// ? Fonction
/** //! Fonction pour savoir si l'utilisateur est connecté
 * @param {logged} boolean - Booléen pour savoir si l'utilisateur est connecté
 * Fonction qui permet de récupérer le booléen pour savoir si l'utilisateur est connecté
 */
function isUserLogged() {
  const logged = useAppSelector((state) => state.user.login.logged); // Booléen pour savoir si l'utilisateur est connecté
  return logged;
}

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

/** //! Fonction de rendu conditionnel pour la route de création de projet
 * @param {userLogged} boolean - Booléen pour savoir si l'utilisateur est connecté
 * Affiche CreateProject si l'utilisateur est connecté
 * Navigate vers la page d'accueil si l'utilisateur n'est pas connecté
 */
function RenderCreateProjectRoute() {
  const userLogged = isUserLogged();
  return userLogged ? <CreateProject /> : <Navigate to="/" />;
}

/** //! Fonction de rendu conditionnel pour la route de modification de projet
 * @param {project} object - Objet du projet
 * @param {dispatch} function - Fonction dispatch de Redux
 * Récupère l'ID de l'URL (id du projet)
 * Récupère l'ID du membre connecté
 * Récupère le projet en fonction de l'ID
 * Affiche MyProject si l'ID du membre connecté correspond à l'ID du membre qui a créé le projet
 * Navigate vers la page du projet si l'ID du membre connecté ne correspond pas à l'ID du membre qui a créé le projet
 */
function RenderUpdateProject() {
  // ? State
  const project = useAppSelector((state) => state.projects.project.data); // Récupère les projets
  const userId = useAppSelector((state) => state.user.login.id); // Récupère l'ID du membre connecté;

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? Récupère l'ID de l'URL (id du projet)
  const { id } = useParams();

  // ? useEffect
  // Récupère le projet en fonction de l'ID
  useEffect(() => {
    dispatch(fetchOneProject(id));
  }, [dispatch]);

  // ? Rendu conditionnel
  // Si l'ID du membre connecté correspond à l'ID du membre qui a créé le projet, affiche MyProject
  // Sinon, navigate vers la page du projet
  return project && project.user_id === userId ? (
    <MyProject />
  ) : (
    <Navigate to={`/projects/${id}`} />
  );
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
        <Route path="/projects/:id/edit" element={<RenderUpdateProject />} />
        <Route path="/create-project" element={<RenderCreateProjectRoute />} />
      </Route>
    </Route>
  )
);

export default Router;
