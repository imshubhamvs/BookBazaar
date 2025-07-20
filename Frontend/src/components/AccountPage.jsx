// // AccountPage.jsx
// import React, { useEffect, useState } from 'react';

// export default function AccountPage() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/auth/me', {
//           credentials: 'include',
//         });
//         const data = await res.json();
//         if (res.ok) {
//           setUser(data.user);
//         }
//       } catch (err) {
//         console.error('Error fetching user info:', err);
//       }
//     };
//     fetchUser();
//   }, []);

//   if (!user) {
//     return (
//       <div style={{ padding: '2rem' }}>
//         <h2>Please login to view your account.</h2>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Welcome, {user.fullName}!</h2>
//       <p><strong>Email:</strong> {user.email}</p>
//       <p><strong>Phone:</strong> {user.phone}</p>
//       <p><strong>Address:</strong> {user.address?.house}, {user.address?.area}, {user.address?.pincode}</p>
//     </div>
//   );
// }
// src/pages/AccountPage.jsx
import React from 'react';

export default function AccountPage() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Account Info</h2>
      {user ? (
        <ul>
          <li><strong>Name:</strong> {user.name}</li>
          <li><strong>Email:</strong> {user.email}</li>
          <li><strong>Phone:</strong> {user.phone}</li>
          {user.address ? (
            <div>
              <p><strong>House:</strong> {user.address.house}</p>
              <p><strong>Area:</strong> {user.address.area}</p>
              <p><strong>Pincode:</strong> {user.address.pincode}</p>
            </div>
          ) : (
            <p><i>No address provided.</i></p>
          )}
        </ul>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

