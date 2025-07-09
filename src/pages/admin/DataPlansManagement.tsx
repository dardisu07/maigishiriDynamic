import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, Edit, Trash2, Search, Filter,
  CheckCircle, XCircle, AlertTriangle,
  Wifi, Tag, DollarSign, Percent, Clock, Star,
  RefreshCw, Eye, EyeOff, ToggleLeft, ToggleRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

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
  created_at: string;
  updated_at: string;
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

const DataPlansManagement: React.FC = () => {
  const navigate = useNavigate();
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([]);
  const [categories, setCategories] = useState<DataPlanCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [selectedPlanType, setSelectedPlanType] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [editingPlan, setEditingPlan] = useState<DataPlan | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchDataPlans();
    fetchCategories();
  }, []);

  const fetchDataPlans = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('data_plan_categories')
        .select('*')
        .order('network', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('data_plans')
        .update({ is_active: !currentStatus })
        .eq('id', planId);

      if (error) throw error;
      
      setDataPlans(plans => 
        plans.map(plan => 
          plan.id === planId ? { ...plan, is_active: !currentStatus } : plan
        )
      );
    } catch (error) {
      console.error('Error updating plan status:', error);
    }
  };

  const togglePopularStatus = async (planId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('data_plans')
        .update({ is_popular: !currentStatus })
        .eq('id', planId);

      if (error) throw error;
      
      setDataPlans(plans => 
        plans.map(plan => 
          plan.id === planId ? { ...plan, is_popular: !currentStatus } : plan
        )
      );
    } catch (error) {
      console.error('Error updating popular status:', error);
    }
  };

  const deletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this data plan?')) return;

    try {
      const { error } = await supabase
        .from('data_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      
      setDataPlans(plans => plans.filter(plan => plan.id !== planId));
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const filteredPlans = dataPlans.filter(plan => {
    const matchesSearch = plan.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.network.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.plan_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNetwork = !selectedNetwork || plan.network === selectedNetwork;
    const matchesPlanType = !selectedPlanType || plan.plan_type === selectedPlanType;
    const matchesActive = !showActiveOnly || plan.is_active;

    return matchesSearch && matchesNetwork && matchesPlanType && matchesActive;
  });

  const networks = [...new Set(dataPlans.map(plan => plan.network))];
  const planTypes = [...new Set(dataPlans.map(plan => plan.plan_type))];

  const getNetworkColor = (network: string) => {
    const colors: { [key: string]: string } = {
      'MTN': 'bg-yellow-100 text-yellow-800',
      'GLO': 'bg-green-100 text-green-800',
      'AIRTEL': 'bg-red-100 text-red-800',
      '9MOBILE': 'bg-blue-100 text-blue-800'
    };
    return colors[network.toUpperCase()] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading data plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Plans Management</h1>
              <p className="text-gray-600 mt-1">Manage data plans and categories</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Data Plan</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold text-gray-900">{dataPlans.length}</p>
              </div>
              <Wifi className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold text-green-600">
                  {dataPlans.filter(plan => plan.is_active).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Popular Plans</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {dataPlans.filter(plan => plan.is_popular).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Networks</p>
                <p className="text-2xl font-bold text-purple-600">{networks.length}</p>
              </div>
              <Tag className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Plans
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by size, network..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network
              </label>
              <Select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
              >
                <option value="">All Networks</option>
                {networks.map(network => (
                  <option key={network} value={network}>{network}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Type
              </label>
              <Select
                value={selectedPlanType}
                onChange={(e) => setSelectedPlanType(e.target.value)}
              >
                <option value="">All Types</option>
                {planTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <Button
                variant={showActiveOnly ? "default" : "outline"}
                onClick={() => setShowActiveOnly(!showActiveOnly)}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>{showActiveOnly ? 'Active Only' : 'All Plans'}</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Plans Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Network
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {plan.size}
                          </div>
                          <div className="text-sm text-gray-500">
                            {plan.validity} • {plan.plan_type}
                          </div>
                          {plan.description && (
                            <div className="text-xs text-gray-400 mt-1">
                              {plan.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getNetworkColor(plan.network)}>
                        {plan.network}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium">₦{plan.selling_price}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Cost: ₦{plan.cost_price} • Margin: {plan.profit_margin}%
                        </div>
                        {plan.discount_percentage > 0 && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Percent className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-500">
                              {plan.discount_percentage}% off
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => togglePlanStatus(plan.id, plan.is_active)}
                            className="flex items-center space-x-1"
                          >
                            {plan.is_active ? (
                              <ToggleRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                            <span className={`text-xs ${plan.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                              {plan.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => togglePopularStatus(plan.id, plan.is_popular)}
                            className="flex items-center space-x-1"
                          >
                            <Star className={`w-4 h-4 ${plan.is_popular ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                            <span className={`text-xs ${plan.is_popular ? 'text-yellow-600' : 'text-gray-400'}`}>
                              {plan.is_popular ? 'Popular' : 'Regular'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPlan(plan)}
                          className="flex items-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePlan(plan.id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPlans.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data plans found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedNetwork || selectedPlanType
                  ? 'Try adjusting your filters to see more results.'
                  : 'Get started by adding your first data plan.'}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DataPlansManagement;