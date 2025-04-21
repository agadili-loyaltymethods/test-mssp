import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid 
} from '@mui/material';
import { RootState } from '../../redux/store';
import { useSegmentService } from '../../hooks/useSegmentService';
import { useAlertService } from '../../hooks/useAlertService';
import { Segment } from '../../types';
import CardMiniSkeleton from '../card-mini-skeleton/CardMiniSkeleton';
import NoData from '../common/no-data/NoData';
import './ClippableCoupons.scss';

const ClippableCoupons: React.FC = () => {
  const memberInfo = useSelector((state: RootState) => state.member);
  
  const { getAllSegments, getMemberSegments, addMemberSegment, deleteMemberSegment } = useSegmentService();
  const { errorAlert, successAlert } = useAlertService();
  
  const [segments, setSegments] = useState<Segment[]>([]);
  const [memberSegments, setMemberSegments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (memberInfo?._id) {
      getSegments();
    }
  }, [memberInfo]);
  
  const getSegments = async () => {
    setIsLoading(true);
    
    try {
      // Get all marketing segments
      const segmentsResponse = await getAllSegments(JSON.stringify({ "ext.marketing": true }));
      setSegments(segmentsResponse);
      
      // Get member segments
      const query = JSON.stringify({
        member: memberInfo._id,
        segment: { $in: segmentsResponse.map((segment) => segment._id) }
      });
      
      const memberSegmentsResponse = await getMemberSegments(5, query);
      setMemberSegments(memberSegmentsResponse);
    } catch (error: any) {
      errorAlert(error?.error?.error || error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isClaimed = (segmentId: string): boolean => {
    return !!memberSegments.find(x => x.segment === segmentId);
  };
  
  const updateSegment = async (segmentId: string) => {
    const existingSegment = memberSegments.findIndex(x => x.segment === segmentId);
    
    if (existingSegment > -1) {
      try {
        await deleteMemberSegment(memberSegments[existingSegment]._id);
        
        // Update local state
        const updatedSegments = [...memberSegments];
        updatedSegments.splice(existingSegment, 1);
        setMemberSegments(updatedSegments);
        
        successAlert('Coupon has been successfully deactivated.');
      } catch (error: any) {
        errorAlert(error?.error?.error || error?.message);
      }
    } else {
      try {
        const response = await addMemberSegment(memberInfo._id, segmentId);
        
        // Update local state
        setMemberSegments([...memberSegments, response]);
        
        successAlert('Coupon has been successfully activated.');
      } catch (error: any) {
        errorAlert(error?.error?.error || error?.message);
      }
    }
  };
  
  if (isLoading) {
    return (
      <Box className="mt-50">
        <CardMiniSkeleton />
      </Box>
    );
  }
  
  if (!segments.length) {
    return <NoData>No coupons available.</NoData>;
  }
  
  return (
    <Box display="flex" flexDirection="column" gap={2} className="mt-20">
      <Typography variant="h6">Available Coupons</Typography>
      
      <Grid container spacing={2}>
        {segments.map((segment, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="box-shadow-none border-gray bg-white h-300">
              <CardContent className="h-100p">
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  justifyContent="space-between" 
                  gap={2} 
                  height="100%"
                >
                  <img src="assets/bclc-logo.png" alt="Logo" />
                  <Typography variant="h6" className="m-0 color-accent line-height-adjust">
                    {segment.name}
                  </Typography>
                  <Typography color="textSecondary" className="mt-10">
                    {segment.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color={isClaimed(segment._id) ? "secondary" : "primary"}
                    fullWidth
                    onClick={() => updateSegment(segment._id)}
                  >
                    {isClaimed(segment._id) ? 'Deactivate' : 'Activate'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClippableCoupons;
