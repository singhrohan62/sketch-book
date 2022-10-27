import { useState } from 'react';

import './Login.css';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { resetPwdForUser } from '../../APIs/User';

import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPwd({
  open,
  handleClose,
  toastHandlerForPromises,
}) {
  const [initState, setCompState] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const [showPasswords, togglePwdVisibility] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const handleClickShowPassword = (key) => {
    const prevState = showPasswords[key];
    togglePwdVisibility({ ...showPasswords, [key]: !prevState });
  };

  const handleFormChange = (e) => {
    const inputKey = e.target.id;
    const input = e.target.value;

    setCompState({
      ...initState,
      [e.target.id]: e.target.value,
    });

    // If 'errors' exist, then we also need to check if the user has entered
    // valid data for a field. If yes, we need to stop showing error at that instant

    switch (inputKey) {
      case 'email':
        if (Object.keys(errors).length && isEmail(input)) {
          const existingErrors = errors;
          existingErrors.email = null;
          setErrors(existingErrors);
        }
        break;
      case 'newPassword':
        if (Object.keys(errors).length && input.length >= 8) {
          const existingErrors = errors;
          delete existingErrors.newPassword;
          existingErrors.newPassword = null;
          setErrors(existingErrors);
        }
        break;
      case 'confirmPassword':
        if (Object.keys(errors).length && input.length >= 8) {
          const existingErrors = errors;
          delete existingErrors.confirmPassword;
          existingErrors.confirmPassword = null;
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

    if (!isEmail(initState.email)) {
      errors.email = 'Email should be in correct format';
    }

    if (initState.newPassword.length < 8) {
      errors.newPassword = 'New password should be of atleast 8 characters';
    }

    if (
      initState.confirmPassword.length < 8 ||
      initState.newPassword !== initState.confirmPassword
    ) {
      errors.confirmPassword =
        "Confirm password doesn't match with the new password";
    }

    setErrors(errors);

    if (Object.keys(errors).length) {
      // Don't submit the form: show an alert to rectify the inputs
      toast.error('Could not reset password. Check the error message(s)');
    } else {
      // handle form submission and go to Login page
      const resetPwdPromise = resetPwdForUser(initState);

      toastHandlerForPromises(
        resetPwdPromise,
        'Resetting password...',
        'Password updated successfully!',
        'Could not reset password. Something went wrong'
      );

      resetPwdPromise.then(() => {
        handleClose();
      });
    }
  };

  return (
    <Dialog open={open} handleClose={handleClose}>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter your email along with the new password and confirm your new
          password.
        </DialogContentText>

        <div className="textfield-wrapper-dialog">
          <TextField
            id="email"
            required
            error={errors.email}
            helperText={errors.email ? errors.email : null}
            variant="outlined"
            value={initState.email}
            onChange={(e) => handleFormChange(e)}
            sx={{ my: 1 }}
            size="small"
            label="Email"
            fullWidth
          />
        </div>
        <div className="textfield-wrapper-dialog">
          <TextField
            id="newPassword"
            required
            error={errors.newPassword ? true : false}
            helperText={errors.newPassword ? errors.newPassword : null}
            variant="outlined"
            value={initState.newPassword}
            type={showPasswords.newPassword ? 'text' : 'password'}
            onChange={(e) => handleFormChange(e)}
            sx={{ my: 1 }}
            size="small"
            label="New Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={() => {
                      handleClickShowPassword('newPassword');
                    }}
                    edge="end"
                  >
                    {showPasswords.newPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </div>
        <div className="textfield-wrapper-dialog">
          <TextField
            id="confirmPassword"
            required
            error={errors.confirmPassword ? true : false}
            helperText={errors.confirmPassword ? errors.confirmPassword : null}
            variant="outlined"
            value={initState.confirmPassword}
            type={showPasswords.confirmPassword ? 'text' : 'password'}
            onChange={(e) => handleFormChange(e)}
            sx={{ my: 1 }}
            size="small"
            label="Confirm Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => {
                      handleClickShowPassword('confirmPassword');
                    }}
                    edge="end"
                  >
                    {showPasswords.confirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </div>
      </DialogContent>
      <DialogActions>
        <div className="button-container">
          <Button
            variant="outlined"
            color="secondary"
            className="login-btn montserrat"
            fullWidth
            onClick={handleClose}
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
            Reset password
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
