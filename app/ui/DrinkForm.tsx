'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Select, Input, VStack, HStack, Text, Flex, Heading, Separator, Spinner } from '@chakra-ui/react';
import { Drink } from '@prisma/client';
import CustomerSelect from './CustomerSelect';
import CustomAlert from './CustomAlert';

export default function DrinkForm() {
    const [drinks, setDrinks] = useState([]);
    const [selected, setSelected] = useState<{ drink: Drink, quantity: number }[]>([]);
    const [customer, setCustomer] = useState('');
    const [customers, setCustomers] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/drinks').then(res => res.json()).then(setDrinks);
    }, []);

    useEffect(() => {
        fetch('/api/customers').then(res => res.json()).then(setCustomers);
    }, []);

    const addToSelected = (drink: Drink, quantity: number) => {
        setSelected((prevSelected) => {
            const existingDrink = prevSelected.find((item) => item.drink.id === drink.id);
            if (existingDrink) {
                // If the drink already exists, increase its quantity
                return (prevSelected.map((item) =>
                    item.drink.id === drink.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item).filter((item) => item.quantity > 0)
                );
            } else if (quantity > 0) {
                return [...prevSelected, { drink: drink, quantity: quantity }];
            } else {
                return prevSelected;
            }
        });
    };

    const submit = async (type: String) => {
        if (selected.length === 0) {
            setError("Nincs kiválasztott ital!");
            setTimeout(() => setError(null), 5000);
            return;
        }
        if (customer.trim() === "") {
            setError("Kérlek, add meg a vásárló nevét!");
            setTimeout(() => setError(null), 5000);
            return;
        }

        const response = await fetch('/api/invoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, paid: customer, status: 0 }),
        });

        if (!response.ok) {
            throw new Error('Failed to create invoice');
        }

        const invoice = await response.json(); // Parse the response JSON
        const invoiceId = invoice.id; // Access the invoice ID

        console.log("Created Invoice ID:", invoiceId);

        selected.forEach(async (item) => {
            await fetch('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    drinkId: item.drink.id,
                    invoiceId: invoiceId,
                    quantity: item.quantity,
                }),
            });
        });

        setSuccess(`Sikeres tranzakció! Vásárló: ${customer}, Fizetési mód: ${type}`);
        setTimeout(() => setSuccess(null), 5000);

        setSelected([]);
        setCustomer('');
    };

    console.log("Customer:", customer);

    return (
        
        <VStack gap={4} align="stretch" mb={8}>
            {/* Top Buttons */}
            <HStack justify="space-between" mb={4}>
                <Button colorPalette={"teal"} onClick={() => submit("Készpénz")}>Készpénz</Button>
                <Button colorPalette={"blue"} onClick={() => submit("Tartozás")}>Tartozás</Button>
                <Text fontSize="xl" color={"pink"}>{selected.reduce((total, item) => total + item.drink.price * item.quantity, 0)} JMF</Text>
                <Button colorPalette={"green"} onClick={() => submit("Revolut")}>Revolut</Button>
                <Button colorPalette={"orange"} onClick={() => submit("Utalás")}>Utalás</Button>
            </HStack>

            <CustomerSelect customers={customers} value={customer} onChange={(e) => setCustomer(e)} />

            {error ? <CustomAlert message={error} type="error" /> : null}
            {success ? <CustomAlert message={success} type="success" /> : null}

            {/* Selected List */}
            {selected.length > 0 ? <Heading>Kosár</Heading> : null}
            <VStack gap={2} align="stretch" borderRadius="md">
                {selected.map((row: { drink: Drink; quantity: number }) => (
                    <Flex
                        key={row.drink.id}
                        justifyContent={"space-between"}
                        background={"whiteAlpha.900"}
                        color={"black"}
                        p={2}
                        borderRadius="md"
                    >
                        <Text w={"100%"} padding={2} fontWeight="bold">{row.drink.name}</Text>
                        <Text w={"100%"} padding={2} fontSize="sm" color="gray.500">{row.quantity} db</Text>
                        <Text w={"100%"} textAlign={"right"} paddingRight={10} paddingY={2}>{row.drink.price * row.quantity} JMF</Text>
                        <HStack gap={2} alignItems="center">
                            <Button size="sm" colorPalette={"teal"} onClick={() => addToSelected(row.drink, -1)}>-</Button>
                            <Text w={"100%"} fontSize="sm" color="gray.500">{row.quantity}</Text>
                            <Button size="sm" colorPalette={"teal"} onClick={() => addToSelected(row.drink, 1)}>+</Button>
                        </HStack>
                    </Flex>
                ))}
            </VStack>
            {selected.length > 0 ? <Separator size={"lg"} marginY={10} /> : null}

            {/* Drink List */}
            <Heading>Italok</Heading>
            <VStack gap={2} align="stretch" borderRadius="md">
                {drinks.length>0 ? drinks.map((drink: Drink) => (
                    <Flex
                        key={drink.id}
                        justifyContent={"space-between"}
                        background={"whiteAlpha.700"}
                        color={"black"}
                        p={2}
                        borderRadius="md"
                    >
                        <Text w={"100%"} padding={2} fontWeight="bold">{drink.name}</Text>
                        <Text w={"100%"} padding={2} fontSize="sm" color="gray.500">{drink.description}</Text>
                        <Text w={"100%"} textAlign={"right"} paddingRight={10} paddingY={2}>{drink.price} JMF</Text>
                        <Button size="sm" colorPalette={"teal"} onClick={() => addToSelected(drink, 1)}>+</Button>
                    </Flex>
                )) : <Spinner size="xl" />}
            </VStack>
        </VStack>
    );
}