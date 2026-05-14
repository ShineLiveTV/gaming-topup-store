import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Check, X, User, Server, Hash, Search, Loader2, AtSign, ExternalLink, Copy } from 'lucide-react';
import { useLocation } from 'wouter';
import { useUser } from '@/contexts/UserContext';
import { saveOrder, formatMMK, USD_TO_MMK } from '@/lib/firebase';

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
  verifyType: 'mlbb' | 'pubg' | 'telegram' | 'none';
  packages: Package[];
}

const PRODUCTS_DATA: Record<string, ProductData> = {
  mlbb: {
    id: 'mlbb',
    name: 'Mobile Legends: Bang Bang',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663614362943/jsNKFDeSkjcXUUS3CSt8iF/mlbb-card-FjFN9mujNhmCcVyiEyEMzc.webp',
    description: 'Get instant MLBB diamonds for your favorite heroes and skins',
    hasServer: true,
    verifyType: 'mlbb',
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
    verifyType: 'pubg',
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
    verifyType: 'telegram',
    packages: [
      { id: '1month', name: '1 Month', amount: '1 Month', price: 4.99 },
      { id: '3months', name: '3 Months', amount: '3 Months', price: 12.99, bonus: 'Save 13%' },
      { id: '6months', name: '6 Months', amount: '6 Months', price: 24.99, bonus: 'Save 17%', popular: true },
      { id: '12months', name: '12 Months', amount: '12 Months', price: 44.99, bonus: 'Save 25%' },
    ]
  }
};

// Payment accounts — ဒီနေရာမှာ သင့် KBZPay/WavePay number ထည့်ပါ
const PAYMENT_INFO = {
  kbzpay: '09xxxxxxxxx',   // ← သင့် KBZPay number
  wavepay: '09xxxxxxxxx',  // ← သင့် WavePay number
  name: 'သင့်နာမည်',        // ← သင့်နာမည်
};

type Step = 'form' | 'payment' | 'success';

export default function ProductDetail({ productId }: { productId: string }) {
  const [, navigate] = useLocation();
  const { user, isLoggedIn } = useUser();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [step, setStep] = useState<Step>('form');

  const [gameId, setGameId] = useState('');
  const [serverId, setServerId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<'kbzpay' | 'wavepay'>('kbzpay');
  const [copied, setCopied] = useState(false);

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
    if (!isLoggedIn) { navigate('/login'); return; }
    setShowOrderForm(true);
    setStep('form');
    setVerifiedName('');
    setVerifyError('');
    setConfirmed(false);
    setGameId('');
    setServerId('');
  };

  const handleVerifyMLBB = async () => {
    if (!gameId || !serverId) { setVerifyError('Game ID နှင့် Server ID ထည့်ပါ'); return; }
    setVerifying(true);
    setVerifyError('');
    setVerifiedName('');
    try {
      const res = await fetch(`https://api.isan.eu.org/nickname/ml?id=${gameId}&zone=${serverId}`);
      const data = await res.json();
      if (data.success && data.name) {
        setVerifiedName(data.name);
      } else {
        setVerifyError('ID မှားနေသည် သို့မဟုတ် ရှာမတွေ့ပါ');
      }
    } catch {
      setVerifyError('စစ်ဆေးမရပါ။ ထပ်စမ်းပါ');
    } finally {
      setVerifying(false);
    }
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg || !user) return;
    setSubmitting(true);
    try {
      const id = await saveOrder({
        userId: user.uid,
        userName: user.displayName || user.email || 'Player',
        userEmail: user.email || '',
        productId: product.id,
        productName: product.name,
        packageName: selectedPkg.name,
        price: selectedPkg.price,
        priceMMK: Math.round(selectedPkg.price * USD_TO_MMK),
        gameId,
        serverId: serverId || '',
        verifiedName: verifiedName || '',
        status: 'pending',
        createdAt: Date.now(),
      });
      setOrderId(id);
      setStep('payment');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentDone = () => {
    setStep('success');
    setTimeout(() => {
      setShowOrderForm(false);
      setStep('form');
      setGameId('');
      setServerId('');
      setVerifiedName('');
      setConfirmed(false);
      setSelectedPackage(null);
    }, 4000);
  };

  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const telegramUsername = gameId.replace('@', '').trim();
  const canOrder =
    product.verifyType === 'mlbb' ? !!verifiedName :
    product.verifyType === 'pubg' ? (!!gameId && confirmed) :
    product.verifyType === 'telegram' ? (!!telegramUsername && confirmed) :
    true;

  const mmkPrice = selectedPkg ? Math.round(selectedPkg.price * USD_TO_MMK) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-magenta-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
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

          {/* Packages */}
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
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-magenta-500 text-black px-3 py-1 rounded-full text-xs font-bold">POPULAR</div>
                  )}
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-white text-sm">{pkg.name}</h3>
                    {selectedPackage === pkg.id && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-lg font-bold text-cyan-400 mb-1">{pkg.amount}</p>
                  {pkg.bonus && <p className="text-xs text-magenta-400 mb-1 font-semibold">{pkg.bonus}</p>}
                  {/* MMK Price */}
                  <p className="text-base font-bold text-white">{formatMMK(pkg.price)}</p>
                  <p className="text-xs text-gray-500">${pkg.price.toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedPackage && (
            <div className="flex justify-center mb-12">
              <button onClick={handleBuyNow}
                className="btn-neon flex items-center gap-2 px-8 py-4 text-lg font-semibold">
                <ShoppingCart size={22} />
                Buy Now — {formatMMK(selectedPkg?.price || 0)}
              </button>
            </div>
          )}

          <div className="glass-effect border border-cyan-500/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 neon-cyan">Why Choose Us?</h3>
            <ul className="space-y-3">
              {['Instant delivery', '100% Secure', '24/7 Customer Support', 'KBZPay, WavePay'].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-gray-300">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-950 border-t-2 sm:border-2 border-cyan-500/60 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl max-h-[92vh] overflow-y-auto">

            {/* Step: SUCCESS */}
            {step === 'success' && (
              <div className="text-center py-12 px-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-magenta-500 flex items-center justify-center mb-4">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold neon-cyan mb-2">အော်ဒါ တင်ပြီးပြီ!</h3>
                <p className="text-gray-400 mb-2">Order ID: <span className="text-cyan-400 font-mono text-sm">{orderId.slice(0, 10)}</span></p>
                <p className="text-gray-400 text-sm">ငွေပေးချေမှု စစ်ဆေးပြီးနောက် မကြာမီ ဆောင်ရွက်ပေးပါမည်</p>
              </div>
            )}

            {/* Step: PAYMENT */}
            {step === 'payment' && selectedPkg && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">ငွေပေးချေမည်</h3>
                    <p className="text-xs text-gray-500 mt-1">Order ID: {orderId.slice(0, 10)}</p>
                  </div>
                  <button onClick={() => setShowOrderForm(false)}
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>

                {/* Amount */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6 text-center">
                  <p className="text-xs text-gray-400 mb-1">ပေးချေရမည့်ငွေ</p>
                  <p className="text-4xl font-bold text-white">{mmkPrice.toLocaleString()} <span className="text-2xl text-cyan-400">Ks</span></p>
                  <p className="text-sm text-gray-500 mt-1">{selectedPkg.name} — {product.name}</p>
                </div>

                {/* Payment Method */}
                <div className="flex gap-3 mb-6">
                  <button onClick={() => setSelectedPayment('kbzpay')}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${selectedPayment === 'kbzpay' ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400' : 'bg-gray-900 border border-gray-700 text-gray-400'}`}>
                    KBZPay
                  </button>
                  <button onClick={() => setSelectedPayment('wavepay')}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${selectedPayment === 'wavepay' ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400' : 'bg-gray-900 border border-gray-700 text-gray-400'}`}>
                    WavePay
                  </button>
                </div>

                {/* Account Number */}
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-2">{selectedPayment === 'kbzpay' ? 'KBZPay' : 'WavePay'} နံပါတ်</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-white font-mono">
                        {selectedPayment === 'kbzpay' ? PAYMENT_INFO.kbzpay : PAYMENT_INFO.wavepay}
                      </p>
                      <p className="text-sm text-gray-400">{PAYMENT_INFO.name}</p>
                    </div>
                    <button onClick={() => handleCopyNumber(selectedPayment === 'kbzpay' ? PAYMENT_INFO.kbzpay : PAYMENT_INFO.wavepay)}
                      className="flex items-center gap-1 px-3 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm hover:bg-cyan-500/30 transition-all">
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-6">
                  <p className="text-yellow-400 text-xs text-center">
                    ⚠️ ငွေလွှဲပြီးနောက် "ငွေပေးပြီးပါပြီ" ကို နှိပ်ပါ
                  </p>
                </div>

                <button onClick={handlePaymentDone}
                  className="w-full btn-neon py-4 font-bold text-lg flex items-center justify-center gap-2">
                  <Check size={20} />
                  ငွေပေးပြီးပါပြီ
                </button>
              </div>
            )}

            {/* Step: FORM */}
            {step === 'form' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Order Details</h3>
                    <p className="text-xs text-gray-500 mt-1">အချက်အလက်များ ဖြည့်ပါ</p>
                  </div>
                  <button onClick={() => setShowOrderForm(false)}
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>

                {/* Package */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6">
                  <p className="text-xs text-gray-400 mb-1">ရွေးချယ်ထားသော Package</p>
                  <p className="font-bold text-cyan-400 text-lg">{selectedPkg?.name}</p>
                  <p className="text-2xl font-bold text-white">{formatMMK(selectedPkg?.price || 0)}</p>
                  <p className="text-xs text-gray-500">${selectedPkg?.price.toFixed(2)}</p>
                </div>

                <form onSubmit={handleProceedToPayment} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">သင့်နာမည်</label>
                    <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3">
                      <User size={18} className="text-cyan-400" />
                      <span className="text-white font-medium">{user?.displayName || user?.email || 'Player'}</span>
                    </div>
                  </div>

                  {/* MLBB */}
                  {product.verifyType === 'mlbb' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Game ID <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                          <input type="text" placeholder="ဥပမာ - 123456789" value={gameId}
                            onChange={e => { setGameId(e.target.value); setVerifiedName(''); setVerifyError(''); }} required
                            className="w-full pl-12 pr-4 py-4 bg-gray-900 border-2 border-gray-700 focus:border-cyan-500 rounded-xl text-white text-lg placeholder-gray-600 focus:outline-none transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Server ID <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <Server className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-magenta-400" />
                          <input type="text" placeholder="ဥပမာ - 1234" value={serverId}
                            onChange={e => { setServerId(e.target.value); setVerifiedName(''); setVerifyError(''); }} required
                            className="w-full pl-12 pr-4 py-4 bg-gray-900 border-2 border-gray-700 focus:border-cyan-500 rounded-xl text-white text-lg placeholder-gray-600 focus:outline-none transition-all" />
                        </div>
                      </div>
                      {!verifiedName && (
                        <button type="button" onClick={handleVerifyMLBB} disabled={verifying || !gameId || !serverId}
                          className="w-full py-3 bg-gray-800 border border-cyan-500/50 rounded-xl text-cyan-400 font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2 disabled:opacity-40">
                          {verifying ? <><Loader2 size={18} className="animate-spin" /> စစ်ဆေးနေသည်...</> : <><Search size={18} /> Game ID စစ်ဆေးမည်</>}
                        </button>
                      )}
                      {verifyError && <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-3 text-center"><p className="text-red-400 text-sm">{verifyError}</p></div>}
                      {verifiedName && (
                        <div className="bg-green-500/10 border-2 border-green-500/40 rounded-xl p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"><Check className="w-5 h-5 text-green-400" /></div>
                          <div>
                            <p className="text-xs text-gray-400">ကစားသမားအမည် ✓</p>
                            <p className="font-bold text-green-400 text-xl">{verifiedName}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* PUBG */}
                  {product.verifyType === 'pubg' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">PUBG Player ID <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                          <input type="text" placeholder="ဥပမာ - 5123456789" value={gameId}
                            onChange={e => { setGameId(e.target.value); setConfirmed(false); }} required
                            className="w-full pl-12 pr-4 py-4 bg-gray-900 border-2 border-gray-700 focus:border-cyan-500 rounded-xl text-white text-lg placeholder-gray-600 focus:outline-none transition-all" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">PUBG Mobile → Profile → Player ID မှ ရယူပါ</p>
                      </div>
                      {gameId && (
                        <label className="flex items-start gap-3 cursor-pointer bg-gray-900 border border-gray-700 rounded-xl p-4" onClick={() => setConfirmed(!confirmed)}>
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${confirmed ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600'}`}>
                            {confirmed && <Check size={14} className="text-white" />}
                          </div>
                          <p className="text-sm text-gray-300">Player ID <span className="text-cyan-400 font-bold">{gameId}</span> သည် ကျွန်ုပ်၏ PUBG Mobile account မှန်ကန်ကြောင်း အတည်ပြုပါသည်</p>
                        </label>
                      )}
                    </>
                  )}

                  {/* Telegram */}
                  {product.verifyType === 'telegram' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Telegram Username <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                          <input type="text" placeholder="@username" value={gameId}
                            onChange={e => { setGameId(e.target.value); setConfirmed(false); }} required
                            className="w-full pl-12 pr-4 py-4 bg-gray-900 border-2 border-gray-700 focus:border-cyan-500 rounded-xl text-white text-lg placeholder-gray-600 focus:outline-none transition-all" />
                        </div>
                      </div>
                      {telegramUsername && (
                        <>
                          <a href={`https://t.me/${telegramUsername}`} target="_blank" rel="noopener noreferrer"
                            className="w-full py-3 bg-gray-800 border border-cyan-500/50 rounded-xl text-cyan-400 font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                            <ExternalLink size={18} /> t.me/{telegramUsername} ကို ဖွင့်ကြည့်ပါ
                          </a>
                          <label className="flex items-start gap-3 cursor-pointer bg-gray-900 border border-gray-700 rounded-xl p-4" onClick={() => setConfirmed(!confirmed)}>
                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${confirmed ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600'}`}>
                              {confirmed && <Check size={14} className="text-white" />}
                            </div>
                            <p className="text-sm text-gray-300"><span className="text-cyan-400 font-bold">@{telegramUsername}</span> သည် ကျွန်ုပ်၏ Telegram account မှန်ကန်ကြောင်း အတည်ပြုပါသည်</p>
                          </label>
                        </>
                      )}
                    </>
                  )}

                  {canOrder && (
                    <button type="submit" disabled={submitting}
                      className="w-full btn-neon py-4 font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50">
                      {submitting ? <><Loader2 size={20} className="animate-spin" /> လုပ်ဆောင်နေသည်...</> : <><ShoppingCart size={20} /> ငွေပေးချေမည် — {formatMMK(selectedPkg?.price || 0)}</>}
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
          }
