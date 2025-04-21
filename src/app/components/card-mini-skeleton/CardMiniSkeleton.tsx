import React from 'react';
import { Box } from '@mui/material';
import './CardMiniSkeleton.scss';

const CardMiniSkeleton: React.FC = () => {
  return (
    <Box className="box" display="flex" flexDirection="row" width="100%" gap={3}>
      {[...Array(4)].map((_, rowIndex) => (
        <Box key={`row-${rowIndex}`} className="skeleton">
          <Box className="skeleton-left flex1">
            <Box className="square"></Box>
          </Box>
          <Box className="skeleton-right flex2">
            <Box className="line h17 w40 m10"></Box>
            <Box className="line"></Box>
            <Box className="line h8 w50"></Box>
            <Box className="line w75"></Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CardMiniSkeleton;
