import { Alert } from "@chakra-ui/react";

export default function CustomAlert({ message, type }: { message: string; type: 'success' | 'error' }) {
    return (
        <Alert.Root status={type}>
            <Alert.Indicator />
            <Alert.Title>{message}</Alert.Title>
        </Alert.Root>
    );
}