import './styles.css';
import { useState } from 'react';

import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';

import toast, { Toaster } from 'react-hot-toast';

export default function App() {
  const [isLoggedIn, setLogin] = useState(false);
  const [user, setUser] = useState({});

  const handleLogin = (userDetails) => {
    setUser(userDetails);
    setLogin(true);
  };

  if (isLoggedIn) {
    return (
      <>
        <Dashboard
          logOut={() => setLogin(false)}
          toastHandlerForPromises={handlePromiseWithToast}
          loggedInUser={user}
        />
        <ToastContainer />
      </>
    );
  } else {
    return (
      <>
        <Login
          login={handleLogin}
          toastHandlerForPromises={handlePromiseWithToast}
        />
        <ToastContainer />
      </>
    );
  }
}

const handlePromiseWithToast = async (
  promise,
  loadingMsg,
  successMsg,
  errorMsg
) => {
  toast.promise(promise, {
    loading: loadingMsg || 'Loading...',
    success: successMsg || 'Success!!',
    error: errorMsg || 'Error!!',
  });
};

const ToastContainer = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 2000,
        style: {
          background: '#fff',
          color: '#7e48a2',
        },

        // Default options for specific types
        success: {
          duration: 2000,
          theme: {
            primary: 'green',
            secondary: 'black',
          },
        },
      }}
    />
  );
};
