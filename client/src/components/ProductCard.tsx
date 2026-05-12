import { useState } from 'react';

interface ProductCardProps {
  title: string;
  image: string;
  price: string;
  neonColor: 'cyan' | 'magenta' | 'lime' | 'orange';
  description: string;
}

const neonColors = {
  cyan: {
    border: 'border-cyan-500/50',
    glow: 'glow-cyan',
    text: 'text-cyan-400',
    shadow: 'shadow-cyan-500/50',
  },
  magenta: {
    border: 'border-magenta-500/50',
    glow: 'glow-magenta',
    text: 'text-magenta-400',
    shadow: 'shadow-magenta-500/50',
  },
  lime: {
    border: 'border-lime-500/50',
    glow: '',
    text: 'text-lime-400',
    shadow: 'shadow-lime-500/50',
  },
  orange: {
    border: 'border-orange-500/50',
    glow: '',
    text: 'text-orange-400',
    shadow: 'shadow-orange-500/50',
  },
};

export default function ProductCard({ title, image, price, neonColor, description }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = neonColors[neonColor];

  return (
    <div
      className={`glass-hover border-2 ${colors.border} overflow-hidden transition-all duration-300 ${
        isHovered ? 'transform scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
        <img 
          src={image} 
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`} />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-2 ${colors.text}`}>{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        
        {/* Price */}
        <div className="mb-4">
          <span className="text-gray-500 text-sm">Starting from</span>
          <p className={`text-2xl font-bold ${colors.text}`}>{price}</p>
        </div>

        {/* Button */}
        <button className="w-full btn-neon transition-all duration-300 hover:shadow-lg">
          Buy Now
        </button>
      </div>
    </div>
  );
}
