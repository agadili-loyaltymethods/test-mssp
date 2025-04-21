import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Menu, 
  MenuItem, 
  IconButton,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { RootState } from '../../redux/store';
import { removeItem } from '../../redux/slices/cartSlice';
import { formatCurrency } from '../../utils/formatters';
import './Cart.scss';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  useEffect(() => {
    // Filter out items with hideInMSSP flag
    const items = cartItems.filter(item => !item?.ext?.hideInMSSP);
    setFilteredItems(items);
    
    // Calculate totals
    if (items.length) {
      setTotalItems(items.reduce((total, item) => total + item.quantity, 0));
      setTotalPrice(items.reduce((total, item) => total + (item.cost * item.quantity), 0));
    } else {
      setTotalItems(0);
      setTotalPrice(0);
    }
  }, [cartItems]);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const removeFromCart = (product: any) => {
    dispatch(removeItem({ itemId: product.sku }));
  };
  
  return (
    <Box display="flex" flexDirection="row">
      <Typography 
        variant="h5" 
        className="cursor-pointer" 
        onClick={handleClick}
        display="flex"
        alignItems="center"
      >
        <span className="cart-count pt-49">
          <img src="/assets/icons/cart-icon.svg" alt="Cart" />
          <em>{totalItems}</em>
        </span>
      </Typography>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 350 }
        }}
      >
        <Box 
          display="flex" 
          flexDirection="column" 
          className="cart-dropdown w-100p"
        >
          {/* Scrollable Product List */}
          <Box 
            onClick={(e) => e.stopPropagation()} 
            display="flex" 
            flexDirection="column" 
            className="product-list w-100p" 
            flex="auto" 
            gap="10px"
          >
            <Box 
              display="flex" 
              flexDirection="column" 
              className="container w-100p mb-10" 
              gap="10px"
            >
              {filteredItems.map((product, index) => (
                <Box 
                  key={index} 
                  display="flex" 
                  flexDirection="row" 
                  alignItems="center"
                >
                  <Box flex="0 0 20%">
                    <img 
                      src={product.url} 
                      alt={product.name} 
                      title={product.desc} 
                      loading="lazy" 
                    />
                  </Box>
                  <Box 
                    flex="0 0 60%" 
                    display="flex" 
                    flexDirection="column" 
                    gap="5px" 
                    className="pl-5"
                  >
                    <Typography variant="subtitle2" fontWeight="bold" className="mb-10">
                      {product.name}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {product.quantity} x {formatCurrency(product.cost)}
                    </Typography>
                  </Box>
                  <Box flex="0 0 20%">
                    <IconButton 
                      onClick={() => removeFromCart(product)}
                      color="error"
                    >
                      <DeleteIcon className="font-size-large" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              
              {filteredItems.length === 0 && (
                <>
                  <Typography variant="body1" fontWeight="bold" className="font-size-medium">
                    Your cart is empty!
                  </Typography>
                  <Typography variant="body2">
                    Start adding items to your cart to see them here.
                  </Typography>
                </>
              )}
            </Box>
          </Box>
          
          {/* Fixed Checkout Section */}
          {filteredItems.length > 0 && (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="flex-end" 
              className="checkout-footer w-100p p-10"
            >
              <Typography variant="body2">Cart Total</Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatCurrency(totalPrice)}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                className="mt-10" 
                component={Link} 
                to="/checkout"
                onClick={handleClose}
              >
                Checkout
              </Button>
            </Box>
          )}
        </Box>
      </Menu>
    </Box>
  );
};

export default Cart;
