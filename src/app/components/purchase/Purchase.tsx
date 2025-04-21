import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Box, 
  Chip, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent 
} from '@mui/material';
import { useProductService } from '../../hooks/useProductService';
import { useAlertService } from '../../hooks/useAlertService';
import { ProductHelper } from '../../utils/productHelper';
import Product from '../product/Product';
import NoData from '../common/no-data/NoData';
import './Purchase.scss';

const Purchase: React.FC = () => {
  const location = useLocation();
  const { getProducts } = useProductService();
  const { errorAlert } = useAlertService();
  
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const products = await getProducts();
        setAllProducts(products);
        
        const categories = ProductHelper.getCategories(products);
        setAllCategories(categories);
        
        // Set initial category from URL hash or first category
        const hash = location.hash.replace('#', '');
        const initialCategory = categories.includes(hash) ? hash : categories[0];
        setSelectedCategory(initialCategory);
        filterProductsByCategory(initialCategory, products);
      } catch (error: any) {
        errorAlert(error?.error?.error || error?.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [getProducts, errorAlert, location.hash]);
  
  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    filterProductsByCategory(category, allProducts);
    // Update URL hash without navigating
    window.history.replaceState(null, '', `#${category}`);
  };
  
  const filterProductsByCategory = (category: string, products: any[]) => {
    setFilteredProducts(products.filter(x => x.category === category));
  };
  
  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="center" className="w-1300 mt-20">
          <Box 
            display="flex" 
            flexDirection="column" 
            gap={3} 
            alignItems="space-between" 
            justifyContent="center" 
            className="w-100p"
          >
            <Grid container spacing={2} className="mb-40 w-100p">
              {[...Array(10)].map((_, index) => (
                <Grid item xs={12} sm={6} md={3} lg={2.4} key={index}>
                  <Card className="skeleton-card">
                    <CardContent className="skeleton">
                      <Box className="skeleton-left">
                        <Box className="square h-150 w-100p mb-15"></Box>
                        <Box className="line h-20 w-100p mb-10"></Box>
                        <Box className="line h-10 w-100p mb-10"></Box>
                        <Box className="line h-40 w-100p mb-20"></Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  }
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" flexDirection="column" alignItems="center" className="w-1300 mt-20">
        <Box display="flex" alignItems="center" justifyContent="center" className="filter-container mb-20">
          {allCategories.map((category, index) => (
            <Chip
              key={index}
              label={category}
              onClick={() => selectCategory(category)}
              color={selectedCategory === category ? "primary" : "default"}
              className={selectedCategory === category ? "selected" : ""}
            />
          ))}
        </Box>
        
        <Grid container spacing={2}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Product product={product} />
              </Grid>
            ))
          ) : (
            <Box width="100%" display="flex" justifyContent="center">
              <NoData>No products available.</NoData>
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Purchase;
