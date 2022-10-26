import '../Login/Login.css';

import {
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import toast from 'react-hot-toast';

import { useState } from 'react';

import { signUpUser } from '../../APIs/User.js';

export default function Signup({ toggleLogin, toastHandlerForPromises }) {
  const gotoLogin = (_) => toggleLogin(true);

  const [showPassword, togglePwdVisibility] = useState(false);

  const handleClickShowPassword = () => {
    togglePwdVisibility(!showPassword);
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleFormChange = (e) => {
    const inputKey = e.target.id;
    const input = e.target.value;

    // If 'errors' exist, then we also need to check if the user has entered
    // valid data for a field. If yes, we need to stop showing error at that instant

    switch (inputKey) {
      case 'email':
        setFormData({ ...formData, email: input });
        if (Object.keys(errors).length && isEmail(input)) {
          const existingErrors = errors;
          existingErrors.email = null;
          setErrors(existingErrors);
        }
        break;
      case 'password':
        setFormData({ ...formData, password: input });
        if (Object.keys(errors).length && input.length >= 8) {
          const existingErrors = errors;
          delete existingErrors.password;
          existingErrors.password = null;
          setErrors(existingErrors);
        }
        break;
      case 'firstName':
        setFormData({ ...formData, firstName: input });
        if (Object.keys(errors).length && input.length >= 1) {
          const existingErrors = errors;
          existingErrors.firstName = null;
          setErrors({ existingErrors });
        }
        break;
      case 'lastName':
        setFormData({ ...formData, lastName: input });
        if (Object.keys(errors).length && input.length >= 1) {
          const existingErrors = errors;
          existingErrors.lastName = null;
          setErrors(existingErrors);
        }
        break;
      default:
        break;
    }
  };

  const [errors, setErrors] = useState({});

  // Regex for email validation
  const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const validateFormAndSubmit = async () => {
    const errors = {};

    if (!isEmail(formData.email)) {
      errors.email = 'Email should be in correct format';
    }

    if (formData.password.length < 8) {
      errors.password = 'Password should be of atleast 8 characters';
    }

    if (formData.firstName.length < 1) {
      errors.firstName = 'First name cannot be empty';
    }

    if (formData.lastName.length < 1) {
      errors.lastName = 'Last name cannot be empty';
    }

    setErrors(errors);

    if (Object.keys(errors).length) {
      // Don't submit the form: show an alert to rectify the inputs
      toast.error('Could not sign up. Press OK to check the error message(s)');
    } else {
      // handle form submission and go to Login page
      const signUpPromise = signUpUser(formData);
      toastHandlerForPromises(
        signUpPromise,
        'Signing up...',
        'Signed up successfully!',
        'Could not sign up. Please try again.'
      );
      signUpPromise.then((res) => gotoLogin());
    }
  };

  return (
    <div className="container">
      <Typography
        variant="h4"
        className="purple montserrat"
        sx={{ mt: 1, mb: 2 }}
      >
        Sign up
      </Typography>
      <div className="textfield-wrapper">
        <TextField
          id="email"
          required
          error={errors.email}
          helperText={errors.email ? errors.email : null}
          variant="outlined"
          value={formData.email}
          onChange={(e) => handleFormChange(e)}
          sx={{ my: 1 }}
          size="small"
          label="Email"
          fullWidth
        />
      </div>
      <div className="textfield-wrapper">
        <TextField
          id="password"
          required
          error={errors.password ? true : false}
          helperText={errors.password ? errors.password : null}
          variant="outlined"
          value={formData.password}
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => handleFormChange(e)}
          sx={{ my: 1 }}
          size="small"
          label="Password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </div>
      <div className="textfield-wrapper">
        <TextField
          id="firstName"
          required
          error={errors.firstName}
          helperText={errors.firstName ? errors.firstName : null}
          variant="outlined"
          value={formData.firstName}
          onChange={(e) => handleFormChange(e)}
          sx={{ my: 1 }}
          size="small"
          label="First Name"
          fullWidth
        />
      </div>
      <div className="textfield-wrapper">
        <TextField
          id="lastName"
          required
          error={errors.lastName}
          helperText={errors.lastName ? errors.lastName : null}
          variant="outlined"
          value={formData.lastName}
          onChange={(e) => handleFormChange(e)}
          sx={{ my: 1 }}
          size="small"
          label="Last Name"
          fullWidth
        />
      </div>
      <div className="button-container">
        <Button
          variant="outlined"
          color="secondary"
          className="login-btn montserrat"
          fullWidth
          onClick={gotoLogin}
          sx={{ borderRadius: '16px', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Divider
          orientation="vertical"
          variant="middle"
          sx={{ mx: 1, mt: 0 }}
        />
        <Button
          variant="contained"
          color="secondary"
          className="login-btn montserrat"
          fullWidth
          onClick={validateFormAndSubmit}
          sx={{ borderRadius: '16px', textTransform: 'none' }}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
}
