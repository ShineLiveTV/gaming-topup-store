import { Mail, MessageCircle, Facebook } from 'lucide-react';

/**
 * Footer Component
 * Design: Cyberpunk Neon Minimalism
 */

export default function Footer() {
  return (
    <footer className="glass-effect border-t border-cyan-500/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded flex items-center justify-center">
                <span className="text-white font-bold">⚡</span>
              </div>
              <span className="text-lg font-bold neon-cyan">GameTopUp</span>
            </div>
            <p className="text-sm text-gray-400">
              Instant & secure digital top-ups for your favorite games
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Home</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Products</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">How It Works</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">FAQ</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://t.me/gametopup" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2">
                  <MessageCircle size={16} /> Telegram Channel
                </a>
              </li>
              <li>
                <a href="https://facebook.com/gametopup" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2">
                  <Facebook size={16} /> Facebook Page
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#privacy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#terms" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Terms of Service</a></li>
              <li>
                <a href="mailto:support@gametopup.com" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2">
                  <Mail size={16} /> Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-cyan-500/20 pt-8">
          <p className="text-center text-sm text-gray-500">
            © 2026 GameTopUp. All rights reserved. | Secure • Fast • Trusted
          </p>
        </div>
      </div>
    </footer>
  );
}
