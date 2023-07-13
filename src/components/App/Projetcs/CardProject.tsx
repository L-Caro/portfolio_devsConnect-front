// ? Librairies
import { Link } from 'react-router-dom'; // Sert à gérer les liens
import { v4 as uuidv4 } from 'uuid';

// ? Styles
import './style.scss';

// ? Typage
import { ProjectI } from '../../../@types/interface';

// ? Interface globale
interface CardProjectI {
  project: ProjectI;
}

// const owner

// ? Fonction principale
function CardProject({ project }: CardProjectI) {
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
    <section className="CardProject">
      {/** //! Link
       * @param {String} to - Lien vers la page du projet en fonction de son id
       * @param {String} key - Clé unique pour chaque projet (id)
       */}
      <Link to={`/projects/${id}`} key={project.id}>
        <div className="CardProject--header">
          <div className="CardProject--header--link">
            <div className="CardProject--header--link--text">
              <h3 className="CardProject--header--link--text--title">
                {title}
              </h3>
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
          </div>
        </div>
        <h4 className="CardProject--header--technos--title">
          Languages utilisés :
        </h4>
        <div className="CardProject--header--technos--list">
          {/** //! Affichage des technos
           * Si member.tags existe et qu'il y a au moins une techno
           * On map sur la liste des technos
           * On affiche l'image de la techno avec le nom en alt et title
           *
           * Sinon on affiche un message pour dire qu'il n'y a pas de techno
           */}
          {project.tags && project.tags.length > 0 ? (
            project.tags.map((tag) => (
              <img
                src={`/images/technos/${tag.name.toLowerCase()}.svg`}
                alt={tag.name}
                title={tag.name}
                key={tag.id}
                className="CardProject--header--technos--list--img"
              />
            ))
          ) : (
            <p>Aucune techno</p>
          )}
        </div>
        <div className="CardProject--body">
          <h4 className="CardProject--body--title">Description :</h4>
          <p className="CardProject--body--description">{description}</p>
        </div>
      </Link>
      <div className="CardProject--footer">
        <h4 className="CardProject--footer--title">Participants :</h4>
        {/* //! On map dessus en dur et limite à 3 l'affichage */}
        <ul className="CardProject--footer--list">
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
                <li className="CardProject--footer--list--item">
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

export default CardProject;
