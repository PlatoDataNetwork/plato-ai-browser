import { X } from 'lucide-react';

interface TabProps {
  title: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  isLast?: boolean;
  index: number;
  onClose?: () => void;
  isOnlyTab?: boolean;  // Add this prop
}

export function Tab({ title, icon, isActive, onClick, isLast, index, onClose, isOnlyTab }: TabProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center px-2 cursor-pointer transition-all h-8 gap-1 min-w-[200px] rounded-md group ${
        isActive || isLast ? 'bg-[#3d4569]' : 'hover:bg-[#3d4569]'
      }`}
    >
      <div className="mr-1 relative">
        <div className={`${!isOnlyTab ? 'group-hover:opacity-0' : ''}`}>
          {icon}
        </div>
        {!isOnlyTab && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 hover:bg-[#4d5579] rounded flex items-center justify-center"
          >
            <X size={14} className="text-gray-400" />
          </div>
        )}
      </div>
      <span className={`text-[13px] ${isActive ? 'text-white' : 'text-gray-300'}`}>
        {title}
      </span>
    </div>
  );
}