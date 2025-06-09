'use client';

import { Box, Heading } from '@chakra-ui/react';
import DrinkForm from './ui/DrinkForm';

export default function HomePage() {
  return (
    <Box maxW="1000px" mx="auto" mt={8} p={4}>
      <Heading mb={6}>Italpult</Heading>
      <DrinkForm />
    </Box>
  );
}