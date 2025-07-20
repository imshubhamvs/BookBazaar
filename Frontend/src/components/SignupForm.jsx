
import React, { useState } from 'react';
import './AuthForm.css';

export default function SignupForm({ onClose }) {
  const [step, setStep] = useState(1); // Step 1 = registration, Step 2 = OTP
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    address: {
      house: '',
      area: '',
      pincode: ''
    }
  });
  const [otp, setOtp] = useState('');
  const [serverMsg, setServerMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['house', 'area', 'pincode'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // for cookies
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setServerMsg('OTP sent to email. Please verify.');
        setStep(2);
      } else {
        setServerMsg(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setServerMsg('Something went wrong.');
    }
  };

  const handleOTPVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setServerMsg('Registration complete! You can now log in.');
        setTimeout(() => onClose(), 2000);
      } else {
        setServerMsg(data.message || 'OTP verification failed');
      }
    } catch (err) {
      console.error(err);
      setServerMsg('Something went wrong.');
    }
  };

  return (
    <form className="auth-form" onSubmit={step === 1 ? handleRegister : handleOTPVerify}>
      <h2>{step === 1 ? 'Register' : 'Verify OTP'}</h2>

      {step === 1 ? (
        <>
          <input name="fullName" type="text" placeholder="Full Name" className="modal-input" required onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" className="modal-input" required onChange={handleChange} />
          <input name="phone" type="text" placeholder="Phone Number" className="modal-input" required onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" className="modal-input" required onChange={handleChange} />
          <input name="house" type="text" placeholder="House / Street" className="modal-input" onChange={handleChange} />
          <input name="area" type="text" placeholder="Area / Landmark" className="modal-input" onChange={handleChange} />
          <input name="pincode" type="text" placeholder="Pincode" className="modal-input" onChange={handleChange} />
        </>
      ) : (
        <>
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="modal-input" required />
        </>
      )}

      <div className="modal-buttons">
        <button type="submit" className="primary-button">
          {step === 1 ? 'Register' : 'Verify OTP'}
        </button>
        <button type="button" className="secondary-button" onClick={onClose}>
          Cancel
        </button>
      </div>

      {serverMsg && <p style={{ color: '#e74c3c', marginTop: '10px', textAlign: 'center' }}>{serverMsg}</p>}
    </form>
  );
}

// import React, { useState } from 'react';
// import './AuthForm.css';
// import { useAuth } from '../contexts/AuthContext';

// export default function SignupForm({ onClose }) {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     password: '',
//     address: { house: '', area: '', pincode: '' }
//   });
//   const [otp, setOtp] = useState('');
//   const [serverMsg, setServerMsg] = useState('');
//   const { setUser } = useAuth();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (["house", "area", "pincode"].includes(name)) {
//       setFormData((prev) => ({
//         ...prev,
//         address: { ...prev.address, [name]: value }
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('http://localhost:5000/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setServerMsg('OTP sent to email. Please verify.');
//         setStep(2);
//       } else {
//         setServerMsg(data.message || 'Registration failed');
//       }
//     } catch (err) {
//       console.error(err);
//       setServerMsg('Something went wrong.');
//     }
//   };

//   const handleOTPVerify = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ email: formData.email, otp }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setServerMsg('Registration complete!');
//         setUser(data.user);
//         setTimeout(() => onClose(), 2000);
//       } else {
//         setServerMsg(data.message || 'OTP verification failed');
//       }
//     } catch (err) {
//       console.error(err);
//       setServerMsg('Something went wrong.');
//     }
//   };

//   return (
//     <form className="auth-form" onSubmit={step === 1 ? handleRegister : handleOTPVerify}>
//       <h2>{step === 1 ? 'Register' : 'Verify OTP'}</h2>

//       {step === 1 ? (
//         <>
//           <input name="fullName" type="text" placeholder="Full Name" className="modal-input" required onChange={handleChange} />
//           <input name="email" type="email" placeholder="Email" className="modal-input" required onChange={handleChange} />
//           <input name="phone" type="text" placeholder="Phone Number" className="modal-input" required onChange={handleChange} />
//           <input name="password" type="password" placeholder="Password" className="modal-input" required onChange={handleChange} />
//           <input name="house" type="text" placeholder="House / Street" className="modal-input" onChange={handleChange} />
//           <input name="area" type="text" placeholder="Area / Landmark" className="modal-input" onChange={handleChange} />
//           <input name="pincode" type="text" placeholder="Pincode" className="modal-input" onChange={handleChange} />
//         </>
//       ) : (
//         <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="modal-input" required />
//       )}

//       <div className="modal-buttons">
//         <button type="submit" className="primary-button">{step === 1 ? 'Register' : 'Verify OTP'}</button>
//         <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
//       </div>
//       {serverMsg && <p style={{ color: '#e74c3c', marginTop: '10px', textAlign: 'center' }}>{serverMsg}</p>}
//     </form>
//   );
// }
