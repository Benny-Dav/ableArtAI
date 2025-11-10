'use client';
import { useAuth } from "@/components/context/AuthProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import Image from "next/image";
import imgbtfly from "../../../public/images/imgbtfly.png";

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error } = await signIn({ email, password });
      if (error) throw error;
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="glass-card p-8 space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Image src={imgbtfly} alt="Imagen Logo" height={40} width={40} className="animate-float" />
              <h1 className="logo text-3xl">able</h1>
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-4 flex items-start gap-3 animate-slide-in">
              <AlertCircle className="text-error-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-error-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field w-full pl-10 pr-4"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field w-full pl-10 pr-12"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-card text-gray-400">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link 
                href="/signup" 
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-primary-400 hover:text-primary-300 transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary-400 hover:text-primary-300 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}