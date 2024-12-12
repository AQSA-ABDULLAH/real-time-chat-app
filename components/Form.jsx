"use client";

import { EmailOutlined, LockOutlined, PersonOutline } from "@mui/icons-material";
import { sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config"; // Import Firebase auth object from your Firebase configuration
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";

const Form = ({ type }) => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // To set values dynamically if needed
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data, e) => {
    e.preventDefault(); // Make sure to prevent default form submission

    if (type === "register") {
      setError(null); // Reset previous error
      setMessage(null); // Reset previous message

      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user);

        // Store email in localStorage
        localStorage.setItem("registrationData", JSON.stringify({ email: data.email }));

        setMessage("Registration successful. Please check your email for verification.");

        // Reset form fields (optional)
        setValue("email", "");
        setValue("password", "");
        setValue("confirmPassword", "");

      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setError(errorMessage);
      }
    }

    if (type === "login") {
      setError(null); // Reset previous error
      setMessage(null); // Reset previous message

      try {
        const userCredentials = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredentials.user;

        if (user.emailVerified) {
          // Redirect to dashboard or homepage
          router.push("/chats");
        } else {
          setError("Please verify your email before logging in.");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Invalid credentials. Please try again.";
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        <div className="text-center mb-6">
          <img src="/assets/logo.png" alt="logo" className="mx-auto w-16 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Sky Chat</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {type === "register" && (
            <div>
              <div className="flex items-center bg-gray-100 rounded-lg border border-gray-300 px-4 py-2">
                <input
                  {...register("username", {
                    required: "Username is required",
                    validate: (value) =>
                      value.length >= 3 || "Username must be at least 3 characters",
                  })}
                  type="text"
                  placeholder="Username"
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                />
                <PersonOutline className="text-gray-500" />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
          )}

          <div>
            <div className="flex items-center bg-gray-100 rounded-lg border border-gray-300 px-4 py-2">
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Email"
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
              <EmailOutlined className="text-gray-500" />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center bg-gray-100 rounded-lg border border-gray-300 px-4 py-2">
              <input
                {...register("password", {
                  required: "Password is required",
                  validate: (value) =>
                    value.length >= 5 &&
                    /[!@#$%^&*()_+{}[\]:;<>,.?~\\/\-]/.test(value) ||
                    "Password must be at least 5 characters and contain at least one special character",
                })}
                type="password"
                placeholder="Password"
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
              <LockOutlined className="text-gray-500" />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {type === "register" && (
            <div>
              <div className="flex items-center bg-gray-100 rounded-lg border border-gray-300 px-4 py-2">
                <input
                  {...register("confirmPassword", { required: "Please confirm your password" })}
                  type="password"
                  placeholder="Confirm Password"
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                />
                <LockOutlined className="text-gray-500" />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {type === "register" ? "Join Free" : "Let's Chat"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
        {message && (
          <p className="text-green-500 text-sm mt-2 text-center">{message}</p>
        )}

        {type === "register" ? (
          <Link href="/" className="block text-center text-gray-600 mt-4 hover:underline">
            Already have an account? Sign In Here
          </Link>
        ) : (
          <Link href="/register" className="block text-center text-gray-600 mt-4 hover:underline">
            Don't have an account? Register Here
          </Link>
        )}
      </div>
    </div>
  );
};

export default Form;



