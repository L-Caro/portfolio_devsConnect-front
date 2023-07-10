// ? Librairies
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Audio } from 'react-loader-spinner';
import Carousel from 'react-multi-carousel';
import responsive from '../../../../utils/CustomCarousel';
import 'react-multi-carousel/lib/styles.css';

import { useAppSelector, useAppDispatch } from '../../../../hook/redux';

// ? Fonctions externes
import { fetchOneMember } from '../../../../store/reducer/members';

// ? Composants
import ProjectCard from './ProjectCard';
import NotFound from '../../../NotFound/NotFound';

// ? Styles
import './style.scss';

// ? Fonction principale
function OneMember() {
  // ? State
  // Store
  const member = useAppSelector((state) => state.members.member.data); // On récupère les données du membre
  const loading = useAppSelector((state) => state.members.member.loading); // On récupère le loading

  // ? Navigate
  const navigate = useNavigate(); // Permet de naviguer entre les pages

  // ? Params
  const { id } = useParams(); // On récupère l'id du membre dans l'url

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? useEffect
  useEffect(() => {
    if (id) dispatch(fetchOneMember(id)); // On récupère les infos du membre avec l'id en url
  }, [dispatch, id]); // On met à jour le useEffect si l'id change

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
          wrapperClass
        />
        <p>loading</p>
      </div>
    );
  }

  // Si la réponse ne vient pas, on affiche une erreur serveur
  if (!member) {
    return (
      <NotFound
        errorMessage="Désolé, ce membre est momentanément indisponible"
        errorStatus=""
      />
    );
  }

  // ? Rendu JSX
  return (
    <>
      <div className="OneMember--return">
        {/** //! Retour
         * @param {Function} navigate - Permet de naviguer entre les pages
         * On envoie au composant la fonction navigate
         * A chaque clic sur le bouton, on retourne à la page précédente
         */}
        <button type="button" onClick={() => navigate(-1)}>
          Retour
        </button>
      </div>
      <div className="OneMember">
        <h2 className="OneMember--title">
          {member.firstname} {member.lastname}
        </h2>
        <div className="OneMember--content">
          <div className="OneMember--firstField">
            <img
              src={`http://localhost:3000${member.picture}`}
              alt="profil"
              className="OneMember--firstField--image"
            />
            <h2 className="OneMember--firstField--title">
              {member.firstname} {member.lastname}
            </h2>
            <a
              href={`mailto:${member.email}`}
              className="OneMember--firstField--contact"
            >
              Me contacter
            </a>
            <div className="OneMember--firstField--availability">
              <p className={member.availability ? 'open' : 'close'}>
                {/* On ajoute une classe pour css en fonction de availability */}{' '}
                {member.availability ? 'Disponible' : 'Indisponible'}
                {/* On affiche un texte en fonction de availability */}
              </p>
            </div>
            <div className="OneMember--firstField--technos">
              <h4 className="OneMember--firstField--technos--title">
                Technos maitrisées
              </h4>
              <div className="OneMember--firstField--technos--technos">
                {/** //! Affichage des technos
                 * Si member.tags existe et si les tags sont sous forme de tableau
                 * On map sur la liste des technos
                 * On affiche l'image de la techno avec le nom en alt et title
                 *
                 * Et on affiche le nom de la techno
                 */}
                {member.tags &&
                  Array.isArray(member.tags) &&
                  member.tags.map((tag) => (
                    <div
                      className="OneMember--firstField--technos--technos--group"
                      key={tag.id}
                    >
                      <img
                        src={`/images/technos/${tag.name.toLowerCase()}.svg`}
                        alt={tag.name}
                        title={tag.name}
                      />
                      <p>{tag.name}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="OneMember--secondField">
            <div className="OneMember--secondField--description">
              {member.description}
            </div>
            <div className="OneMember--secondField--projects">
              <h4 className="OneMember--secondField--projects--title">
                Projets réalisés
              </h4>
              {member.projects && member.projects.length > 0 && (
                <Carousel
                  // ? Paramètres du carousel
                  responsive={responsive} // Gère des paramètres spécifiques en fonction de la taille de l'écran
                  swipeable // Swipe sur mobile (false === interdit)
                  draggable={false} // Drag sur mobile (false === interdit)
                  // ? Affichage/Position des éléments
                  // centerMode // Affiche partiellement les cartes gauches et droites
                  showDots // Affiche les points de navigation
                  renderDotsOutside // Affiche les points de navigation en dehors du carousel
                  removeArrowOnDeviceType="mobile" // Supprime les flèches de navigation sur mobile
                  renderButtonGroupOutside={false} // Affiche les boutons de navigation en dehors du carousel
                  // ? Animations
                  // rewind // Permet de revenir au début de la liste après la dernière carte
                  // rewindWithAnimation // Revenir au début de la liste avec une animation
                  infinite // Permet de revenir au début de la liste
                  autoPlay // Défilement automatique
                  autoPlaySpeed={7000} // Vitesse de défilement (temps entre chaque slide)
                  customTransition="transform 2000ms ease-in-out" // Transition entre chaque slide
                  shouldResetAutoplay // Reset l'autoplay à chaque interaction
                  transitionDuration={2000}
                >
                  {/** //! ProjectCard.tsx
                   * @param {Object} projectID - Données du projet
                   * @param {Number} key - Clé unique pour chaque projet
                   * On envoie au composant ProjectCard les données de chaque projet
                   * et une clé unique
                   */}

                  {member.projects.map((project) => (
                    <ProjectCard key={project.id} projectID={project} />
                  ))}
                </Carousel>
              )}{' '}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OneMember;

//  {/** //! Affichage des projets
//              * @param {Array} member.projects - Liste des projets
//              * Si member.projects existe et qu'il y a au moins un projet
//              * On map sur la liste des projets
//              */}
