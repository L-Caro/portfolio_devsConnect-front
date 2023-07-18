/* eslint-disable no-nested-ternary */
// ? Librairies
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { Audio } from 'react-loader-spinner';

import { useAppSelector, useAppDispatch } from '../../../../hook/redux';

// ? Fonctions externes
import { fetchOneProject } from '../../../../store/reducer/projects';
import ProjectAddMember from '../../../../store/actions/ProjectAddMember';
import ProjectRemoveMember from '../../../../store/actions/ProjectRemoveMember';
import { resetMessage, updateFlash } from '../../../../store/reducer/main';
import { toggleModalLogin } from '../../../../store/reducer/log';

// ? Composants
import ProjectMember from '../../Cards/ProjectMember/ProjectMember';
import NotFound from '../../../NotFound/NotFound';

// ? Typage
import { ProjectI } from '../../../../@types/interface';
import MyProject from './MyProject/MyProject';

function OneProject() {
  // ? State
  // Store
  const project = useAppSelector((state) => state.projects.project.data); // On récupère les données du projet
  const loading = useAppSelector((state) => state.members.member.loading); // On récupère le loading
  const userId = useAppSelector((state) => state.user.login.id); // On récupère l'id du membre connecté
  const projectId = useAppSelector((state) => state.projects.project.data?.id); // On récupère l'id du projet

  // ? Navigate
  const navigate = useNavigate(); // Permet de naviguer entre les pages

  // ? Params
  const { id } = useParams(); // On récupère l'id du membre dans l'url

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? useEffect
  useEffect(() => {
    if (id) dispatch(fetchOneProject(id)); // On récupère les infos du membre avec l'id en url
  }, [dispatch, id]); // On met à jour le useEffect si l'id change

  // ? Fonctions
  //* On vérifie si le membre est le propriétaire du projet
  const isMine = () => {
    if (project?.user_id === userId) {
      return true;
    }
    return false;
  };

  //* On vérifie si le membre est déjà membre du projet
  const isMember = () => {
    if (project?.users?.find((user) => user.user_id === userId)) {
      return true;
    }
    return false;
  };

  const handleAddMember = (projectId, userId) => {
    if (!userId) {
      dispatch(resetMessage()); // On reset le message flash

      dispatch(
        updateFlash({
          type: 'error',
          children: 'Vous devez être connecté pour postuler à un projet',
        })
      );
      dispatch(toggleModalLogin()); // On ouvre la modal de connexion
      return;
    }
    dispatch(ProjectAddMember({ projectId, userId }));
    dispatch(fetchOneProject(id));
  };

  const handleRemoveMember = (projectId, userId) => {
    dispatch(ProjectRemoveMember({ projectId, userId }));

    dispatch(fetchOneProject(id));
  };

  // En cas de chargement des membres, on affiche un indicateur de chargement
  if (loading) {
    return (
      <div className="Loader">
        <Audio
          height="80"
          width="80"
          radius="9"
          color="grey"
          ariaLabel="three-dots-loading"
          wrapperStyle
          // wrapperClass
        />
        <p>loading</p>
      </div>
    );
  }

  // Si la réponse ne vient pas, on affiche une erreur serveur
  if (!project) {
    return (
      <NotFound
        errorMessage="Désolé, ce membre est momentanément indisponible"
        errorStatus=""
      />
    );
  }
  return (
    <div className="container">
      <div className="Project--return">
        {' '}
        // todo Bouton retour OP, manque le style
        {/** //! Retour
         * @param {Function} navigate - Permet de naviguer entre les pages
         * On envoie au composant la fonction navigate
         * A chaque clic sur le bouton, on retourne à la page précédente
         */}
        <button type="button" onClick={() => navigate(-1)}>
          Retour
        </button>
      </div>

      {isMine() ? (
        <button
          type="button"
          onClick={() => navigate(`/projects/${projectId}/edit`)}
        >
          Modifier mon projet
        </button>
      ) : isMember() ? (
        <button
          type="button"
          onClick={(e) => handleRemoveMember(projectId, userId)}
        >
          Quitter le projet
        </button>
      ) : (
        <button
          onClick={(e) => handleAddMember(projectId, userId)}
          type="button"
        >
          postuler au projet
        </button>
      )}
      <div className="OneProject">{project.title}</div>
      <div className="OneProject__members">{project.id}</div>
      <div>{project.description}</div>
      <div>{project.availability}</div>
      {project.tags.map((tag) => (
        <div key={uuidv4()}>
          <p>{tag.tag_name}</p>
          <img
            src={`/images/technos/${tag.tag_name.toLowerCase()}.svg`}
            alt=""
            width="20px" // todo Supprimer ce style
            heigth="20px" // todo Supprimer ce style
          />
        </div>
      ))}
      <div>
        <div>{project.user_pseudo}</div>
        {project.users &&
          project.users.map((user) =>
            user.is_active ? (
              <ProjectMember key={user.id} member={user} />
            ) : null
          )}
      </div>
    </div>
  );
}

export default OneProject;
