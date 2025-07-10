import { supabase } from './supabase';

// Network mappings for NaijaDataSub API
export const NETWORK_MAPPINGS = {
  'mtn': 1,
  'airtel': 2, // Verified correct mapping for Airtel
  'glo': 3, // Verified correct mapping for Glo
  '9mobile': 4,
} as const;

// Disco mappings for electricity
export const DISCO_MAPPINGS = {
  'ikeja': 'ikeja-electric',
  'eko': 'eko-electric',
  'ibadan': 'ibadan-electric',
  'abuja': 'abuja-electric',
} as const;

// Cable provider mappings
export const CABLE_MAPPINGS = {
  'dstv': 2,
  'gotv': 1,
  'startime': 3,
} as const;

class NaijaDataSubAPI {
  private getEdgeFunctionUrl() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('Supabase URL not configured');
    }
    return `${supabaseUrl}/functions/v1/naijadatasub-proxy`;
  }

  private async makeEdgeFunctionRequest(action: string, data: any) {
    try {
      const url = this.getEdgeFunctionUrl();
      const token = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!token) {
        throw new Error('Supabase anon key not configured');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, data }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API request failed');
      }

      return result.data;

    } catch (error: any) {
      console.error('Edge function request error:', error);
      
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to payment service. Please check your internet connection and try again.');
      }
      
      if (error.message.includes('NetworkError') || 
          error.message.includes('ERR_NETWORK') ||
          error.message.includes('ERR_INTERNET_DISCONNECTED')) {
        throw new Error('Network connection error. Please check your internet connection and try again.');
      }

      throw error;
    }
  }

  async buyCable(data: {
    cable_name: string;
    cable_plan: string;
    smart_card_number: string;
  }) {
    return await this.makeEdgeFunctionRequest('buy_cable', {
      cable_name: data.cable_name,
      cable_plan: data.cable_plan,
      smart_card_number: data.smart_card_number,
    });
  }

  async validateSmartCard(data: {
    cable_name: string;
    smart_card_number: string;
  }) {
    return await this.makeEdgeFunctionRequest('validate_smart_card', {
      cable_name: data.cable_name,
      smart_card_number: data.smart_card_number,
    });
  }
  async checkUserDetails() {
    return await this.makeEdgeFunctionRequest('check_user_details', {});
  }

  async buyAirtime(data: {
    network: keyof typeof NETWORK_MAPPINGS;
    amount: number;
    mobile_number: string;
    ported_number?: boolean;
  }) {
    return await this.makeEdgeFunctionRequest('buy_airtime', {
      network: data.network,
      amount: data.amount,
      mobile_number: data.mobile_number,
      ported_number: data.ported_number || true,
    });
  }

  async buyData(data: {
    network: keyof typeof NETWORK_MAPPINGS;
    mobile_number: string;
    plan: string; // This is the plan_id from data_plans table
    ported_number?: boolean;
  }) {
    return await this.makeEdgeFunctionRequest('buy_data', {
      network: data.network,
      mobile_number: data.mobile_number,
      plan: data.plan,
      ported_number: data.ported_number || true,
    });
  }

  async buyElectricity(data: {
    disco_name: keyof typeof DISCO_MAPPINGS;
    amount: number;
    meter_number: string;
    meter_type: 'prepaid' | 'postpaid';
  }) {
    return await this.makeEdgeFunctionRequest('buy_electricity', {
      disco_name: data.disco_name,
      amount: data.amount,
      meter_number: data.meter_number,
      meter_type: data.meter_type,
    });
  }

  async validateMeter(data: {
    disco_name: keyof typeof DISCO_MAPPINGS;
    meter_number: string;
    meter_type: 'prepaid' | 'postpaid';
  }) {
    return await this.makeEdgeFunctionRequest('validate_meter', {
      disco_name: data.disco_name,
      meter_number: data.meter_number,
      meter_type: data.meter_type,
    });
  }

  async buyCable(data: {
    cable_name: string;
    cable_plan: string;
    smart_card_number: string;
  }) {
    return await this.makeEdgeFunctionRequest('buy_cable', {
      cable_name: data.cable_name,
      cable_plan: data.cable_plan,
      smart_card_number: data.smart_card_number,
    });
  }

  async validateSmartCard(data: {
    cable_name: string;
    smart_card_number: string;
  }) {
    return await this.makeEdgeFunctionRequest('validate_smart_card', {
      cable_name: data.cable_name,
      smart_card_number: data.smart_card_number,
    });
  }
}

export const naijadatasubAPI = new NaijaDataSubAPI();