// ProfileCompletion.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

const ProfileCompletion = () => {
    const [companyName, setCompanyName] = useState('');
    const [industry, setIndustry] = useState('');
    const [useCase, setUseCase] = useState('');
    const [organizationSize, setOrganizationSize] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/complete-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    companyName,
                    industry,
                    useCase,
                    organizationSize,
                    phoneNumber
                }),
            });

            if (response.ok) {
                navigate('/');
            } else {
                const data = await response.json();
                setError(data.message || 'An error occurred while completing your profile');
            }
        } catch (error) {
            setError('Unable to connect to the server. Please try again later.');
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader>
                <h2 className="text-2xl font-bold text-center">Complete Your Profile</h2>
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
                            placeholder="Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                        />
                        <Select onValueChange={setIndustry} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an industry..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tech">Technology</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                {/* Add more industries as needed */}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setUseCase}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a use case..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="projectManagement">Project Management</SelectItem>
                                <SelectItem value="crm">CRM</SelectItem>
                                <SelectItem value="hrm">Human Resources</SelectItem>
                                {/* Add more use cases as needed */}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setOrganizationSize} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your organization's size..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1-10">1-10 employees</SelectItem>
                                <SelectItem value="11-50">11-50 employees</SelectItem>
                                <SelectItem value="51-200">51-200 employees</SelectItem>
                                <SelectItem value="201-500">201-500 employees</SelectItem>
                                <SelectItem value="501+">501+ employees</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="tel"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <CardFooter className="flex justify-center mt-6">
                        <Button type="submit">Complete Profile</Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProfileCompletion;