'use client';
import { useAuth } from "@/components/context/AuthProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, UserPlus } from "lucide-react";
import Image from "next/image";
import imgbtfly from "../../../public/images/imgbtfly.png";

export default function Signup() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = '';
    
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score < 3) {
      feedback = 'Weak - Add uppercase, numbers, or symbols';
    } else if (score < 4) {
      feedback = 'Good - Consider adding more complexity';
    } else {
      feedback = 'Strong password';
    }
    
    setPasswordStrength({ score, feedback });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setError("Please choose a stronger password");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp({ email, password });
      if (error) throw error;
      
      // Show success message and redirect
      router.push('/login?message=Please check your email to confirm your account');
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
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
        {/* Signup Card */}
        <div className="glass-card p-8 space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Image src={imgbtfly} alt="Imagen Logo" height={40} width={40} className="animate-float" />
              <h1 className="logo text-3xl">able</h1>
            </div>
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400">Join us and start creating amazing images</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-4 flex items-start gap-3 animate-slide-in">
              <AlertCircle className="text-error-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-error-400 text-sm">{error}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-6">
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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  onChange={(e) => checkPasswordStrength(e.target.value)}
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
              
              {/* Password Strength Indicator */}
              {passwordStrength.feedback && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          level <= passwordStrength.score
                            ? passwordStrength.score < 3 ? 'bg-error-500' 
                              : passwordStrength.score < 4 ? 'bg-warning-500'
                              : 'bg-success-500'
                            : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    passwordStrength.score < 3 ? 'text-error-400'
                    : passwordStrength.score < 4 ? 'text-warning-400'
                    : 'text-success-400'
                  }`}>
                    {passwordStrength.feedback}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field w-full pl-10 pr-4"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 text-primary-500 bg-dark-card border-dark-border rounded focus:ring-primary-500 focus:ring-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-primary-400 hover:text-primary-300 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary-400 hover:text-primary-300 transition-colors">
                  Privacy Policy
                </Link>
              </label>
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
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
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

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-primary-500" />
            <span>Free trial included</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-primary-500" />
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
