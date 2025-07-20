

// LoginForm.jsx
import React, { useState } from 'react';
import './AuthForm.css';

export default function LoginForm({ onClose }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user)); // ✅ Store user
      onClose();
      window.location.reload(); // Refresh to update navbar
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (err) {
    console.error(err);
    alert('Server error during login.');
  }
};


  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email or Phone Number"
        className="modal-input"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="modal-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="modal-buttons">
        <button type="submit" className="primary-button">Login</button>
        <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
}


// import React, { useState } from 'react';
// import './AuthForm.css';
// import { useAuth } from '../contexts/AuthContext';

// export default function LoginForm({ onClose }) {
//   const [identifier, setIdentifier] = useState('');
//   const [password, setPassword] = useState('');
//   const { setUser } = useAuth();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ identifier, password }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setUser(data.user);
//         onClose();
//       } else {
//         alert(data.error || 'Login failed');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Server error during login.');
//     }
//   };

//   return (
//     <form className="auth-form" onSubmit={handleLogin}>
//       <h2>Login</h2>
//       <input
//         type="text"
//         placeholder="Email or Phone Number"
//         className="modal-input"
//         value={identifier}
//         onChange={(e) => setIdentifier(e.target.value)}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         className="modal-input"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <div className="modal-buttons">
//         <button type="submit" className="primary-button">Login</button>
//         <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
//       </div>
//     </form>
//   );
// }