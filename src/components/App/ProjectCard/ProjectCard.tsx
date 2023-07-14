// ? Librairies
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// ? Styles
import './style.scss';

// ? Typage globale
import { ProjectI } from '../../../@types/interface';

// ? Interface
interface CardProjectI {
  project: ProjectI;
}
// ? Fonction principale
function ProjectCard({ project }: CardProjectI) {
  // On récupère les données de project depuis Projects.tsx
  const {
    id,
    title,
    description,
    availability,
    user_pseudo: userPseudo,
    users,
  } = project;

  // ? Rendu JSX
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
            <h4 className="ProjectCard--firstField--title">{title}</h4>
            <p
              className={`CardProject--header--link--text--availability ${
                availability ? 'open' : 'close'
              }`}
            >
              {/* On ajoute une classe pour css en fonction de availability */}{' '}
              {availability ? 'Disponible' : 'Indisponible'}{' '}
              {/* On affiche un texte en fonction de availability */}
            </p>
            <p>
              Propriétaire du projet : <span>{userPseudo}</span>
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
              project.tags
                .slice(0, 9)
                .map((tag) => (
                  <img
                    key={`${id}-${tag.id}`}
                    src={`/images/technos/${tag.name.toLowerCase()}.svg`}
                    alt={tag.name}
                    title={tag.name}
                  />
                ))}
          </div>
          <div className="ProjectCard--thirdField">
            <div className="ProjectCard--thirdField--description">
              {description}
            </div>
          </div>
        </div>
      </Link>
      <div className="ProjectCard--footer">
        <h4 className="ProjectCard--footer--title">Participants :</h4>
        {/* //! On map dessus en dur et limite à 3 l'affichage */}
        <ul className="ProjectCard--footer--list">
          {/** //! Affichage des utilisateurs
           * Si project.members existe et qu'il y a au moins un membre
           * On map sur la liste des membres
           * On limite à 3 l'affichage
           *
           *  Sinon on affiche un message pour dire qu'il n'y a pas de membre
           */}
          {users &&
            users.length > 0 &&
            users.slice(0, 9).map((user) => (
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
