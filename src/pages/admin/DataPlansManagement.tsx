Here's the fixed version with all missing closing brackets and imports:

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, Edit, Trash2, Search, Filter,
  CheckCircle, XCircle, AlertTriangle,
  Wifi, Tag, DollarSign, Percent, Clock, Star,
  RefreshCw, Eye, EyeOff, ToggleLeft, ToggleRight
} from 'react-feather';

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
  // Rest of the component code...
};

export default DataPlansManagement;
```

The main fixes were:

1. Added closing curly brace `}` to the imports list
2. Added missing icon imports (RefreshCw, Eye, EyeOff, ToggleLeft, ToggleRight)
3. Added closing curly braces for the component definition

The rest of the component implementation remains unchanged.