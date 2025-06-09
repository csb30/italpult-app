'use client';

import { Box, Heading, Button, VStack, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import DrinkForm from './ui/DrinkForm';
import SalesTable from './ui/SalesTable'; // Create this component for the sales table view

export default function HomePage() {
  const [activeView, setActiveView] = useState<'drinkForm' | 'salesTable'>('drinkForm');

  return (
    <Box maxW="1000px" mx="auto" mt={8} p={4}>
      <Heading mb={6}>Italpult</Heading>

      {/* Navbar */}
      <HStack gap={4} mb={6}>
        <Button
          id='drinkFormButton'
          colorPalette={activeView === 'drinkForm' ? 'teal' : 'gray'}
          onClick={() => setActiveView('drinkForm')}
        >
          Italpult
        </Button>
        <Button
          id='salesTableButton'
          colorPalette={activeView === 'salesTable' ? 'teal' : 'gray'}
          onClick={() => setActiveView('salesTable')}
        >
          Eladások
        </Button>
      </HStack>

      {/* Conditional Rendering */}
      <VStack>
        {activeView === 'drinkForm' && <DrinkForm />}
        {activeView === 'salesTable' && <SalesTable />}
      </VStack>
    </Box>
  );
}