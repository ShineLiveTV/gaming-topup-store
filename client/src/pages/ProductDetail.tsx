import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { useLocation } from 'wouter';

/**
 * Product Detail Page
 * Design: Cyberpunk Neon Minimalism
 * Features: Package selection, pricing tiers, buy functionality
 */

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
  packages: Package[];
}

const PRODUCTS_DATA: Record<string, ProductData> = {
  mlbb: {
    id: 'mlbb',
    name: 'Mobile Legends: Bang Bang',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663614362943/jsNKFDeSkjcXUUS3CSt8iF/mlbb-card-FjFN9mujNhmCcVyiEyEMzc.webp',
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
  pubg: {
    id: 'pubg',
    name: 'PUBG Mobile',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663614362943/jsNKFDeSkjcXUUS3CSt8iF/pubg-card-ZCWCyTi7hXwCj7shXDgH7j.webp',
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
  telegram: {
    id: 'telegram',
    name: 'Telegram Premium',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663614362943/jsNKFDeSkjcXUUS3CSt8iF/telegram-card-ZXL5vv448oBannzZhs98i6.webp',
    description: 'Upgrade to Telegram Premium for exclusive features and unlimited storage',
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
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const product = PRODUCTS_DATA[productId];

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Product not found</p>
          <button
            onClick={() => navigate('/')}
            className="btn-neon"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-magenta-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 glass-effect border-b border-cyan-500/20 sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-cyan-400" />
          </button>
          <h1 className="text-xl font-bold neon-cyan">{product.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-8 pb-20">
        <div className="container mx-auto px-4">
          {/* Product Image and Info */}
          <div className="mb-12">
            <div className="mb-6 rounded-2xl overflow-hidden glass-effect border border-cyan-500/30 h-64 md:h-80">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-gray-300 text-center md:text-lg">{product.description}</p>
          </div>

          {/* Packages Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center neon-cyan">Select Your Package</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.packages.map(pkg => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative p-4 rounded-xl transition-all duration-300 ${
                    selectedPackage === pkg.id
                      ? 'glass-effect border-2 border-cyan-400 shadow-lg shadow-cyan-500/50'
                      : 'glass-effect border border-cyan-500/30 hover:border-cyan-500/60'
                  } ${pkg.popular ? 'ring-2 ring-magenta-500/50' : ''}`}
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-magenta-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                      POPULAR
                    </div>
                  )}

                  {/* Content */}
                  <div className="text-left">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-white text-lg">{pkg.name}</h3>
                      {selectedPackage === pkg.id && (
                        <Check className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>

                    <p className="text-2xl font-bold text-cyan-400 mb-2">{pkg.amount}</p>

                    {pkg.bonus && (
                      <p className="text-sm text-magenta-400 mb-3 font-semibold">{pkg.bonus}</p>
                    )}

                    <p className="text-xl font-bold text-white">${pkg.price.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Buy Button */}
          {selectedPackage && (
            <div className="flex justify-center mb-12">
              <button className="btn-neon flex items-center gap-2 px-8 py-3 text-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                <ShoppingCart size={20} />
                Buy Now - ${product.packages.find(p => p.id === selectedPackage)?.price.toFixed(2)}
              </button>
            </div>
          )}

          {/* Features */}
          <div className="glass-effect border border-cyan-500/30 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold mb-4 neon-cyan">Why Choose Us?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Instant delivery - Credits added within seconds</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">100% Secure - All transactions are encrypted</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">24/7 Customer Support - We're always here to help</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Multiple Payment Methods - KBZPay, WavePay, KPay</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
