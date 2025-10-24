import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../utils/api';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  DollarSign, 
  MessageSquare, 
  AlertCircle,
  Clock,
  CheckCircle,
  CreditCard,
  Phone,
  Grid,
  List
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Debt } from '../types';

const Debts = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [shareChannel, setShareChannel] = useState<'SMS' | 'WHATSAPP'>('WHATSAPP');
  const [shareMessage, setShareMessage] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterBy, setFilterBy] = useState('all');
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    whatsapp: '',
    amountOwed: '',
    dueAt: '',
    notes: '',
    contextType: 'OTHER' as 'SALE' | 'REPAIR' | 'OTHER',
    contextId: ''
  });

  const queryClient = useQueryClient();

  // Build query params
  const queryParams = new URLSearchParams();
  if (activeTab !== 'all') queryParams.append('status', activeTab);
  if (searchTerm) queryParams.append('search', searchTerm);

  // Fetch debts
  const { data: debts, isLoading } = useQuery(['debts', activeTab, searchTerm], () =>
    api.get(`/debts?${queryParams.toString()}`).then(res => res.data.data)
  );

  // Create/Update debt mutation
  const debtMutation = useMutation(
    (data: any) => {
      if (selectedDebt) {
        return api.put(`/debts/${selectedDebt._id}`, data);
      }
      return api.post('/debts', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('debts');
        toast.success(selectedDebt ? 'Debt updated successfully!' : 'Debt created successfully!');
        setIsModalOpen(false);
        resetForm();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to save debt');
      }
    }
  );

  // Payment mutation
  const paymentMutation = useMutation(
    (data: any) => api.post(`/debts/${selectedDebt?._id}/payment`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('debts');
        toast.success('Payment recorded successfully!');
        setIsPaymentModalOpen(false);
        setSelectedDebt(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to record payment');
      }
    }
  );

  // Share mutation
  const shareMutation = useMutation(
    (data: any) => api.post(`/debts/${selectedDebt?._id}/share`, data),
    {
      onSuccess: () => {
        toast.success('Debt reminder sent successfully!');
        setIsShareModalOpen(false);
        setSelectedDebt(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to send reminder');
      }
    }
  );

  // Delete mutation
  const deleteMutation = useMutation(
    (id: string) => api.delete(`/debts/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('debts');
        toast.success('Debt deleted successfully!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to delete debt');
      }
    }
  );

  const resetForm = () => {
    setFormData({
      customerName: '',
      phone: '',
      whatsapp: '',
      amountOwed: '',
      dueAt: '',
      notes: '',
      contextType: 'OTHER',
      contextId: ''
    });
    setSelectedDebt(null);
  };

  const handleEdit = (debt: Debt) => {
    setSelectedDebt(debt);
    setFormData({
      customerName: debt.customerName,
      phone: debt.phone,
      whatsapp: debt.whatsapp || '',
      amountOwed: debt.amountOwed.toString(),
      dueAt: debt.dueAt ? new Date(debt.dueAt).toISOString().split('T')[0] : '',
      notes: debt.notes || '',
      contextType: debt.contextType,
      contextId: debt.contextId || ''
    });
    setIsModalOpen(true);
  };

  const handlePayment = (debt: Debt) => {
    setSelectedDebt(debt);
    setIsPaymentModalOpen(true);
  };

  const handleShare = (debt: Debt) => {
    setSelectedDebt(debt);
    setShareMessage(`Hi ${debt.customerName}, this is a friendly reminder that you owe $${debt.amountOwed}. Please settle this amount at your earliest convenience. Thank you!`);
    setIsShareModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debtMutation.mutate(formData);
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get('amount') as string);
    const notes = formData.get('notes') as string;
    
    paymentMutation.mutate({ amount, notes });
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    shareMutation.mutate({
      channel: shareChannel,
      message: shareMessage
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this debt?')) {
      deleteMutation.mutate(id);
    }
  };

  // Helper function to compute debt status
  const getDebtStatus = (debt: Debt) => {
    if (debt.status === 'SETTLED') return 'PAID';
    if (debt.status === 'UNPAID' || debt.status === 'PARTIAL') {
      const dueDate = new Date(debt.dueAt);
      const now = new Date();
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue < 0) return 'OVERDUE';
      if (daysUntilDue <= 3) return 'DUE_SOON';
      return 'UNPAID';
    }
    return debt.status;
  };

  // Filter and sort debts
  const filteredDebts = debts?.filter((debt: Debt) => {
    const computedStatus = getDebtStatus(debt);
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'overdue' && computedStatus === 'OVERDUE') ||
                         (filterBy === 'dueSoon' && computedStatus === 'DUE_SOON') ||
                         (filterBy === 'paid' && computedStatus === 'PAID');
    return matchesFilter;
  })?.sort((a: Debt, b: Debt) => {
    switch (sortBy) {
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'customerName':
        return a.customerName.localeCompare(b.customerName);
      case 'amountOwed':
        return b.amountOwed - a.amountOwed;
      case 'dueAt':
        return new Date(a.dueAt || '').getTime() - new Date(b.dueAt || '').getTime();
      default:
        return 0;
    }
  }) || [];

  const totalDebts = debts?.length || 0;
  const totalAmount = debts?.reduce((sum: number, debt: Debt) => sum + debt.amountOwed, 0) || 0;
  const overdueDebts = debts?.filter((debt: Debt) => getDebtStatus(debt) === 'OVERDUE').length || 0;
  const dueSoonDebts = debts?.filter((debt: Debt) => getDebtStatus(debt) === 'DUE_SOON').length || 0;
  const paidDebts = debts?.filter((debt: Debt) => getDebtStatus(debt) === 'PAID').length || 0;
  const overdueAmount = debts?.filter((debt: Debt) => getDebtStatus(debt) === 'OVERDUE')
    .reduce((sum: number, debt: Debt) => sum + debt.amountOwed, 0) || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading debts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                  Debt Management 💳
                </h1>
                <p className="text-red-100 text-lg sm:text-xl mb-4">Track and manage customer debts with precision</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 sm:px-4 py-2">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">{totalDebts} Total Debts</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 sm:px-4 py-2">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">${totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-left lg:text-right">
                <div className="text-red-100 text-base sm:text-lg font-medium">Debt Status</div>
                <div className="text-red-200 text-xs sm:text-sm mt-1">
                  {overdueDebts} overdue, {dueSoonDebts} due soon
                </div>
                <div className="mt-4 bg-white/20 rounded-2xl p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold">${overdueAmount.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-red-100">Overdue Amount</div>
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
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{overdueDebts}</div>
                  <div className="text-sm text-gray-500">Overdue</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{dueSoonDebts}</div>
                  <div className="text-sm text-gray-500">Due Soon</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{paidDebts}</div>
                  <div className="text-sm text-gray-500">Paid</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">${totalAmount.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total Amount</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full" style={{width: '90%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search debts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
      </div>

              {/* Filter */}
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Debts</option>
                <option value="overdue">Overdue</option>
                <option value="dueSoon">Due Soon</option>
                <option value="paid">Paid</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="customerName">Sort by Customer</option>
                <option value="amountOwed">Sort by Amount</option>
                <option value="dueAt">Sort by Due Date</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-2xl p-1">
          <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === 'grid' ? 'bg-white shadow-md' : 'text-gray-500'
                  }`}
                >
                  <Grid className="w-5 h-5" />
          </button>
          <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === 'list' ? 'bg-white shadow-md' : 'text-gray-500'
                  }`}
                >
                  <List className="w-5 h-5" />
          </button>
              </div>

              {/* Add Debt Button */}
          <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Debt</span>
          </button>
        </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: 'all', label: 'All Debts', count: totalDebts, color: 'gray' },
              { key: 'OVERDUE', label: 'Overdue', count: overdueDebts, color: 'red' },
              { key: 'DUE_SOON', label: 'Due Soon', count: dueSoonDebts, color: 'yellow' },
              { key: 'PAID', label: 'Paid', count: paidDebts, color: 'green' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 flex items-center space-x-2 ${
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

          {/* Debts Grid/List */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredDebts.map((debt: Debt) => (
              <div
                key={debt._id}
                className="group relative overflow-hidden bg-gray-50 rounded-3xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {debt.customerName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{debt.phone}</span>
                      </span>
                      {debt.whatsapp && (
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{debt.whatsapp}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    getDebtStatus(debt) === 'PAID' ? 'bg-green-100 text-green-800' :
                    getDebtStatus(debt) === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                    getDebtStatus(debt) === 'DUE_SOON' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                      {getDebtStatus(debt)}
                  </div>
                    </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount Owed</span>
                    <span className="font-bold text-red-600">${debt.amountOwed}</span>
                    </div>
                  {debt.dueAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Due Date</span>
                      <span className="font-medium">{new Date(debt.dueAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Context</span>
                    <span className="font-medium">{debt.contextType}</span>
                  </div>
                  {debt.notes && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {debt.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {new Date(debt.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                      <button
                      onClick={() => handleEdit(debt)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                      >
                      <Edit className="w-4 h-4" />
                      </button>
                      <button
                      onClick={() => handlePayment(debt)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
                      >
                      <DollarSign className="w-4 h-4" />
                      </button>
                      <button
                      onClick={() => handleShare(debt)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                    >
                      <MessageSquare className="w-4 h-4" />
                  </button>
                    <button
                      onClick={() => handleDelete(debt._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredDebts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No debts found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Debt</span>
              </button>
            </div>
          )}
        </div>

      {/* Debt Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                {selectedDebt ? 'Edit Debt' : 'Add New Debt'}
              </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Owed *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amountOwed}
                      onChange={(e) => setFormData({ ...formData, amountOwed: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueAt}
                      onChange={(e) => setFormData({ ...formData, dueAt: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Context Type
                    </label>
                    <select
                      value={formData.contextType}
                      onChange={(e) => setFormData({ ...formData, contextType: e.target.value as 'SALE' | 'REPAIR' | 'OTHER' })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="SALE">Sale</option>
                      <option value="REPAIR">Repair</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    disabled={debtMutation.isLoading}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {debtMutation.isLoading ? 'Saving...' : (selectedDebt ? 'Update Debt' : 'Create Debt')}
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
                  name="amount"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Notes
                </label>
                <textarea
                    name="notes"
                    rows={3}
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
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {paymentMutation.isLoading ? 'Recording...' : 'Record Payment'}
                  </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Send Reminder</h2>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleShareSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel
                  </label>
                  <select
                    value={shareChannel}
                    onChange={(e) => setShareChannel(e.target.value as 'SMS' | 'WHATSAPP')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

                <div className="flex space-x-4">
                <button
                    type="button"
                  onClick={() => setIsShareModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                  <button
                    type="submit"
                    disabled={shareMutation.isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {shareMutation.isLoading ? 'Sending...' : 'Send Reminder'}
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

export default Debts;