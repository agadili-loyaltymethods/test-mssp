import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Drawer, 
  Divider, 
  Chip, 
  Grid 
} from '@mui/material';
import { RootState } from '../../redux/store';
import { useMember } from '../../hooks/useMember';
import { useActivity } from '../../hooks/useActivity';
import { useAlertService } from '../../hooks/useAlertService';
import { Coupon } from '../../types';
import CardMiniSkeleton from '../card-mini-skeleton/CardMiniSkeleton';
import NoData from '../common/no-data/NoData';
import { formatExpiryDate } from '../../utils/formatters';
import './RewardsWallet.scss';

const RewardsWallet: React.FC = () => {
  const memberInfo = useSelector((state: RootState) => state.member);
  const location = useSelector((state: RootState) => state.location);
  
  const { getMemberVouchers, getVouchers } = useMember();
  const { getActivity } = useActivity();
  const { errorAlert } = useAlertService();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [availableVouchers, setAvailableVouchers] = useState<Coupon[]>([]);
  const [availableVouchersWithPurse, setAvailableVouchersWithPurse] = useState<Coupon[]>([]);
  const [allVouchers, setAllVouchers] = useState<Coupon[]>([]);
  const [memberVouchers, setMemberVouchers] = useState<Coupon[]>([]);
  const [memberPoints, setMemberPoints] = useState<{key: string, value: number}[]>([]);
  const [selectedPointPurse, setSelectedPointPurse] = useState<{key: string, value: number} | null>(null);
  
  useEffect(() => {
    if (memberInfo?._id) {
      getRewardWallet();
    }
  }, [memberInfo, location]);
  
  const getRewardWallet = async () => {
    setIsLoading(true);
    setSelectedPointPurse(null);
    
    try {
      // Get available point balances
      const activityResponse = await getActivity(getPayload());
      const pointsData = activityResponse.data.rdBalances;
      
      const points = Object.keys(pointsData).map(key => ({
        key: key,
        value: pointsData[key]
      }));
      
      setMemberPoints(points);
      
      // Get vouchers
      const [memberVouchersResponse, allVouchersResponse] = await Promise.all([
        getMemberVouchers(memberInfo._id),
        getVouchers(memberInfo)
      ]);
      
      setMemberVouchers(memberVouchersResponse.flatMap((voucher: any) => voucher.rewards));
      setAllVouchers(allVouchersResponse);
      
      // Set available vouchers
      const filtered = allVouchersResponse.filter((voucher) => 
        voucher.cost > 0 && 
        points.find((point) => 
          point.key === voucher?.ext?.purseName && 
          point.value >= voucher.cost
        )
      );
      
      setAvailableVouchers(filtered);
      
      // Set initial selected purse
      if (points.length > 0) {
        setSelectedPointPurse(points[0]);
        
        // Filter vouchers for selected purse
        const filteredByPurse = allVouchersResponse.filter((voucher) => 
          voucher.cost > 0 && 
          voucher.ext.purseName === points[0].key
        );
        
        setAvailableVouchersWithPurse(filteredByPurse);
      }
    } catch (error: any) {
      errorAlert(error?.error?.error || error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPayload = (coupon = '') => {
    return {
      type: !!coupon ? coupon : 'Personalization',
      date: new Date().toISOString(),
      srcChannelType: 'Web',
      couponCode: 'Balance',
      srcChannelID: location.location,
      loyaltyID: memberInfo?.loyaltyId
    };
  };
  
  const isPointSourceValid = (voucherName: string, cost: number): boolean => {
    if (!selectedPointPurse) return false;
    return selectedPointPurse.value >= cost;
  };
  
  const redemptionPayload = (couponCode: string) => {
    return {
      type: 'Redemption',
      srcChannelType: 'Web',
      srcChannelID: location.location,
      date: new Date(),
      loyaltyID: memberInfo?.loyaltyId,
      couponCode: couponCode,
      ext: {
        purse: selectedPointPurse?.key
      }
    };
  };
  
  const buyVoucher = async (rewardName: string) => {
    setIsLoading(true);
    
    try {
      await getActivity(redemptionPayload(rewardName), true);
      await getRewardWallet();
      toggleDrawer();
    } catch (error: any) {
      errorAlert(error?.error?.error || error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePurseSelection = (category: {key: string, value: number}) => {
    setSelectedPointPurse(category);
    
    // Filter vouchers for selected purse
    const filteredByPurse = allVouchers.filter((voucher) => 
      voucher.cost > 0 && 
      voucher.ext.purseName === category.key
    );
    
    setAvailableVouchersWithPurse(filteredByPurse);
  };
  
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const renderVoucherCard = (voucher: Coupon) => (
    <Card className="box-shadow-none border-gray bg-white">
      <CardContent>
        <Box 
          display="flex" 
          flexDirection="column"
        >
          <Box 
            display="flex" 
            flexDirection="row" 
            alignItems="center" 
            gap={2} 
            className="h-80"
          >
            <Box className="w-50 img-sec">
              <img src="assets/bclc-logo.png" alt="Logo" />
            </Box>
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="flex-start" 
              gap={1} 
              className="voucher-container pl-10"
            >
              <Typography 
                variant="h5" 
                color="secondary" 
                className="line-height-adjust mt-0 card-text-ellipsis"
              >
                {voucher.name}
              </Typography>
              
              {voucher.expiresOn && (
                <Typography variant="caption" color="textSecondary">
                  Expires {formatExpiryDate(voucher.expiresOn)}
                </Typography>
              )}
              
              {voucher.cost && (
                <Typography variant="caption" color="textSecondary">
                  {voucher.cost.toLocaleString()} Points
                </Typography>
              )}
            </Box>
          </Box>
          
          {voucher.cost && (
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              disabled={!selectedPointPurse || !isPointSourceValid(voucher.name, voucher.cost)}
              onClick={() => buyVoucher(voucher.name)}
            >
              Buy with Points
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
  
  if (isLoading) {
    return (
      <Box className="mt-50">
        <CardMiniSkeleton />
      </Box>
    );
  }
  
  return (
    <>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: { width: 600 }
        }}
      >
        <Box display="flex" flexDirection="column" gap={2} className="p-20">
          <Box 
            display="flex" 
            flexDirection="row" 
            alignItems="center" 
            justifyContent="space-between" 
            className="pb-5"
          >
            <Typography variant="h6">Redemption Catalog</Typography>
            <Button onClick={toggleDrawer}>&times;</Button>
          </Box>
          
          <Divider />
          
          <Box display="flex" flexDirection="column">
            <Box 
              display="flex" 
              flexDirection="row" 
              alignItems="center" 
              justifyContent="center" 
              className="w-100p p-10"
            >
              <Box component="div" display="flex" gap={1}>
                {memberPoints.map((category, index) => (
                  <Chip
                    key={index}
                    label={`${category.key}: ${category.value.toLocaleString()}`}
                    onClick={() => handlePurseSelection(category)}
                    color={selectedPointPurse?.key === category.key ? 'primary' : 'default'}
                    variant={selectedPointPurse?.key === category.key ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>
            
            <Grid container spacing={2} className="p-20">
              {availableVouchersWithPurse.map((voucher, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  {renderVoucherCard(voucher)}
                </Grid>
              ))}
              
              {availableVouchersWithPurse.length === 0 && (
                <Grid item xs={12}>
                  <NoData>No vouchers available for this point type.</NoData>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </Drawer>
      
      <Box display="flex" flexDirection="column" gap={2} className="mt-20">
        <Box display="flex" justifyContent="space-between" alignItems="center" className="pr-10">
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">Rewards Wallet</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {memberPoints.map((point) => (
              <Box 
                key={point.key}
                sx={{ 
                  border: '0.5px solid gray', 
                  padding: '10px', 
                  margin: '1px', 
                  borderRadius: '8px' 
                }}
              >
                {point.key}: <strong>{point.value.toLocaleString()}</strong>
              </Box>
            ))}
            <Button
              variant="contained"
              color="primary"
              disabled={!availableVouchers.length}
              onClick={toggleDrawer}
            >
              Buy with Points
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          {memberVouchers.length > 0 ? (
            memberVouchers.map((voucher, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                {renderVoucherCard(voucher)}
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <NoData>No reward available in the wallet.</NoData>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default RewardsWallet;
