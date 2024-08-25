// SignIn.js
"use client";
import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Ensure this path is correct

const SignIn = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailSignIn, setIsEmailSignIn] = useState(false);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in with Google:', result.user);
      onSignIn(result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleEmailSignIn = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in with Email/Password:', userCredential.user);
      onSignIn(userCredential.user);
    } catch (error) {
      console.error('Error signing in with Email/Password:', error);
    }
  };

  return (
    <div style={signInContainerStyle}>
      <h2 style={headingStyle}>Sign In</h2>
      {!isEmailSignIn ? (
        <button onClick={handleGoogleSignIn} style={signInButtonStyle}>
          Sign in with Google
        </button>
      ) : (
        <form onSubmit={handleEmailSignIn} style={formStyle}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={signInButtonStyle}>
            Sign In
          </button>
        </form>
      )}
      <button 
        onClick={() => setIsEmailSignIn(!isEmailSignIn)} 
        style={toggleButtonStyle}
      >
        {isEmailSignIn ? 'Sign in with Google' : 'Sign in with Email/Password'}
      </button>
    </div>
  );
};

// Styling for the sign-in component
const signInContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f0f0f0',
  color: '#333',
  textAlign: 'center',
};

const headingStyle = {
  marginBottom: '20px',
};

const signInButtonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#4285F4',
  color: '#fff',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  marginBottom: '10px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '300px',
  marginTop: '20px',
};

const inputStyle = {
  margin: '5px 0',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  width: '100%',
};

const toggleButtonStyle = {
  marginTop: '10px',
  backgroundColor: '#fbbc05',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default SignIn;
