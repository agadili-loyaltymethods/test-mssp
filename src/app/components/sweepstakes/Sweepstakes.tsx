import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  CircularProgress
} from '@mui/material';
import { RootState } from '../../redux/store';
import { useActivity } from '../../hooks/useActivity';
import { useAlertService } from '../../hooks/useAlertService';
import { useMember } from '../../hooks/useMember';
import { ExternalCoupons, SpendCategory } from '../../types';
import { GeneralConstants } from '../../constants/generalConstants';
import { SweepstakesConstant } from '../../constants/sweepstakesConstants';
import CardMiniSkeleton from '../card-mini-skeleton/CardMiniSkeleton';
import NoData from '../common/no-data/NoData';
import { formatExpiryDate } from '../../utils/formatters';
import './Sweepstakes.scss';

const Sweepstakes: React.FC = () => {
  const memberInfo = useSelector((state: RootState) => state.member);
  
  const { getActivity } = useActivity();
  const { errorAlert } = useAlertService();
  const { refreshMember } = useMember();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<null | 'won' | 'lost'>(null);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [claimedTimes, setClaimedTimes] = useState<number>(0);
  const [memberPoints, setMemberPoints] = useState<number>(0);
  
  const claimLimit = GeneralConstants.externalCouponsLimit;
  const sweepstakes = SweepstakesConstant;
  
  useEffect(() => {
    if (memberInfo?.purses) {
      const points = memberInfo.purses[0].availBalance;
      setMemberPoints(points);
    }
  }, [memberInfo]);
  
  const showSweepstake = () => {
    setDialogOpen(true);
    setStatus(null);
  };
  
  const closeDialog = (refresh: boolean = false) => {
    setDialogOpen(false);
    if (refresh) {
      refreshMember();
    }
  };
  
  const submitSweepstake = async () => {
    setIsLoading(true);
    
    const payload = {
      type: "Sweepstakes",
      date: new Date().toISOString(),
      srcChannelType: "Web",
      loyaltyID: memberInfo.loyaltyId,
      couponCode: ExternalCoupons.SWEEPSTAKES,
    };
    
    try {
      const response = await getActivity(payload, true);
      
      if (response.data.sweepStakesPoints > 0) {
        const pointsPurse = response.data.purses.find((purse: any) => purse.name === SpendCategory.POINTS);
        const points = pointsPurse.new - pointsPurse.prev;
        
        setEarnedPoints(points);
        
        if (points) {
          setStatus('won');
        } else {
          closeDialog();
        }
      } else {
        setStatus('lost');
      }
      
      setClaimedTimes(claimedTimes + 1);
    } catch (error: any) {
      errorAlert(error?.error?.error || error?.message);
      closeDialog();
    } finally {
      setIsLoading(false);
    }
  };
  
  const redirectToRewards = () => {
    closeDialog(true);
    window.location.hash = 'Rewards';
  };
  
  if (isLoading && !dialogOpen) {
    return (
      <Box className="mt-50">
        <CardMiniSkeleton />
      </Box>
    );
  }
  
  if (!sweepstakes) {
    return <NoData>No sweepstakes available.</NoData>;
  }
  
  return (
    <>
      <Box display="flex" flexDirection="column" className="mt-20">
        <Typography variant="h6" className="mt-0">
          Sweepstakes
        </Typography>
        
        <Box display="flex" gap={3}>
          <Box flex="0 0 25%">
            <Card className="box-shadow-none border-gray bg-white">
              <CardContent>
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  gap={3}
                >
                  <img src="assets/logo-login.svg" alt="Logo" className="w-100" />
                  <Typography variant="h6">{sweepstakes.title}</Typography>
                  <Typography color="textSecondary">{sweepstakes.desc}</Typography>
                  {sweepstakes.expiresOn && (
                    <Typography variant="caption" color="textSecondary">
                      Expires {formatExpiryDate(sweepstakes.expiresOn)}
                    </Typography>
                  )}
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    className="mt-20"
                    onClick={showSweepstake}
                  >
                    Participate Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => closeDialog(status !== null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{sweepstakes.title}</Typography>
            <Button onClick={() => closeDialog(status !== null)}>&times;</Button>
          </Box>
        </DialogTitle>
        
        {isLoading ? (
          <DialogContent>
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              minHeight="200px"
            >
              <CircularProgress />
            </Box>
          </DialogContent>
        ) : (
          <>
            {!status ? (
              <>
                <DialogContent>
                  <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    gap={2}
                  >
                    <img src="assets/sweepstake.png" alt="Sweepstake" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {sweepstakes.summary ?? sweepstakes.desc}
                    </Typography>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => closeDialog(false)} color="inherit">
                    Cancel
                  </Button>
                  <Button onClick={submitSweepstake} variant="contained" color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </>
            ) : status === 'lost' ? (
              <>
                <DialogContent>
                  <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    gap={2}
                    width="60%"
                    margin="0 auto"
                  >
                    <span className="material-icons lost-icon">close</span>
                    <Typography variant="body2" align="center">
                      We appreciate your entry, we regret to inform you that you were not selected as one
                      of the winners this time.
                    </Typography>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => closeDialog(true)} variant="contained" color="inherit">
                    Close
                  </Button>
                </DialogActions>
              </>
            ) : (
              <>
                <DialogContent>
                  <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    gap={2}
                  >
                    <img src="assets/sweepstake.png" alt="Sweepstake" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Congratulations!
                    </Typography>
                    <Typography variant="h6">
                      You have received{' '}
                      <span className="color-primary font-size-large">
                        {earnedPoints.toLocaleString()}
                      </span>{' '}
                      Points
                    </Typography>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={redirectToRewards}
                  >
                    Check Available Rewards
                  </Button>
                  <Button onClick={() => closeDialog(true)} color="inherit">
                    Cancel
                  </Button>
                </DialogActions>
              </>
            )}
          </>
        )}
      </Dialog>
    </>
  );
};

export default Sweepstakes;
