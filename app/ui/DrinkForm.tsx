'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Select, Input, VStack, HStack, Text, Flex, Heading, Separator } from '@chakra-ui/react';
import { Drink } from '@prisma/client';

export default function DrinkForm() {
    const [drinks, setDrinks] = useState([]);
    const [selected, setSelected] = useState<{ drink: Drink, quantity: number }[]>([]);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetch('/api/drinks').then(res => res.json()).then(setDrinks);
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

    const submit = async () => {
        await fetch('/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ drinkId: Number(selected), quantity: Number(quantity) }),
        });
        setQuantity(1);
    };

    return (
        <VStack gap={4} align="stretch" mb={8}>
            {/* Top Buttons */}
            <HStack justify="space-between" mb={4}>
                <Button colorPalette={"teal"}>Készpénz</Button>
                <Button colorPalette={"blue"}>Tartozás</Button>
                <Text fontSize="xl" color={"pink"}>{selected.reduce((total, item) => total + item.drink.price * item.quantity, 0)} JMF</Text>
                <Button colorPalette={"green"}>Revolut</Button>
                <Button colorPalette={"orange"}>Utalás</Button>
            </HStack>

            {/* Selected List */}
            {selected.length>0 ? <Heading>Kosár</Heading> : null}
            <VStack gap={2} align="stretch" bg="blackAlpha.800" borderRadius="md">
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
            {selected.length>0 ? <Separator size={"lg"} marginY={10}/>: null}

            {/* Drink List */}
            <Heading>Italok</Heading>
            <VStack gap={2} align="stretch" bg="blackAlpha.800" borderRadius="md">
                {drinks.map((drink: Drink) => (
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
                ))}
            </VStack>
        </VStack>
    );
}