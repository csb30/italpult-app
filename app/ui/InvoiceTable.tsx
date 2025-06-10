import { Table, SkeletonText, Button, HStack } from "@chakra-ui/react";

import TablePopover from "./TablePopover";

import { Sale as PrismaSale, Invoice as PrismaInvoice, Drink } from '@prisma/client';
import { RiDeleteBin2Line, RiInboxArchiveLine, RiInboxUnarchiveLine } from "react-icons/ri";

interface Invoice extends PrismaInvoice {
    sales: Sale[];
}

interface Sale extends PrismaSale {
    drink: Drink;
}

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

export default function InvoiceTable({ invoices, modifyInvoice, deleteInvoice }: { invoices: Invoice[], modifyInvoice: (id: number, status: number) => void, deleteInvoice: (id: number) => void }) {

    return (
        <Table.Root size="sm" variant={"line"}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Vásárló</Table.ColumnHeader>
                    <Table.ColumnHeader>Időbélyeg</Table.ColumnHeader>
                    <Table.ColumnHeader>Típus</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Végösszeg</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Műveletek</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {invoices.length > 0 ? invoices.map((invoice: Invoice) => (
                    <Table.Row key={invoice.id}>
                        <Table.Cell>{invoice.paid}</Table.Cell>
                        <Table.Cell>{formatDate(invoice.createdAt)}</Table.Cell>
                        <Table.Cell>{invoice.type}</Table.Cell>
                        <Table.Cell textAlign="end">{calculateTotal(invoice.sales)} JMF</Table.Cell>
                        <Table.Cell>
                            <HStack gap={2} justifyContent={"end"}>
                                <TablePopover sales={invoice.sales} />
                                <Button colorPalette={"cyan"} variant={"subtle"} onClick={() => modifyInvoice(invoice.id, invoice.status === 0 ? 1 : 0)}>
                                    {invoice.status == 0 ? <RiInboxArchiveLine /> : <RiInboxUnarchiveLine />}</Button>
                                <Button colorPalette={"orange"} variant={"subtle"} onClick={() => deleteInvoice(invoice.id)}><RiDeleteBin2Line /></Button>
                            </HStack>
                        </Table.Cell>
                    </Table.Row>
                )) :
                    <Table.Row key={1}>
                        <Table.Cell><SkeletonText noOfLines={1} /></Table.Cell>
                        <Table.Cell><SkeletonText noOfLines={1} /></Table.Cell>
                        <Table.Cell><SkeletonText noOfLines={1} /></Table.Cell>
                        <Table.Cell textAlign="end"><SkeletonText noOfLines={1} /></Table.Cell>
                        <Table.Cell>
                            <HStack gap={2} justifyContent={"end"}>
                                <TablePopover sales={[]} disabled={true} />
                                <Button colorPalette={"cyan"} variant={"subtle"} disabled={true}><RiInboxArchiveLine /></Button>
                                <Button colorPalette={"orange"} variant={"subtle"} disabled={true}><RiDeleteBin2Line /></Button>
                            </HStack>
                        </Table.Cell>
                    </Table.Row>
                }
            </Table.Body>
        </Table.Root>
    );
}