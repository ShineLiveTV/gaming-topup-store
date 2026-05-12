import { useState } from 'react';
import { useLocation } from 'wouter';
import { LogOut, Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

/**
 * Admin Dashboard
 * Design: Cyberpunk Neon Minimalism
 * Features: Product management, package editing, pricing control
 */

interface Package {
  id: string;
  name: string;
  amount: string;
  price: number;
  bonus?: string;
  popular?: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  packages: Package[];
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'mlbb',
    name: 'Mobile Legends: Bang Bang',
    description: 'Get instant MLBB diamonds for your favorite heroes and skins',
    packages: [
      { id: '50', name: '50 Diamonds', amount: '50💎', price: 0.99 },
      { id: '100', name: '100 Diamonds', amount: '100💎', price: 1.99 },
      { id: '300', name: '300 Diamonds', amount: '300💎', price: 4.99, bonus: '+30 bonus' },
      { id: '500', name: '500 Diamonds', amount: '500💎', price: 7.99, bonus: '+50 bonus', popular: true },
      { id: '1000', name: '1000 Diamonds', amount: '1000💎', price: 14.99, bonus: '+100 bonus' },
      { id: '2000', name: '2000 Diamonds', amount: '2000💎', price: 27.99, bonus: '+200 bonus' },
    ]
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    description: 'Unlock premium weapons, skins, and battle pass with UC',
    packages: [
      { id: '60', name: '60 UC', amount: '60 UC', price: 0.99 },
      { id: '300', name: '300 UC', amount: '300 UC', price: 4.99 },
      { id: '600', name: '600 UC', amount: '600 UC', price: 9.99, bonus: '+60 bonus', popular: true },
      { id: '1200', name: '1200 UC', amount: '1200 UC', price: 19.99, bonus: '+120 bonus' },
      { id: '2400', name: '2400 UC', amount: '2400 UC', price: 37.99, bonus: '+240 bonus' },
      { id: '3000', name: '3000 UC', amount: '3000 UC', price: 47.99, bonus: '+300 bonus' },
    ]
  },
  {
    id: 'telegram',
    name: 'Telegram Premium',
    description: 'Upgrade to Telegram Premium for exclusive features and unlimited storage',
    packages: [
      { id: '1month', name: '1 Month', amount: '1 Month', price: 4.99 },
      { id: '3months', name: '3 Months', amount: '3 Months', price: 12.99, bonus: 'Save 13%' },
      { id: '6months', name: '6 Months', amount: '6 Months', price: 24.99, bonus: 'Save 17%', popular: true },
      { id: '12months', name: '12 Months', amount: '12 Months', price: 44.99, bonus: 'Save 25%' },
    ]
  }
];

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { isAdminLoggedIn, logoutAdmin } = useAdmin();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [expandedProduct, setExpandedProduct] = useState<string | null>('mlbb');
  const [editingPackage, setEditingPackage] = useState<{ productId: string; packageId: string } | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editBonus, setEditBonus] = useState('');

  if (!isAdminLoggedIn) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/');
  };

  const handleEditPackage = (productId: string, pkg: Package) => {
    setEditingPackage({ productId, packageId: pkg.id });
    setEditPrice(pkg.price.toString());
    setEditBonus(pkg.bonus || '');
  };

  const handleSavePackage = () => {
    if (!editingPackage) return;

    setProducts(products.map(product => {
      if (product.id === editingPackage.productId) {
        return {
          ...product,
          packages: product.packages.map(pkg => {
            if (pkg.id === editingPackage.packageId) {
              return {
                ...pkg,
                price: parseFloat(editPrice),
                bonus: editBonus || undefined
              };
            }
            return pkg;
          })
        };
      }
      return product;
    }));

    setEditingPackage(null);
    setEditPrice('');
    setEditBonus('');
  };

  const handleTogglePopular = (productId: string, packageId: string) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          packages: product.packages.map(pkg => ({
            ...pkg,
            popular: pkg.id === packageId ? !pkg.popular : false
          }))
        };
      }
      return product;
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-magenta-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 glass-effect border-b border-cyan-500/20 sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold neon-cyan">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors text-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {products.map(product => (
              <div key={product.id} className="glass-effect border border-cyan-500/30 rounded-2xl overflow-hidden">
                {/* Product Header */}
                <button
                  onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-cyan-500/5 transition-colors"
                >
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-white mb-1">{product.name}</h2>
                    <p className="text-sm text-gray-400">{product.packages.length} packages</p>
                  </div>
                  {expandedProduct === product.id ? (
                    <ChevronUp className="w-6 h-6 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-cyan-400" />
                  )}
                </button>

                {/* Product Content */}
                {expandedProduct === product.id && (
                  <div className="border-t border-cyan-500/20 p-6">
                    <div className="space-y-4">
                      {product.packages.map(pkg => (
                        <div key={pkg.id} className="glass-effect border border-cyan-500/20 rounded-lg p-4">
                          {editingPackage?.productId === product.id && editingPackage?.packageId === pkg.id ? (
                            // Edit Mode
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Package Name
                                  </label>
                                  <input
                                    type="text"
                                    value={pkg.name}
                                    disabled
                                    className="w-full px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-gray-400 opacity-50"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Price ($)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(e.target.value)}
                                    className="w-full px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Bonus (optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={editBonus}
                                    onChange={(e) => setEditBonus(e.target.value)}
                                    placeholder="e.g., +50 bonus"
                                    className="w-full px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={handleSavePackage}
                                  className="flex-1 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors font-semibold"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingPackage(null)}
                                  className="flex-1 px-4 py-2 bg-gray-500/20 border border-gray-500/30 rounded-lg text-gray-400 hover:bg-gray-500/30 transition-colors font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-bold text-white mb-1">{pkg.name}</h3>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-cyan-400 font-semibold">${pkg.price.toFixed(2)}</span>
                                  {pkg.bonus && <span className="text-magenta-400">{pkg.bonus}</span>}
                                  {pkg.popular && <span className="text-yellow-400 font-semibold">⭐ Popular</span>}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleTogglePopular(product.id, pkg.id)}
                                  className={`px-3 py-2 rounded-lg transition-colors text-sm font-semibold ${
                                    pkg.popular
                                      ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                                      : 'bg-gray-500/10 border border-gray-500/20 text-gray-400 hover:bg-gray-500/20'
                                  }`}
                                >
                                  {pkg.popular ? '★ Popular' : '☆ Popular'}
                                </button>
                                <button
                                  onClick={() => handleEditPackage(product.id, pkg)}
                                  className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                                >
                                  <Edit2 size={18} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Save Notice */}
          <div className="mt-8 p-4 glass-effect border border-cyan-500/20 rounded-lg">
            <p className="text-sm text-gray-400">
              💡 <span className="text-cyan-400">Tip:</span> Changes are saved to your session. To persist changes permanently, integrate with a backend database.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
