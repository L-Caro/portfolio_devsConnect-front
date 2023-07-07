/* eslint-disable no-nested-ternary */
// ? Librairies
import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../hook/redux';

// ? Fonctions externes
import { fetchAllTags } from '../../../../../store/reducer/tag';
import { fetchOneMember } from '../../../../../store/reducer/members';
import updateMember from '../../../../../store/actions/updateMember';
import checkPseudo from '../../../../../store/actions/checkPseudo';
import checkEmail from '../../../../../store/actions/checkEmail';

import {
  toggleEditMode,
  toggleModalDelete,
  toggleModalPassword,
} from '../../../../../store/reducer/log';
import { resetMessage, updateFlash } from '../../../../../store/reducer/main';
import {
  classMapping,
  validateField,
  isFormValid,
  errorMessages,
} from '../../../../../utils/validate form/validateForm';

// ? Composants
import CustomSwitch from '../../../../../utils/customSwitchUI';
import ProjectCard from '../ProjectCard';
import Input from '../../../../Form/Input';
import DeleteModale from './DeleteModale/DeleteModale';
import PasswordModale from './PasswordModale/PasswordModale';

// ? Styles
import './style.scss';

// ? Typage global
import { TagI, MemberI } from '../../../../../@types/interface';

// ? Fonction principale
function MyProfile() {
  // ? States
  // Store
  const member: MemberI | null = useAppSelector(
    (state) => state.members.member.data
  ); // On récupère les données du membre
  const userId = useAppSelector((state) => state.user.login.id); // On récupère l'id de l'utilisateur connecté
  const allTags: TagI[] = useAppSelector((state) => state.tag.list.data); // On récupère les tags
  const isEditMode = useAppSelector((state) => state.log.isEditMode); // On récupère le state isEditMode
  const { pseudoMessage, emailMessage, pseudoStatus, emailStatus } =
    useAppSelector((state) => state.ajax);

  // Local
  const [checked, setChecked] = useState(false); // Valeur du switch
  const [selectedTags, setSelectedTags] = useState<TagI[] | undefined>(
    member?.tags
  ); // On récupère les tags du membre qu'on stocke (pour la gestion de l'update)
  const [oldPseudo, setOldPseudo] = useState(''); // Ancien mot de passe
  const [oldEmail, setOldEmail] = useState(''); // Ancien mot de passe

  const { modalDelete, modalPassword } = useAppSelector((state) => state.log); // On récupère le state modale
  const [isOpenPasswordModale, setIsOpenPasswordModale] = useState(false); // State pour la modale de modification du mot de passe

  // Etats pour la gestion du formulaire et des erreurs associées
  const [formFields, setFormFields] = useState({
    firstname: { value: '', className: '' },
    lastname: { value: '', className: '' },
    pseudo: { value: '', className: '' },
    email: { value: '', className: '' },
    tags: { value: '', className: '' },
    description: { value: '', className: '' },
  });
  // ? useRef
  const formRef = useRef<HTMLFormElement>(null); // Utiliser pour récupérer les données du formulaire (référence au <form>)

  // ? useDispatch
  const dispatch = useAppDispatch();
  // ? useEffect
  useEffect(() => {
    // On récupère les données du membre en fonction de l'id
    if (userId) {
      const userIdString = userId.toString(); // On convertit l'id en string
      dispatch(fetchOneMember(userIdString));
      setChecked(member?.availability); // On stocke la valeur de l'availability du membre dans le state checked
    }
  }, [dispatch, isEditMode, userId, member?.availability, modalPassword]); // On rappelle le useEffect à chaque modification du state isEditMode et/ou userId

  useEffect(() => {
    // On récupère tous les tags
    dispatch(fetchAllTags());
    setSelectedTags(member?.tags); // On stocke les tags du membre dans le state selectedTags
  }, [dispatch, member?.tags, isEditMode]); // On rappelle le useEffect à chaque modification du state isEditMode et/ou member?.tags

  // ? Fonctions
  /** //* Switch open to work
   * @param {boolean} checked - valeur du switch
   * Au clic, on inverse la valeur du switch
   */
  const handleSwitch = () => {
    setChecked(!checked);
  };

  /** //* Fonction pour le bouton annuler
   * @param {boolean} isEditMode - valeur du state isEditMode
   * Au clic, on inverse la valeur du state isEditMode
   */
  const handleCancelClick = () => {
    // On réinitialise les messages d'erreur et isFormValid pour ne rien garder en mémoire
    formFields.firstname.value = '';
    formFields.lastname.value = '';
    formFields.pseudo.value = '';
    formFields.email.value = '';
    formFields.description.value = '';
    isFormValid.firstname = true;
    isFormValid.lastname = true;
    isFormValid.pseudo = true;
    isFormValid.email = true;
    isFormValid.description = true;
    dispatch(toggleEditMode());
  };

  /** //* Fonction pour le bouton delete
   * @param {boolean} modalDelete - valeur du state modalDelete
   * Au clic, on inverse la valeur du state modalDelete
   * qui affiche ou non la modale de suppression
   */
  const handleDeleteModale = () => {
    dispatch(toggleModalDelete());
  };

  /** //* Fonction pour le bouton modifier le mot de passe
   * @param {boolean} modalPassword - valeur du state modalPassword
   * Au clic, on inverse la valeur du state modalPassword
   * qui affiche ou non la modale de suppression
   */
  const handlePasswordModale = () => {
    dispatch(toggleModalPassword());
  };

  /** //* Fonction pour la modification du tableau selectedTags
   * @param {number} id - id du tag cliqué
   * On récupère l'id du tag cliqué
   * On vérifie si le tag est présent dans selectedTags (find)
   * Si oui, on le retire du tableau et on retire la classe `selected` du tag.
   * Si non, on l'ajoute au tableau et on ajoute la classe `selected` au tag.
   */
  const handleImageClick = (id: number) => {
    // Si on trouve l'id dans allTags, on stocke dans selectedTag
    const selectedTag = allTags.find((tag) => tag.id === id);
    if (selectedTag) {
      if (
        // Si selectedTags existe et que selectedTag est présent dans selectedTags
        selectedTags &&
        selectedTags.some((tag) => tag.id === selectedTag.id)
      ) {
        // ? Le tag est déjà sélectionné
        // On le supprime en filtrant selectedTags pour ne garder que ceux avec un id différent
        const updatedTags = selectedTags.filter(
          (tag) => tag.id !== selectedTag.id
        );
        // On met à jour le state
        setSelectedTags(updatedTags);

        // On retire la classe `selected` du tag
        const tagElement = document.getElementById(`tag-${selectedTag.id}`); // On cible l'element par son id spécifique
        if (tagElement) tagElement.classList.remove('selected'); // Si on trouve l'element avec l'id de selectedTag, on retire la classe `selected`
      } else {
        // ? Le tag n'est pas sélectionné
        // On l'ajoute en concaténant selectedTags et selectedTag dans updatedTags (spread operator)
        // Pour éviter l'erreur de linter sur le ternaire imbriqué => eslint-disable-next-line no-nested-ternary
        // eslint-disable-next-line no-nested-ternary
        const updatedTags: TagI[] | undefined = selectedTag
          ? selectedTags !== undefined
            ? [...selectedTags, selectedTag]
            : [selectedTag]
          : [selectedTag]; // Si selectedTags existe, on concatène, sinon on crée un tableau avec selectedTag
        // On met à jour le state
        setSelectedTags(updatedTags);

        // On ajoute la classe `selected` au tag
        const tagElement = document.getElementById(`tag-${selectedTag.id}`); // On cible l'element par son id spécifique
        if (tagElement) tagElement.classList.add('selected'); // Si on trouve l'element avec l'id de selectedTag, on ajoute la classe `selected`
      }
    }
  };
  /** //! Accessibilité
   * Une div n'est pas un element clickable par défaut.
   * @param {React.KeyboardEvent<HTMLDivElement>} event - event du clavier
   * @param {string} imageId - id de l'image cliquée
   * On ajoute un fonction d’accessibilité pour le clavier.
   * Si la touche enter ou espace est pressée, on appelle la fonction handleClick() juste au dessus.
   */
  const handleImageKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    imageId: string
  ) => {
    if (event.key === 'enter' || event.key === ' ') {
      handleImageClick(Number(imageId));
    }
  };

  // ! ==== Requêtes Ajax ====
  // ! =======================
  // ? Verification pseudo

  /** //* Fonction de vérification du pseudo
   * @param {React.ChangeEvent<HTMLInputElement>} event - Événement de changement de valeur
   * On récupère la valeur du champ
   * On appelle la fonction checkPseudo() du fichier actions/checkPseudo.ts
   * On lui passe en paramètre l'ancien pseudo du membre connecté
   */
  const verifyPseudo = (event) => {
    if (event.target.value) {
      dispatch(checkPseudo({ oldPseudo: event.target.value }));
    }
  };
  /** //* Fonction de vérification du statut de la requête Ajax
   * @param {string} status - Statut de la requête Ajax
   * Si le statut est success, on passe isFormValid.Pseudo à true
   * Sinon, on passe isFormValid.Pseudo à false
   */
  const checkPseudoStatus = () => {
    if (pseudoStatus === 'success') {
      isFormValid.pseudo = true;
    } else if (pseudoStatus === 'error') {
      isFormValid.pseudo = false;
    }
  };
  /** //* useEffect pour relancer la verification du statut de la requête Ajax
   * Quand le statut change, on appelle la fonction checkStatus()
   * Pour avoir toujours l'état à jour
   */
  useEffect(() => {
    checkPseudoStatus();
  }, [pseudoStatus, oldPseudo]);

  // ? Verification email

  /** //* Fonction de vérification du email
   * @param {React.ChangeEvent<HTMLInputElement>} event - Événement de changement de valeur
   * On récupère la valeur du champ
   * On appelle la fonction checkEmail() du fichier actions/checkEmail.ts
   * On lui passe en paramètre l'ancien email du membre connecté
   */
  const verifyEmail = (event) => {
    if (event.target.value) {
      dispatch(checkEmail({ oldEmail: event.target.value }));
    }
  };
  /** //* Fonction de vérification du statut de la requête Ajax
   * @param {string} status - Statut de la requête Ajax
   * Si le statut est success, on passe isFormValid.Email à true
   * Sinon, on passe isFormValid.Email à false
   */
  const checkEmailStatus = () => {
    if (emailStatus === 'success') {
      isFormValid.email = true;
    } else if (emailStatus === 'error') {
      isFormValid.email = false;
    }
  };
  /** //* useEffect pour relancer la verification du statut de la requête Ajax
   * Quand le statut change, on appelle la fonction checkStatus()
   * Pour avoir toujours l'état à jour
   */
  useEffect(() => {
    checkEmailStatus();
  }, [emailStatus, oldEmail]);

  // ! ==== Verification des champs ====
  // ! =================================

  const handleChange = (event, fieldName) => {
    // La propriété value qui servira a appelé la fonction validateField peut soit provenir de onChange de l'input pseudo,
    // soit du useEffect, qui lui relance la fonction handleChange avec oldPseudo (à jour)
    // Donc on initialise value à '' et on la met à jour selon le cas
    let value = '';
    // Si on a un event et que event.target existe, on récupère la valeur de l'input
    if (event && event.target) {
      value = event.target.value;
      // Sinon, en fonction du fieldName, on récupère la valeur de oldPseudo ou oldEmail
    } else if (fieldName === 'pseudo') {
      // On récupère la valeur de oldPseudo
      value = oldPseudo;
    } else if (fieldName === 'email') {
      // On récupère la valeur de oldEmail
      value = oldEmail;
    }
    const options = { pseudoStatus, emailStatus };

    let newClassName = '';

    if (value.length !== 0) {
      const validation = validateField(value, fieldName, options);

      if (validation) {
        const { className } = validation;
        newClassName = classMapping[className];
      }
    }

    setFormFields((prevState) => ({
      ...prevState,
      [fieldName]: {
        value,
        className: newClassName,
      },
    }));
  };
  //! Comme le status de la requête Ajax est asynchrone, et que la validation des champs se fait sur un fichier externe
  //! on doit utiliser un useEffect pour mettre à jour le state pseudoStatus et emailStatus pour relancer la fonction
  useEffect(() => {
    handleChange(oldPseudo, 'pseudo');
  }, [pseudoStatus, oldPseudo]);
  useEffect(() => {
    handleChange(oldEmail, 'email');
  }, [emailStatus, oldEmail]);

  // ! ==== Envoie du formulaire ====
  // ! ==============================

  /** //* Fonction d'envoi du formulaire
   * @param {React.FormEvent<HTMLFormElement>} event - event du formulaire
   * On empêche le comportement par défaut du formulaire
   * On crée un objet formData pour stocker les données du formulaire
   * On stocke les données du formulaire dans un objet
   * On soumet le formulaire
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // ! Déclaration des variables
    const formData = new FormData(); // On crée un objet formData pour stocker les données du formulaire
    const objData = Object.fromEntries(formData.entries()); // On stocke les données du formulaire dans un objet

    // inputs
    const inputs = formRef.current
      ? formRef.current.querySelectorAll('.MyProfile--input') // On cible tous les inputs du formulaire
      : null;

    const firstname = document.querySelector('#firstname') as HTMLInputElement;
    const lastname = document.querySelector('#lastname') as HTMLInputElement;
    const pseudo = document.querySelector('#pseudo') as HTMLInputElement;
    const email = document.querySelector('#email') as HTMLInputElement;

    const textarea = formRef.current
      ? formRef.current.querySelector('textarea') // On cible le textarea du formulaire
      : null;
    const textareaName: keyof MemberI = textarea?.name as keyof MemberI; // On récupère le name du textarea
    const textareaValue: string | undefined = textarea?.value; // On récupère la value du textarea

    // erreurs du formulaire

    // ! Gestion des erreurs

    dispatch(resetMessage()); // On reset le message flash

    if (selectedTags.length === 0) {
      // Si aucun tag n'est sélectionné, on passe isFormValid.tags à false
      isFormValid.tags = false;
    } else {
      // Sinon, on passe isFormValid.tags à true
      isFormValid.tags = true;
    }

    // On vérifie si les champs sont vides
    ['firstname', 'lastname', 'pseudo', 'email'].forEach((field) => {
      if (eval(field).value === '') {
        // Si le champ est vide, on passe isFormValid[field] à true, car dans l'update on n'est pas obligé de tout modifier
        isFormValid[field] = true;
      }
    });

    // On compte le nombre de false dans isFormValid
    const falseFieldCount = Object.values(isFormValid).filter(
      (value) => value === false
    ).length;

    // Si un seul champ est vide, on affiche un message d'erreur spécifique à ce champ
    if (falseFieldCount === 1) {
      // On laisse le mode édition activé
      dispatch(toggleEditMode(true));
      // On récupère le nom du champ qui est vide
      const invalidField = Object.keys(isFormValid).find(
        (field) => !isFormValid[field]
      );

      // On affiche le message d'erreur spécifique à ce champ
      if (invalidField) {
        dispatch(
          updateFlash({
            type: 'error',
            children: errorMessages[invalidField],
          })
        );
      }
    }

    // Si plusieurs champs sont vides, on affiche un message d'erreur général
    if (falseFieldCount > 1) {
      // On laisse le mode édition activé
      dispatch(toggleEditMode(true));
      dispatch(
        updateFlash({
          type: 'error',
          children: errorMessages.multiple,
        })
      );
    }

    // ! Soumission du formulaire
    // Si tous les champs sont remplis, on envoie le formulaire
    if (falseFieldCount === 0) {
      // ? Gestion des inputs
      inputs?.forEach((input) => {
        // Pour chaque input
        const { name, value } = input as HTMLInputElement; // On récupère le name et la value en destructuring
        // Vérifiez si `name` est une clé valide de `MemberI`
        if (member && name in member) {
          const memberValue = member[name as keyof MemberI]; // Obtenez la valeur actuelle de `name` dans `objData`

          // Si la valeur est différente d'une string vide et de la valeur initiale, on l'ajoute à formData et à objData
          if (value !== '' && value !== memberValue) {
            formData.append(name, value);
            objData[name] = value;
          }
        }
      });

      // ? Gestion du textarea
      if (
        textareaValue !== undefined && // On vérifie que textareaValue existe
        textareaValue !== '' && // On vérifie que textareaValue n'est pas une string vide
        textareaName && // On vérifie que textareaName existe
        member && // On vérifie que member existe
        textareaValue !== member[textareaName] // On vérifie que textareaValue est différent de la valeur initiale
      ) {
        formData.append(textareaName, textareaValue); // Alors, on ajoute textareaValue à formData
        objData[textareaName] = textareaValue; // On ajoute textareaValue à objData
      }

      // ? Gestion du switch openToWork
      if (
        checked !== undefined && // On vérifie que checked existe
        checked !== member?.availability
      ) {
        // Si la valeur du state est différente de la valeur du membre, on l'ajoute à formData
        formData.append('availability', checked.toString());
      }

      // ? Gestion des tags
      if (selectedTags && selectedTags.length > 0) {
        // On vérifie que selectedTags existe et qu'il contient au moins un tag
        const selectedTagsData = selectedTags.map((tag) => tag.id); // On crée un tableau avec les id des tags sélectionnés
        // const tagsJSON = JSON.stringify(selectedTagsData); // On convertie le tableau en chaîne JSON

        formData.append('tags', selectedTagsData); // On ajoute le tableau selectedTagsData à formData
        objData.tags = selectedTagsData; // On ajoute le tableau selectedTagsData à objData
      }

      dispatch(
        // On dispatch l'action updateMember avec l'id du membre et les données du formulaire
        updateMember({
          id: userId,
          formData: { availability: checked, ...objData }, // Dans formData, on ajoute la valeur de checked et on ajoute les données du formulaire (objData)
        })
      );
    }
  };

  /** //* Fonction pour le bouton d'édition
   * @param {React.FormEvent<HTMLFormElement>} event - event du formulaire
   * On empêche le comportement par défaut du formulaire
   * Au clic, on inverse la valeur du state isEditMode
   *
   * Si isEditMode est true, on soumet le formulaire
   */
  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    dispatch(toggleEditMode());

    if (isEditMode) {
      handleSubmit(event);
    }
  };
  // ? Rendu JSX
  return (
    <>
      <div className="MyProfile">
        <h2 className="MyProfile--title">
          {member?.firstname} {member?.lastname}
        </h2>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="MyProfile--content">
            <fieldset className="MyProfile--content--firstField">
              <img
                className="MyProfile--content--firstField--image"
                src="/images/profil/profil.svg"
                alt="profil"
              />
              {/* Pour chaque input, on désactive le champ si on est pas en mode édition */}
              <Input
                id="firstname"
                name="firstname"
                slot={isEditMode ? 'Prénom' : null}
                type="text"
                placeholder={member?.firstname || ''}
                aria-label="Prénom"
                value={formFields.firstname.value}
                className={`MuiInputBase-input ${formFields.firstname.className}`}
                disabled={!isEditMode}
                onChange={(event) => handleChange(event, 'firstname')}
                helperText={
                  formFields.firstname.value !== '' &&
                  isFormValid.firstname === false ? (
                    <span className="wrong">{errorMessages.firstname}</span>
                  ) : (
                    ''
                  )
                }
                color={
                  formFields.firstname.value === ''
                    ? 'perso'
                    : isFormValid.firstname === false
                    ? 'error'
                    : 'success'
                }
              />
              <Input
                id="lastname"
                name="lastname"
                slot={isEditMode ? 'Nom' : null}
                type="text"
                placeholder={member?.lastname || ''}
                aria-label="Nom"
                value={formFields.lastname.value}
                className={`MyProfile--input ${formFields.lastname.className}`}
                disabled={!isEditMode}
                onChange={(event) => handleChange(event, 'lastname')}
                helperText={
                  formFields.lastname.value !== '' &&
                  isFormValid.lastname === false ? (
                    <span className="wrong">{errorMessages.lastname}</span>
                  ) : (
                    ''
                  )
                }
                color={
                  formFields.lastname.value === ''
                    ? 'perso'
                    : isFormValid.lastname === false
                    ? 'error'
                    : 'success'
                }
              />
              <Input
                id="pseudo"
                name="pseudo"
                slot={isEditMode ? 'Pseudo' : null}
                type="text"
                placeholder={member?.pseudo || ''}
                aria-label="Pseudo"
                value={formFields.pseudo.value}
                className={`MyProfile--input ${formFields.pseudo.className}`}
                disabled={!isEditMode}
                onChange={(event) => {
                  setOldPseudo(event.target.value);
                  handleChange(event, 'pseudo');
                  verifyPseudo(event);
                  checkPseudoStatus();
                }}
                helperText={
                  formFields.pseudo.value !== '' && pseudoStatus === 'error' ? (
                    <span className="wrong">{pseudoMessage}</span>
                  ) : formFields.pseudo.value !== '' &&
                    isFormValid.pseudo === false ? (
                    <span className="wrong">{errorMessages.pseudo}</span>
                  ) : formFields.pseudo.value !== '' &&
                    isFormValid.pseudo === true ? (
                    <span className="good">{pseudoMessage}</span>
                  ) : (
                    ''
                  )
                }
                color={
                  formFields.pseudo.value === ''
                    ? 'perso'
                    : isFormValid.pseudo === false
                    ? 'error'
                    : 'success'
                }
              />
              <Input
                id="email"
                name="email"
                slot={isEditMode ? 'Email' : null}
                type="email"
                placeholder={member?.email || ''}
                aria-label="Email"
                value={formFields.email.value}
                className={`MyProfile--input ${formFields.email.className}`}
                disabled={!isEditMode}
                onChange={(event) => {
                  setOldEmail(event.target.value);
                  handleChange(event, 'email');
                  verifyEmail(event);
                  checkEmailStatus();
                }}
                helperText={
                  formFields.email.value !== '' && emailStatus === 'error' ? (
                    <span className="wrong">{emailMessage}</span>
                  ) : formFields.email.value !== '' &&
                    isFormValid.email === false ? (
                    <span className="wrong">{errorMessages.email}</span>
                  ) : formFields.email.value !== '' &&
                    isFormValid.email === true ? (
                    <span className="good">{emailMessage}</span>
                  ) : (
                    ''
                  )
                }
                color={
                  formFields.email.value === ''
                    ? 'perso'
                    : isFormValid.email === false
                    ? 'error'
                    : 'success'
                }
              />
              {!isEditMode ? (
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Editez pour modifier"
                  className="MyProfile--input"
                  disabled
                />
              ) : (
                <button
                  type="button"
                  className="MyProfile--fourthField--button--delete" // TODO: A modifier (mauvaise classe)
                  onClick={handlePasswordModale}
                  disabled={!isEditMode}
                >
                  Modifier le mot de passe
                </button>
              )}
              <Input
                id="description"
                name="description"
                multiline
                rows={5}
                rowsMax={5}
                slot={isEditMode ? 'A propos de moi' : null}
                type="text"
                placeholder={member?.description || ''}
                aria-label="A propos de moi"
                value={formFields.description.value}
                className={`MyProfile--input ${formFields.description.className}`}
                disabled={!isEditMode}
                onChange={(event) => handleChange(event, 'description')}
                helperText={
                  formFields.description.value !== '' &&
                  isFormValid.description === false ? (
                    <span className="wrong">{errorMessages.description}</span>
                  ) : (
                    ''
                  )
                }
                color={
                  formFields.description.value === ''
                    ? 'perso'
                    : isFormValid.description === false
                    ? 'error'
                    : 'success'
                }
              />
              <div className="MyProfile--content--firstField--openToWork">
                <p>Ouvert aux projets</p>
                <CustomSwitch
                  name="availability"
                  checked={isEditMode ? checked : member?.availability} // Si on est en mode édition, on affiche la valeur du state checked, sinon on affiche la valeur du membre
                  onChange={handleSwitch} // On appelle la fonction handleSwitch au changement de valeur du switch
                  disabled={!isEditMode} // On désactive le switch si on est pas en mode édition
                />
              </div>
            </fieldset>
            <fieldset className="MyProfile--content--secondField">
              <img
                src="/images/profil/profil.svg"
                alt="profil"
                className="MyProfile--content--secondField--image"
              />
              <div className="MyProfile--content--secondField--technos">
                <h4 className="MyProfile--content--secondField--technos--title">
                  Mes technos
                </h4>
                <p>(1 techno minimum)</p>
                <div className="MyProfile--content--secondField--technos--technos">
                  {/** //! Rendu conditionnel des tags
                   * @param {boolean} isEditMode - Si on est en mode édition ou lecture
                   * @param {array} member.tags - Les tags du membre
                   * @param {array} allTags - Tous les tags
                   *
                   * Affichage des tags en fonction des conditions lecture ou édition
                   */}
                  {!isEditMode
                    ? /** //* En mode lecture
                       * Si on a des tags, on les affiche avec un map() sur les tags du membre
                       * On ajoute une key à chaque tag
                       * On affiche l'image du tag et son nom
                       */
                      member?.tags &&
                      member.tags.map((tag) => (
                        <div
                          className="MyProfile--content--secondField--technos--technos--group"
                          key={tag.id}
                        >
                          <img
                            src={`/images/technos/${tag.name.toLowerCase()}.svg`}
                            alt={tag.name}
                            title={tag.name}
                          />
                          <p>{tag.name}</p>
                        </div>
                      ))
                    : /** //* En mode édition
                       * Si on a des tags, on les affiche avec un map() sur allTags
                       * On ajoute une key à chaque tag
                       * On affiche l'image du tag et son nom
                       *
                       * On vérifie si le tag est présent dans les tags du membre pour ajouter la classe selected
                       */
                      allTags &&
                      allTags?.map((tag) => {
                        const isMatchingTag =
                          member?.tags?.find(
                            (memberTag) => memberTag.id === tag.id // On vérifie si le tag est présent dans les tags du membre
                          ) !== undefined;
                        const className = isMatchingTag ? 'selected' : ''; // Si le tag est présent dans les tags du membre, on ajoute la classe selected
                        return (
                          <div
                            className={`MyProfile--content--secondField--technos--technos--group ${className}`}
                            role="button"
                            key={tag.id}
                            id={`tag-${tag.id}`} // Sert de référence pour la fonction handleImageClick ( permet d'ajouter ou de retirer la classe selected quand on ajoute/supprime le tag)
                            onClick={() => handleImageClick(tag.id)} // On appelle la fonction handleImageClick au clic sur l'image
                            onKeyDown={(
                              event // On appelle la fonction handleImageKeyDown au keydown sur l'image
                            ) => handleImageKeyDown(event, tag.id.toString())}
                            tabIndex={0} // On ajoute un tabIndex pour que l'élément soit focusable (accessibilité)
                          >
                            <img
                              src={`/images/technos/${tag.name.toLowerCase()}.svg`}
                              alt={tag.name}
                              title={tag.name}
                            />
                            <p>{tag.name}</p>
                          </div>
                        );
                      })}
                </div>
              </div>
            </fieldset>
            <fieldset className="MyProfile--content--thirdField">
              <div className="MyProfile--thirdField--projects">
                <h4 className="MyProfile--thirdField--projects--title">
                  Projets
                </h4>
                {/** //! Projets du membre
                 * @param {array} member.projects - Les projets du membre
                 * Si on a au moins un projet, on les affiche avec un map() sur les projets du membre
                 * Pour chaque projet, on envoie au composant <ProjectCard /> une key et le projet
                 */}
                {member?.projects &&
                  member.projects.length > 0 &&
                  member.projects.map((project) => (
                    <ProjectCard key={project.id} projectID={project} />
                  ))}
              </div>
            </fieldset>
          </div>
          <fieldset className="MyProfile--fourthField--button">
            <div className="MyProfile--fourthField--button--group">
              <button // ? Bouton annuler
                onClick={handleCancelClick} // On appelle la fonction handleCancelClick au clic sur le bouton
                type="button"
                className={`MyProfile--fourthField--button--cancel ${
                  // On contrôle l'affichage du bouton si on est en mode édition grâce à la classe CSS visible ou hidden
                  isEditMode
                    ? 'MyProfile--fourthField--button--group--visible'
                    : 'MyProfile--fourthField--button--group--hidden'
                }`}
                disabled={!isEditMode}
              >
                Annuler
              </button>
              <button // ? Bouton modifier ou valider
                onClick={handleEditClick}
                type="button"
                className={`MyProfile--fourthField--button--submit ${
                  // On contrôle l'affichage du bouton si on est en mode édition grâce à la classe CSS updatedMode ou submittedMode
                  isEditMode
                    ? 'MyProfile--fourthField--button--updatedMode'
                    : 'MyProfile--fourthField--button--submittedMode'
                }`}
              >
                {isEditMode ? 'Valider' : 'Modifier mon profil'}{' '}
                {/* On affiche le texte en fonction du mode isEditMode */}
              </button>
            </div>
            <button // ? Bouton supprimer le profil
              type="button"
              className="MyProfile--fourthField--button--delete"
              onClick={handleDeleteModale} // On appelle la fonction handleDeleteModale au clic sur le bouton
            >
              Supprimer le profil
            </button>
          </fieldset>
        </form>
      </div>
      {/** //! Modale de suppression
       * Si modalDelete est true, on affiche la modale
       */}
      {modalDelete && <DeleteModale />}
      {/** //! Modale de changement de password
       * Si modalPassword est true, on affiche la modale
       */}
      {modalPassword && (
        <PasswordModale
          selectedTags={selectedTags} // Obligé de renvoyer les tags, sinon ils disparaissent
        />
      )}
    </>
  );
}

export default MyProfile;
