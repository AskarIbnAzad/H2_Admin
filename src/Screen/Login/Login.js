import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login_service_auth } from '../../Services/authentication';
import { asyncStatus } from '../../Utils/asyncStatus';


const Login = () => {
  const dispatch = useDispatch();
  const { login_status } = useSelector((state) => state.userAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const obj = {
      email: email,
      password: password,
    };
    dispatch(login_service_auth(obj));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-4 py-2 rounded w-full"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border px-4 py-2 rounded w-full"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className={`py-2 px-4 rounded w-full ${
              login_status === asyncStatus.LOADING
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white'
            }`}
            disabled={login_status === asyncStatus.LOADING}
          >
            {login_status === asyncStatus.LOADING ? (
              <span className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* forgot password */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <p className="text-gray-600 text-sm mb-0">Forgot your password?</p>
          <button
            type="button"
            className="text-blue-600 underline hover:text-blue-800 text-sm font-medium bg-transparent p-0 border-none cursor-pointer"
            style={{ boxShadow: 'none' }}
            onClick={() => {
              window.open('https://h2research.org/signin');
            }}
          >
            Reset Password
          </button>
        </div>


        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm mb-2">Don't have an account?</p>
          <button
            type="button"
            className="py-2 px-4 rounded w-full bg-green-500 text-white hover:bg-green-600 transition-colors"
            onClick={() => {
              // Add your sign up navigation logic here
              window.open('https://h2research.org/signup'); // Replace with your sign-up URL
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
