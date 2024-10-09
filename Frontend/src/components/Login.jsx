// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader>
                <h2 className="text-2xl font-bold text-center">Login</h2>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
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
                        <Button type="submit">Login</Button>
                        <Button variant="outline" onClick={() => navigate('/register')}>
                            Register
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
};

export default Login;
