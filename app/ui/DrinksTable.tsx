import { Table, HStack, Button, SkeletonText, VStack, Input, InputGroup } from "@chakra-ui/react";
import { RiDeleteBin2Line, RiUpload2Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import { Drink } from "@prisma/client";
import CustomAlert from "./CustomAlert";


export default function DrinksTable() {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
    });

    const [error, setError] = useState<string | null>(null);

    const addDrink = async (name: string, description: string, price: number) => {
        if (name.trim() === '' || description.trim() === '' || price <= 0) {
            setError("Kérlek, töltsd ki az összes mezőt helyesen!");
            setTimeout(() => setError(null), 5000);
            return;
        }

        const drink = await fetch('/api/drinks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, price }),
        });

        drink.json().then(res => {
            setDrinks([...drinks, { id: res.id, name: res.name, description: res.description, price: res.price }]);
            setFormData({ name: '', description: '', price: 0 });
        });
        return drink.json();
    }

    const deleteDrink = async (id: number) => {
        const drink = await fetch('/api/drinks', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        setDrinks(drinks.filter(d => d.id !== id));
        return drink.json();
    }

    useEffect(() => {
        fetch('/api/drinks').then(res => res.json()).then(data => {
            setDrinks(data);
        })
    }, []);

    return (
        <VStack gap={4} width={"100%"}>
            {error ? <CustomAlert message={error} type="error" /> : null}

            <Table.Root size="sm" variant={"line"}>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Név</Table.ColumnHeader>
                        <Table.ColumnHeader>Leírás</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">Ár</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">Műveletek</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            <Input placeholder="Példa koktél" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </Table.Cell>
                        <Table.Cell>
                            <Input placeholder="Összetevő 1, összetevő 2, összetevő 3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                            <InputGroup endAddon="JMF">
                                <Input textAlign="end" placeholder="0" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} />
                            </InputGroup>
                        </Table.Cell>
                        <Table.Cell>
                            <HStack gap={2} justifyContent={"end"}>
                                <Button colorPalette={"teal"} variant={"subtle"} onClick={() => addDrink(formData.name, formData.description, formData.price)}>
                                    <RiUpload2Line />
                                </Button>
                            </HStack>
                        </Table.Cell>
                    </Table.Row>


                    {drinks.length > 0 ? drinks.map((drink: Drink) => (
                        <Table.Row key={drink.id}>
                            <Table.Cell>{drink.name}</Table.Cell>
                            <Table.Cell>{drink.description}</Table.Cell>
                            <Table.Cell textAlign="end">{drink.price} JMF</Table.Cell>
                            <Table.Cell>
                                <HStack gap={2} justifyContent={"end"}>
                                    <Button colorPalette={"orange"} variant={"subtle"} onClick={() => deleteDrink(drink.id)}>
                                        <RiDeleteBin2Line />
                                    </Button>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    )) :
                        <Table.Row key={1}>
                            <Table.Cell><SkeletonText noOfLines={1} /></Table.Cell>
                            <Table.Cell><SkeletonText noOfLines={1} /></Table.Cell>
                            <Table.Cell textAlign="end"><SkeletonText noOfLines={1} /></Table.Cell>
                            <Table.Cell>
                                <HStack gap={2} justifyContent={"end"}>
                                    <Button colorPalette={"orange"} variant={"subtle"} disabled={true}><RiDeleteBin2Line /></Button>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    }
                </Table.Body>
            </Table.Root>
        </VStack>
    );
}