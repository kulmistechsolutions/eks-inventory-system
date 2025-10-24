import { useQuery } from 'react-query';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Users,
  Wrench
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isSalesTech = user?.role === 'sales_tech';

  // Fetch dashboard stats with error handling
  const { data: productStats, error: productError } = useQuery('productStats', () =>
    api.get('/products/stats/summary').then(res => res.data.data),
    { retry: 1, refetchOnWindowFocus: false }
  );


  const { data: repairStats, error: repairError } = useQuery('repairStats', () =>
    api.get('/repairs/stats/summary').then(res => res.data.data),
    { retry: 1, refetchOnWindowFocus: false }
  );

  const { data: recentRepairs } = useQuery('recentRepairs', () =>
    api.get('/repairs?status=processing').then(res => res.data.data),
    { retry: 1, refetchOnWindowFocus: false }
  );

  // Admin-only statistics
  const { data: salesData } = useQuery('sales', () =>
    api.get('/sales').then(res => res.data.data),
    { enabled: isAdmin, retry: 1, refetchOnWindowFocus: false }
  );

  const { data: usersData } = useQuery('users', () =>
    api.get('/users').then(res => res.data.data),
    { enabled: isAdmin, retry: 1, refetchOnWindowFocus: false }
  );

  const { data: allRepairsData } = useQuery('allRepairs', () =>
    api.get('/repairs').then(res => res.data.data),
    { enabled: isAdmin, retry: 1, refetchOnWindowFocus: false }
  );




  const pieData = [
    { name: 'Completed', value: repairStats?.completed || 0, color: '#10B981' },
    { name: 'Processing', value: repairStats?.processing || 0, color: '#3B82F6' },
    { name: 'Waiting', value: repairStats?.waiting || 0, color: '#F59E0B' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  // Show loading state if any critical query is loading
  const isLoading = !productStats && !productError;

  // Show error state if there are critical errors
  const hasError = productError || repairError;

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-red-200/50 p-8 max-w-2xl w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10"></div>
          <div className="relative text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Error Loading Dashboard
            </h3>
            <p className="text-red-700 mb-6 text-lg">
            {(productError as any)?.message || (repairError as any)?.message || 'An error occurred while loading dashboard data.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Retry
          </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-transparent mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-20 w-20 border-4 border-blue-300 border-t-transparent mx-auto mb-6 opacity-50"></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loading Dashboard
            </h2>
            <p className="text-gray-600 text-lg">Preparing your personalized dashboard...</p>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Welcome back, <span className="font-semibold text-blue-600">{user?.name}</span>! Here's what's happening today.
            </p>
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Products in Stock */}
          <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
          <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Products in Stock</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {productStats?.totalProducts || 0}
              </p>
                  <p className="text-sm text-blue-600 mt-2 font-medium">
                {productStats?.totalStock || 0} total units
              </p>
            </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-8 h-8 text-white" />
                </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
          <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
          <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Low Stock Alerts</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {productStats?.lowStockItems || 0}
              </p>
                  <p className="text-sm text-red-500 mt-2 font-medium">
                Products need restocking
              </p>
            </div>
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
            </div>
          </div>
        </div>

        {/* Active Repairs */}
          <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
          <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Active Repairs</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                {repairStats?.processing || 0}
              </p>
                  <p className="text-sm text-yellow-600 mt-2 font-medium">
                {repairStats?.waiting || 0} waiting
              </p>
            </div>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin-only Statistics */}
        {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {salesData?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Total Sales</div>
                  </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000" style={{width: '85%'}}></div>
              </div>
            </div>
          </div>

            <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      ${salesData?.reduce((sum: number, sale: any) => sum + sale.total, 0).toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Total Revenue</div>
                  </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000" style={{width: '90%'}}></div>
              </div>
            </div>
          </div>

            <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {usersData?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Total Users</div>
                  </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000" style={{width: '75%'}}></div>
              </div>
            </div>
          </div>

            <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {allRepairsData?.filter((repair: any) => repair.status === 'completed').length || 0}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Completed Repairs</div>
                  </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000" style={{width: '95%'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row - For All Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Stock Chart */}
          <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
                Product Stock Overview
              </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'In Stock', value: productStats?.totalProducts || 0, color: '#10B981' },
              { name: 'Low Stock', value: productStats?.lowStockItems || 0, color: '#F59E0B' },
              { name: 'Out of Stock', value: productStats?.outOfStockItems || 0, color: '#EF4444' }
            ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} className="drop-shadow-lg">
                    {[
                      { name: 'In Stock', value: productStats?.totalProducts || 0, color: '#10B981' },
                      { name: 'Low Stock', value: productStats?.lowStockItems || 0, color: '#F59E0B' },
                      { name: 'Out of Stock', value: productStats?.outOfStockItems || 0, color: '#EF4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
            </BarChart>
          </ResponsiveContainer>
            </div>
        </div>

        {/* Repair Status Chart */}
          <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent mb-6">
                Repair Status
              </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                    stroke="white"
                    strokeWidth={2}
              >
                {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-lg" />
                ))}
              </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
            </PieChart>
          </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Admin-only Charts */}
        {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Performance Chart */}
            <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent mb-6">
                  Sales Performance
                </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                    { name: 'Total Sales', value: salesData?.length || 0, color: '#10B981' },
                    { name: 'Total Revenue', value: salesData?.reduce((sum: number, sale: any) => sum + sale.total, 0) || 0, color: '#3B82F6' },
                    { name: 'Avg Sale', value: salesData?.length > 0 ? salesData.reduce((sum: number, sale: any) => sum + sale.total, 0) / salesData.length : 0, color: '#F59E0B' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip 
                      formatter={(value) => typeof value === 'number' ? (value > 1000 ? `$${value.toLocaleString()}` : value.toString()) : value}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} className="drop-shadow-lg">
                      {[
                        { name: 'Total Sales', value: salesData?.length || 0, color: '#10B981' },
                        { name: 'Total Revenue', value: salesData?.reduce((sum: number, sale: any) => sum + sale.total, 0) || 0, color: '#3B82F6' },
                        { name: 'Avg Sale', value: salesData?.length > 0 ? salesData.reduce((sum: number, sale: any) => sum + sale.total, 0) / salesData.length : 0, color: '#F59E0B' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
              </BarChart>
            </ResponsiveContainer>
              </div>
          </div>

          {/* User Activity Chart */}
            <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent mb-6">
                  User Activity
                </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Admins', value: usersData?.filter((user: any) => user.role === 'admin').length || 0, color: '#8B5CF6' },
                    { name: 'Sales & Tech', value: usersData?.filter((user: any) => user.role === 'sales_tech').length || 0, color: '#10B981' },
                    { name: 'Active Users', value: usersData?.filter((user: any) => user.isActive !== false).length || 0, color: '#3B82F6' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                      stroke="white"
                      strokeWidth={2}
                >
                  {[
                    { name: 'Admins', value: usersData?.filter((user: any) => user.role === 'admin').length || 0, color: '#8B5CF6' },
                    { name: 'Sales & Tech', value: usersData?.filter((user: any) => user.role === 'sales_tech').length || 0, color: '#10B981' },
                    { name: 'Active Users', value: usersData?.filter((user: any) => user.isActive !== false).length || 0, color: '#3B82F6' }
                  ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-lg" />
                  ))}
                </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
              </PieChart>
            </ResponsiveContainer>
              </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Repairs */}
        {(isAdmin || isSalesTech) && (
            <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
                  Active Repairs
                </h3>
                <div className="space-y-4">
              {recentRepairs?.slice(0, 5).map((repair: any) => (
                    <div key={repair._id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/80 transition-all duration-300">
                  <div>
                        <p className="font-semibold text-gray-900">{repair.customerName}</p>
                        <p className="text-sm text-gray-600">{repair.mobileModel}</p>
                    {repair.addedBy && (
                          <p className="text-xs text-gray-500 mt-1">Added by: {repair.addedBy.name}</p>
                    )}
                    {repair.completedBy && (
                          <p className="text-xs text-green-600 mt-1">Completed by: {repair.completedBy.name}</p>
                    )}
                  </div>
                  <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          repair.status === 'completed' ? 'bg-green-100 text-green-800' :
                          repair.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                    }`}>
                      {repair.status.replace('_', ' ')}
                    </span>
                        <p className="text-xs text-gray-600 mt-2 font-medium">${repair.repairCost?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              ))}
                </div>
            </div>
          </div>
        )}
      </div>

      {/* Low Stock Alert */}
      {(isAdmin || isSalesTech) && productStats?.lowStockItems > 0 && (
          <div className="group relative overflow-hidden bg-gradient-to-r from-yellow-50 to-orange-50 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200/50 p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            <div>
                <p className="font-bold text-yellow-900 text-lg">Low Stock Alert</p>
                <p className="text-sm text-yellow-800 mt-1">
                  {productStats.lowStockItems} products are running low on stock and need restocking
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

