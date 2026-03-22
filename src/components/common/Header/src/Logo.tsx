import React from 'react';

import { MedicineBoxOutlined } from '@ant-design/icons';

interface LogoProps {
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ onClick }) => {
  return (
    <div
      className="flex cursor-pointer items-center gap-3 transition-all duration-200 hover:opacity-80"
      onClick={onClick}
    >
      {/* Logo Square */}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg">
        <MedicineBoxOutlined className="text-xl text-white" />
      </div>

      {/* Title */}
      <div className="hidden sm:block">
        <h1 className="text-lg font-bold text-blue-700">SVYKHOA</h1>
      </div>
    </div>
  );
};

export default Logo;
