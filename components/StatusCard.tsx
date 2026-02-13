
import React from 'react';

interface StatusCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
}

const StatusCard: React.FC<StatusCardProps> = ({ label, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  };

  return (
    <div className="glass p-4 md:p-5 rounded-[24px] md:rounded-[30px] flex items-center gap-3 md:gap-5 border border-white/5 hover:bg-white/[0.03] transition-all group">
      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl border ${colors[color]} group-hover:scale-110 transition-transform`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{label}</p>
        <p className="text-xl md:text-2xl font-black text-white mt-1 truncate italic leading-none">{value}</p>
      </div>
    </div>
  );
};

export default StatusCard;
