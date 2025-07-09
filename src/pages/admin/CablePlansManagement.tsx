import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Save,
  Tv,
  Eye,
  EyeOff,
  AlertTriangle,
  Star,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../lib/utils';

type CableProvider = {
  id: string;
  external_id: number;
  name: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

type CablePlan = {
  id: string;
  external_id: number;
  cable_provider_id: string;
  name: string;
  cost_price: number;
  selling_price: number;
  profit_margin: number;
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const CablePlansManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [providers, setProviders] = useState<CableProvider[]>([]);
  const [plans, setPlans] = useState<CablePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CableProvider | CablePlan | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkProfitMargin, setBulkProfitMargin] = useState('');
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [globalProfitMargin, setGlobalProfitMargin] = useState('');

  // Form data for provider
  const [providerFormData, setProviderFormData] = useState({
    external_id: '',
    name: '',
    is_active: true,
    sort_order: 0,
  });

  // Form data for plan
  const [planFormData, setPlanFormData] = useState({
    external_id: '',
    cable_provider_id: '',
    name: '',
    cost_price: '',
    selling_price: '',
    profit_margin: '',
    is_active: true,
    is_popular: false,
    sort_order: 0,
  });

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchProviders();
    fetchGlobalProfitMargin();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedProvider) {
      fetchPlans(selectedProvider);
    }
  }, [selectedProvider]);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('cable_providers')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setProviders(data || []);
      
      // Select the first provider by default if none is selected
      if (data && data.length > 0 && !selectedProvider) {
        setSelectedProvider(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching cable providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async (providerId: string) => {
    try {
      const { data, error } = await supabase
        .from('cable_plans')
        .select('*')
        .eq('cable_provider_id', providerId)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching cable plans:', error);
    }
  };

  const fetchGlobalProfitMargin = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'cable_plan_profit_margin')
        .single();

      if (error) throw error;
      setGlobalProfitMargin(data?.value || '5');
    } catch (error) {
      console.error('Error fetching global profit margin:', error);
      setGlobalProfitMargin('5'); // Default to 5% if there's an error
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProviders();
    if (selectedProvider) {
      await fetchPlans(selectedProvider);
    }
    await fetchGlobalProfitMargin();
    setRefreshing(false);
  };

  const handleSubmitProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const providerData = {
        external_id: parseInt(providerFormData.external_id),
        name: providerFormData.name,
        is_active: providerFormData.is_active,
        sort_order: providerFormData.sort_order,
      };

      if (isEditMode && selectedItem) {
        // Update existing provider
        const { error } = await supabase
          .from('cable_providers')
          .update(providerData)
          .eq('id', (selectedItem as CableProvider).id);
        
        if (error) throw error;
        
        // Log admin action
        await supabase.from('admin_logs').insert([{
          admin_id: user?.id,
          action: 'update_cable_provider',
          details: { 
            provider_id: (selectedItem as CableProvider).id, 
            provider_name: providerFormData.name 
          },
        }]);
      } else {
        // Create new provider
        const { error } = await supabase
          .from('cable_providers')
          .insert([providerData]);
        
        if (error) throw error;
        
        // Log admin action
        await supabase.from('admin_logs').insert([{
          admin_id: user?.id,
          action: 'create_cable_provider',
          details: { provider_name: providerFormData.name },
        }]);
      }

      // Refresh providers list
      fetchProviders();
      resetProviderForm();
      setShowAddProviderModal(false);
      setIsEditMode(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error saving cable provider:', error);
      alert('Error saving cable provider. Please try again.');
    }
  };

  const handleSubmitPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const costPrice = parseFloat(planFormData.cost_price);
      const sellingPrice = parseFloat(planFormData.selling_price);
      const profitMargin = parseFloat(planFormData.profit_margin);
      
      const planData = {
        external_id: parseInt(planFormData.external_id),
        cable_provider_id: planFormData.cable_provider_id,
        name: planFormData.name,
        cost_price: costPrice,
        selling_price: sellingPrice,
        profit_margin: profitMargin,
        is_active: planFormData.is_active,
        is_popular: planFormData.is_popular,
        sort_order: planFormData.sort_order,
      };

      if (isEditMode && selectedItem) {
        // Update existing plan
        const { error } = await supabase
          .from('cable_plans')
          .update(planData)
          .eq('id', (selectedItem as CablePlan).id);
        
        if (error) throw error;
        
        // Log admin action
        await supabase.from('admin_logs').insert([{
          admin_id: user?.id,
          action: 'update_cable_plan',
          details: { 
            plan_id: (selectedItem as CablePlan).id, 
            plan_name: planFormData.name 
          },
        }]);
      } else {
        // Create new plan
        const { error } = await supabase
          .from('cable_plans')
          .insert([planData]);
        
        if (error) throw error;
        
        // Log admin action
        await supabase.from('admin_logs').insert([{
          admin_id: user?.id,
          action: 'create_cable_plan',
          details: { plan_name: planFormData.name },
        }]);
      }

      // Refresh plans list
      fetchPlans(selectedProvider);
      resetPlanForm();
      setShowAddPlanModal(false);
      setIsEditMode(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error saving cable plan:', error);
      alert('Error saving cable plan. Please try again.');
    }
  };

  const handleDeleteProvider = async () => {
    if (!selectedItem) return;

    try {
      // Check if provider has plans
      const { count, error: countError } = await supabase
        .from('cable_plans')
        .select('*', { count: 'exact', head: true })
        .eq('cable_provider_id', (selectedItem as CableProvider).id);
      
      if (countError) throw countError;
      
      if (count && count > 0) {
        alert(`This provider has ${count} plans. Please delete these plans first.`);
        setShowDeleteModal(false);
        return;
      }

      // Delete the provider
      const { error } = await supabase
        .from('cable_providers')
        .delete()
        .eq('id', (selectedItem as CableProvider).id);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: 'delete_cable_provider',
        details: { 
          provider_id: (selectedItem as CableProvider).id, 
          provider_name: (selectedItem as CableProvider).name 
        },
      }]);

      fetchProviders();
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting cable provider:', error);
      alert('Error deleting cable provider. Please try again.');
    }
  };

  const handleDeletePlan = async () => {
    if (!selectedItem) return;

    try {
      // Delete the plan
      const { error } = await supabase
        .from('cable_plans')
        .delete()
        .eq('id', (selectedItem as CablePlan).id);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: 'delete_cable_plan',
        details: { 
          plan_id: (selectedItem as CablePlan).id, 
          plan_name: (selectedItem as CablePlan).name 
        },
      }]);

      fetchPlans(selectedProvider);
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting cable plan:', error);
      alert('Error deleting cable plan. Please try again.');
    }
  };

  const handleEditProvider = (provider: CableProvider) => {
    setProviderFormData({
      external_id: provider.external_id.toString(),
      name: provider.name,
      is_active: provider.is_active,
      sort_order: provider.sort_order,
    });
    setIsEditMode(true);
    setSelectedItem(provider);
    setShowAddProviderModal(true);
  };

  const handleEditPlan = (plan: CablePlan) => {
    setPlanFormData({
      external_id: plan.external_id.toString(),
      cable_provider_id: plan.cable_provider_id,
      name: plan.name,
      cost_price: plan.cost_price.toString(),
      selling_price: plan.selling_price.toString(),
      profit_margin: plan.profit_margin.toString(),
      is_active: plan.is_active,
      is_popular: plan.is_popular,
      sort_order: plan.sort_order,
    });
    setIsEditMode(true);
    setSelectedItem(plan);
    setShowAddPlanModal(true);
  };

  const handleToggleProviderActive = async (provider: CableProvider) => {
    try {
      const { error } = await supabase
        .from('cable_providers')
        .update({ is_active: !provider.is_active })
        .eq('id', provider.id);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: provider.is_active ? 'deactivate_cable_provider' : 'activate_cable_provider',
        details: { 
          provider_id: provider.id, 
          provider_name: provider.name 
        },
      }]);

      fetchProviders();
    } catch (error) {
      console.error('Error toggling provider status:', error);
      alert('Error updating provider status. Please try again.');
    }
  };

  const handleTogglePlanActive = async (plan: CablePlan) => {
    try {
      const { error } = await supabase
        .from('cable_plans')
        .update({ is_active: !plan.is_active })
        .eq('id', plan.id);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: plan.is_active ? 'deactivate_cable_plan' : 'activate_cable_plan',
        details: { 
          plan_id: plan.id, 
          plan_name: plan.name 
        },
      }]);

      fetchPlans(selectedProvider);
    } catch (error) {
      console.error('Error toggling plan status:', error);
      alert('Error updating plan status. Please try again.');
    }
  };

  const handleTogglePlanPopular = async (plan: CablePlan) => {
    try {
      const { error } = await supabase
        .from('cable_plans')
        .update({ is_popular: !plan.is_popular })
        .eq('id', plan.id);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: plan.is_popular ? 'unmark_popular_cable_plan' : 'mark_popular_cable_plan',
        details: { 
          plan_id: plan.id, 
          plan_name: plan.name 
        },
      }]);

      fetchPlans(selectedProvider);
    } catch (error) {
      console.error('Error toggling plan popular status:', error);
      alert('Error updating plan popular status. Please try again.');
    }
  };

  const resetProviderForm = () => {
    setProviderFormData({
      external_id: '',
      name: '',
      is_active: true,
      sort_order: 0,
    });
  };

  const resetPlanForm = () => {
    setPlanFormData({
      external_id: '',
      cable_provider_id: selectedProvider,
      name: '',
      cost_price: '',
      selling_price: '',
      profit_margin: '',
      is_active: true,
      is_popular: false,
      sort_order: 0,
    });
  };

  const handleBulkProfitMarginChange = async () => {
    if (!bulkProfitMargin || selectedPlans.length === 0) return;
    
    const profitMarginValue = parseFloat(bulkProfitMargin);
    if (isNaN(profitMarginValue)) return;
    
    try {
      // Get the selected plans
      const { data: selectedPlansData, error: fetchError } = await supabase
        .from('cable_plans')
        .select('*')
        .in('id', selectedPlans);
      
      if (fetchError) throw fetchError;
      
      // Update each plan with the new profit margin and recalculate selling price
      const updates = selectedPlansData?.map(plan => {
        const newSellingPrice = plan.cost_price * (1 + profitMarginValue / 100);
        return {
          id: plan.id,
          profit_margin: profitMarginValue,
          selling_price: Math.round(newSellingPrice * 100) / 100, // Round to 2 decimal places
        };
      });
      
      if (!updates || updates.length === 0) return;
      
      // Perform the updates
      for (const update of updates) {
        const { error } = await supabase
          .from('cable_plans')
          .update({
            profit_margin: update.profit_margin,
            selling_price: update.selling_price,
          })
          .eq('id', update.id);
        
        if (error) throw error;
      }
      
      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: 'bulk_update_cable_plan_profit_margin',
        details: { 
          profit_margin: profitMarginValue,
          plan_count: selectedPlans.length,
          plan_ids: selectedPlans
        },
      }]);
      
      // Refresh plans and reset selection
      fetchPlans(selectedProvider);
      setSelectedPlans([]);
      setBulkProfitMargin('');
      setBulkEditMode(false);
    } catch (error) {
      console.error('Error updating profit margins:', error);
      alert('Error updating profit margins. Please try again.');
    }
  };

  const handleUpdateGlobalProfitMargin = async () => {
    if (!globalProfitMargin) return;
    
    const profitMarginValue = parseFloat(globalProfitMargin);
    if (isNaN(profitMarginValue)) return;
    
    try {
      // Update the admin setting
      const { error: settingError } = await supabase
        .from('admin_settings')
        .update({ value: globalProfitMargin.toString() })
        .eq('key', 'cable_plan_profit_margin');
      
      if (settingError) throw settingError;
      
      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: 'update_global_cable_profit_margin',
        details: { 
          profit_margin: profitMarginValue
        },
      }]);
      
      alert('Global profit margin updated successfully.');
    } catch (error) {
      console.error('Error updating global profit margin:', error);
      alert('Error updating global profit margin. Please try again.');
    }
  };

  const handleApplyGlobalProfitMargin = async () => {
    if (!globalProfitMargin) return;
    
    const profitMarginValue = parseFloat(globalProfitMargin);
    if (isNaN(profitMarginValue)) return;
    
    if (!confirm(`Are you sure you want to apply ${profitMarginValue}% profit margin to ALL cable plans? This will update the selling prices.`)) {
      return;
    }
    
    try {
      // Get all plans
      const { data: allPlans, error: fetchError } = await supabase
        .from('cable_plans')
        .select('*');
      
      if (fetchError) throw fetchError;
      
      // Update each plan with the new profit margin and recalculate selling price
      const updates = allPlans?.map(plan => {
        const newSellingPrice = plan.cost_price * (1 + profitMarginValue / 100);
        return {
          id: plan.id,
          profit_margin: profitMarginValue,
          selling_price: Math.round(newSellingPrice * 100) / 100, // Round to 2 decimal places
        };
      });
      
      if (!updates || updates.length === 0) return;
      
      // Perform the updates
      for (const update of updates) {
        const { error } = await supabase
          .from('cable_plans')
          .update({
            profit_margin: update.profit_margin,
            selling_price: update.selling_price,
          })
          .eq('id', update.id);
        
        if (error) throw error;
      }
      
      // Log admin action
      await supabase.from('admin_logs').insert([{
        admin_id: user?.id,
        action: 'apply_global_cable_profit_margin',
        details: { 
          profit_margin: profitMarginValue,
          plan_count: updates.length
        },
      }]);
      
      // Refresh plans
      fetchPlans(selectedProvider);
      alert('Global profit margin applied successfully to all plans.');
    } catch (error) {
      console.error('Error applying global profit margin:', error);
      alert('Error applying global profit margin. Please try again.');
    }
  };

  const filteredPlans = plans.filter(plan => {
    return plan.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cable Plans Management</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage cable TV providers and subscription plans</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={refreshing}
              >
                <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => {
                  resetProviderForm();
                  setIsEditMode(false);
                  setShowAddProviderModal(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Add Provider
              </button>
              <button
                onClick={() => {
                  resetPlanForm();
                  setIsEditMode(false);
                  setPlanFormData(prev => ({ ...prev, cable_provider_id: selectedProvider }));
                  setShowAddPlanModal(true);
                }}
                className="flex items-center px-4 py-2 bg-[#0F9D58] text-white rounded-lg hover:bg-[#0d8a4f] transition-colors"
                disabled={!selectedProvider}
              >
                <Plus size={16} className="mr-2" />
                Add Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global Profit Margin Setting */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Global Profit Margin</h2>
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Profit Margin (%)
              </label>
              <input
                type="number"
                value={globalProfitMargin}
                onChange={(e) => setGlobalProfitMargin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                min="0"
                step="0.1"
              />
            </div>
            <button
              onClick={handleUpdateGlobalProfitMargin}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save size={16} className="mr-2 inline-block" />
              Save
            </button>
            <button
              onClick={handleApplyGlobalProfitMargin}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Apply to All Plans
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This setting controls the default profit margin for new cable plans. You can also apply it to all existing plans.
          </p>
        </div>

        {/* Provider Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cable Providers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedProvider === provider.id
                    ? 'bg-[#0F9D58]/10 border-2 border-[#0F9D58]'
                    : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-[#0F9D58]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#0F9D58]/10 rounded-full flex items-center justify-center">
                      <Tv size={20} className="text-[#0F9D58]" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">{provider.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ID: {provider.external_id}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProvider(provider);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Edit Provider"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleProviderActive(provider);
                      }}
                      className={`p-1 ${
                        provider.is_active 
                          ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300' 
                          : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                      }`}
                      title={provider.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {provider.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(provider);
                        setShowDeleteModal(true);
                      }}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete Provider"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                    provider.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {provider.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plans Management */}
        {selectedProvider && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {providers.find(p => p.id === selectedProvider)?.name} Plans
                </h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search plans..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                    />
                  </div>
                  <button
                    onClick={() => setBulkEditMode(!bulkEditMode)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      bulkEditMode 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Bulk Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Edit Controls */}
            {bulkEditMode && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Set Profit Margin (%) for Selected Plans
                    </label>
                    <input
                      type="number"
                      value={bulkProfitMargin}
                      onChange={(e) => setBulkProfitMargin(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                      min="0"
                      step="0.1"
                      placeholder="Enter profit margin %"
                    />
                  </div>
                  <button
                    onClick={handleBulkProfitMarginChange}
                    disabled={!bulkProfitMargin || selectedPlans.length === 0}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    Apply to Selected ({selectedPlans.length})
                  </button>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">
                  This will update the profit margin and recalculate the selling price for all selected plans.
                </p>
              </div>
            )}

            {/* Plans Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {bulkEditMode && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPlans(filteredPlans.map(plan => plan.id));
                            } else {
                              setSelectedPlans([]);
                            }
                          }}
                          checked={selectedPlans.length === filteredPlans.length && filteredPlans.length > 0}
                          className="h-4 w-4 text-[#0F9D58] focus:ring-[#0F9D58] border-gray-300 rounded"
                        />
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Plan Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cost Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Selling Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Profit Margin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      {bulkEditMode && (
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedPlans.includes(plan.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPlans([...selectedPlans, plan.id]);
                              } else {
                                setSelectedPlans(selectedPlans.filter(id => id !== plan.id));
                              }
                            }}
                            className="h-4 w-4 text-[#0F9D58] focus:ring-[#0F9D58] border-gray-300 rounded"
                          />
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {plan.is_popular && (
                            <Star size={16} className="text-yellow-500 fill-current mr-2" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{plan.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">ID: {plan.external_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(plan.cost_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(plan.selling_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {plan.profit_margin}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          plan.is_active 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {plan.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditPlan(plan)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit Plan"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleTogglePlanActive(plan)}
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
                          onClick={() => handleTogglePlanPopular(plan)}
                          className={`${
                            plan.is_popular
                              ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 fill-current' 
                              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
                          }`}
                          title={plan.is_popular ? 'Remove Popular Tag' : 'Mark as Popular'}
                        >
                          <Star size={16} className={plan.is_popular ? 'fill-current' : ''} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(plan);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete Plan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPlans.length === 0 && (
              <div className="text-center py-12">
                <Tv className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No plans found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {plans.length === 0 
                    ? "Start by adding your first cable plan" 
                    : "Try adjusting your search criteria"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Provider Modal */}
      {showAddProviderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Provider' : 'Add New Provider'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmitProvider} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  External ID
                </label>
                <input
                  type="number"
                  required
                  value={providerFormData.external_id}
                  onChange={(e) => setProviderFormData({...providerFormData, external_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Provider Name
                </label>
                <input
                  type="text"
                  required
                  value={providerFormData.name}
                  onChange={(e) => setProviderFormData({...providerFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={providerFormData.sort_order}
                  onChange={(e) => setProviderFormData({...providerFormData, sort_order: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Lower numbers appear first in the list
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={providerFormData.is_active}
                  onChange={(e) => setProviderFormData({...providerFormData, is_active: e.target.checked})}
                  className="h-4 w-4 text-[#0F9D58] focus:ring-[#0F9D58] border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Active
                </label>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProviderModal(false);
                    setIsEditMode(false);
                    resetProviderForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#0F9D58] text-white rounded-lg hover:bg-[#0d8a4f] transition-colors"
                >
                  {isEditMode ? 'Update Provider' : 'Add Provider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Plan Modal */}
      {showAddPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Plan' : 'Add New Plan'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmitPlan} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Provider
                </label>
                <select
                  value={planFormData.cable_provider_id}
                  onChange={(e) => setPlanFormData({...planFormData, cable_provider_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent"
                  required
                >
                  <option value="">Select Provider</option>
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  External ID
                </label>
                <input
                  type="number"
                  required
                  value={planFormData.external_id}
                  onChange={(e) => setPlanFormData({...planFormData, external_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  required
                  value={planFormData.name}
                  onChange={(e) => setPlanFormData({...planFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cost Price (₦)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={planFormData.cost_price}
                    onChange={(e) => {
                      const costPrice = parseFloat(e.target.value);
                      const profitMargin = parseFloat(planFormData.profit_margin) || 0;
                      const newSellingPrice = costPrice * (1 + profitMargin / 100);
                      
                      setPlanFormData({
                        ...planFormData, 
                        cost_price: e.target.value,
                        selling_price: isNaN(newSellingPrice) ? '' : newSellingPrice.toFixed(2)
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profit Margin (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={planFormData.profit_margin}
                    onChange={(e) => {
                      const profitMargin = parseFloat(e.target.value);
                      const costPrice = parseFloat(planFormData.cost_price) || 0;
                      const newSellingPrice = costPrice * (1 + profitMargin / 100);
                      
                      setPlanFormData({
                        ...planFormData, 
                        profit_margin: e.target.value,
                        selling_price: isNaN(newSellingPrice) ? '' : newSellingPrice.toFixed(2)
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selling Price (₦)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={planFormData.selling_price}
                  onChange={(e) => {
                    const sellingPrice = parseFloat(e.target.value);
                    const costPrice = parseFloat(planFormData.cost_price) || 0;
                    let profitMargin = 0;
                    
                    if (costPrice > 0 && sellingPrice > 0) {
                      profitMargin = ((sellingPrice - costPrice) / costPrice) * 100;
                    }
                    
                    setPlanFormData({
                      ...planFormData, 
                      selling_price: e.target.value,
                      profit_margin: isNaN(profitMargin) ? '' : profitMargin.toFixed(2)
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={planFormData.sort_order}
                  onChange={(e) => setPlanFormData({...planFormData, sort_order: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Lower numbers appear first in the list
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={planFormData.is_active}
                    onChange={(e) => setPlanFormData({...planFormData, is_active: e.target.checked})}
                    className="h-4 w-4 text-[#0F9D58] focus:ring-[#0F9D58] border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Active
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_popular"
                    checked={planFormData.is_popular}
                    onChange={(e) => setPlanFormData({...planFormData, is_popular: e.target.checked})}
                    className="h-4 w-4 text-[#0F9D58] focus:ring-[#0F9D58] border-gray-300 rounded"
                  />
                  <label htmlFor="is_popular" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Popular
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPlanModal(false);
                    setIsEditMode(false);
                    resetPlanForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#0F9D58] text-white rounded-lg hover:bg-[#0d8a4f] transition-colors"
                >
                  {isEditMode ? 'Update Plan' : 'Add Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <AlertTriangle className="text-red-500 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {'id' in selectedItem && 'cable_provider_id' in selectedItem 
                    ? 'Delete Plan' 
                    : 'Delete Provider'}
                </h2>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete 
                {' id' in selectedItem && 'cable_provider_id' in selectedItem 
                  ? `the plan "${selectedItem.name}"` 
                  : `the provider "${selectedItem.name}"`}? 
                This action cannot be undone.
              </p>
              
              {'id' in selectedItem && !('cable_provider_id' in selectedItem) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        If this provider has any plans, you will not be able to delete it. You must first delete all plans associated with this provider.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={'id' in selectedItem && 'cable_provider_id' in selectedItem 
                    ? handleDeletePlan 
                    : handleDeleteProvider}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CablePlansManagement;