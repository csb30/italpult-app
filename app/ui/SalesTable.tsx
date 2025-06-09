'use client';

import { useEffect, useState } from 'react';
import { Table, Spinner } from '@chakra-ui/react';
import { Sale as PrismaSale, Invoice as PrismaInvoice, Drink} from '@prisma/client';
import TablePopover from './TablePopover';

interface Invoice extends PrismaInvoice {
  sales: Sale[];
}

interface Sale extends PrismaSale {
  drink: Drink;
}

export default function SalesTable() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetch('/api/invoice').then(res => res.json()).then(setInvoices);
  }, []);

  const formatDate = (datein: Date) => {
    const date = new Date(datein);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  const calculateTotal = (sales: Sale[]) => {
    return sales.reduce((total, sale) => total + sale.quantity * sale.drink.price, 0);
  };

  return (
    <Table.Root size="sm" variant={"line"}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Vásárló</Table.ColumnHeader>
          <Table.ColumnHeader>Időbélyeg</Table.ColumnHeader>
          <Table.ColumnHeader>Típus</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Végösszeg</Table.ColumnHeader>
          <Table.ColumnHeader></Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        { invoices.length>0 ? invoices.map((invoice: Invoice) => (
          <Table.Row key={invoice.id}>
            <Table.Cell>{invoice.paid}</Table.Cell>
            <Table.Cell>{formatDate(invoice.createdAt)}</Table.Cell>
            <Table.Cell>{invoice.type}</Table.Cell>
            <Table.Cell textAlign="end">{calculateTotal(invoice.sales)} JMF</Table.Cell>
            <Table.Cell><TablePopover sales={invoice.sales} /></Table.Cell>
          </Table.Row>
        )) : <Table.Row><Table.Cell><Spinner size="xl" /></Table.Cell></Table.Row>}
      </Table.Body>
    </Table.Root>
  );
}