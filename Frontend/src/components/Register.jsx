// frontend/src/components/Register.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsRegistered(true);
            } else {
                setError(data.message || 'An error occurred during registration');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Unable to connect to the server. Please try again later.');
        }
    };

    if (isRegistered) {
        return (
            <Card className="w-full max-w-md mx-auto mt-10">
                <CardContent>
                    <Alert>
                        <AlertDescription>
                            Registration successful! Please check your email to verify your account.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader>
                <h2 className="text-2xl font-bold text-center">Register</h2>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <CardFooter className="flex justify-between mt-6">
                        <Button type="submit">Register</Button>
                        <Button variant="outline" onClick={() => navigate('/login')}>
                            Back to Login
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
};

export default Register;
