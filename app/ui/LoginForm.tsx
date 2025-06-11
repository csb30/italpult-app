'use client'

import { useState } from 'react';
import { Box, Input, Button, VStack, Text } from '@chakra-ui/react';
import CustomAlert from './CustomAlert';
import { useRouter } from 'next/navigation'

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>('');
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('../api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!res.ok) {
            setError('Hibás felhasználónév vagy jelszó!');
            setTimeout(() => setError(null), 5000);
        }
        router.push('/')
    };

    return (
        <Box maxW="sm" mx="auto" mt={16} p={6} borderWidth={1} borderRadius="md">
            <form onSubmit={handleSubmit}>
                <VStack gap={4}>
                    <Input
                        placeholder="Felhasználónév"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <Input
                        placeholder="Jelszó"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button type="submit" colorScheme="teal" w="full">
                        Bejelentkezés
                    </Button>
                    {error ? <CustomAlert message={error} type="error" /> : null}
                </VStack>
            </form>
        </Box>
    );
}