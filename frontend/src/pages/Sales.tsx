import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  ShoppingCart, 
  Trash2, 
  Search, 
  Grid,
  List,
  DollarSign,
  TrendingUp,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

const Sales = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [cart, setCart] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  const queryClient = useQueryClient();

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery('products', () =>
    api.get('/products').then(res => res.data.data)
  );

  // Fetch sales data for admin statistics
  const { data: salesData } = useQuery('sales', () =>
    api.get('/sales').then(res => res.data.data),
    { enabled: isAdmin }
  );


  // Create sale mutation
  const createSaleMutation = useMutation(
    (saleData: any) => api.post('/sales', saleData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sales');
        queryClient.invalidateQueries('products');
        toast.success('Sale completed successfully!');
        setCart([]);
        setCustomerName('');
        setCustomerPhone('');
        setPaymentMethod('cash');
        setIsModalOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create sale');
      }
    }
  );


  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.product === product._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        product: product._id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        cost: product.cost,
        subtotal: product.price,
        profit: product.price - product.cost
      }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.product !== productId));
    } else {
      setCart(cart.map(item =>
        item.product === productId
          ? { ...item, quantity, subtotal: item.price * quantity, profit: (item.price - item.cost) * quantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product !== productId));
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const cartProfit = cart.reduce((sum, item) => sum + item.profit, 0);
    return { subtotal, cartProfit };
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    const { subtotal, cartProfit } = calculateTotals();
    
    createSaleMutation.mutate({
      items: cart.map(item => ({
        ...item,
        productId: item.product
      })),
      customerName: customerName.trim() || 'Walk-in Customer',
      customerPhone: customerPhone.trim(),
      subtotal,
      tax: 0,
      total: subtotal,
      totalProfit: cartProfit,
      paymentMethod
    });
  };


  // Filter and sort products
  const filteredProducts = products?.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || product.category === filterBy;
    return matchesSearch && matchesFilter;
  })?.sort((a: any, b: any) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return b.price - a.price;
      case 'quantity':
        return b.quantity - a.quantity;
      case 'profit':
        return (b.price - b.cost) - (a.price - a.cost);
      default:
        return 0;
    }
  }) || [];

  const categories = [...new Set(products?.map((product: any) => product.category) || [])] as string[];

  const { subtotal, cartProfit } = calculateTotals();

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading sales data...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                  Sales Management 💰
                </h1>
                <p className="text-green-100 text-lg sm:text-xl mb-4">Create sales and track your revenue with style</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 sm:px-4 py-2">
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">Sales Management</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full"></div>
        </div>

        {/* Admin-only Statistics */}
        {isAdmin && salesData && (
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
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">${salesData.reduce((sum: number, sale: any) => sum + sale.total, 0).toLocaleString()}</div>
                    <div className="text-xs sm:text-sm text-gray-500">Total Revenue</div>
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
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">${salesData.reduce((sum: number, sale: any) => sum + (sale.total - sale.items.reduce((itemSum: number, item: any) => itemSum + (item.cost * item.quantity), 0)), 0).toLocaleString()}</div>
                    <div className="text-xs sm:text-sm text-gray-500">Total Profit</div>
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
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">{salesData.filter((sale: any) => {
                      const today = new Date().toISOString().split('T')[0];
                      return sale.createdAt && sale.createdAt.split('T')[0] === today;
                    }).length}</div>
                    <div className="text-xs sm:text-sm text-gray-500">Today's Sales</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 sm:mb-6 space-y-4 lg:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                  {/* Search */}
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
                    />
                  </div>

                  {/* Filter */}
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  {/* View Mode */}
                  <div className="flex bg-gray-100 rounded-2xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        viewMode === 'grid' ? 'bg-white shadow-md' : 'text-gray-500'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        viewMode === 'list' ? 'bg-white shadow-md' : 'text-gray-500'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product: any) => (
                  <div
                    key={product._id}
                    className="group relative overflow-hidden bg-gray-50 rounded-2xl p-3 sm:p-4 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">{product.category}</p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2">
                          <span className="text-base sm:text-lg font-bold text-green-600">${product.price}</span>
                          <span className="text-xs sm:text-sm text-gray-500">Stock: {product.quantity}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Section */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 sticky top-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Shopping Cart</h2>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400">Add products to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-2xl">
                    <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">{item.productName}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">${item.price} each</p>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                          onClick={() => updateQuantity(item.product, item.quantity - 1)}
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors text-xs sm:text-base"
                        >
                          -
                      </button>
                      <span className="w-6 sm:w-8 text-center font-medium text-xs sm:text-sm">{item.quantity}</span>
                      <button
                          onClick={() => updateQuantity(item.product, item.quantity + 1)}
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors text-xs sm:text-base"
                        >
                          +
                      </button>
                      <button
                          onClick={() => removeFromCart(item.product)}
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors ml-1 sm:ml-2"
                        >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-base sm:text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                      <span>Profit:</span>
                      <span>${cartProfit.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 sm:py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Checkout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Checkout</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter customer name (optional)"
                  />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Phone
                </label>
                <input
                    type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter phone number"
                  />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                    <option value="mobile">Mobile Money</option>
                    <option value="evc_plus">EVC Plus</option>
                    <option value="e_dahab">E-Dahab</option>
                    <option value="jeeb">Jeeb</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Profit:</span>
                      <span>${cartProfit.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={createSaleMutation.isLoading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {createSaleMutation.isLoading ? 'Processing...' : 'Complete Sale'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;