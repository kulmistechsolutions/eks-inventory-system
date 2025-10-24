import { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../utils/api';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Wrench,
  BarChart3,
  Users,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart,
  Legend
} from 'recharts';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('profit-loss');
  const [period] = useState('month');

  // Fetch profit/loss report
  useQuery(
    ['profitLoss', startDate, endDate],
    () => api.get('/reports/profit-loss', {
      params: { startDate, endDate }
    }).then(res => res.data.data),
    { enabled: !!startDate && !!endDate }
  );

  // Fetch sales report
  useQuery(
    ['salesReport', period],
    () => api.get(`/reports/sales?period=${period}`).then(res => res.data.data),
    { enabled: true }
  );

  // Fetch repair report
  useQuery(
    ['repairReport', period],
    () => api.get(`/reports/repairs?period=${period}`).then(res => res.data.data),
    { enabled: true }
  );

  const handleDownloadReport = async (type: string) => {
    try {
      const response = await api.get(`/reports/${type}/download`, {
        params: { startDate, endDate },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const handleQuickReportDownload = async (reportType: string) => {
    try {
      let endpoint = '';
      let filename = '';
      
      switch (reportType) {
        case 'daily-sales':
          endpoint = '/reports/sales/export';
          filename = 'daily-sales-report';
          break;
        case 'weekly-repairs':
          endpoint = '/reports/repairs/export';
          filename = 'weekly-repairs-report';
          break;
        case 'monthly-profit':
          endpoint = '/reports/profit-loss/download';
          filename = 'monthly-profit-report';
          break;
        case 'inventory-status':
          endpoint = '/reports/inventory/download';
          filename = 'inventory-status-report';
          break;
        case 'customer-analytics':
          endpoint = '/reports/sales/export';
          filename = 'customer-analytics-report';
          break;
        case 'financial-summary':
          endpoint = '/reports/profit-loss/download';
          filename = 'financial-summary-report';
          break;
        default:
          throw new Error('Invalid report type');
      }

      const response = await api.get(endpoint, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download report');
    }
  };

  // Sample chart data
  const salesChartData = [
    { name: 'Jan', sales: 4000, profit: 2400 },
    { name: 'Feb', sales: 3000, profit: 1398 },
    { name: 'Mar', sales: 2000, profit: 9800 },
    { name: 'Apr', sales: 2780, profit: 3908 },
    { name: 'May', sales: 1890, profit: 4800 },
    { name: 'Jun', sales: 2390, profit: 3800 },
  ];

  const repairChartData = [
    { name: 'Completed', value: 45, color: '#10B981' },
    { name: 'Processing', value: 20, color: '#3B82F6' },
    { name: 'Waiting', value: 10, color: '#F59E0B' },
  ];


  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-violet-100 bg-clip-text text-transparent">
                Reports & Analytics 📊
              </h1>
              <p className="text-violet-100 text-lg sm:text-xl mb-4">Comprehensive insights into your business performance</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 sm:px-4 py-2">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">Advanced Analytics</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 sm:px-4 py-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">Real-time Data</span>
                </div>
              </div>
            </div>
            <div className="text-left lg:text-right">
              <div className="text-violet-100 text-base sm:text-lg font-medium">Report Center</div>
              <div className="text-violet-200 text-xs sm:text-sm mt-1">
                Generate insights instantly
              </div>
              <div className="mt-4 bg-white/20 rounded-2xl p-4">
                <div className="text-2xl font-bold">Live</div>
                <div className="text-sm text-violet-100">Data Updates</div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full"></div>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Generate Reports</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            >
              <option value="profit-loss">Profit & Loss</option>
              <option value="sales">Sales Report</option>
              <option value="repairs">Repair Report</option>
              <option value="inventory">Inventory Report</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleDownloadReport(reportType)}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Sales Performance Chart */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Sales Performance</h3>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>+12% from last month</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesChartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorSales)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorProfit)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Repair Status Distribution */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Repair Status</h3>
            <div className="text-xs sm:text-sm text-gray-500">Real-time data</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={repairChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {repairChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">$24,500</div>
                <div className="text-xs sm:text-sm text-gray-500">Total Revenue</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '85%'}}></div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">156</div>
                <div className="text-xs sm:text-sm text-gray-500">Products Sold</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{width: '75%'}}></div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Wrench className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">89</div>
                <div className="text-xs sm:text-sm text-gray-500">Repairs Done</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '90%'}}></div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">+18%</div>
                <div className="text-xs sm:text-sm text-gray-500">Growth Rate</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{width: '65%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Reports</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            { title: 'Daily Sales Report', description: 'Today\'s sales performance', icon: DollarSign, color: 'green', type: 'daily-sales' },
            { title: 'Weekly Repairs', description: 'This week\'s repair summary', icon: Wrench, color: 'blue', type: 'weekly-repairs' },
            { title: 'Monthly Profit', description: 'Monthly profit analysis', icon: TrendingUp, color: 'purple', type: 'monthly-profit' },
            { title: 'Inventory Status', description: 'Current stock levels', icon: Package, color: 'yellow', type: 'inventory-status' },
            { title: 'Customer Analytics', description: 'Customer behavior insights', icon: Users, color: 'indigo', type: 'customer-analytics' },
            { title: 'Financial Summary', description: 'Complete financial overview', icon: FileText, color: 'pink', type: 'financial-summary' }
          ].map((report, index) => (
            <div
              key={index}
              onClick={() => handleQuickReportDownload(report.type)}
              className="group relative overflow-hidden bg-gray-50 rounded-2xl p-4 sm:p-6 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-${report.color}-500 to-${report.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}>
                  <report.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">{report.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;