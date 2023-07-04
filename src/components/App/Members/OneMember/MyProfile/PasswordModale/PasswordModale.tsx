/* eslint-disable no-nested-ternary */
// ? Librairie
import { useRef, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../../../hook/redux';

// ? Fonctions externes
import updateMember from '../../../../../../store/actions/updateMember';
import checkPassword from '../../../../../../store/actions/checkPassword';
import {
  resetMessage,
  updateFlash,
} from '../../../../../../store/reducer/main';
import {
  classMapping,
  validateField,
  isFormValid,
  errorMessages,
} from '../../../../../../utils/validate form/validateForm';

// ? Composants
import Input from '../../../../../Form/Input';

// ? Styles
import './style.scss';

// ? Fonction principale
function PasswordModale({
  isOpenPasswordModale,
  setIsOpenPasswordModale,
  selectedTags,
}: {
  isOpenPasswordModale: boolean;
  setIsOpenPasswordModale: (isOpen: boolean) => void;
  selectedTags: string[];
}) {
  // ? States
  // Redux
  const id = useAppSelector((state) => state.user.login.id); // id du membre connecté
  const { passwordMessage, passwordStatus } = useAppSelector(
    (state) => state.ajax
  ); // Message de validation ou d'erreur

  // Local
  const [formFields, setFormFields] = useState({
    oldPassword: { value: '', className: '' },
    newPassword: { value: '', className: '' },
    confirmPassword: { value: '', className: '' },
  });
  const [oldPassword, setOldPassword] = useState(''); // Ancien mot de passe

  // ? useRef
  const modalRef = useRef(null); // Permet de cibler la modale

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? useEffect

  //* Pour le clic externe à la modale
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        // Si on clique en dehors de la modale
        modalRef.current &&
        !(modalRef.current as Element).contains(event.target as Node)
        // On précise que modalRef.current éun element html (Element)
        // On précise que event.target représente un noeud du DOM (Node)
      ) {
        setIsOpenPasswordModale(!isOpenPasswordModale);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenPasswordModale, setIsOpenPasswordModale]);

  // ? Fonctions
  /** //* Fonction pour fermer la modale avec la croix ou le bouton annuler
   * @param {boolean} isOpenPasswordModale - État de la modale
   * Au clic, on inverse l'état de la modale
   */
  const handlePasswordModale = () => {
    setIsOpenPasswordModale(!isOpenPasswordModale);
    // Si on annule l'action, on repasse les champs en valides, ils ne seront pas pris en compte dans MyProfile
    isFormValid.oldPassword = true;
    isFormValid.newPassword = true;
    isFormValid.confirmPassword = true;
  };

  /** //! Accessibilité
   * @param {React.KeyboardEvent<HTMLDivElement>} event - Événement clavier
   * @param {boolean} isOpenPasswordModale - État de la modale
   * * Une div n'est pas un element clickable par défaut.
   * On ajoute un fonction d’accessibilité pour le clavier.
   * Si la touche enter ou espace est pressée, on appelle la fonction handlePasswordModale() juste au dessus.
   */
  const handlePasswordModaleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === 'enter' || event.key === ' ') {
      handlePasswordModale();
    }
  };

  /** //* Fonction de vérification du mot de passe
   * @param {React.ChangeEvent<HTMLInputElement>} e - Événement de changement de valeur
   * On récupère la valeur du champ
   * On appelle la fonction checkPassword() du fichier actions/checkPassword.ts
   * On lui passe en paramètre l'ancien mot de passe et l'id du membre connecté
   */
  const verifyPassword = (e) => {
    setOldPassword(e.target.value);

    if (e.target.value) {
      dispatch(checkPassword({ oldPassword: e.target.value, id }));
    }
  };

  /** //* Fonction de vérification du statut de la requête Ajax
   * @param {string} status - Statut de la requête Ajax
   * Si le statut est success, on passe isFormValid.oldPassword à true
   * Sinon, on passe isFormValid.oldPassword à false
   */
  const checkPasswordStatus = () => {
    if (passwordStatus === 'success') {
      isFormValid.oldPassword = true;
    } else {
      isFormValid.oldPassword = false;
    }
  };
  /** //* useEffect pour vérifier le statut de la requête Ajax
   * Quand le statut change, on appelle la fonction checkStatus()
   * Pour avoir toujours l'état à jour
   */
  useEffect(() => {
    checkPasswordStatus();
  }, [passwordStatus]);

  /** //* Fonction de validation des champs
   * @param {string} value - valeur du champ
   * @param {string} fieldName - nom du champ
   * Fonction qui vérifie si le champ est vide ou non
   * Si le champ est vide, on retourne une string vide
   * Si le champ n'est pas vide, on appelle la fonction validateField() du fichier utils.ts
   * Cette fonction vérifiera si le champ est valide ou non
   * On retourne le résultat dans le state formFields
   */
  const handleChange = (event, fieldName) => {
    const { value } = event.target;
    const newPasswordValue = formFields.newPassword.value;

    const options = { newPasswordValue };

    const validation = validateField(value, fieldName, options);

    let newClassName = '';

    if (validation) {
      const { className } = validation;
      newClassName = classMapping[className];
    }

    setFormFields((prevState) => ({
      ...prevState,
      [fieldName]: {
        value,
        className: newClassName,
      },
    }));
  };

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

    // const oldPassword = document.querySelector(
    //   '#oldPassword'
    // ) as HTMLInputElement;
    const newPassword = document.querySelector(
      '#newPassword'
    ) as HTMLInputElement;
    const confirmPassword = document.querySelector(
      '#confirmPassword'
    ) as HTMLInputElement;

    if (!oldPassword || oldPassword.value === '') {
      isFormValid.oldPassword = false;
    }
    if (!newPassword || newPassword.value === '') {
      isFormValid.newPassword = false;
    }
    if (!confirmPassword || confirmPassword.value === '') {
      isFormValid.confirmPassword = false;
    }

    // ! Gestion des erreurs
    dispatch(resetMessage()); // On reset le message flash
    // On vérifie si les champs sont vides
    // On compte le nombre de false dans isFormValid
    const falseFieldCount = Object.values(isFormValid).filter(
      (value) => value === false
    ).length;
    // Si un seul champ est vide, on affiche un message d'erreur spécifique à ce champ
    if (falseFieldCount === 1) {
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
      // Obligé de renvoyer les tags, sinon ils disparaissent
      // ? Gestion des tags
      if (selectedTags && selectedTags.length > 0) {
        // On vérifie que selectedTags existe et qu'il contient au moins un tag
        const selectedTagsData = selectedTags.map((tag) => tag.id); // On crée un tableau avec les id des tags sélectionnés
        // const tagsJSON = JSON.stringify(selectedTagsData); // On convertie le tableau en chaîne JSON

        formData.append('tags', selectedTagsData); // On ajoute le tableau selectedTagsData à formData
        objData.tags = selectedTagsData; // On ajoute le tableau selectedTagsData à objData
      }

      // ? Gestion du password
      formData.append('password', confirmPassword.value);
      objData.password = confirmPassword.value;

      dispatch(
        // On dispatch l'action updateMember avec l'id du membre et les données du formulaire
        updateMember({
          id,
          formData: { ...objData }, // Dans formData, on ajoute les données du formulaire (objData)
        })
      );
      setIsOpenPasswordModale(false); // On ferme la modale
    }
  };

  // ? Rendu JSX

  return (
    <div className="PasswordModale">
      <div className="PasswordModale--container" ref={modalRef}>
        <div className="PasswordModale--container--head">
          <h2 className="PasswordModale--title">Changement de mot de passe</h2>
          <div
            /** //? Bouton fermer la modale
             * @param {boolean} isOpenPasswordModale - État de la modale
             * @param {React.MouseEvent<HTMLDivElement>} event - Événement clic
             * @param {React.KeyboardEvent<HTMLDivElement>} event - Événement clavier
             * * Une div n'est pas un element clickable par défaut.
             * On ajoute tabindex={0} pour le rendre focusable.
             * et une fonction de déclenchement au clic ou au clavier
             */
            className="PasswordModale--close"
            role="button" // On précise que c'est un bouton
            tabIndex={0} // On précise que c'est un élément focusable
            onClick={handlePasswordModale}
            onKeyDown={handlePasswordModaleKeyDown}
          >
            X
          </div>
        </div>

        <form onSubmit={handleSubmit} className="PasswordModale--form">
          <div className="PasswordModale--form--submit">
            <Input
              id="oldPassword"
              slot="Ancien mot de passe"
              name="password"
              type="password"
              placeholder="*****"
              value={formFields.oldPassword.value}
              onChange={(event) => {
                checkPasswordStatus();
                verifyPassword(event);
                handleChange(event, 'oldPassword');
              }}
              className={
                oldPassword === ''
                  ? 'MyProfile--input'
                  : passwordStatus === 'success'
                  ? `MyProfile--input ${'good'}`
                  : `MyProfile--input ${'wrong'}`
              }
            />
            <span
              className={
                oldPassword === ''
                  ? ''
                  : passwordStatus === 'success'
                  ? 'good'
                  : 'wrong'
              }
            >
              {oldPassword === ''
                ? ''
                : passwordStatus === 'success'
                ? passwordMessage
                : ''}
            </span>
            <Input
              id="newPassword"
              slot="Nouveau mot de passe"
              name="password"
              type="password"
              placeholder="*****"
              value={formFields.newPassword.value}
              onChange={(event) => handleChange(event, 'newPassword')}
              className={`MyProfile--input ${formFields.newPassword.className}`}
            />
            <Input
              id="confirmPassword"
              slot="Confirmation du mot de passe"
              name="password"
              type="password"
              placeholder="*****"
              value={formFields.confirmPassword.value}
              onChange={(event) => handleChange(event, 'confirmPassword')}
              className={`MyProfile--input ${formFields.confirmPassword.className}`}
            />
            <button
              type="button"
              onClick={handlePasswordModale}
              className="PasswordModale--form--submit--cancel"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="PasswordModale--form--submit--confirm"
            >
              Modifier le mot de passe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordModale;
