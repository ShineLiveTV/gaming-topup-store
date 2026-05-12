import { useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/**
 * Home Page - Mobile App Style Grid Layout
 * Design: Cyberpunk Neon Minimalism
 * Features: Category filters, product grid, search functionality
 */

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
  description: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'mlbb',
    name: 'Mobile Legends: Bang Bang',
    category: 'mobile',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663614362943/jsNKFDeSkjcXUUS3CSt8iF/mlbb-card-FjFN9mujNhmCcVyiEyEMzc.webp',
    price: '$2.99',
    description: 'Get instant MLBB diamonds for your favorite heroes'
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    category: 'mobile',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663614362943/jsNKFDeSkjcXUUS3CSt8iF/pubg-card-ZCWCyTi7hXwCj7shXDgH7j.webp',
    price: '$3.99',
    description: 'Unlock premium weapons and skins instantly'
  },
  {
    id: 'telegram',
    name: 'Telegram Premium',
    category: 'subscription',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663614362943/jsNKFDeSkjcXUUS3CSt8iF/telegram-card-ZXL5vv448oBannzZhs98i6.webp',
    price: '$4.99',
    description: 'Upgrade to Telegram Premium for exclusive features'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'mobile', label: 'Mobile Game' },
  { id: 'pc', label: 'PC Game' },
  { id: 'console', label: 'Console Game' }
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Background Effects */}
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-magenta-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass-effect border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500/60 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-3">ရွေးချယ်ပါ</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2 rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-cyan-500 text-black font-semibold'
                      : 'glass-effect border border-cyan-500/30 text-gray-300 hover:border-cyan-500/60'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-4">ရွေးချယ်ခွင့်</p>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No products found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [, navigate] = useLocation();

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="group relative">
      {/* Card Container */}
      <div className="glass-effect border border-cyan-500/30 rounded-2xl overflow-hidden hover:border-cyan-500/60 transition-all duration-300 h-full flex flex-col shadow-lg hover:shadow-cyan-500/20 hover:shadow-2xl cursor-pointer" onClick={handleViewDetails}>
        {/* Image Container */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-cyan-500/10 to-magenta-500/10">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Neon Border Effect */}
          <div className="absolute inset-0 border border-cyan-400/0 group-hover:border-cyan-400/30 transition-all duration-300 rounded-2xl" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-5 flex flex-col">
          <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors text-sm md:text-base">
            {product.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-400 mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Price and Button */}
          <div className="mt-auto">
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-xs md:text-sm font-semibold text-gray-400">Starting from</span>
            </div>
            <div className="mb-4">
              <span className="text-xl md:text-2xl font-bold text-cyan-400">{product.price}</span>
            </div>
            <button onClick={handleViewDetails} className="w-full btn-neon flex items-center justify-center gap-2 py-2 text-sm md:text-base font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              <ShoppingCart size={18} />
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
