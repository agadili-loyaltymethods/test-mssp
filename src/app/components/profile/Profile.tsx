import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Menu, MenuItem, TextField, CircularProgress } from '@mui/material';
import { RootState } from '../../redux/store';
import { useMember } from '../../hooks/useMember';
import { addMember, clearMember } from '../../redux/slices/memberSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import { useAlertService } from '../../hooks/useAlertService';

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { getMember } = useMember();
  const { errorAlert } = useAlertService();
  
  const memberInfo = useSelector((state: RootState) => state.member);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loyaltyIdValue, setLoyaltyIdValue] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [memberTier, setMemberTier] = useState<string>('');
  const [totalPoints, setTotalPoints] = useState<number>(0);
  
  useEffect(() => {
    if (memberInfo) {
      setLoyaltyIdValue(memberInfo.loyaltyId || '');
      
      if (memberInfo.tiers && memberInfo.tiers.length > 0) {
        setMemberTier(memberInfo.tiers[0].level.name);
      }
      
      if (memberInfo.purses && memberInfo.purses.length > 0) {
        const anywherePoints = memberInfo.purses.find(x => x.name === 'Anywhere Points');
        setTotalPoints(anywherePoints?.availBalance || 0);
      }
    }
  }, [memberInfo]);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const switchMember = async () => {
    if (!loyaltyIdValue) return;
    
    const oldVal = localStorage.getItem('loyaltyId');
    localStorage.setItem('loyaltyId', loyaltyIdValue);
    
    setIsFetching(true);
    
    try {
      const member = await getMember(loyaltyIdValue);
      dispatch(addMember({ member }));
      handleClose();
    } catch (error: any) {
      localStorage.setItem('loyaltyId', oldVal || '');
      setLoyaltyIdValue(oldVal || '');
      errorAlert(error?.error?.error || error?.message);
    } finally {
      setIsFetching(false);
    }
  };
  
  const clearStore = () => {
    dispatch(clearMember());
    dispatch(clearCart());
  };
  
  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap="5px">
      <span className="material-symbols-outlined font-size-extra-large">account_circle</span>
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Typography variant="body1" margin={0}>
          {memberInfo?.firstName} {memberInfo?.lastName}
        </Typography>
        <Box display="flex" flexDirection="row">
          <Typography 
            variant="h5" 
            className="cursor-pointer m-0" 
            onClick={handleClick}
            display="flex"
            alignItems="center"
          >
            {memberTier} | {totalPoints.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            <Button 
              size="small" 
              sx={{ 
                width: '30px', 
                height: '25px', 
                padding: 0,
                minWidth: 'auto'
              }} 
              color="primary"
            >
              <span className="material-icons">expand_more</span>
            </Button>
          </Typography>
        </Box>
      </Box>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          padding="10px"
          onClick={(e) => e.stopPropagation()}
        >
          <TextField
            label="Switch Member"
            variant="outlined"
            color="primary"
            value={loyaltyIdValue}
            onChange={(e) => setLoyaltyIdValue(e.target.value)}
            InputProps={{
              endAdornment: (
                <Button
                  disabled={isFetching}
                  onClick={switchMember}
                  color="primary"
                  title="Click to Switch Member"
                >
                  {isFetching ? (
                    <CircularProgress size={20} />
                  ) : (
                    <span className="material-icons color-primary">person_search</span>
                  )}
                </Button>
              ),
            }}
          />
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
