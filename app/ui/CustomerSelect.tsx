import { Combobox, Portal } from "@chakra-ui/react"

import { useFilter, useListCollection } from "@chakra-ui/react"

interface CustomerSelectProps {
    customers: string[];
    value: string;
    onChange: (value: string) => void;
  }

export default function CustomerSelect( {customers, value, onChange}: CustomerSelectProps) {

    const { contains } = useFilter({ sensitivity: "base" })

    const { collection, filter } = useListCollection({
        initialItems: customers,
        filter: contains,
    })

    return (
        <Combobox.Root
            collection={collection}
            onInputValueChange={(e) => {filter(e.inputValue); onChange(e.inputValue)}}
        >
            <Combobox.Control>
                <Combobox.Input value={value} placeholder="Vásárló" />
                <Combobox.IndicatorGroup>
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.Empty>No items found</Combobox.Empty>
                        {collection.items.map((item) => (
                            <Combobox.Item item={item} key={item}>
                                {item}
                                <Combobox.ItemIndicator />
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    )
}