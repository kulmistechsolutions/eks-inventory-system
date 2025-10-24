import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Package, 
  TrendingUp, 
  BarChart3,
  PieChart,
  Activity,
  ArrowRight
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">EKS</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Enter your email and password to access your account</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="admin@eks.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Log In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </form>


          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p><strong>Admin:</strong> admin@eks.com / admin123</p>
              <p><strong>Sales & Tech (10%):</strong> ali@eks.com / ali123</p>
              <p><strong>Sales & Tech ($5):</strong> mohamed@eks.com / mohamed123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Dashboard Preview */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Effortlessly manage your inventory and repairs</h2>
            <p className="text-xl text-blue-100">Log in to access your EKS dashboard and manage your business operations</p>
          </div>

          {/* Dashboard Preview Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md border border-white/20">
            <div className="space-y-4">
              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-100">Total Sales</p>
                      <p className="text-lg font-bold">$189,374</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-green-300" />
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-green-300">+12.5%</span>
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-100">Repairs</p>
                      <p className="text-lg font-bold">47</p>
                    </div>
                    <Activity className="w-6 h-6 text-blue-300" />
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-blue-300">Active</span>
                  </div>
                </div>
              </div>

              {/* Chart Preview */}
              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">Sales Overview</h4>
                  <BarChart3 className="w-4 h-4 text-blue-300" />
                </div>
                <div className="flex items-end space-x-1 h-16">
                  {[40, 60, 45, 80, 55, 70, 65].map((height, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm flex-1"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">Categories</h4>
                  <PieChart className="w-4 h-4 text-blue-300" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-100">Smartphones</span>
                    <span className="text-white font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-100">Laptops & PC</span>
                    <span className="text-white font-medium">30%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-100">Accessories</span>
                    <span className="text-white font-medium">25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-sm text-gray-500">
        <p>Copyright © 2025 EKS Electronic. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;

