import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './AuthModal.css';

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="auth-toggle">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Register</button>
        </div>
        {isLogin ? <LoginForm onClose={onClose} /> : <SignupForm onClose={onClose} />}
      </div>
    </div>
  );
}
