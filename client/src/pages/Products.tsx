import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Package, Plus, Search, Grid, List, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    cost: '',
    quantity: '',
    minStock: ''
  });

  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then((res: any) => res.data.data)
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (selectedProduct) {
        return api.put(`/products/${selectedProduct._id}`, data).then((res: any) => res.data.data);
      } else {
        return api.post('/products', data).then((res: any) => res.data.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`).then((res: any) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      cost: '',
      quantity: '',
      minStock: ''
    });
    setSelectedProduct(null);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      cost: product.cost.toString(),
      quantity: product.quantity.toString(),
      minStock: product.minStock.toString()
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock)
    });
  };

  const filteredProducts = Array.isArray(products) ? products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) : [];

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
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
  });

  const totalProducts = Array.isArray(products) ? products.length : 0;
  const lowStockProducts = Array.isArray(products) ? products.filter((p: any) => p.quantity <= p.minStock && p.quantity > 0).length : 0;
  const outOfStockProducts = Array.isArray(products) ? products.filter((p: any) => p.quantity === 0).length : 0;
  const totalValue = Array.isArray(products) ? products.reduce((sum: number, product: any) => sum + (product.price * product.quantity), 0) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Error loading products</div>
          <p className="text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                Product Management 📦
              </h1>
              <p className="text-emerald-100 text-base sm:text-lg mb-4">
                Manage your inventory with precision and ease
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 sm:px-4 py-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium">{totalProducts} Products</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 sm:px-4 py-2">
                  <span className="text-sm sm:text-base font-medium">
                    {lowStockProducts} low stock, {outOfStockProducts} out of stock
                  </span>
                </div>
              </div>
            </div>
            <div className="text-left lg:text-right">
              <div className="text-emerald-100 text-base sm:text-lg font-medium">Inventory Overview</div>
              <div className="text-emerald-200 text-xs sm:text-sm mt-1">
                {lowStockProducts} low stock, {outOfStockProducts} out of stock
              </div>
              <div className="mt-4 bg-white/20 rounded-2xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold">{totalProducts}</div>
                <div className="text-xs sm:text-sm text-emerald-100">Total Products</div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalProducts}</div>
                <div className="text-xs sm:text-sm text-gray-500">Total Products</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{lowStockProducts}</div>
                <div className="text-xs sm:text-sm text-gray-500">Low Stock</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{outOfStockProducts}</div>
                <div className="text-xs sm:text-sm text-gray-500">Out of Stock</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{width: '40%'}}></div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">${totalValue.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-gray-500">Total Value</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '95%'}}></div>
            </div>
          </div>
        </div>
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 sm:py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 sm:py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="profit">Sort by Profit</option>
            </select>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-white shadow-md' : 'hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-white shadow-md' : 'hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Add Product Button */}
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={`grid gap-4 sm:gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {sortedProducts.map((product: any) => (
          <div
            key={product._id}
            className="group relative overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative p-4 sm:p-6">
              {/* Product Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 bg-gray-100 rounded-full px-2 sm:px-3 py-1 inline-block">
                    {product.category}
                  </p>
                </div>
                <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Price</span>
                  <span className="font-bold text-green-600 text-sm sm:text-base">${product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Cost</span>
                  <span className="font-bold text-gray-900 text-sm sm:text-base">${product.cost}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Quantity</span>
                  <span className={`font-bold text-sm sm:text-base ${
                    product.quantity === 0 ? 'text-red-600' :
                    product.quantity <= product.minStock ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {product.quantity}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Profit</span>
                  <span className="font-bold text-blue-600 text-sm sm:text-base">${(product.price - product.cost).toFixed(2)}</span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Stock Status</span>
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    product.quantity === 0 
                      ? 'bg-red-100 text-red-800' 
                      : product.quantity <= product.minStock 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {product.quantity === 0 ? 'Out of Stock' :
                     product.quantity <= product.minStock ? 'Low Stock' :
                     'In Stock'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      product.quantity === 0 
                        ? 'bg-red-500' 
                        : product.quantity <= product.minStock 
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{width: `${Math.min((product.quantity / (product.minStock * 3)) * 100, 100)}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Product</span>
          </button>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {selectedProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Books">Books</option>
                      <option value="Home">Home</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Stock *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all duration-200 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isLoading}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                  >
                    {mutation.isLoading ? 'Saving...' : (selectedProduct ? 'Update Product' : 'Create Product')}
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

export default Products;