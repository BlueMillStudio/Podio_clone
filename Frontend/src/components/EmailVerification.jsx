// src/components/EmailVerification.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

const EmailVerification = () => {
    const [status, setStatus] = useState('verifying');
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/verify-email/${token}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    setStatus('success');
                    setTimeout(() => navigate('/profile-completion'), 3000);
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error('Error verifying email:', error);
                setStatus('error');
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Email Verification</h2>
                </CardHeader>
                <CardContent>
                    {status === 'verifying' && (
                        <Alert>
                            <AlertDescription>Verifying your email...</AlertDescription>
                        </Alert>
                    )}
                    {status === 'success' && (
                        <Alert>
                            <AlertDescription>
                                Your email has been successfully verified. You will be redirected to complete your profile.
                            </AlertDescription>
                        </Alert>
                    )}
                    {status === 'error' && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                There was an error verifying your email. The link may be invalid or expired.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default EmailVerification;