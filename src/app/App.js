import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import { useMember } from './hooks/useMember';
import { addMember } from './redux/slices/memberSlice';
import Header from './components/header/Header';
import Dashboard from './components/dashboard/Dashboard';
import PurchaseHistory from './components/purchase-history/PurchaseHistory';
import Purchase from './components/purchase/Purchase';
import Rewards from './components/rewards/Rewards';
import Checkout from './components/checkout/Checkout';
import PurchaseConfirmation from './components/purchase-confirmation/PurchaseConfirmation';
import PageNotFound from './components/page-not-found/PageNotFound';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { getMember } = useMember();
  const isLoading = useSelector(state => state.auth.isLoading);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const loyaltyId = localStorage.getItem('loyaltyId') || '1001';
        const member = await getMember(loyaltyId);
        dispatch(addMember(member));
        localStorage.setItem('loyaltyId', member.loyaltyId);
      } catch (error) {
        console.error('Error fetching member:', error);
      }
    };

    if (isAuthenticated) {
      fetchMember();
    }
  }, [dispatch, getMember, isAuthenticated]);

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
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
