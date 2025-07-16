/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/v1/products/getAll')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box mt={6} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h4" mb={3} fontWeight="bold">
        ToolMart Products
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        justifyContent="flex-start"
        alignItems="stretch"
      >
        {products.map((product) => (
          <Box key={product.id} flex="1 1 250px" maxWidth="300px">
            <ProductCard {...product} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HomePage;
