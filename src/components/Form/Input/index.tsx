/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-nested-ternary */
// ? Librairies
import { useId, useState } from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { ThemeProvider } from '@mui/material/styles';
import customThemeMUI from '../../../utils/customOutlinedUI';

// ? Styles
import './style.scss';

// ? Typage local
interface InputProps {
  name: string; //! Obligatoire
  placeholder: string;
  slot: string | null;
  [otherProps: string]: unknown; // On ne connait pas le type de ce qu'il peut y avoir => booléen, string, number, ...
}

// ? Fonction principale
function Input({ name, placeholder, slot, ...props }: InputProps) {
  // ? State
  // Local
  const [value, setValue] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  // ? useId
  const inputId = useId(); // Génère un id aléatoire pour le champ

  // ? Fonctions
  /** //* Mise à jour de la valeur de l'input
   * @param {React.ChangeEvent<HTMLInputElement>} event - On récupère l'évènement
   * On met à jour le state value avec la valeur de l'input
   */
  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setValue(event.target.value);
  }
  function handleClickVisibilityIcon() {
    setShowPassword(!showPassword);
  }

  // ? Rendu JSX
  return (
    <ThemeProvider theme={customThemeMUI}>
      <TextField
        key={inputId}
        color="perso"
        id={inputId}
        slot={slot}
        label={slot}
        focused={slot}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        {...props}
        type={
          (slot === 'Mot de passe' && showPassword) ||
          (slot === 'Confirmation du mot de passe' && showPassword) ||
          (slot === 'Ancien mot de passe' && showPassword) ||
          (slot === 'Nouveau mot de passe' && showPassword)
            ? 'text'
            : (slot === 'Mot de passe' && !showPassword) ||
              (slot === 'Confirmation du mot de passe' && !showPassword) ||
              (slot === 'Ancien mot de passe' && !showPassword) ||
              (slot === 'Nouveau mot de passe' && !showPassword)
            ? 'password'
            : 'text'
        }
        sx={{ m: 2, width: '250px' }}
        InputProps={
          slot === 'Mot de passe' ||
          slot === 'Confirmation du mot de passe' ||
          slot === 'Ancien mot de passe' ||
          slot === 'Nouveau mot de passe'
            ? {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={handleClickVisibilityIcon}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon type="button" />
                    ) : (
                      <VisibilityOutlinedIcon type="button" />
                    )}
                  </InputAdornment>
                ),
              }
            : ''
        }
      />
    </ThemeProvider>
  );
}
export default Input;
