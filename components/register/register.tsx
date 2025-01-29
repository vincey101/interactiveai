// 'use client';

// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Eye, EyeOff } from 'lucide-react';
// import mediaService from '@/services/media.service';
// import { AppDispatch } from '@/app/store';
// import { RootState } from '@/app/store';
// import { registerUser } from '@/features/auth/userSlice';

// const RegisterPage = () => {
//     const [fullName, setFullName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const dispatch = useDispatch<AppDispatch>();
//     const { loading, error } = useSelector((state: RootState) => state.user);

//     const handleRegister = () => {
//         if (password === confirmPassword) {
//             dispatch(registerUser({ name: fullName, email, password }));
//         } else {
//             alert("Passwords don't match!");
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto p-8 flex">
//             <div className="absolute overflow-hidden -z-10 top-0 left-0 w-screen h-screen">
//                 <img className="w-full h-full object-cover" src={mediaService.authBackgroundImage} alt="Background" />
//             </div>
//             <form className="bg-white rounded-lg shadow-sm p-8 w-[90vw] sm:w-[50vw] mx-auto">
//                 <h1 className="text-3xl font-bold text-gray-900">
//                     Human<span className="font-[300]">AI</span>
//                 </h1>
//                 <p className="text-xs mb-6">Enter Your Account</p>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
//                         Full Name
//                     </label>
//                     <input
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         id="fullName"
//                         type="text"
//                         placeholder="Full Name"
//                         value={fullName}
//                         onChange={(e) => setFullName(e.target.value)}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//                         Email
//                     </label>
//                     <input
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         id="email"
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//                         Password
//                     </label>
//                     <div className="relative">
//                         <input
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//                             id="password"
//                             type={showPassword ? 'text' : 'password'}
//                             placeholder="Password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                         <button
//                             type="button"
//                             className="absolute inset-y-0 right-0 px-3 py-2 flex items-center"
//                             onClick={() => setShowPassword(!showPassword)}
//                         >
//                             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                         </button>
//                     </div>
//                 </div>
//                 <div className="mb-6">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
//                         Confirm Password
//                     </label>
//                     <div className="relative">
//                         <input
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//                             id="confirm-password"
//                             type={showPassword ? 'text' : 'password'}
//                             placeholder="Confirm Password"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                         />
//                         <button
//                             type="button"
//                             className="absolute inset-y-0 right-0 px-3 py-2 flex items-center"
//                             onClick={() => setShowPassword(!showPassword)}
//                         >
//                             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                         </button>
//                     </div>
//                 </div>

//                 {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//                 <div className="flex items-center justify-between">
//                     <button
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none w-full focus:shadow-outline"
//                         type="button"
//                         onClick={handleRegister}
//                         disabled={loading}
//                     >
//                         {loading ? 'Registering...' : 'Register'}
//                     </button>
//                 </div>
//                 <p className="text-sm text-center mt-4">
//                     Already have an account?{' '}
//                     <a href="/login" className="text-blue-500 hover:underline">
//                         Login
//                     </a>
//                 </p>
//             </form>
//         </div>
//     );
// };

// export default RegisterPage;