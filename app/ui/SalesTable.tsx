'use client';

import { useEffect, useState } from 'react';
import InvoiceTable from './InvoiceTable';
import { Heading, VStack } from '@chakra-ui/react';
import { Sale as PrismaSale, Invoice as PrismaInvoice, Drink } from '@prisma/client';

interface Invoice extends PrismaInvoice {
  sales: Sale[];
}

interface Sale extends PrismaSale {
  drink: Drink;
}

const deleteInvoice = async (id: number) => {
  const response = await fetch('/api/invoice', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete invoice');
  }

  return response.json();
}

const modifyInvoice = async (id: number, status: number) => {
  const response = await fetch('/api/invoice', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  });

  if (!response.ok) {
    throw new Error('Failed to modify invoice');
  }

  return response.json();
}

export default function SalesTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetch('/api/invoice/').then(res => res.json()).then(setInvoices);
  }, []);

  return (
    <VStack gap={4} align="stretch" mb={8} w={"100%"}>
      <Heading>Számlák</Heading>
      <InvoiceTable invoices={invoices.filter((invoice) => invoice.status === 0)}
        modifyInvoice={(id: number, status: number) =>
          modifyInvoice(id, status).then(() => {
            setInvoices(prevInvoices =>
              prevInvoices.map(inv =>
                inv.id === id ? { ...inv, status: status } : inv
              )
            );
          })}

        deleteInvoice={(id: number) =>
          deleteInvoice(id)
            .then(() => {
              setInvoices(prevInvoices => prevInvoices.filter(inv => inv.id !== id));
            })
        } />

      <Heading>Archivált számlák</Heading>
      <InvoiceTable invoices={invoices.filter((invoice) => invoice.status === 1)}
        modifyInvoice={(id: number, status: number) =>
          modifyInvoice(id, status).then(() => {
            setInvoices(prevInvoices =>
              prevInvoices.map(inv =>
                inv.id === id ? { ...inv, status: status } : inv
              )
            );
          })}

        deleteInvoice={(id: number) =>
          deleteInvoice(id)
            .then(() => {
              setInvoices(prevInvoices => prevInvoices.filter(inv => inv.id !== id));
            })
        } />
    </VStack>
  );
}