'use client';

import { useState } from 'react';
import { Box, Heading, Button, VStack, HStack } from '@chakra-ui/react';
import DrinkForm from './ui/DrinkForm';
import SalesTable from './ui/SalesTable';
import DrinksTable from './ui/DrinksTable';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [activeView, setActiveView] = useState<string>('drinkForm');
  const router = useRouter();

  return (
    <Box maxW="1000px" mx="auto" mt={8} p={4}>
      <HStack justifyContent="space-between" mb={6}>
        <Heading>Italpult</Heading>
        <Button
          colorPalette="red"
          onClick={() => {
            fetch('/api/logout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            }).then(() => {
              router.push('/login');
            });
          }}
        >
          Kijelentkezés
        </Button>
      </HStack>
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
        <Button
          id='drinksTableButton'
          colorPalette={activeView === 'drinksTable' ? 'teal' : 'gray'}
          onClick={() => setActiveView('drinksTable')}
        >
          Italok
        </Button>
      </HStack>
      <VStack>
        {activeView === 'drinkForm' && <DrinkForm />}
        {activeView === 'salesTable' && <SalesTable />}
        {activeView === 'drinksTable' && <DrinksTable />}
      </VStack>
    </Box>
  );
}