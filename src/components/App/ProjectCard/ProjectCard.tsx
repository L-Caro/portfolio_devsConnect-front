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
      <div className="ProjectCard" key={id}>
        <div className="ProjectCard--firstField">
          <Link to={`/projects/${id}`}>
            <h4 className="ProjectCard--firstField--title">{project.title}</h4>
          </Link>
          <p
            className={`ProjectCard--firstField--availability ${
              project.availability ? 'open' : 'close'
            }`}
          >
            {/* On ajoute une classe pour css en fonction de availability */}{' '}
            {project.availability
              ? 'Ouvert au recrutement'
              : 'Fermé au recrutement'}{' '}
            {/* On affiche un texte en fonction de availability */}
          </p>
          <div className="ProjectCard--firstField--owner">
            <p className="ProjectCard--firstField--owner--title">
              Propriétaire :{' '}
            </p>
            <Link to={`/users/${project.user_id}`}>
              <span className="ProjectCard--firstField--owner--name">
                {project.user_pseudo}
              </span>
            </Link>
          </div>
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
    </section>
  );
}
export default ProjectCard;
