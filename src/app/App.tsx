import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import { useMember } from './hooks/useMember';
import { addMember } from './redux/slices/memberSlice';
import { RootState } from './redux/store';
import Header from './components/header/Header';
import Dashboard from './components/dashboard/Dashboard';
import PurchaseHistory from './components/purchase-history/PurchaseHistory';
import Purchase from './components/purchase/Purchase';
import Rewards from './components/rewards/Rewards';
import Checkout from './components/checkout/Checkout';
import PurchaseConfirmation from './components/purchase-confirmation/PurchaseConfirmation';
import PageNotFound from './components/page-not-found/PageNotFound';
import { useAlertService } from './hooks/useAlertService';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { getMember } = useMember();
  const { errorAlert } = useAlertService();
  const [isLoading, setIsLoading] = useState(true);
  
  // Register custom SVG icons
  useEffect(() => {
    // This would be the equivalent of registering custom icons in Angular
    // For React, we'd typically import SVG as components or use an icon library
    const customIcons = ['view-dashboard', 'cart-outline', 'gift-outline', 'history', 'hotel', 'casino', 'poker_chip'];
    // Implementation would depend on the icon system used in React
  }, []);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const loyaltyId = localStorage.getItem('loyaltyId') || '1001';
        const member = await getMember(loyaltyId);
        dispatch(addMember({ member }));
        localStorage.setItem('loyaltyId', member.loyaltyId);
      } catch (error: any) {
        errorAlert(error?.error?.error || error?.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMember();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, getMember, isAuthenticated, errorAlert]);

  if (isLoading || authLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        className="c-loader"
      >
        <div className="lds-roller">
          <div></div><div></div><div></div><div></div>
          <div></div><div></div><div></div><div></div>
        </div>
      </Box>
    );
  }

  return (
    <>
      {isAuthenticated && <Header />}
      <main className={isAuthenticated ? 'adjust-header-height' : ''}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/purchase-history" element={<PurchaseHistory />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/purchase-confirmation" element={<PurchaseConfirmation />} />
          <Route path="/page-not-found" element={<PageNotFound />} />
          <Route path="*" element={<Navigate to="/page-not-found" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
