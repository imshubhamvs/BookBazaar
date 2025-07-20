
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import './Navbar.css';

export default function Navbar({ cart }) {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const totalItems = Object.values(cart).reduce((sum, val) => sum + val, 0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUserClick = () => {
    if (user) {
      navigate('/account');
    } else {
      setShowModal(true);
    }
  };

  const handleLogout = () => {
    fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
      window.location.reload();
    });
  };

  return (
    <nav className="navbar">
      <h1 className="logo" >BookBazar</h1>
      <div className="navbar-controls">
        <input type="text" className="search-input" placeholder="Search books..." />

        <button className="cart-button" onClick={() => navigate('/cart')}>
          🛒
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </button>

        {user ? (
          <div className="user-controls">
            <button className="login-button" onClick={handleUserClick}>
              <span className="user-icon">
                {user.name ? user.name[0].toUpperCase() : '👤'}
              </span>
            </button>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="login-button" onClick={handleUserClick}>
            Login / Signup
          </button>
        )}
      </div>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </nav>
  );
}

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AuthModal from './AuthModal';
// import './Navbar.css';
// import { useAuth } from '../contexts/AuthContext';

// export default function Navbar({ cart }) {
//   const [showModal, setShowModal] = useState(false);
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const totalItems = Object.values(cart).reduce((sum, val) => sum + val, 0);

//   const handleUserClick = () => {
//     if (user) {
//       navigate('/account');
//     } else {
//       setShowModal(true);
//     }
//   };

//   return (
//     <nav className="navbar">
//       <h1 className="logo">BookBazar</h1>
//       <div className="navbar-controls">
//         <input type="text" className="search-input" placeholder="Search books..." />

//         <button className="cart-button">
//           🛒
//           {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
//         </button>

//         {user ? (
//           <div className="user-controls">
//             <button className="login-button" onClick={handleUserClick}>
//               <span className="user-icon">
//                 {user.fullName ? user.fullName[0].toUpperCase() : '👤'}
//               </span>
//             </button>
//             <button className="logout-button" onClick={logout}>Logout</button>
//           </div>
//         ) : (
//           <button className="login-button" onClick={handleUserClick}>Login / Signup</button>
//         )}
//       </div>
//       {showModal && <AuthModal onClose={() => setShowModal(false)} />}
//     </nav>
//   );
// }