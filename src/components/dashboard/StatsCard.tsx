
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: 'purple' | 'green' | 'blue' | 'yellow' | 'red';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  color,
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'purple':
        return 'bg-purple-500/20 text-purple-500';
      case 'green':
        return 'bg-green-500/20 text-green-500';
      case 'blue':
        return 'bg-blue-500/20 text-blue-500';
      case 'yellow':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'red':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-purple-500/20 text-purple-500';
    }
  };
  
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };
  
  return (
    <motion.div 
      whileHover={{ translateY: -5 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="p-6 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          <div className={`p-3 rounded-lg ${getColorClass()}`}>
            {icon}
          </div>
        </div>
        
        <div className={`mt-4 flex items-center gap-1 text-sm ${getChangeColor()}`}>
          {changeType === 'positive' && <ArrowUp className="h-3 w-3" />}
          {changeType === 'negative' && <ArrowDown className="h-3 w-3" />}
          <span>{change}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
