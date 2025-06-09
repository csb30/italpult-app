'use client';

import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

export default function SalesTable() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch('/api/sales').then(res => res.json()).then(setSales);
  }, []);

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Ital</Th>
          <Th>Mennyiség</Th>
          <Th>Dátum</Th>
        </Tr>
      </Thead>
      <Tbody>
        {sales.map((s: any) => (
          <Tr key={s.id}>
            <Td>{s.drink.name}</Td>
            <Td>{s.quantity}</Td>
            <Td>{new Date(s.createdAt).toLocaleString()}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}