import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input.jsx'
import { validateEmail } from '../../utils/helper.js'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATHS } from '../../utils/apiPaths.js'
import { UserContext } from '../../context/userContext.jsx'

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter a valid password.");
      return;
    }

    setError(null);

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.LOGIN,
        { email, password }
      );

      // ✅ correct extraction
      const { token } = response.data;

      if (token) {
        // updateUser already saves token + user
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">
        Welcome Back
      </h3>

      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Please enter your details to log in
      </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          type="text"
          placeholder="john@example.com"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          type="password"
          placeholder="Min 8 Characters"
        />

        {error && (
          <p className="text-red-500 text-xs pb-2.5">
            {error}
          </p>
        )}

        <button className="btn-primary" type="submit">
          LOGIN
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Don't have an account?{" "}
          <button
            type="button"
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => setCurrentPage("signup")}
          >
            SignUp
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
