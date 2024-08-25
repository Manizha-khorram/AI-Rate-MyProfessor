"use client";
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Ensure this path is correct
import SignIn from './SignIn'; // Ensure this path is correct

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log('User logged in:', user);
      } else {
        setUser(null);
        console.log('User not logged in');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={appContainerStyle}>
      <h1 style={headerStyle}>Welcome to AI Rate My Professor</h1>
      {user ? (
        <div style={profileContainerStyle}>
          <h2 style={profileGreetingStyle}>Welcome, {user.displayName || 'User'}!</h2>
          {user.photoURL && <img src={user.photoURL} alt="User profile" style={profileImageStyle} />}
          <p style={profileEmailStyle}>Email: {user.email}</p>
          <button onClick={handleSignOut} style={signOutButtonStyle}>
            Sign Out
          </button>
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

// Styling for the app component
const appContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#f0f0f0',
  color: '#333',
  textAlign: 'center',
};

const headerStyle = {
  marginBottom: '20px',
};

const profileContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const profileGreetingStyle = {
  marginBottom: '10px',
};

const profileImageStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  marginBottom: '10px',
};

const profileEmailStyle = {
  marginBottom: '20px',
};

const signOutButtonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#d9534f',
  color: '#fff',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

export default App; // Ensure the component is exported
