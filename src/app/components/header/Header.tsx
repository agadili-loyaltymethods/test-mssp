import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TokenHelper } from '../../utils/tokenHelper';
import Locations from '../locations/Locations';
import Profile from '../profile/Profile';
import './Header.scss';

// Custom styled components
const HeaderContainer = styled('header')({
  height: '70px',
  backgroundColor: 'var(--white)',
  color: 'var(--black)',
  borderBottom: '1px solid #E8E7E4',
  padding: '20px',
  width: '100%',
  zIndex: 1000,
});

const NavItem = styled(Box)(({ theme }) => ({
  padding: '10px 30px',
  cursor: 'pointer',
  borderBottom: '2px solid #fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '#f0f3f5',
    borderBottom: `3px solid ${theme.palette.primary.main} !important`,
    '& .MuiSvgIcon-root, & label': {
      color: theme.palette.primary.main,
    },
  },
  '&.active': {
    backgroundColor: '#f0f3f5',
    borderRadius: '0 !important',
    borderBottom: `3px solid ${theme.palette.primary.main}`,
    '& .MuiSvgIcon-root, & label': {
      color: theme.palette.primary.main,
    },
  },
}));

const NavLabel = styled('label')({
  cursor: 'pointer',
  fontSize: '14px',
  textAlign: 'center',
});

const SmallIcon = styled('span')({
  fontSize: '12px',
  width: '12px',
  height: '12px',
  verticalAlign: '-webkit-baseline-middle',
});

const Header: React.FC = () => {
  const openExternalLink = (path: string, query: string = '') => {
    TokenHelper.openExternalLink(path, query);
  };

  return (
    <HeaderContainer>
      <Box 
        display="flex" 
        flexDirection="row" 
        alignItems="center" 
        justifyContent="center" 
        width="100%"
      >
        <Box 
          width="1440px" 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between"
        >
          {/* Left section */}
          <Box flex="0 0 15%" display="flex" alignItems="center">
            <Link to="/">
              <img 
                className="cursor-pointer w-75" 
                src="assets/bclc-logo.png" 
                alt="BCLC Logo" 
              />
            </Link>
          </Box>
          
          {/* Middle section */}
          <Box flex="0 0 55%" display="flex" alignItems="center">
            <Box display="flex" alignItems="center" justifyContent="center" textAlign="center">
              <NavItem 
                component={Link} 
                to="/dashboard" 
                className={window.location.pathname === '/dashboard' ? 'active' : ''}
              >
                <span className="material-icons">view_dashboard</span>
                <NavLabel>Dashboard</NavLabel>
              </NavItem>
              
              <NavItem 
                component={Link} 
                to="/rewards" 
                className={window.location.pathname === '/rewards' ? 'active' : ''}
              >
                <span className="material-icons">card_giftcard</span>
                <NavLabel>Rewards</NavLabel>
              </NavItem>
              
              <NavItem 
                component={Link} 
                to="/purchase-history" 
                className={window.location.pathname === '/purchase-history' ? 'active' : ''}
              >
                <span className="material-icons">history</span>
                <NavLabel>Activity History</NavLabel>
              </NavItem>
              
              <NavItem 
                onClick={() => openExternalLink('hotel-booking')}
                component="a"
              >
                <span className="material-icons">hotel</span>
                <NavLabel>
                  Hotel Booking <SmallIcon className="material-icons color-primary">open_in_new</SmallIcon>
                </NavLabel>
              </NavItem>
              
              <NavItem 
                onClick={() => openExternalLink('casino')}
                component="a"
              >
                <span className="material-icons">casino</span>
                <NavLabel>
                  Casino <SmallIcon className="material-icons color-primary">open_in_new</SmallIcon>
                </NavLabel>
              </NavItem>
            </Box>
          </Box>
          
          {/* Right section */}
          <Box flex="0 0 30%">
            <Box 
              display="flex" 
              flexDirection="row" 
              alignItems="center" 
              justifyContent="space-between" 
              gap="40px" 
              className="right-menu-icons"
            >
              <Locations />
              <Profile />
            </Box>
          </Box>
        </Box>
      </Box>
    </HeaderContainer>
  );
};

export default Header;
