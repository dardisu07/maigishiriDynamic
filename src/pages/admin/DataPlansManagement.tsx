import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Edit, Trash2, Search, Filter, Eye, EyeOff, 
  Star, Package, Heart, Save, RefreshCw, CheckCircle, AlertTriangle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../lib/utils';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string;
  in_stock: boolean;
  rating: number;
  reviews: number;
  discount: number;
  is_new: boolean;
  is_featured: boolean;
  created_at: string;
};

type DataPlan = {
  id: string;
  external_id: number;
  network: string;
  plan_type: string;
  size: string;
  validity: string;
  cost_price: number;
  selling_price: number;
  profit_margin: number;
  description: string;
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
  discount_percentage: number;
  show_discount_badge: boolean;
  created_at?: string;
  updated_at?: string;
};

type ProductCategory = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
};

type DataPlanCategory = {
  id: string;
  network: string;
  plan_type: string;
  display_name: string;
  description: string;
  is_active: boolean;
  sort_order: number;
};

const ProductsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'products' | 'data_plans'>('products');
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    category: 'Electronics',
    in_stock: true,
    is_new: false,
    is_featured: false,
  });
  
  // Data Plans state
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([]);
  const [dataPlanCategories, setDataPlanCategories] = useState<DataPlanCategory[]>([]);
  const [loadingDataPlans, setLoadingDataPlans] = useState(true);
  const [dataPlanSearchQuery, setDataPlanSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [selectedPlanType, setSelectedPlanType] = useState('all');
  const [showAddDataPlanModal, setShowAddDataPlanModal] = useState(false);
  const [editingDataPlan, setEditingDataPlan] = useState<DataPlan | null>(null);
  const [importMode, setImportMode] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');
  const [importResults, setImportResults] = useState<{success: number, failed: number, errors: string[]}>({
    success: 0,
    failed: 0,
    errors: []
  });
  const [showImportResults, setShowImportResults] = useState(false);
  
  const [dataPlanFormData, setDataPlanFormData] = useState<Omit<DataPlan, 'id' | 'created_at' | 'updated_at'>>({
    external_id: 0,
    network: 'MTN',
    plan_type: 'SME',
    size: '',
    validity: '',
    cost_price: 0,
    selling_price: 0,
    profit_margin: 0,
    description: '',
    is_active: true,
    is_popular: false,
    sort_order: 0,
    discount_percentage: 0,
    show_discount_badge: false,
  });

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    
    if (activeTab === 'products') {
      fetchProducts();
      fetchProductCategories();
    } else {
      fetchDataPlans();
      fetchDataPlanCategories();
    }
  }, [user, navigate, activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('id, name, description, is_active')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setProductCategories(data || []);
      
      // Set default category if available
      if (data && data.length > 0 && !productFormData.category) {
        setProductFormData(prev => ({ ...prev, category: data[0].name }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const fetchDataPlans = async () => {
    try {
      setLoadingDataPlans(true);
      const { data, error } = await supabase
        .from('data_plans')
        .select('*')
        .order('network', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setDataPlans(data || []);
    } catch (error) {
      console.error('Error fetching data plans:', error);
    } finally {
      setLoadingDataPlans(false);
    }
  };
  
  const fetchDataPlanCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('data_plan_categories')
        .select('*')
        .eq('is_active', true)
        .order('network', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setDataPlanCategories(data || []);
    } catch (error) {
      console.error('Error fetching data plan categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: productFormData.name,
        description: productFormData.description,
        price: Number(productFormData.price),
        original_price: productFormData.original_price ? Number(productFormData.original_price) : null,
        image_url: productFormData.image_url,
        category: productFormData.category,
        in_stock: productFormData.in_stock,
        is_new: productFormData.is_new,
        is_featured: productFormData.is_featured,
        discount: productFormData.original_price && productFormData.price 
          ? Math.round(((Number(productFormData.original_price) - Number(productFormData.price)) / Number(productFormData.original_price)) * 100)
          : 0,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
      }

      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: editingProduct ? 'update_product' : 'create_product',
        details: { product_name: productFormData.name, product_id: editingProduct?.id },
      }]);

      fetchProducts();
      resetForm();
      setShowAddModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };
  
  const handleDataPlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Calculate profit margin if not provided
      let profitMargin = dataPlanFormData.profit_margin;
      if (profitMargin === 0 && dataPlanFormData.cost_price > 0 && dataPlanFormData.selling_price > 0) {
        profitMargin = ((dataPlanFormData.selling_price - dataPlanFormData.cost_price) / dataPlanFormData.cost_price) * 100;
      }
      
      const dataPlanData = {
        ...dataPlanFormData,
        profit_margin: profitMargin,
      };

      if (editingDataPlan) {
        const { error } = await supabase
          .from('data_plans')
          .update(dataPlanData)
          .eq('id', editingDataPlan.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('data_plans')
          .insert([dataPlanData]);
        
        if (error) throw error;
      }

      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: editingDataPlan ? 'update_data_plan' : 'create_data_plan',
        details: { 
          network: dataPlanFormData.network, 
          plan_type: dataPlanFormData.plan_type,
          size: dataPlanFormData.size,
          external_id: dataPlanFormData.external_id,
          data_plan_id: editingDataPlan?.id 
        },
      }]);

      fetchDataPlans();
      resetDataPlanForm();
      setShowAddDataPlanModal(false);
      setEditingDataPlan(null);
    } catch (error) {
      console.error('Error saving data plan:', error);
      alert(`Error saving data plan: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: 'delete_product',
        details: { product_name: productName, product_id: productId },
      }]);

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  
  const handleDeleteDataPlan = async (dataPlanId: string, network: string, size: string) => {
    if (!confirm(`Are you sure you want to delete this data plan (${network} ${size})?`)) return;

    try {
      const { error } = await supabase
        .from('data_plans')
        .delete()
        .eq('id', dataPlanId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: 'delete_data_plan',
        details: { 
          network: network, 
          size: size,
          data_plan_id: dataPlanId 
        },
      }]);

      fetchDataPlans();
    } catch (error) {
      console.error('Error deleting data plan:', error);
      alert(`Error deleting data plan: ${error.message || 'Unknown error'}`);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      image_url: product.image_url,
      category: product.category,
      in_stock: product.in_stock,
      is_new: product.is_new,
      is_featured: product.is_featured,
    });
    setShowAddModal(true);
  };
  
  const handleEditDataPlan = (dataPlan: DataPlan) => {
    setEditingDataPlan(dataPlan);
    setDataPlanFormData({
      external_id: dataPlan.external_id,
      network: dataPlan.network,
      plan_type: dataPlan.plan_type,
      size: dataPlan.size,
      validity: dataPlan.validity,
      cost_price: dataPlan.cost_price,
      selling_price: dataPlan.selling_price,
      profit_margin: dataPlan.profit_margin,
      description: dataPlan.description || '',
      is_active: dataPlan.is_active,
      is_popular: dataPlan.is_popular,
      sort_order: dataPlan.sort_order,
      discount_percentage: dataPlan.discount_percentage,
      show_discount_badge: dataPlan.show_discount_badge,
    });
    setShowAddDataPlanModal(true);
  };
  
  const handleToggleDataPlanActive = async (dataPlan: DataPlan) => {
    try {
      const { error } = await supabase
        .from('data_plans')
        .update({ is_active: !dataPlan.is_active })
        .eq('id', dataPlan.id);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: dataPlan.is_active ? 'deactivate_data_plan' : 'activate_data_plan',
        details: { 
          network: dataPlan.network, 
          size: dataPlan.size,
          data_plan_id: dataPlan.id 
        },
      }]);

      fetchDataPlans();
    } catch (error) {
      console.error('Error toggling data plan status:', error);
      alert(`Error updating data plan status: ${error.message || 'Unknown error'}`);
    }
  };
  
  const handleToggleDataPlanPopular = async (dataPlan: DataPlan) => {
    try {
      const { error } = await supabase
        .from('data_plans')
        .update({ is_popular: !dataPlan.is_popular })
        .eq('id', dataPlan.id);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: dataPlan.is_popular ? 'unmark_popular_data_plan' : 'mark_popular_data_plan',
        details: { 
          network: dataPlan.network, 
          size: dataPlan.size,
          data_plan_id: dataPlan.id 
        },
      }]);

      fetchDataPlans();
    } catch (error) {
      console.error('Error toggling data plan popular status:', error);
      alert(`Error updating data plan popular status: ${error.message || 'Unknown error'}`);
    }
  };

  const resetForm = () => {
    setProductFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      image_url: '',
      category: productCategories.length > 0 ? productCategories[0].name : 'Electronics',
      in_stock: true,
      is_new: false,
      is_featured: false,
    });
  };
  
  const resetDataPlanForm = () => {
    setDataPlanFormData({
      external_id: 0,
      network: 'MTN',
      plan_type: 'SME',
      size: '',
      validity: '',
      cost_price: 0,
      selling_price: 0,
      profit_margin: 0,
      description: '',
      is_active: true,
      is_popular: false,
      sort_order: 0,
      discount_percentage: 0,
      show_discount_badge: false,
    });
  };
  
  const handleBulkImport = async () => {
    if (!bulkImportText.trim()) {
      alert('Please enter data to import');
      return;
    }
    
    try {
      // Parse the input text
      // Expected format: Plan ID, Network, Plan type, Amount, Size, Validity
      const lines = bulkImportText.trim().split('\n');
      const dataPlans: Omit<DataPlan, 'id' | 'created_at' | 'updated_at'>[] = [];
      const errors: string[] = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('Plan ID') || line.startsWith('#')) continue; // Skip header or empty lines
        
        const parts = line.split('\t');
        if (parts.length < 6) {
          errors.push(`Line ${i + 1}: Invalid format, expected at least 6 columns`);
          continue;
        }
        
        const externalId = parseInt(parts[0]);
        const network = parts[1].trim().toUpperCase();
        const planType = parts[2].trim();
        const amountStr = parts[3].replace('₦', '').replace(',', '').trim();
        const amount = parseFloat(amountStr);
        const size = parts[4].trim();
        const validity = parts[5].trim();
        
        if (isNaN(externalId) || isNaN(amount)) {
          errors.push(`Line ${i + 1}: Invalid external ID or amount`);
          continue;
        }
        
        // Create data plan object
        const dataPlan = {
          external_id: externalId,
          network,
          plan_type: planType,
          size,
          validity,
          cost_price: amount * 0.95, // Assume 5% profit margin by default
          selling_price: amount,
          profit_margin: 5,
          description: `${network} ${size} for ${validity}`,
          is_active: true,
          is_popular: false,
          sort_order: 0,
          discount_percentage: 0,
          show_discount_badge: false,
        };
        
        dataPlans.push(dataPlan);
      }
      
      // Insert data plans
      let successCount = 0;
      let failedCount = 0;
      
      for (const plan of dataPlans) {
        // Check if plan with this external_id already exists
        const { data: existingPlan, error: checkError } = await supabase
          .from('data_plans')
          .select('id')
          .eq('external_id', plan.external_id)
          .maybeSingle();
          
        if (checkError) {
          errors.push(`Error checking for existing plan with external_id ${plan.external_id}: ${checkError.message}`);
          failedCount++;
          continue;
        }
        
        if (existingPlan) {
          // Update existing plan
          const { error: updateError } = await supabase
            .from('data_plans')
            .update(plan)
            .eq('id', existingPlan.id);
            
          if (updateError) {
            errors.push(`Error updating plan with external_id ${plan.external_id}: ${updateError.message}`);
            failedCount++;
          } else {
            successCount++;
          }
        } else {
          // Insert new plan
          const { error: insertError } = await supabase
            .from('data_plans')
            .insert([plan]);
            
          if (insertError) {
            errors.push(`Error inserting plan with external_id ${plan.external_id}: ${insertError.message}`);
            failedCount++;
          } else {
            successCount++;
          }
        }
      }
      
      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: 'bulk_import_data_plans',
        details: { 
          total: dataPlans.length,
          success: successCount,
          failed: failedCount
        },
      }]);
      
      // Set import results
      setImportResults({
        success: successCount,
        failed: failedCount,
        errors
      });
      setShowImportResults(true);
      
      // Refresh data plans
      fetchDataPlans();
      
    } catch (error) {
      console.error('Error importing data plans:', error);
      alert(`Error importing data plans: ${error.message || 'Unknown error'}`);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const productCategoryOptions = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  
  // Filter data plans based on search query and selected network/plan type
  const filteredDataPlans = dataPlans.filter(plan => {
    const matchesSearch = 
      plan.size.toLowerCase().includes(dataPlanSearchQuery.toLowerCase()) ||
      plan.description?.toLowerCase().includes(dataPlanSearchQuery.toLowerCase()) ||
      plan.validity.toLowerCase().includes(dataPlanSearchQuery.toLowerCase()) ||
      plan.external_id.toString().includes(dataPlanSearchQuery);
    
    const matchesNetwork = selectedNetwork === 'all' || plan.network === selectedNetwork;
    const matchesPlanType = selectedPlanType === 'all' || plan.plan_type === selectedPlanType;
    
    return matchesSearch && matchesNetwork && matchesPlanType;
  });
  
  // Get unique networks and plan types for filtering
  const networks = ['all', ...Array.from(new Set(dataPlans.map(p => p.network)))];
  const planTypes = ['all', ...Array.from(new Set(dataPlans.map(p => p.plan_type)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F9D58]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors mr-4"
              >
                <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeTab === 'products' ? 'Products Management' : 'Data Plans Management'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activeTab === 'products' 
                    ? `${products.length} total products` 
                    : `${dataPlans.length} total data plans`}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {activeTab === 'products' && (
                <button
                  onClick={() => navigate('/admin/product-categories')}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Filter size={16} className="mr-2" />
                  Manage Categories
                </button>
              )}
              
              <button
                onClick={() => setActiveTab(activeTab === 'products' ? 'data_plans' : 'products')}
                className="flex items-center px-4 py-2 bg-[#0F9D58] text-white rounded-lg hover:bg-[#0d8a4f] transition-colors"
              >
                <RefreshCw size={16} className="mr-2" />
                Switch to {activeTab === 'products' ? 'Data Plans' : 'Products'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' ? (
          <>
            {/* Products Management */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => {
                  resetForm();
                  setEditingProduct(null);
                  setShowAddModal(true);
                }}
                className="flex items-center px-4 py-2 bg-[#0F9D58] text-white rounded-lg hover:bg-[#0d8a4f] transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Add Product
              </button>
            </div>
            
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                >
                  {productCategoryOptions.map(option => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'All Categories' : option}
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Filter size={16} className="mr-2" />
                  {filteredProducts.length} products found
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 sm:h-80 object-cover"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      {product.is_new && (
                        <span className="bg-[#0F9D58] text-white text-xs px-2 py-1 rounded-full font-bold">
                          NEW
                        </span>
                      )}
                      {product.is_featured && (
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          FEATURED
                        </span>
                      )}
                      {product.discount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          -{product.discount}%
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      <Heart size={20} className="text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {product.category}
                      </span>
                      <div className="flex items-center">
                        <Star className="text-yellow-400 fill-current" size={12} />
                        <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="font-bold text-[#0F9D58] text-lg">
                          {formatCurrency(product.price)}
                        </span>
                        {product.original_price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatCurrency(product.original_price)}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.in_stock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Data Plans Management */}
            <div className="mb-6 flex justify-between">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    resetDataPlanForm();
                    setEditingDataPlan(null);
                    setShowAddDataPlanModal(true);
                  }}
                  className="flex items-center px-4 py-2 bg-[#0F9D58] text-white rounded-lg hover:bg-[#0d8a4f] transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Add Data Plan
                </button>
                
                <button
                  onClick={() => {
                    setImportMode(true);
                    setBulkImportText('');
                    setShowAddDataPlanModal(true);
                  }}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Bulk Import
                </button>
              </div>
              
              <button
                onClick={fetchDataPlans}
                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </button>
            </div>
            
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search data plans..."
                    value={dataPlanSearchQuery}
                    onChange={(e) => setDataPlanSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                  />
                </div>
                
                <select
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                >
                  {networks.map(network => (
                    <option key={network} value={network}>
                      {network === 'all' ? 'All Networks' : network}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedPlanType}
                  onChange={(e) => setSelectedPlanType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                >
                  {planTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Plan Types' : type}
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Filter size={16} className="mr-2" />
                  {filteredDataPlans.length} data plans found
                </div>
              </div>
            </div>

            {/* Data Plans Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        External ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Network
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Plan Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Validity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loadingDataPlans ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0F9D58]"></div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredDataPlans.length > 0 ? (
                      filteredDataPlans.map((plan) => (
                        <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {plan.external_id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {plan.network}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {plan.plan_type}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {plan.size}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {plan.validity}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#0F9D58]">
                            {formatCurrency(plan.selling_price)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                plan.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {plan.is_active ? 'Active' : 'Inactive'}
                              </span>
                              
                              {plan.is_popular && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Popular
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEditDataPlan(plan)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit Data Plan"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleDataPlanActive(plan)}
                              className={`${
                                plan.is_active 
                                  ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' 
                                  : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                              }`}
                              title={plan.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {plan.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button
                              onClick={() => handleToggleDataPlanPopular(plan)}
                              className={`${
                                plan.is_popular 
                                  ? 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300' 
                                  : 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                              }`}
                              title={plan.is_popular ? 'Remove Popular Tag' : 'Mark as Popular'}
                            >
                              <Star size={16} className={plan.is_popular ? 'fill-current' : ''} />
                            </button>
                            <button
                              onClick={() => handleDeleteDataPlan(plan.id, plan.network, plan.size)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete Data Plan"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center">
                          <div className="text-gray-500 dark:text-gray-400">
                            No data plans found. Try adjusting your search or filter criteria.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({...productFormData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                  >
                    {productCategories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({...productFormData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Original Price (₦) - Optional
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productFormData.original_price}
                    onChange={(e) => setProductFormData({...productFormData, original_price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={productFormData.image_url}
                  onChange={(e) => setProductFormData({...productFormData, image_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productFormData.in_stock}
                    onChange={(e) => setProductFormData({...productFormData, in_stock: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">In Stock</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productFormData.is_new}
                    onChange={(e) => setProductFormData({...productFormData, is_new: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">New Product</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productFormData.is_featured}
                    onChange={(e) => setProductFormData({...productFormData, is_featured: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
                </label>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#0F9D58] text-white rounded-lg hover:bg-[#0d8a4f] transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add/Edit Data Plan Modal */}
      {showAddDataPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {importMode 
                  ? 'Bulk Import Data Plans' 
                  : editingDataPlan 
                  ? 'Edit Data Plan' 
                  : 'Add New Data Plan'}
              </h2>
            </div>
            
            {importMode ? (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paste Data Plan Information
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Format: Plan ID, Network, Plan type, Amount, Size, Validity (tab-separated)
                  </p>
                  <textarea
                    rows={10}
                    value={bulkImportText}
                    onChange={(e) => setBulkImportText(e.target.value)}
                    placeholder="455	AIRTEL	AWOOF DATA SHARE	₦365	1.0 GB	3 Days Don't buy if owing"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58] font-mono"
                  />
                </div>
                
                {showImportResults && (
                  <div className={`p-4 rounded-lg ${
                    importResults.failed > 0 
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' 
                      : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  }`}>
                    <div className="flex items-start">
                      {importResults.failed > 0 
                        ? <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                        : <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
                      }
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">Import Results</h3>
                        <p className="text-sm mt-1">
                          Successfully imported: <span className="font-medium text-green-600 dark:text-green-400">{importResults.success}</span><br />
                          Failed: <span className="font-medium text-red-600 dark:text-red-400">{importResults.failed}</span>
                        </p>
                        {importResults.errors.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Errors:</p>
                            <ul className="text-xs text-red-600 dark:text-red-400 mt-1 list-disc list-inside">
                              {importResults.errors.slice(0, 5).map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                              {importResults.errors.length > 5 && (
                                <li>...and {importResults.errors.length - 5} more errors</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddDataPlanModal(false);
                      setImportMode(false);
                      setBulkImportText('');
                      setShowImportResults(false);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkImport}
                    className="flex-1 px-4 py-2 bg-[#0F9D58] text-white rounded-lg hover:bg-[#0d8a4f] transition-colors"
                  >
                    Import Data Plans
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDataPlanSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      External ID (Plan ID) *
                    </label>
                    <input
                      type="number"
                      required
                      value={dataPlanFormData.external_id}
                      onChange={(e) => setDataPlanFormData({...dataPlanFormData, external_id: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This must match the Plan ID from your API provider
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Network *
                    </label>
                    <select
                      required
                      value={dataPlanFormData.network}
                      onChange={(e) => setDataPlanFormData({...dataPlanFormData, network: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                    >
                      <option value="MTN">MTN</option>
                      <option value="AIRTEL">AIRTEL</option>
                      <option value="GLO">GLO</option>
                      <option value="9MOBILE">9MOBILE</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Plan Type *
                    </label>
                    <input
                      type="text"
                      required
                      value={dataPlanFormData.plan_type}
                      onChange={(e) => setDataPlanFormData({...dataPlanFormData, plan_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                      placeholder="SME, GIFTING, CORPORATE GIFTING, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Size *
                    </label>
                    <input
                      type="text"
                      required
                      value={dataPlanFormData.size}
                      onChange={(e) => setDataPlanFormData({...dataPlanFormData, size: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                      placeholder="1.0 GB, 500.0 MB, etc."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Validity *
                    </label>
                    <input
                      type="text"
                      required
                      value={dataPlanFormData.validity}
                      onChange={(e) => setDataPlanFormData({...dataPlanFormData, validity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                      placeholder="30 DAYS, 7 DAYS, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={dataPlanFormData.description}
                      onChange={(e) => setDataPlanFormData({...dataPlanFormData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                      placeholder="Optional description"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cost Price (₦) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={dataPlanFormData.cost_price}
                      onChange={(e) => setDataPlanFormData({...dataPlanFormData, cost_price: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Selling Price (₦) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={dataPlanFormData.selling_price}
                      onChange={(e) => {
                        const newSellingPrice = parseFloat(e.target.value) || 0;
                        const newProfitMargin = dataPlanFormData.cost_price > 0 
                          ? ((newSellingPrice - dataPlanFormData.cost_price) / dataPlanFormData.cost_price) * 100 
                          : 0;
                        
                        setDataPlanFormData({
                          ...dataPlanFormData, 
                          selling_price: newSellingPrice,
                          profit_margin: parseFloat(newProfitMargin.toFixed(2))
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Profit Margin (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={dataPlanFormData.profit_margin}
                      onChange={(e) => {
                        const newProfitMargin = parseFloat(e.target.value) || 0;
                        const newSellingPrice = dataPlanFormData.cost_price * (1 + (newProfitMargin / 100));
                        
                        setDataPlanFormData({
                          ...dataPlanFormData, 
                          profit_margin: newProfitMargin,
                          selling_price: parseFloat(newSellingPrice.toFixed(2))
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={dataPlanFormData.sort_order}
                      onChange={(e) => setDataPlanFormData({...dataPlanFormData, sort_order: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={dataPlanFormData.discount_percentage}
                      onChange={(e) => setDataPlanFormData({...dataPlanFormData, discount_percentage: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={dataPlanFormData.is_active}
                      onChange={(e) => setDataPlanFormData({...dataPlanFormData, is_active: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={dataPlanFormData.is_popular}
                      onChange={(e) => setDataPlanFormData({...dataPlanFormData, is_popular: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Popular</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={dataPlanFormData.show_discount_badge}
                      onChange={(e) => setDataPlanFormData({...dataPlanFormData, show_discount_badge: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Discount Badge</span>
                  </label>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddDataPlanModal(false);
                      setEditingDataPlan(null);
                      resetDataPlanForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#0F9D58] text-white rounded-lg hover:bg-[#0d8a4f] transition-colors"
                  >
                    {editingDataPlan ? 'Update Data Plan' : 'Add Data Plan'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;