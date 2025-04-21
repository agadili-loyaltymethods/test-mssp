import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Tabs, 
  Tab, 
  Card, 
  CardContent 
} from '@mui/material';
import { Reward } from '../../types';
import RewardsWallet from '../rewards-wallet/RewardsWallet';
import EarnedBenefits from '../earned-benefits/EarnedBenefits';
import Offers from '../offers/Offers';
import ClippableCoupons from '../clippable-coupons/ClippableCoupons';
import Sweepstakes from '../sweepstakes/Sweepstakes';
import Quiz from '../quiz/Quiz';
import './Rewards.scss';

const Rewards: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  
  // Array of tab URLs that correspond to the enum values
  const tabUrls: string[] = Object.values(Reward);
  
  useEffect(() => {
    // Get the fragment from the URL
    const fragment = location.hash.replace('#', '');
    
    // Find the index of the tab that matches the fragment
    const tabIndex = tabUrls.findIndex((tab) => tab === fragment);
    
    // Set the selected tab index, default to 0 if not found
    setSelectedTab(tabIndex > -1 ? tabIndex : 0);
    
    // Update the URL fragment if it's not already set
    if (!fragment || tabIndex === -1) {
      navigate({ hash: tabUrls[0] }, { replace: true });
    }
  }, [location.hash, navigate, tabUrls]);
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    navigate({ hash: tabUrls[newValue] }, { replace: true });
  };
  
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="center">
        <Box display="flex" flexDirection="column" alignItems="center" className="w-1300">
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            className="w-100p mt-20"
            centered
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Rewards Wallet" />
            <Tab label="Exclusive Offers" />
            <Tab label="Clippable Coupons" />
            <Tab label="Survey" />
          </Tabs>
          
          <Box width="100%" mt={2}>
            {selectedTab === 0 && <RewardsWallet />}
            {selectedTab === 1 && <Offers />}
            {selectedTab === 2 && <ClippableCoupons />}
            {selectedTab === 3 && <Quiz />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Rewards;
