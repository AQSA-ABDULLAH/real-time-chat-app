"use client";

import { EmailOutlined, LockOutlined, PersonOutline } from "@mui/icons-material";
import {
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, firestore, doc, setDoc } from "../firebase/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

const Form = ({ type }) => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data) => {
    setError(null);
    setMessage(null);

    if (type === "register") {
      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      try {
        // Register user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user);

        // Save user data to Firestore
        await setDoc(doc(firestore, "users", user.uid), {
          username: data.username,
          email: data.email,
          createdAt: new Date().toISOString(),
        });

        // Success message
        setMessage("Registration successful. Please check your email for verification.");

        // Reset form fields
        setValue("email", "");
        setValue("password", "");
        setValue("confirmPassword", "");
        setValue("username", "");
      } catch (err) {
        setError(err.message || "An error occurred during registration.");
      }
    }

    if (type === "login") {
      try {
        const userCredentials = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredentials.user;

        if (user.emailVerified) {
          // Save user email to localStorage
          localStorage.setItem("userEmail", user.email);

          // Navigate to chats
          router.push("/chats");
        } else {
          setError("Please verify your email before logging in.");
        }
      } catch (err) {
        setError(err.message || "Invalid credentials. Please try again.");
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
                    minLength: { value: 3, message: "Username must be at least 3 characters" },
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
                  minLength: { value: 5, message: "Password must be at least 5 characters" },
                  pattern: {
                    value: /[!@#$%^&*(),.?":{}|<>]/,
                    message: "Password must include at least one special character",
                  },
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
