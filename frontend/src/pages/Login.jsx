import React, { useState } from "react";
import { useAppContext } from "../contexts/Appcontext";
import toast from "react-hot-toast";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {axios,settoken}=useAppContext();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const url = isSignup
      ? "/api/user/register"
      : "/api/user/login";

    const payload = isSignup
      ? { name, email, password }
      : { email, password };

    const { data } = await axios.post(url, payload);

    if (data.success) {
      toast.success(isSignup ? "Account created" : "Login successful");

      // Save token
      settoken(data.token);
      localStorage.setItem("token", data.token);

      // Reset form
      setName("");
      setEmail("");
      setPassword("");


    } else {
      toast.error("Authentication failed");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  } finally {
    setLoading(false);
  }
};


  return (
     <div className="h-screen w-full flex overflow-hidden bg-purple-50 dark:bg-[#0f0b14]">
      
      {/* Left Image */}
     <div className="hidden md:flex w-1/2 h-full">

        <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="login"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white dark:bg-[#1a1325] rounded-2xl p-8 shadow-xl border border-purple-200 dark:border-purple-700"
        >
          {/* Header */}
          <h2 className="text-3xl font-bold text-center text-purple-700 dark:text-purple-400">
            {isSignup ? "Create Account" : "Sign In"}
          </h2>
          <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
            {isSignup
              ? "Create an account to get started"
              : "Welcome back! Please sign in to continue"}
          </p>

          {/* Name (Signup only) */}
          {isSignup && (
            <div className="mt-8">
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-11 px-4 rounded-xl bg-transparent border border-purple-300 dark:border-purple-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700"
                required
              />
            </div>
          )}

          {/* Email */}
          <div className={isSignup ? "mt-5" : "mt-8"}>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 px-4 rounded-xl bg-transparent border border-purple-300 dark:border-purple-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700"
              required
            />
          </div>

          {/* Password */}
          <div className="mt-5">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-4 rounded-xl bg-transparent border border-purple-300 dark:border-purple-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700"
              required
            />
          </div>

          {/* Remember / Forgot (Login only) */}
          {!isSignup && (
            <div className="flex items-center justify-between mt-6 text-sm text-gray-600 dark:text-gray-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-purple-700" />
                Remember me
              </label>
              <button type="button" className="hover:underline text-purple-700 dark:text-purple-400">
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full h-11 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-medium transition disabled:opacity-60"
          >
            {loading
              ? isSignup
                ? "Creating account..."
                : "Signing in..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>

          {/* Footer toggle */}
          <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
            {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
            <span
              onClick={() => setIsSignup(!isSignup)}
              className="text-purple-700 dark:text-purple-400 cursor-pointer hover:underline"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
