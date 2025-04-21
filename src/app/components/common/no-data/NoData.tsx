import React, { ReactNode } from 'react';

interface NoDataProps {
  children: ReactNode;
}

const NoData: React.FC<NoDataProps> = ({ children }) => {
  return (
    <p className="font-size-regular">{children}</p>
  );
};

export default NoData;
