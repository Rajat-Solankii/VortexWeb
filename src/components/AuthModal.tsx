"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, Mail, Lock, User, KeyRound, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const authQuery = searchParams.get("auth") as any;
  const initialMode = ["login", "signup", "verify", "forgot", "reset_verify", "new_password"].includes(authQuery) ? authQuery : "login";

  const [mode, setMode] = useState<"login" | "signup" | "verify" | "forgot" | "reset_verify" | "new_password">(initialMode);

  useEffect(() => {
    if (authQuery && ["login", "signup", "verify", "forgot", "reset_verify", "new_password"].includes(authQuery) && authQuery !== mode) {
      setMode(authQuery);
    }
  }, [authQuery]);

  const changeMode = (newMode: "login" | "signup" | "verify" | "forgot" | "reset_verify" | "new_password") => {
    setMode(newMode);
    const params = new URLSearchParams(searchParams.toString());
    params.set("auth", newMode);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const validatePassword = (passStr: string) => {
    // Minimum 8 characters, at least one letter and one number
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passRegex.test(passStr);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (res?.error) {
      if (res.error === "Please verify your email before logging in.") {
        try {
          // Automatically resend OTP and switch to verify mode
          await fetch("/api/auth/resend-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
          });
          changeMode("verify");
        } catch (e) {
          setError("Account not verified. Failed to resend code.");
        }
      } else {
        setError(res.error);
      }
    } else {
      onClose();
      window.location.reload();
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and include a number and a letter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to register");
        setIsLoading(false);
        return;
      }

      // Success, move to verify mode
      changeMode("verify");
    } catch (err) {
      setError("An unexpected error occurred");
    }
    
    setIsLoading(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Invalid verification code");
        setIsLoading(false);
        return;
      }

      // Automatically log them in after verifying
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        setError(signInRes.error);
      } else {
        onClose();
        window.location.reload();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to send reset email");
        setIsLoading(false);
        return;
      }
      changeMode("reset_verify");
    } catch (err) {
      setError("An unexpected error occurred");
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword(newPassword)) {
      setError("Password must be at least 8 characters long and include a number and a letter.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        setIsLoading(false);
        return;
      }
      
      // Successfully reset, log them in
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password: newPassword,
      });

      if (signInRes?.error) {
        setError(signInRes.error);
        changeMode("login");
      } else {
        onClose();
        window.location.reload();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
    setIsLoading(false);
  };

  const handleBack = () => {
    setError("");
    switch(mode) {
      case "signup":
      case "forgot":
        changeMode("login");
        break;
      case "verify":
        changeMode("signup");
        break;
      case "reset_verify":
        changeMode("forgot");
        break;
      case "new_password":
        changeMode("login");
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0d14] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
      >
        {/* Decorative Background Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-[#7047eb]/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] bg-[#7047eb]/10 rounded-full blur-[100px] pointer-events-none"></div>
        {mode !== "login" && (
          <button 
            onClick={handleBack}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all z-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pb-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
              {mode === "login" && "Welcome Back"}
              {mode === "signup" && "Create Account"}
              {mode === "verify" && "Verify Email"}
              {mode === "forgot" && "Reset Password"}
              {mode === "reset_verify" && "Verify Reset Code"}
              {mode === "new_password" && "Create New Password"}
            </h2>
            <p className="text-gray-400 text-sm">
              {mode === "login" && "Sign in to access your Vortex library."}
              {mode === "signup" && "Join the ultimate streaming hub."}
              {(mode === "verify" || mode === "reset_verify") && `We sent a 6-digit code to ${email}`}
              {mode === "forgot" && "Enter your email to receive a reset code."}
              {mode === "new_password" && "Enter your new password."}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 text-center animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#7047eb] transition-colors"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#7047eb] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => { changeMode("forgot"); setError(""); }} 
                  className="text-xs text-gray-400 hover:text-[#b794f6] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <button 
                disabled={isLoading}
                type="submit" 
                className="w-full bg-[#7047eb] hover:bg-[#5d35d9] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(112,71,235,0.4)] flex justify-center items-center h-[52px]"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </button>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  required
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#7047eb] transition-colors"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#7047eb] transition-colors"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password (min 8 chars, 1 letter, 1 number)" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#7047eb] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Confirm Password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#7047eb] transition-colors"
                />
              </div>
              <button 
                disabled={isLoading}
                type="submit" 
                className="w-full bg-[#7047eb] hover:bg-[#5d35d9] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(112,71,235,0.4)] flex justify-center items-center h-[52px]"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
              </button>
            </form>
          )}

          {mode === "verify" && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  required
                  maxLength={6}
                  placeholder="6-Digit Code" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 text-center text-2xl tracking-[0.5em] font-mono pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#7047eb] transition-colors"
                />
              </div>
              <button 
                disabled={isLoading || otp.length !== 6}
                type="submit" 
                className="w-full bg-[#7047eb] hover:bg-[#5d35d9] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(112,71,235,0.4)] flex justify-center items-center h-[52px]"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Sign In"}
              </button>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#7047eb] transition-colors"
                />
              </div>
              <button 
                disabled={isLoading}
                type="submit" 
                className="w-full bg-[#7047eb] hover:bg-[#5d35d9] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(112,71,235,0.4)] flex justify-center items-center h-[52px]"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Code"}
              </button>
            </form>
          )}

          {mode === "reset_verify" && (
            <form onSubmit={(e) => { e.preventDefault(); changeMode("new_password"); }} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  required
                  maxLength={6}
                  placeholder="6-Digit Code" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 text-center text-2xl tracking-[0.5em] font-mono pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#7047eb] transition-colors"
                />
              </div>
              <button 
                disabled={otp.length !== 6}
                type="submit" 
                className="w-full bg-[#7047eb] hover:bg-[#5d35d9] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(112,71,235,0.4)] flex justify-center items-center h-[52px]"
              >
                Continue
              </button>
            </form>
          )}

          {mode === "new_password" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="New Password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#7047eb] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Confirm New Password" 
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#7047eb] transition-colors"
                />
              </div>
              <button 
                disabled={isLoading}
                type="submit" 
                className="w-full bg-[#7047eb] hover:bg-[#5d35d9] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(112,71,235,0.4)] flex justify-center items-center h-[52px]"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset & Sign In"}
              </button>
            </form>
          )}
        </div>

        {/* Footer / Toggle Mode */}
        {mode !== "verify" && mode !== "reset_verify" && mode !== "new_password" && (
          <div className="bg-white/[0.02] border-t border-white/5 p-6">


            <div className="text-center">
              {mode === "login" || mode === "forgot" ? (
                <p className="text-gray-400 text-sm">
                  Don't have an account?{" "}
                  <button onClick={() => { changeMode("signup"); setError(""); }} className="text-white hover:text-[#b794f6] font-bold transition-colors">
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-gray-400 text-sm">
                  Already have an account?{" "}
                  <button onClick={() => { changeMode("login"); setError(""); }} className="text-white hover:text-[#b794f6] font-bold transition-colors">
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
