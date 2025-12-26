import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import { validateEmail } from '../../utils/helper'
import { UserContext } from '../../context/userContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import uploadImage from '../../utils/uploadImage'

const Signup = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validation
    if (!fullName) {
      setError("Please enter full name.");
      return;
    }

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
      let profileImageUrl = "";

      // Upload profile image if selected
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        {
          name: fullName,
          email,
          password,
          profileImageUrl,
        }
      );

      const { token } = response.data;

      if (token) {
        // updateUser already stores token + user
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
        Create an Account
      </h3>

      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Join us today by entering details below
      </p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector
          image={profilePic}
          setImage={setProfilePic}
        />

        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label="Full Name"
          type="text"
          placeholder="John Doe"
        />

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
          SIGNUP
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Already have an account?{" "}
          <button
            type="button"
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => setCurrentPage("login")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;