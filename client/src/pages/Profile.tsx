import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Mail,
  Eye,
  EyeOff,
  Award,
  Activity,
  Package,
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';

  // Fetch admin statistics
  const { data: salesData } = useQuery('sales', () =>
    api.get('/sales').then(res => res.data.data),
    { enabled: isAdmin }
  );

  const { data: repairsData } = useQuery('repairs', () =>
    api.get('/repairs').then(res => res.data.data),
    { enabled: isAdmin }
  );

  // Fetch recent activities
  const { data: activitiesData } = useQuery('activities', () =>
    api.get('/activities?limit=10').then(res => res.data.data),
    { 
      enabled: !!user,
      refetchInterval: 30000 // Refetch every 30 seconds
    }
  );

  // Update profile mutation
  const updateProfileMutation = useMutation(
    (data: any) => api.put('/users/profile', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    const updateData: any = {
      name: formData.name,
      email: formData.email
    };

    if (formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }

    updateProfileMutation.mutate(updateData);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditing(false);
  };

  // Mock user data for demonstration
  const userData = {
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20',
    role: user?.role || 'sales_tech'
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                My Profile 👤
              </h1>
              <p className="text-teal-100 text-lg sm:text-xl mb-4">Manage your account settings and preferences</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 sm:px-4 py-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">{user?.name}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 sm:px-4 py-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base capitalize">{user?.role}</span>
                </div>
              </div>
            </div>
            <div className="text-left lg:text-right">
              <div className="text-teal-100 text-base sm:text-lg font-medium">Account Status</div>
              <div className="text-teal-200 text-xs sm:text-sm mt-1">
                Active since {new Date(userData.joinDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full"></div>
      </div>

      {/* Admin-only Statistics */}
      {isAdmin && salesData && repairsData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{salesData.length}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Total Sales</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{repairsData.filter((repair: any) => repair.status === 'completed').length}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Repairs Done</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '90%'}}></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">${salesData.reduce((sum: number, sale: any) => sum + sale.total, 0).toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Total Revenue</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-xs sm:text-sm text-gray-500">Performance</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Information */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Personal Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              >
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isLoading}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Save className="w-4 h-4" />
                  <span>{updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{user?.name}</h3>
                  <p className="text-sm sm:text-base text-gray-500">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <span className="text-sm sm:text-base text-gray-700">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <span className="text-sm sm:text-base text-gray-700 capitalize">{user?.role}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <span className="text-sm sm:text-base text-gray-700">Joined {new Date(userData.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Recent Activity</h2>
        <div className="space-y-3 sm:space-y-4">
          {activitiesData && activitiesData.length > 0 ? (
            activitiesData.map((activity: any, index: number) => (
              <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  activity.type === 'repair' ? 'bg-green-500' :
                  activity.type === 'sale' ? 'bg-blue-500' :
                  activity.type === 'profile' ? 'bg-yellow-500' :
                  activity.type === 'login' ? 'bg-green-500' :
                  activity.type === 'logout' ? 'bg-gray-500' :
                  activity.type === 'create' ? 'bg-purple-500' :
                  activity.type === 'update' ? 'bg-orange-500' :
                  activity.type === 'delete' ? 'bg-red-500' :
                  'bg-gray-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {new Date(activity.createdAt).toLocaleDateString()} at {new Date(activity.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  {activity.type === 'repair' ? '🔧' : 
                   activity.type === 'sale' ? '💰' : 
                   activity.type === 'profile' ? '👤' : 
                   activity.type === 'login' ? '🔐' :
                   activity.type === 'logout' ? '🚪' :
                   activity.type === 'create' ? '➕' :
                   activity.type === 'update' ? '✏️' :
                   activity.type === 'delete' ? '🗑️' :
                   '📝'}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">No recent activities found</p>
              <p className="text-gray-400 text-xs sm:text-sm">Your activities will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;