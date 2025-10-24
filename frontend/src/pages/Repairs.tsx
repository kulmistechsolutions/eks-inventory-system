import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Plus, 
  Search, 
  Edit, 
  DollarSign, 
  CheckCircle,
  Wrench,
  Clock,
  Grid,
  List,
  Phone,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

const Repairs = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('waiting');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterBy, setFilterBy] = useState('all');

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    mobileBrand: '',
    mobileModel: '',
    issueDescription: '',
    repairCost: '',
    status: 'waiting'
  });

  const queryClient = useQueryClient();

  // Fetch repairs
  const { data: repairs, isLoading } = useQuery('repairs', () =>
    api.get('/repairs').then(res => res.data.data)
  );


  // Create/Update repair mutation
  const repairMutation = useMutation(
    (data: any) => {
      if (selectedRepair) {
        return api.put(`/repairs/${selectedRepair._id}`, data);
      }
      return api.post('/repairs', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('repairs');
        toast.success(selectedRepair ? 'Repair updated successfully!' : 'Repair created successfully!');
        setIsModalOpen(false);
        resetForm();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to save repair');
      }
    }
  );

  // Complete repair mutation
  const completeRepairMutation = useMutation(
    (data: any) => api.put(`/repairs/${selectedRepair._id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('repairs');
        toast.success('Repair completed successfully!');
        setIsModalOpen(false);
        resetForm();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to complete repair');
      }
    }
  );

  // Payment mutation
  const paymentMutation = useMutation(
    (data: any) => api.post(`/repairs/${selectedRepair._id}/payment`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('repairs');
        toast.success('Payment recorded successfully!');
        setIsPaymentModalOpen(false);
        setPaymentAmount('');
        setProofImage(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to record payment');
      }
    }
  );

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      mobileBrand: '',
      mobileModel: '',
      issueDescription: '',
      repairCost: '',
      status: 'waiting'
    });
    setSelectedRepair(null);
  };

  const handleEdit = (repair: any) => {
    setSelectedRepair(repair);
    setFormData({
      customerName: repair.customerName,
      customerPhone: repair.customerPhone,
      mobileBrand: repair.mobileBrand,
      mobileModel: repair.mobileModel,
      issueDescription: repair.issueDescription,
      repairCost: repair.repairCost.toString(),
      status: repair.status
    });
    setIsModalOpen(true);
  };

  const handleComplete = (repair: any) => {
    setSelectedRepair(repair);
    setIsModalOpen(true);
  };

  const handlePayment = (repair: any) => {
    setSelectedRepair(repair);
    setPaymentAmount(repair.remainingBalance.toString());
    setIsPaymentModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    repairMutation.mutate(formData);
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeRepairMutation.mutate({
      ...formData,
      status: 'completed',
      completedBy: user?._id,
      completedAt: new Date().toISOString()
    });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = undefined;
    
    if (proofImage) {
      try {
        const formData = new FormData();
        formData.append('image', proofImage);
        const response = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = response.data.url;
      } catch (error) {
        console.log('Image upload failed, proceeding without image');
      }
    }

    paymentMutation.mutate({
      amount: parseFloat(paymentAmount),
      imageUrl
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofImage(file);
    }
  };

  // Filter repairs by status
  const filteredRepairs = repairs?.filter((repair: any) => {
    const matchesSearch = repair.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repair.mobileModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repair.repairNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeTab === 'all' || repair.status === activeTab;
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'myRepairs' && repair.assignedTo === user?._id) ||
                         (filterBy === 'completed' && repair.status === 'completed') ||
                         (filterBy === 'pending' && repair.status !== 'completed');
    return matchesSearch && matchesStatus && matchesFilter;
  })?.sort((a: any, b: any) => {
    switch (sortBy) {
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'customerName':
        return a.customerName.localeCompare(b.customerName);
      case 'repairCost':
        return b.repairCost - a.repairCost;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  }) || [];

  const waitingRepairs = repairs?.filter((repair: any) => repair.status === 'waiting').length || 0;
  const processingRepairs = repairs?.filter((repair: any) => repair.status === 'processing').length || 0;
  const completedRepairs = repairs?.filter((repair: any) => repair.status === 'completed').length || 0;
  const totalRepairs = repairs?.length || 0;
  const totalRevenue = repairs?.filter((repair: any) => repair.status === 'completed').reduce((sum: number, repair: any) => sum + (repair.repairCost || 0), 0) || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading repairs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                  Repair Management 🔧
                </h1>
                <p className="text-orange-100 text-lg sm:text-xl mb-4">Track and manage all repair jobs with precision</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 sm:px-4 py-2">
                    <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">{totalRepairs} Total Repairs</span>
                  </div>
                </div>
              </div>
              <div className="text-left lg:text-right">
                <div className="text-orange-100 text-base sm:text-lg font-medium">Repair Status</div>
                <div className="text-orange-200 text-xs sm:text-sm mt-1">
                  {waitingRepairs} waiting, {processingRepairs} processing
                </div>
                <div className="mt-4 bg-white/20 rounded-2xl p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold">{completedRepairs}</div>
                  <div className="text-xs sm:text-sm text-orange-100">Completed</div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{waitingRepairs}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Waiting</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{processingRepairs}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Processing</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
      </div>

          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{completedRepairs}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Completed</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '90%'}}></div>
              </div>
            </div>
      </div>

          {/* Total Revenue Card - Admin Only */}
          {user?.role === 'admin' && (
            <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <div className="relative p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
                    <div className="text-xs sm:text-sm text-gray-500">Total Revenue</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '95%'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Card - Sales Tech Only */}
          {user?.role === 'sales_tech' && (
            <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <div className="relative p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Wrench className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">{(user as any)?.commissionValue || 0}%</div>
                    <div className="text-xs sm:text-sm text-gray-500">Performance</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{width: `${Math.min(((user as any)?.commissionValue || 0) * 5, 100)}%`}}></div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Controls */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1 w-full">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search repairs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                />
              </div>

              {/* Filter */}
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              >
                <option value="all">All Repairs</option>
                <option value="myRepairs">My Repairs</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="customerName">Sort by Customer</option>
                <option value="repairCost">Sort by Cost</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === 'grid' ? 'bg-white shadow-md' : 'text-gray-500'
                  }`}
                >
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === 'list' ? 'bg-white shadow-md' : 'text-gray-500'
                  }`}
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Add Repair Button */}
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add Repair</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6">
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            {[
              { key: 'all', label: 'All Repairs', count: totalRepairs, color: 'gray' },
              { key: 'waiting', label: 'Waiting', count: waitingRepairs, color: 'yellow' },
              { key: 'processing', label: 'Processing', count: processingRepairs, color: 'blue' },
              { key: 'completed', label: 'Completed', count: completedRepairs, color: 'green' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base ${
                  activeTab === tab.key
                    ? `bg-${tab.color}-500 text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
      </div>

          {/* Repairs Grid/List */}
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredRepairs.map((repair: any) => (
              <div
                key={repair._id}
                className="group relative overflow-hidden bg-gray-50 rounded-3xl p-4 sm:p-6 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {repair.customerName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">{repair.repairNumber}</p>
                    <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{repair.customerPhone}</span>
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    repair.status === 'completed' ? 'bg-green-100 text-green-800' :
                    repair.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {repair.status}
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Device</span>
                    <span className="font-medium text-sm sm:text-base">{repair.mobileBrand} {repair.mobileModel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Cost</span>
                    <span className="font-bold text-green-600 text-sm sm:text-base">${repair.repairCost}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Paid</span>
                    <span className="font-medium text-sm sm:text-base">${repair.amountPaid}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Remaining</span>
                    <span className={`font-medium text-sm sm:text-base ${
                      repair.remainingBalance > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${repair.remainingBalance}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {new Date(repair.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleEdit(repair)}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    {repair.status !== 'completed' && (
                      <button
                        onClick={() => handleComplete(repair)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                    {repair.remainingBalance > 0 && (
                      <button
                        onClick={() => handlePayment(repair)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                      >
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
              </div>

          {/* Empty State */}
          {filteredRepairs.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No repairs found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Repair</span>
              </button>
            </div>
          )}
        </div>

      {/* Repair Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedRepair ? 'Edit Repair' : 'Add New Repair'}
              </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={selectedRepair?.status === 'completed' ? handleCompleteSubmit : handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Phone *
                  </label>
                  <input
                      type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Brand *
                  </label>
                  <input
                    type="text"
                    value={formData.mobileBrand}
                    onChange={(e) => setFormData({ ...formData, mobileBrand: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Model *
                  </label>
                  <input
                    type="text"
                    value={formData.mobileModel}
                    onChange={(e) => setFormData({ ...formData, mobileModel: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repair Cost *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.repairCost}
                    onChange={(e) => setFormData({ ...formData, repairCost: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="waiting">Waiting</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Description *
                  </label>
                  <textarea
                    value={formData.issueDescription}
                    onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={repairMutation.isLoading || completeRepairMutation.isLoading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {repairMutation.isLoading || completeRepairMutation.isLoading 
                      ? 'Saving...' 
                      : (selectedRepair ? 'Update Repair' : 'Create Repair')
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Record Payment</h2>
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
          </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proof Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="flex space-x-4">
                <button
                  type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                  <button
                    type="submit"
                    disabled={paymentMutation.isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {paymentMutation.isLoading ? 'Recording...' : 'Record Payment'}
                  </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repairs;