import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Check, X, User, Server, Hash, Search, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useUser } from '@/contexts/UserContext';

interface Package {
  id: string;
  name: string;
  amount: string;
  price: number;
  bonus?: string;
  popular?: boolean;
}

interface ProductData {
  id: string;
  name: string;
  image: string;
  description: string;
  hasServer?: boolean;
  packages: Package[];
}

const PRODUCTS_DATA: Record<string, ProductData> = {
  mlbb: {
    id: 'mlbb',
    name: 'Mobile Legends: Bang Bang',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663614362943/jsNKFDeSkjcXUUS3CSt8iF/mlbb-card-FjFN9mujNhmCcVyiEyEMzc.webp',
    description: 'Get instant MLBB diamonds for your favorite heroes and skins',
    hasServer: true,
    packages: [
      { id: '50', name: '50 Diamonds', amount: '50💎', price: 0.99 },
      { id: '100', name: '100 Diamonds', amount: '100💎', price: 1.99 },
      { id: '300', name: '300 Diamonds', amount: '300💎', price: 4.99, bonus: '+30 bonus' },
      { id: '500', name: '500 Diamonds', amount: '500💎', price: 7.99, bonus: '+50 bonus', popular: true },
      { id: '1000', name: '1000 Diamonds', amount: '1000💎', price: 14.99, bonus: '+100 bonus' },
      { id: '2000', name: '2000 Diamonds', amount: '2000💎', price: 27.99, bonus: '+200 bonus' },
    ]
  },
  pubg: {
    id: 'pubg',
    name: 'PUBG Mobile',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663614362943/jsNKFDeSkjcXUUS3CSt8iF/pubg-card-ZCWCyTi7hXwCj7shXDgH7j.webp',
    description: 'Unlock premium weapons, skins, and battle pass with UC',
    hasServer: false,
    packages: [
      { id: '60', name: '60 UC', amount: '60 UC', price: 0.99 },
      { id: '300', name: '300 UC', amount: '300 UC', price: 4.99 },
      { id: '600', name: '600 UC', amount: '600 UC', price: 9.99, bonus: '+60 bonus', popular: true },
      { id: '1200', name: '1200 UC', amount: '1200 UC', price: 19.99, bonus: '+120 bonus' },
      { id: '2400', name: '2400 UC', amount: '2400 UC', price: 37.99, bonus: '+240 bonus' },
      { id: '3000', name: '3000 UC', amount: '3000 UC', price: 47.99, bonus: '+300 bonus' },
    ]
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram Premium',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663614362943/jsNKFDeSkjcXUUS3CSt8iF/telegram-card-ZXL5vv448oBannzZhs98i6.webp',
    description: 'Upgrade to Telegram Premium for exclusive features and unlimited storage',
    hasServer: false,
    packages: [
      { id: '1month', name: '1 Month', amount: '1 Month', price: 4.99 },
      { id: '3months', name: '3 Months', amount: '3 Months', price: 12.99, bonus: 'Save 13%' },
      { id: '6months', name: '6 Months', amount: '6 Months', price: 24.99, bonus: 'Save 17%', popular: true },
      { id: '12months', name: '12 Months', amount: '12 Months', price: 44.99, bonus: 'Save 25%' },
    ]
  }
};

export default function ProductDetail({ productId }: { productId: string }) {
  const [, navigate] = useLocation();
  const { user, isLoggedIn } = useUser();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const [gameId, setGameId] = useState('');
  const [serverId, setServerId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const product = PRODUCTS_DATA[productId];
  const selectedPkg = product?.packages.find(p => p.id === selectedPackage);

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Product not found</p>
          <button onClick={() => navigate('/')} className="btn-neon">Back to Home</button>
        </div>
      </div>
    );
  }

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setShowOrderForm(true);
    setVerifiedName('');
    setVerifyError('');
  };

  const handleVerifyId = async () => {
    if (!gameId || (product.hasServer && !serverId)) {
      setVerifyError('Game ID နှင့် Server ID ထည့်ပါ');
      return;
    }
    setVerifying(true);
    setVerifyError('');
    setVerifiedName('');

    try {
      // MLBB ID verification via third-party API
      const response = await fetch(
        `https://api.isan.eu.org/nickname/ml?id=${gameId}&zone=${serverId}`
      );
      const data = await response.json();

      if (data.success && data.name) {
        setVerifiedName(data.name);
      } else {
        setVerifyError('ID မှားနေသည် သို့မဟုတ် ရှာမတွေ့ပါ');
      }
    } catch (err) {
      setVerifyError('စစ်ဆေးမရပါ။ ထပ်စမ်းပါ');
    } finally {
      setVerifying(false);
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedName && product.hasServer) {
      setVerifyError('Game ID အရင်စစ်ဆေးပါ');
      return;
    }
    setOrderSuccess(true);
    setTimeout(() => {
      setShowOrderForm(false);
      setOrderSuccess(false);
      setGameId('');
      setServerId('');
      setVerifiedName('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-magenta-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 glass-effect border-b border-cyan-500/20 sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-cyan-400" />
          </button>
          <h1 className="text-xl font-bold neon-cyan">{product.name}</h1>
        </div>
      </div>

      <main className="relative z-10 pt-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="mb-6 rounded-2xl overflow-hidden glass-effect border border-cyan-500/30 h-64 md:h-80">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-300 text-center md:text-lg">{product.description}</p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center neon-cyan">Select Your Package</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.packages.map(pkg => (
                <button key={pkg.id} onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative p-4 rounded-xl transition-all duration-300 text-left ${
                    selectedPackage === pkg.id
                      ? 'glass-effect border-2 border-cyan-400 shadow-lg shadow-cyan-500/50'
                      : 'glass-effect border border-cyan-500/30 hover:border-cyan-500/60'
                  } ${pkg.popular ? 'ring-2 ring-magenta-500/50' : ''}`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-magenta-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                      POPULAR
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white">{pkg.name}</h3>
                    {selectedPackage === pkg.id && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-xl font-bold text-cyan-400 mb-1">{pkg.amount}</p>
                  {pkg.bonus && <p className="text-xs text-magenta-400 mb-2 font-semibold">{pkg.bonus}</p>}
                  <p className="text-lg font-bold text-white">${pkg.price.toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedPackage && (
            <div className="flex justify-center mb-12">
              <button onClick={handleBuyNow}
                className="btn-neon flex items-center gap-2 px-8 py-3 text-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                <ShoppingCart size={20} />
                Buy Now - ${selectedPkg?.price.toFixed(2)}
              </button>
            </div>
          )}

          <div className="glass-effect border border-cyan-500/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 neon-cyan">Why Choose Us?</h3>
            <ul className="space-y-3">
              {['Instant delivery - Credits added within seconds', '100% Secure - All transactions are encrypted', "24/7 Customer Support - We're always here to help", 'Multiple Payment Methods - KBZPay, WavePay, KPay'].map(f => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {showOrderForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="glass-effect border-2 border-cyan-500/50 rounded-2xl p-6 w-full max-w-md">
            {orderSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-magenta-500 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold neon-cyan mb-2">အော်ဒါ တင်ပြီးပြီ!</h3>
                <p className="text-gray-400">မကြာမီ ဆောင်ရွက်ပေးပါမည်</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold neon-cyan">Order Details</h3>
                  <button onClick={() => setShowOrderForm(false)} className="text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mb-6">
                  <p className="text-sm text-gray-400">Selected Package</p>
                  <p className="font-bold text-cyan-400">{selectedPkg?.name} — ${selectedPkg?.price.toFixed(2)}</p>
                </div>

                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">သင့်နာမည်</label>
                    <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-3">
                      <User size={16} className="text-cyan-400" />
                      <span className="text-white">{user?.displayName || user?.email || 'Player'}</span>
                    </div>
                  </div>

                  {/* Game ID */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Game ID</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Game ID ထည့်ပါ" value={gameId}
                        onChange={e => { setGameId(e.target.value); setVerifiedName(''); setVerifyError(''); }} required
                        className="w-full pl-10 pr-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400" />
                    </div>
                  </div>

                  {/* Server ID (MLBB only) */}
                  {product.hasServer && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Server ID</label>
                      <div className="relative">
                        <Server className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Server ID ထည့်ပါ" value={serverId}
                          onChange={e => { setServerId(e.target.value); setVerifiedName(''); setVerifyError(''); }} required
                          className="w-full pl-10 pr-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400" />
                      </div>
                    </div>
                  )}

                  {/* Verify Button */}
                  {product.hasServer && !verifiedName && (
                    <button type="button" onClick={handleVerifyId} disabled={verifying || !gameId || !serverId}
                      className="w-full py-3 border border-cyan-500/50 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      {verifying ? (
                        <><Loader2 size={18} className="animate-spin" /> စစ်ဆေးနေသည်...</>
                      ) : (
                        <><Search size={18} /> Game ID စစ်ဆေးမည်</>
                      )}
                    </button>
                  )}

                  {/* Verify Error */}
                  {verifyError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-400 text-sm">{verifyError}</p>
                    </div>
                  )}

                  {/* Verified Name */}
                  {verifiedName && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-xs text-gray-400">ကစားသမားအမည်</p>
                        <p className="font-bold text-green-400 text-lg">{verifiedName}</p>
                      </div>
                    </div>
                  )}

                  {/* Order Button - only show after verification for MLBB */}
                  {(!product.hasServer || verifiedName) && (
                    <button type="submit"
                      className="w-full btn-neon py-3 font-semibold flex items-center justify-center gap-2">
                      <ShoppingCart size={18} />
                      အော်ဒါ တင်မည်
                    </button>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
