import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, ArrowLeft, CheckCircle, XCircle, Download, User, Search, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { serviceAPI } from '../../lib/serviceApi';
import { naijadatasubAPI } from '../../lib/naijadatasubApi';
import { formatCurrency } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import TransactionPinModal from '../../components/ui/TransactionPinModal';
import SetPinModal from '../../components/ui/SetPinModal';
import { jsPDF } from 'jspdf';

type Beneficiary = {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  network: string;
  type: 'airtime' | 'data' | 'cable';
  created_at: string;
};

type CableProvider = {
  id: string;
  external_id: number;
  name: string;
  is_active: boolean;
  sort_order: number;
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
};

type CustomerInfo = {
  name: string;
  status: string;
  dueDate?: string;
  customerNumber?: string;
};

const TvServicePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateWalletBalance } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [cableProviders, setCableProviders] = useState<CableProvider[]>([]);
  const [cablePlans, setCablePlans] = useState<CablePlan[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<CableProvider | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<CablePlan | null>(null);
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [saveAsBeneficiary, setSaveAsBeneficiary] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [transaction, setTransaction] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [showBeneficiaries, setShowBeneficiaries] = useState(false);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSetPinModal, setShowSetPinModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(false);

  useEffect(() => {
    fetchCableProviders();
    if (user) {
      fetchBeneficiaries();
    }
  }, [user]);

  useEffect(() => {
    if (selectedProvider) {
      fetchCablePlans(selectedProvider.id);
      // Clear selected plan when provider changes
      setSelectedPlan(null);
      // Clear customer info when provider changes
      setCustomerInfo(null);
    }
  }, [selectedProvider]);

  const fetchCableProviders = async () => {
    setLoadingProviders(true);
    try {
      const { data, error } = await supabase
        .from('cable_providers')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setCableProviders(data || []);
      
      // Select the first provider by default
      if (data && data.length > 0) {
        setSelectedProvider(data[0]);
      }
    } catch (error) {
      console.error('Error fetching cable providers:', error);
    } finally {
      setLoadingProviders(false);
    }
  };

  const fetchCablePlans = async (providerId: string) => {
    setLoadingPlans(true);
    try {
      const { data, error } = await supabase
        .from('cable_plans')
        .select('*')
        .eq('cable_provider_id', providerId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setCablePlans(data || []);
    } catch (error) {
      console.error('Error fetching cable plans:', error);
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchBeneficiaries = async () => {
    if (!user) return;
    
    setLoadingBeneficiaries(true);
    try {
      // Fetch beneficiaries from the database
      const { data, error } = await supabase
        .from('beneficiaries')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'cable')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setBeneficiaries(data || []);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    } finally {
      setLoadingBeneficiaries(false);
    }
  };

  const validateSmartCard = async () => {
    if (!selectedProvider || !smartCardNumber) {
      return;
    }
    
    setIsValidating(true);
    setCustomerInfo(null);
    setErrorMessage('');
    
    try {
      const result = await naijadatasubAPI.validateSmartCard({
        cable_name: selectedProvider.name.toUpperCase(),
        smart_card_number: smartCardNumber,
      });
      
      if (result && result.customer_name) {
        setCustomerInfo({
          name: result.customer_name,
          status: 'active',
          customerNumber: result.customer_number || smartCardNumber,
          dueDate: result.due_date
        });
        
        // If saving as beneficiary, set the name from validation
        if (saveAsBeneficiary && !beneficiaryName) {
          setBeneficiaryName(result.customer_name);
        }
      } else {
        setErrorMessage('Unable to validate smart card. Please check the number and try again.');
      }
    } catch (error: any) {
      console.error('Smart card validation error:', error);
      setErrorMessage(error.message || 'Failed to validate smart card. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleContinue = () => {
    if (!selectedProvider || !selectedPlan || !smartCardNumber || !customerInfo) {
      return;
    }
    
    // Check if user has PIN set
    if (user && !user.hasPin) {
      setShowSetPinModal(true);
      return;
    }
    
    setStep(2);
  };

  const handlePayment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user has PIN set
    if (user.hasPin) {
      setShowPinModal(true);
      return;
    }

    // If no PIN is set, proceed with payment
    await processPayment();
  };

  const processPayment = async () => {
    if (!user || !selectedProvider || !selectedPlan || !smartCardNumber) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const amount = selectedPlan.selling_price;
      
      if (user.walletBalance < amount) {
        throw new Error('Insufficient wallet balance');
      }

      // Process the cable transaction
      const result = await serviceAPI.processCableTransaction(user.id, {
        cableProvider: selectedProvider.name,
        cablePlan: selectedPlan.external_id.toString(),
        smartCardNumber: smartCardNumber,
        amount: amount,
      });
      
      // Deduct from wallet after successful transaction
      const newBalance = user.walletBalance - amount;
      await updateWalletBalance(newBalance);
      
      setTransaction(result);
      setIsSuccess(true);
      
      // Save beneficiary if requested
      if (saveAsBeneficiary && beneficiaryName) {
        await saveBeneficiary();
      }
      
      setStep(3);
    } catch (error: any) {
      console.error('Cable subscription error:', error);
      setErrorMessage(error.message || 'Failed to process subscription. Please try again.');
      setIsSuccess(false);
      setStep(3);
    } finally {
      setIsLoading(false);
      setShowPinModal(false);
    }
  };

  const saveBeneficiary = async () => {
    if (!user || !selectedProvider || !smartCardNumber || !beneficiaryName) return;
    
    try {
      // Insert the beneficiary directly
      const { error } = await supabase
        .from('beneficiaries')
        .insert([{
          user_id: user.id,
          name: beneficiaryName,
          phone_number: smartCardNumber, // Using smartCardNumber as the phone_number field
          network: selectedProvider.name, // Using provider name as the network field
          type: 'cable'
        }]);
        
      if (error) {
        console.error('Error saving beneficiary:', error);
        return;
      }
      
      // Refresh beneficiaries list
      await fetchBeneficiaries();
    } catch (error) {
      console.error('Error saving beneficiary:', error);
    }
  };

  const selectBeneficiary = (beneficiary: Beneficiary) => {
    // Find the provider that matches the beneficiary's network
    const provider = cableProviders.find(p => p.name.toLowerCase() === beneficiary.network.toLowerCase());
    if (provider) {
      setSelectedProvider(provider);
    }
    
    setSmartCardNumber(beneficiary.phone_number);
    setBeneficiaryName(beneficiary.name);
    setShowBeneficiaries(false);
    
    // Validate the smart card after selecting a beneficiary
    setTimeout(() => {
      validateSmartCard();
    }, 100);
  };

  const downloadReceipt = () => {
    if (!transaction || !selectedProvider || !selectedPlan) return;
    
    const doc = new jsPDF();
    
    // Add logo (using text as placeholder)
    doc.setFontSize(24);
    doc.setTextColor(15, 157, 88); // Primary color #0F9D58
    doc.text('MAIGISHIRI DYNAMIC', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Digital Services & E-commerce Platform', 105, 30, { align: 'center' });
    
    // Add line separator
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);
    
    // Transaction details
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('CABLE TV SUBSCRIPTION RECEIPT', 105, 45, { align: 'center' });
    
    doc.setFontSize(10);
    const startY = 60;
    const lineHeight = 7;
    
    // Details grid
    const tableColumn = ["Date:", new Date().toLocaleString()];
    const tableRows = [
      ["Reference:", transaction.reference],
      ["Provider:", selectedProvider.name],
      ["Plan:", selectedPlan.name],
      ["Smart Card Number:", smartCardNumber],
      ["Customer Name:", customerInfo?.name || 'Not available'],
      ["Amount:", formatCurrency(selectedPlan.selling_price)],
      ["Status:", "SUCCESSFUL"],
    ];
    
    tableRows.forEach(([label, value], index) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 40, startY + (lineHeight * index));
      doc.setFont('helvetica', 'normal');
      doc.text(String(value), 80, startY + (lineHeight * index));
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Thank you for choosing Maigishiri Dynamic!', 105, 120, { align: 'center' });
    
    // Save the PDF
    doc.save(`cable-receipt-${transaction.reference}.pdf`);
  };

  const filteredPlans = cablePlans.filter(plan => {
    return plan.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const popularPlans = cablePlans.filter(plan => plan.is_popular);

  const renderStepOne = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-4 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">TV Subscription</h1>
        </div>
        <button
          onClick={() => navigate('/transactions')}
          className="text-primary-500 text-sm font-medium"
        >
          History
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Provider Selection */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Select Provider
          </label>
          <div className="grid grid-cols-3 gap-3">
            {loadingProviders ? (
              <div className="col-span-3 flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F9D58]"></div>
              </div>
            ) : (
              cableProviders.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider)}
                  className={`rounded-xl p-4 cursor-pointer transition-all ${
                    selectedProvider?.id === provider.id
                      ? 'bg-[#0F9D58]/10 border-2 border-[#0F9D58]'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#0F9D58]/10 rounded-full flex items-center justify-center mb-2">
                      <Tv size={24} className="text-[#0F9D58]" />
                    </div>
                    <h3 className="text-base font-medium text-center">{provider.name}</h3>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Smart Card Number */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Smart Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={smartCardNumber}
              onChange={(e) => {
                setSmartCardNumber(e.target.value);
                setCustomerInfo(null); // Clear customer info when smart card number changes
              }}
              placeholder="Enter smart card number"
              className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
            />
            <button
              onClick={() => setShowBeneficiaries(!showBeneficiaries)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <User size={20} />
            </button>
          </div>
          
          {/* Beneficiaries Dropdown */}
          {showBeneficiaries && beneficiaries.length > 0 && (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-2 mt-2 shadow-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 px-2">Recent Beneficiaries</h3>
              <div className="max-h-48 overflow-y-auto">
                {beneficiaries.map(beneficiary => (
                  <div 
                    key={beneficiary.id}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg cursor-pointer"
                    onClick={() => selectBeneficiary(beneficiary)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                      <User size={16} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{beneficiary.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{beneficiary.phone_number}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter the smart card number printed on your decoder
            </p>
            <button
              onClick={validateSmartCard}
              disabled={!selectedProvider || !smartCardNumber || isValidating}
              className="text-sm text-[#0F9D58] font-medium disabled:opacity-50"
            >
              {isValidating ? 'Validating...' : 'Validate'}
            </button>
          </div>
        </div>

        {/* Customer Info */}
        {customerInfo && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-start">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <div className="ml-3">
                <h3 className="font-medium text-green-800 dark:text-green-200">Customer Verified</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Name: <span className="font-medium">{customerInfo.name}</span>
                </p>
                {customerInfo.dueDate && (
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Due Date: <span className="font-medium">{customerInfo.dueDate}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-start">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div className="ml-3">
                <h3 className="font-medium text-red-800 dark:text-red-200">Error</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Plan Selection */}
        {selectedProvider && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                Select Plan
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]"
                />
              </div>
            </div>

            {/* Popular Plans */}
            {popularPlans.length > 0 && searchQuery === '' && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Popular Plans</h3>
                <div className="grid grid-cols-2 gap-3">
                  {popularPlans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`rounded-xl p-4 cursor-pointer transition-all ${
                        selectedPlan?.id === plan.id
                          ? 'bg-[#0F9D58]/10 border-2 border-[#0F9D58]'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        <h3 className="text-base font-medium mb-1">{plan.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
                          {selectedProvider.name} Subscription
                        </p>
                        <div className="mt-2">
                          <p className="text-lg font-bold text-[#0F9D58]">
                            {formatCurrency(plan.selling_price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Plans */}
            <div>
              {searchQuery !== '' && (
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Results</h3>
              )}
              
              {loadingPlans ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F9D58]"></div>
                </div>
              ) : filteredPlans.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {filteredPlans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`rounded-xl p-4 cursor-pointer transition-all ${
                        selectedPlan?.id === plan.id
                          ? 'bg-[#0F9D58]/10 border-2 border-[#0F9D58]'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        <h3 className="text-base font-medium mb-1">{plan.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
                          {selectedProvider.name} Subscription
                        </p>
                        <div className="mt-2">
                          <p className="text-lg font-bold text-[#0F9D58]">
                            {formatCurrency(plan.selling_price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <Tv className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No plans found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {cablePlans.length === 0 
                      ? "No plans available for this provider" 
                      : "Try adjusting your search criteria"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save as Beneficiary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Save as Beneficiary</span>
            <button
              onClick={() => setSaveAsBeneficiary(!saveAsBeneficiary)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                saveAsBeneficiary ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  saveAsBeneficiary ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {saveAsBeneficiary && (
            <div className="mt-3 animate-fade-in">
              <input
                type="text"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                placeholder="Enter beneficiary name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleContinue}
            disabled={!selectedProvider || !selectedPlan || !smartCardNumber || !customerInfo || (saveAsBeneficiary && !beneficiaryName)}
            className="w-full bg-[#0F9D58] hover:bg-[#0d8a4f] text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-4 py-4 flex items-center border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setStep(1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">Confirm Subscription</h1>
      </div>

      <div className="p-4">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Confirm TV Subscription</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Provider</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedProvider?.name}
              </span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Plan</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedPlan?.name}
              </span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Smart Card Number</span>
              <span className="font-medium text-gray-900 dark:text-white">{smartCardNumber}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Customer Name</span>
              <span className="font-medium text-gray-900 dark:text-white">{customerInfo?.name}</span>
            </div>
            
            {saveAsBeneficiary && (
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Save as Beneficiary</span>
                <span className="font-medium text-gray-900 dark:text-white">{beneficiaryName}</span>
              </div>
            )}
            
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Amount</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(selectedPlan?.selling_price || 0)}</span>
            </div>
            
            <div className="flex justify-between py-3">
              <span className="text-gray-600 dark:text-gray-400">Wallet Balance</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(user?.walletBalance || 0)}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1 py-3"
            >
              Back
            </Button>
            
            <Button
              onClick={handlePayment}
              isLoading={isLoading}
              className="flex-1 bg-[#0F9D58] hover:bg-[#0d8a4f] text-white py-3"
            >
              Pay Now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 text-center">
        {isSuccess ? (
          <>
            <div className="w-16 h-16 bg-[#0F9D58]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-[#0F9D58]" size={32} />
            </div>
            
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Subscription Successful!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your {selectedProvider?.name} subscription has been processed successfully.
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
                <span className="font-medium text-gray-900 dark:text-white">{transaction?.reference}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Smart Card Number</span>
                <span className="font-medium text-gray-900 dark:text-white">{smartCardNumber}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Customer Name</span>
                <span className="font-medium text-gray-900 dark:text-white">{customerInfo?.name}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Plan</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedPlan?.name}
                </span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Amount</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(selectedPlan?.selling_price || 0)}</span>
              </div>
              
              {saveAsBeneficiary && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Saved Beneficiary</span>
                  <span className="font-medium text-gray-900 dark:text-white">{beneficiaryName}</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mb-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Back to Home
              </Button>
              
              <Button
                onClick={() => {
                  setStep(1);
                  setSelectedPlan(null);
                  setSmartCardNumber('');
                  setCustomerInfo(null);
                  setSaveAsBeneficiary(false);
                  setBeneficiaryName('');
                  setIsSuccess(null);
                  setTransaction(null);
                  setErrorMessage('');
                }}
                className="flex-1 bg-[#0F9D58] hover:bg-[#0d8a4f] text-white"
              >
                New Subscription
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={downloadReceipt}
              className="w-full flex items-center justify-center"
              icon={<Download size={16} />}
            >
              Download Receipt
            </Button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="text-red-500" size={32} />
            </div>
            
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Subscription Failed</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {errorMessage || 'Your TV subscription could not be completed. Please try again.'}
            </p>
            
            <Button
              onClick={() => {
                setStep(1);
                setIsSuccess(null);
                setErrorMessage('');
              }}
              className="w-full bg-[#0F9D58] hover:bg-[#0d8a4f] text-white"
            >
              Try Again
            </Button>
          </>
        )}
      </Card>
    </div>
  );

  return (
    <>
      {step === 1 && renderStepOne()}
      {step === 2 && renderStepTwo()}
      {step === 3 && renderStepThree()}

      {/* Transaction PIN Modal */}
      <TransactionPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={processPayment}
      />

      {/* Set PIN Modal */}
      <SetPinModal
        isOpen={showSetPinModal}
        onClose={() => setShowSetPinModal(false)}
        onSuccess={() => setStep(2)}
      />
    </>
  );
};

export default TvServicePage;