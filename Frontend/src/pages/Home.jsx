import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const Home = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Recent Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        <li>Facebook Marketing Campaign</li>
                        <li>Facebook Ad Forms</li>
                        <li>Implement New Website</li>
                        <li>Build Web Assets</li>
                        <li>Select Website Platform</li>
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>My Connections</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>No connections yet</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>My Favourite Apps</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        <li>Inspiration</li>
                        <li>Projects</li>
                        <li>Leads & Clients</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default Home;