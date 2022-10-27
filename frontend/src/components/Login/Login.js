import './Login.css';

import {
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import toast, { Toaster } from 'react-hot-toast';

import { useState } from 'react';
import Signup from '../Signup/Signup';

import { loginUser } from '../../APIs/User';
import ForgotPwd from './ForgotPwd';

export default function Login({ login, toastHandlerForPromises }) {
  const [showLogin, toggleLogin] = useState(true);

  const [showPassword, togglePwdVisibility] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const [showResetPwdDialog, toggleResetPwdDialog] = useState(false);

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
      default:
        break;
    }
  };

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

    setErrors(errors);

    if (Object.keys(errors).length) {
      // Don't submit the form: show an alert to rectify the inputs
      notifyError('Could not log in. Check the error message(s)');
    } else {
      // handle form submission and go to the Dashboard page
      const loginPromise = loginUser(formData);
      toastHandlerForPromises(
        loginPromise,
        'Loading...',
        'Logged in successfully!',
        'Could not log in. Check your credentials.'
      );
      loginPromise.then((res) => login(res.data));
    }
  };

  const notifyError = (msg) => toast.error(msg);

  const signupUser = (e) => {
    e.preventDefault();
    setErrors({});
    toggleLogin(false);
  };

  const handleClickShowPassword = () => {
    togglePwdVisibility(!showPassword);
  };

  return showLogin ? (
    <div className="container">
      <Typography
        variant="h4"
        className="purple montserrat"
        sx={{ mt: 1, mb: 2 }}
      >
        Log in to continue
      </Typography>
      <div className="textfield-wrapper">
        <TextField
          id="email"
          required
          error={errors.email ? true : false}
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
      <a
        href=""
        className="anchor purple"
        onClick={(e) => {
          e.preventDefault();
          toggleResetPwdDialog(true);
        }}
      >
        Forgot password?
      </a>
      <div className="button-container">
        <Button
          variant="contained"
          color="secondary"
          className="login-btn montserrat"
          onClick={validateFormAndSubmit}
          sx={{ borderRadius: '16px', textTransform: 'none' }}
          fullWidth
        >
          Log In
        </Button>
      </div>
      <div className="signup-container">
        <p>
          Don't have an account?
          <span>
            <a href="" className="anchor purple" onClick={signupUser}>
              Sign up
            </a>
          </span>
        </p>
      </div>
      <p>or</p>
      <div className="button-container">
        <Button
          variant="outlined"
          color="secondary"
          style={{
            textTransform: 'none',
            fontWeight: 'bold',
          }}
          sx={{ borderColor: '#ccc', borderRadius: '16px' }}
          fullWidth
        >
          <GoogleIcon />
          <span className="login-google montesserat">Log In with Google</span>
        </Button>
      </div>
      {showResetPwdDialog ? (
        <ForgotPwd
          open={showResetPwdDialog}
          handleClose={function () {
            toggleResetPwdDialog(false);
          }}
          toastHandlerForPromises={toastHandlerForPromises}
        />
      ) : null}
    </div>
  ) : (
    <Signup toggleLogin={toggleLogin} />
  );
}
