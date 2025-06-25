import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Package, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Bell,
  User,
  Heart,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Truck,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Package2,
  ShoppingCart,
  FileText,
  Settings
} from 'lucide-react';

interface Medicine {
  id: string;
  productId: string;
  name: string;
  price: number;
  otcStatus: 'OTC' | 'A1' | 'A2' | 'B1' | 'B2';
  supplierId: string;
  quantity: number;
  description: string;
  imageUrl: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  reorderLevel: number;
  location: string;
  lastUpdated: string;
  costPrice: number;
  sellingPrice: number;
  supplierName: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired' | 'Near Expiry';
}

interface InventoryTransaction {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'EXPIRED' | 'RETURNED';
  quantity: number;
  date: string;
  reason: string;
  reference: string;
  user: string;
}

interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRY_WARNING' | 'EXPIRED';
  message: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  date: string;
}

const mockMedicines: Medicine[] = [
  {
    id: '1',
    productId: 'MED001',
    name: 'Paracetamol 500mg',
    price: 25.50,
    otcStatus: 'OTC',
    supplierId: 'SUP001',
    quantity: 100,
    description: 'Pain relief and fever reducer',
    imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    category: 'Pain Relief',
    manufacturer: 'PharmaCorp',
    batchNumber: 'PC2024001',
    expiryDate: '2025-12-31',
    reorderLevel: 50,
    location: 'A1-B2',
    lastUpdated: '2024-01-15',
    costPrice: 20.00,
    sellingPrice: 25.50,
    supplierName: 'MediSupply Ltd',
    status: 'In Stock'
  },
  {
    id: '2',
    productId: 'MED002',
    name: 'Amoxicillin 250mg',
    price: 45.00,
    otcStatus: 'A1',
    supplierId: 'SUP002',
    quantity: 25,
    description: 'Antibiotic for bacterial infections',
    imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    category: 'Antibiotics',
    manufacturer: 'MediSupply',
    batchNumber: 'MS2024002',
    expiryDate: '2025-08-15',
    reorderLevel: 30,
    location: 'B2-C1',
    lastUpdated: '2024-01-14',
    costPrice: 35.00,
    sellingPrice: 45.00,
    supplierName: 'PharmaDist Co',
    status: 'Low Stock'
  },
  {
    id: '3',
    productId: 'MED003',
    name: 'Ibuprofen 200mg',
    price: 30.00,
    otcStatus: 'A2',
    supplierId: 'SUP003',
    quantity: 0,
    description: 'Reduces fever and treats pain or inflammation',
    imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    category: 'Anti-inflammatory',
    manufacturer: 'HealthPlus',
    batchNumber: 'HP2024003',
    expiryDate: '2025-10-20',
    reorderLevel: 40,
    location: 'C1-D2',
    lastUpdated: '2024-01-13',
    costPrice: 24.00,
    sellingPrice: 30.00,
    supplierName: 'HealthCare Solutions',
    status: 'Out of Stock'
  },
  {
    id: '4',
    productId: 'MED004',
    name: 'Cetirizine 10mg',
    price: 18.75,
    otcStatus: 'OTC',
    supplierId: 'SUP001',
    quantity: 120,
    description: 'Antihistamine for allergies',
    imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    category: 'Antihistamines',
    manufacturer: 'AllergyFree',
    batchNumber: 'AF2024004',
    expiryDate: '2024-03-10',
    reorderLevel: 60,
    location: 'D2-E1',
    lastUpdated: '2024-01-12',
    costPrice: 15.00,
    sellingPrice: 18.75,
    supplierName: 'MediSupply Ltd',
    status: 'Near Expiry'
  },
  {
    id: '5',
    productId: 'MED005',
    name: 'Omeprazole 20mg',
    price: 55.25,
    otcStatus: 'B1',
    supplierId: 'SUP004',
    quantity: 75,
    description: 'Proton pump inhibitor for acid reflux',
    imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    category: 'Gastroenterology',
    manufacturer: 'GastroMed',
    batchNumber: 'GM2024005',
    expiryDate: '2023-12-22',
    reorderLevel: 35,
    location: 'E1-F2',
    lastUpdated: '2024-01-11',
    costPrice: 45.00,
    sellingPrice: 55.25,
    supplierName: 'Gastro Pharmaceuticals',
    status: 'Expired'
  },
  {
    id: '6',
    productId: 'MED006',
    name: 'Metformin 500mg',
    price: 42.80,
    otcStatus: 'B2',
    supplierId: 'SUP005',
    quantity: 90,
    description: 'Type 2 diabetes medication',
    imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    category: 'Diabetes',
    manufacturer: 'DiabetesCare',
    batchNumber: 'DC2024006',
    expiryDate: '2025-11-15',
    reorderLevel: 45,
    location: 'F2-G1',
    lastUpdated: '2024-01-10',
    costPrice: 35.00,
    sellingPrice: 42.80,
    supplierName: 'Diabetes Solutions Inc',
    status: 'In Stock'
  }
];

const mockTransactions: InventoryTransaction[] = [
  {
    id: 'TXN001',
    productId: 'MED001',
    type: 'IN',
    quantity: 50,
    date: '2024-01-15',
    reason: 'Stock replenishment',
    reference: 'PO-2024-001',
    user: 'John Doe'
  },
  {
    id: 'TXN002',
    productId: 'MED002',
    type: 'OUT',
    quantity: 25,
    date: '2024-01-14',
    reason: 'Sale',
    reference: 'INV-2024-045',
    user: 'Jane Smith'
  },
  {
    id: 'TXN003',
    productId: 'MED003',
    type: 'OUT',
    quantity: 80,
    date: '2024-01-13',
    reason: 'Bulk order',
    reference: 'INV-2024-044',
    user: 'Mike Johnson'
  },
  {
    id: 'TXN004',
    productId: 'MED005',
    type: 'EXPIRED',
    quantity: 15,
    date: '2024-01-12',
    reason: 'Expired stock removal',
    reference: 'EXP-2024-001',
    user: 'System'
  }
];

const mockAlerts: StockAlert[] = [
  {
    id: 'ALT001',
    productId: 'MED003',
    productName: 'Ibuprofen 200mg',
    type: 'OUT_OF_STOCK',
    message: 'Product is out of stock',
    priority: 'HIGH',
    date: '2024-01-13'
  },
  {
    id: 'ALT002',
    productId: 'MED002',
    productName: 'Amoxicillin 250mg',
    type: 'LOW_STOCK',
    message: 'Stock level below reorder point',
    priority: 'MEDIUM',
    date: '2024-01-14'
  },
  {
    id: 'ALT003',
    productId: 'MED004',
    productName: 'Cetirizine 10mg',
    type: 'EXPIRY_WARNING',
    message: 'Product expires in 2 months',
    priority: 'MEDIUM',
    date: '2024-01-12'
  },
  {
    id: 'ALT004',
    productId: 'MED005',
    productName: 'Omeprazole 20mg',
    type: 'EXPIRED',
    message: 'Product has expired',
    priority: 'HIGH',
    date: '2024-01-11'
  }
];

type ActiveTab = 'medicine-management' | 'inventory' | 'suppliers' | 'reports';
type InventoryView = 'overview' | 'stock-levels' | 'transactions' | 'alerts' | 'reorder' | 'analytics';

function App() {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const [transactions] = useState<InventoryTransaction[]>(mockTransactions);
  const [alerts] = useState<StockAlert[]>(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOTCFilter, setSelectedOTCFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<ActiveTab>('inventory');
  const [inventoryView, setInventoryView] = useState<InventoryView>('overview');

  const getOTCStatusColor = (status: string) => {
    switch (status) {
      case 'OTC':
        return 'bg-gray-900 text-white';
      case 'A1':
        return 'bg-blue-100 text-blue-800';
      case 'A2':
        return 'bg-green-100 text-green-800';
      case 'B1':
        return 'bg-yellow-100 text-yellow-800';
      case 'B2':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Near Expiry':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMedicines = useMemo(() => {
    return medicines.filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.supplierId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesOTC = selectedOTCFilter === 'All' || medicine.otcStatus === selectedOTCFilter;
      const matchesStatus = selectedStatusFilter === 'All' || medicine.status === selectedStatusFilter;
      
      return matchesSearch && matchesOTC && matchesStatus;
    });
  }, [medicines, searchTerm, selectedOTCFilter, selectedStatusFilter]);

  const inventoryStats = useMemo(() => {
    const totalProducts = medicines.length;
    const totalValue = medicines.reduce((sum, med) => sum + (med.quantity * med.costPrice), 0);
    const lowStockItems = medicines.filter(med => med.quantity <= med.reorderLevel).length;
    const outOfStockItems = medicines.filter(med => med.quantity === 0).length;
    const expiredItems = medicines.filter(med => med.status === 'Expired').length;
    const nearExpiryItems = medicines.filter(med => med.status === 'Near Expiry').length;
    
    return {
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStockItems,
      expiredItems,
      nearExpiryItems
    };
  }, [medicines]);

  const handleDeleteMedicine = (id: string) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(prev => prev.filter(med => med.id !== id));
    }
  };

  const renderInventoryOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalProducts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">Rs. {inventoryStats.totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStockItems}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStockItems}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setInventoryView('stock-levels')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package2 className="h-5 w-5 text-blue-600" />
            <span className="font-medium">View Stock Levels</span>
          </button>
          <button 
            onClick={() => setInventoryView('reorder')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-green-600" />
            <span className="font-medium">Reorder Management</span>
          </button>
          <button 
            onClick={() => setInventoryView('alerts')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Bell className="h-5 w-5 text-red-600" />
            <span className="font-medium">View Alerts ({alerts.length})</span>
          </button>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">{alert.productName}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                  <span className="text-sm text-gray-500">{alert.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStockLevels = () => (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-blue-600">Stock Level Management</h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by medicine name, product ID, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[160px]"
            >
              <option value="All">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Expired">Expired</option>
              <option value="Near Expiry">Near Expiry</option>
            </select>
            
            <select
              value={selectedOTCFilter}
              onChange={(e) => setSelectedOTCFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[160px]"
            >
              <option value="All">All OTC</option>
              <option value="OTC">OTC</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock Levels Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-blue-600">
            Stock Levels ({filteredMedicines.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Current Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reorder Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Expiry Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMedicines.map((medicine) => (
                <tr key={medicine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={medicine.imageUrl}
                        alt={medicine.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{medicine.name}</p>
                        <p className="text-sm text-gray-500">{medicine.productId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-lg font-bold ${
                      medicine.quantity === 0 ? 'text-red-600' : 
                      medicine.quantity <= medicine.reorderLevel ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {medicine.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{medicine.reorderLevel}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{medicine.location}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(medicine.status)}`}>
                      {medicine.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{medicine.expiryDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      Rs. {(medicine.quantity * medicine.costPrice).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-blue-600">Recent Transactions</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reason</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reference</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{transaction.productId}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      transaction.type === 'IN' ? 'bg-green-100 text-green-800' :
                      transaction.type === 'OUT' ? 'bg-blue-100 text-blue-800' :
                      transaction.type === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{transaction.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{transaction.reference}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{transaction.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-blue-600">Stock Alerts ({alerts.length})</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    alert.type === 'OUT_OF_STOCK' || alert.type === 'EXPIRED' ? 'bg-red-100' :
                    alert.type === 'LOW_STOCK' || alert.type === 'EXPIRY_WARNING' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {alert.type === 'OUT_OF_STOCK' ? <XCircle className="h-5 w-5 text-red-600" /> :
                     alert.type === 'EXPIRED' ? <XCircle className="h-5 w-5 text-red-600" /> :
                     alert.type === 'LOW_STOCK' ? <AlertTriangle className="h-5 w-5 text-yellow-600" /> :
                     <Clock className="h-5 w-5 text-yellow-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{alert.productName}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-500">Product ID: {alert.productId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                  <span className="text-sm text-gray-500">{alert.date}</span>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <CheckCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReorderManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-600">Reorder Management</h3>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Generate Purchase Order
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Current Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reorder Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Suggested Qty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order Qty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Supplier</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cost</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medicines.filter(med => med.quantity <= med.reorderLevel).map((medicine) => (
                <tr key={medicine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={medicine.imageUrl}
                        alt={medicine.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{medicine.name}</p>
                        <p className="text-sm text-gray-500">{medicine.productId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-red-600 font-bold">{medicine.quantity}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{medicine.reorderLevel}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-blue-600">
                      {medicine.reorderLevel * 2}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      defaultValue={medicine.reorderLevel * 2}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{medicine.supplierName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      Rs. {(medicine.costPrice * medicine.reorderLevel * 2).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      Add to Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Inventory Turnover</h4>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">2.4x</p>
          <p className="text-sm text-green-600">+12% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Average Days to Sell</h4>
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">45 days</p>
          <p className="text-sm text-blue-600">-3 days from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Stock Accuracy</h4>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">98.5%</p>
          <p className="text-sm text-green-600">+1.2% from last month</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Category Performance</h4>
        <div className="space-y-4">
          {['Pain Relief', 'Antibiotics', 'Cardiovascular', 'Diabetes'].map((category, index) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{category}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${85 - index * 15}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{85 - index * 15}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInventoryContent = () => {
    switch (inventoryView) {
      case 'overview':
        return renderInventoryOverview();
      case 'stock-levels':
        return renderStockLevels();
      case 'transactions':
        return renderTransactions();
      case 'alerts':
        return renderAlerts();
      case 'reorder':
        return renderReorderManagement();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderInventoryOverview();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'medicine-management':
        return (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-blue-700">Medicine Product Management</h1>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 shadow-sm">
                <Plus className="h-5 w-5" />
                Add Product
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-blue-600">Search & Filter Products</h2>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by medicine name, product ID, or supplier ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="relative">
                  <select
                    value={selectedOTCFilter}
                    onChange={(e) => setSelectedOTCFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[160px] appearance-none cursor-pointer"
                  >
                    <option value="All">Filter by OTC</option>
                    <option value="OTC">OTC</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-blue-600">
                  All Products ({filteredMedicines.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Medicine Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price (Rs.)</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">OTC Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Supplier ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMedicines.map((medicine) => (
                      <tr key={medicine.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                            <img
                              src={medicine.imageUrl}
                              alt={medicine.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">{medicine.productId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                            {medicine.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">Rs. {medicine.price.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getOTCStatusColor(medicine.otcStatus)}`}>
                            {medicine.otcStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{medicine.supplierId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">{medicine.quantity}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 max-w-xs truncate block">
                            {medicine.description}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteMedicine(medicine.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredMedicines.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No medicines found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-blue-700">Comprehensive Inventory Management</h1>
              <div className="flex gap-3">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import
                </button>
              </div>
            </div>

            {/* Inventory Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'overview', label: 'Overview', icon: BarChart3 },
                  { key: 'stock-levels', label: 'Stock Levels', icon: Package },
                  { key: 'transactions', label: 'Transactions', icon: FileText },
                  { key: 'alerts', label: 'Alerts', icon: Bell },
                  { key: 'reorder', label: 'Reorder', icon: ShoppingCart },
                  { key: 'analytics', label: 'Analytics', icon: Activity }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setInventoryView(key as InventoryView)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      inventoryView === key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {renderInventoryContent()}
          </div>
        );

      case 'suppliers':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-blue-700">Supplier Management</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <User className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Supplier Directory</h2>
                <p className="text-gray-600">Manage supplier relationships and procurement</p>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-blue-700">Reports & Analytics</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <Activity className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Business Intelligence</h2>
                <p className="text-gray-600">Comprehensive reports and analytics dashboard</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Life Care</h1>
                <p className="text-xs text-blue-200">Channeling Services</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('medicine-management')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === 'medicine-management'
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
                }`}
              >
                Medicine Management
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === 'inventory'
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('suppliers')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === 'suppliers'
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
                }`}
              >
                Suppliers
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === 'reports'
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
                }`}
              >
                Reports
              </button>
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-blue-200 hover:text-white transition-colors duration-200">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-blue-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {alerts.length}
                </span>
              </button>
              <div className="bg-blue-700 rounded-full p-2">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;