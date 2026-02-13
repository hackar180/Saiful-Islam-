
import React from 'react';

interface StatusCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ label, value, icon, color }) => (
  <div className="glass p-3 md:p-5 rounded-[20px] md:rounded-[30px] flex items-center gap-3 md:gap-5 border border-white/5 hover:bg-white/[0.03] transition-all group">
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20 group-hover:scale-110 transition-transform`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{label}</p>
      <p className="text-lg md:text-2xl font-black text-white mt-0.5 md:mt-1 truncate italic leading-none">{value}</p>
    </div>
  </div>
);

export default StatusCard;
