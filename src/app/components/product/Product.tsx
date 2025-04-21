import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  FormControl, 
  Select, 
  MenuItem, 
  SelectChangeEvent 
} from '@mui/material';
import { RootState } from '../../redux/store';
import { addItem, removeItem } from '../../redux/slices/cartSlice';
import { useAlertService } from '../../hooks/useAlertService';
import { formatCurrency } from '../../utils/formatters';
import { CartItem } from '../../types';
import './Product.scss';

interface ProductProps {
  product: any;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { successAlert } = useAlertService();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  const [quantity, setQuantity] = useState<number>(1);
  const hemming = 'Hemming';
  
  useEffect(() => {
    // If product is in cart, update quantity state
    const cartItem = cartItems.find(item => item.sku === product.sku);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItems, product.sku]);
  
  const addToCart = () => {
    const item: CartItem = {
      ...product,
      quantity
    };
    
    dispatch(addItem({ item }));
    
    successAlert(`Item successfully added to your cart.`, 'Go to Cart')
      .onAction()
      .subscribe(() => navigate('/checkout'));
  };
  
  const removeFromCart = () => {
    setQuantity(1);
    dispatch(removeItem({ itemId: product.sku }));
    
    successAlert(`Item successfully removed from your cart.`, 'Go to Cart')
      .onAction()
      .subscribe(() => navigate('/checkout'));
  };
  
  const isInCart = (): boolean => {
    return !!cartItems.find(x => x.sku === product.sku);
  };
  
  const handleQuantityChange = (event: SelectChangeEvent<number>) => {
    const newQuantity = Number(event.target.value);
    setQuantity(newQuantity);
    
    if (isInCart()) {
      dispatch(addItem({ 
        item: { 
          ...product, 
          quantity: newQuantity 
        } 
      }));
    }
  };
  
  return (
    <Box 
      flex="1 1 auto" 
      display="flex" 
      flexDirection="column" 
      alignItems="flex-start" 
      className={`card ${product.category === hemming ? 'hemming-card' : ''}`}
    >
      {product.category === hemming ? (
        <img className="hemming" src={product.url} alt={product.name} loading="lazy" />
      ) : (
        <img className="img" src={product.url} alt={product.name} loading="lazy" />
      )}
      
      <Typography fontWeight="bold" className="mt-5 mb-5">
        {product.name}
      </Typography>
      
      <Box 
        width="100%" 
        display="flex" 
        flexDirection="row" 
        alignItems="center" 
        justifyContent="space-between" 
        gap="10px"
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography fontWeight="bold" className="m-0 mr-5">
            Qty:
          </Typography>
          <FormControl variant="outlined" size="small" className="w-80">
            <Select
              value={quantity}
              onChange={handleQuantityChange}
              disabled={product.category === hemming}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                <MenuItem key={qty} value={qty}>
                  {qty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Typography>
          {formatCurrency(product.cost)}
        </Typography>
      </Box>
      
      {product.ext?.nonReturnable && (
        <Typography variant="caption" color="error" className="mt-10 mb-10">
          Non Returnable
        </Typography>
      )}
      
      {!isInCart() ? (
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          className="button w-100p h-40 mb-10" 
          onClick={addToCart}
        >
          Add to Bag
        </Button>
      ) : (
        <Button 
          variant="outlined" 
          color="primary" 
          fullWidth 
          className="button w-100p h-40 mb-10 stroked-btn" 
          onClick={removeFromCart}
        >
          Remove from Bag
        </Button>
      )}
    </Box>
  );
};

export default Product;
