'use client'

import { Popover, Portal, Button, Input, Text } from "@chakra-ui/react";
import { Sale as PrismaSale, Drink } from "@prisma/client";
import { RiInformation2Line } from "react-icons/ri";

interface Sale extends PrismaSale {
  drink: Drink;
}

interface TablePopoverProps {
  sales: Sale[];
  disabled?: boolean;
}

export default function TablePopover({ sales, disabled }: TablePopoverProps) {
    return (
        <Popover.Root size={"lg"}>
            <Popover.Trigger asChild>
              <Button background={"teal"} variant={"subtle"} disabled={disabled ? disabled : false}>
                <RiInformation2Line />
              </Button>
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner>
                <Popover.Content>
                  <Popover.Arrow />
                  <Popover.Body>
                    <Popover.Title fontWeight="medium">
                      Tételek
                    </Popover.Title>
                    {sales.map((sale) => (
                      <div key={sale.id}>
                        <Text>{sale.drink.name} - {sale.drink.price} JMF / {sale.quantity} db</Text>
                      </div>
                    ))}
                    
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
    );
}