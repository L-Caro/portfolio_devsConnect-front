// ? Librairies
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hook/redux';

// ? Styles
import './style.scss';

// ? Typage globale
import { ProjectI } from '../../../@types/interface';
import { fetchOneProject } from '../../../store/reducer/projects';

// ? Fonction principale
function ProjectCard({ id }: ProjectI) {
  // ? State
  // Store
  const project = useAppSelector((state) => state.projects.project.data); // On récupère les données du projet

  // ? Dispatch
  const dispatch = useAppDispatch();

  useEffect(() => {
    const stringId = id.toString();
    dispatch(fetchOneProject(stringId));
  }, [dispatch, id]);

  // ? Rendu JSX
  if (!project) {
    return null; // Si project est null, ne rien afficher
  }
  return (
    /** //! Lien vers le projet
     * @param {Function} Link - Permet de naviguer entre les pages
     * @param {string} to - On envoie l'ID du projet dans l'url
     * @param {string} project.id - On récupère l'ID du projet
     * Permet de naviguer vers la page du projet correspondant a l'id récupéré en state
     */

    <section className="CardProject">
      <Link to={`/projects/${id}`}>
        <div className="ProjectCard" key={id}>
          <div className="ProjectCard--firstField">
            <h4 className="ProjectCard--firstField--title">{project.title}</h4>
            <p
              className={`ProjectCard--firstField--availability ${
                project.availability ? 'open' : 'close'
              }`}
            >
              {/* On ajoute une classe pour css en fonction de availability */}{' '}
              {project.availability ? 'Disponible' : 'Indisponible'}{' '}
              {/* On affiche un texte en fonction de availability */}
            </p>
            <p>
              Propriétaire du projet : <span>{project.user_pseudo}</span>
            </p>
          </div>
          <div className="ProjectCard--secondField--technos">
            {/** //! Affichage des technos
             * @param {Array} project.tags - On récupère la liste des tags du projet
             * On map sur la liste des tags du projet
             * On limite à 4 l'affichage
             * On affiche l'image de la techno avec le nom en alt et title
             */}
            {project.tags &&
              // console.log(project.tags) &&
              project.tags.map((tag) => (
                <img
                  key={`${tag.tag_id}-${tag.tag_id}`}
                  src={`/images/technos/${tag.tag_name.toLowerCase()}.svg`}
                  alt={tag.tag_name}
                  title={tag.tag_name}
                />
              ))}
          </div>
          <div className="ProjectCard--thirdField">
            <div className="ProjectCard--thirdField--description">
              {project.description}
            </div>
          </div>
        </div>
      </Link>
      <div className="ProjectCard--footer">
        {project.users && project.users.length > 0 && (
          <h4 className="ProjectCard--footer--title">Participants :</h4>
        )}

        <ul className="ProjectCard--footer--list">
          {/** //! Affichage des utilisateurs
           * Si project.members existe et qu'il y a au moins un membre
           * On map sur la liste des membres
           * On limite à 3 l'affichage
           *
           *  Sinon on affiche un message pour dire qu'il n'y a pas de membre
           */}
          {project.users &&
            project.users.length > 0 &&
            project.users.slice(0, 9).map((user) => (
              /** //! Link
               * @param {String} to - Lien vers la page du projet en fonction de son id
               * @param {String} key - Clé unique pour chaque projet (id)
               * Pendant la boucle, on génère un lien pour chaque projet
               * en lui donnant une clé unique et le titre du projet
               */
              <Link key={uuidv4()} to={`/users/${user.id}`}>
                <li className="ProjectCard--footer--list--item">
                  {' '}
                  {user.pseudo}
                </li>
              </Link>
            ))}
        </ul>
      </div>
    </section>
  );
}
export default ProjectCard;
