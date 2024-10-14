import React from 'react';
import { Search, User, Bell, Paperclip, LinkIcon, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const EmployeeNetwork = () => {
    const dummyEmployees = [
        { id: 1, name: 'John Doe', avatar: '/path/to/avatar1.jpg' },
        { id: 2, name: 'Jane Smith', avatar: '/path/to/avatar2.jpg' },
    ];

    const dummyPosts = [
        { id: 1, author: 'John Doe', content: 'Just finished the quarterly report!', timestamp: '2 hours ago' },
        { id: 2, author: 'Jane Smith', content: 'Team meeting at 3 PM today', timestamp: '4 hours ago' },
    ];

    return (
        <div className="bg-gray-100 min-h-screen">
            <main className="container mx-auto py-6 flex gap-6">
                <div className="w-2/3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Employees ({dummyEmployees.length})</span>
                                <Button>INVITE</Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {dummyEmployees.map(employee => (
                                <div key={employee.id} className="flex items-center space-x-2 mb-2">
                                    <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full" />
                                    <span>{employee.name}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Input placeholder="Share something. Use @ to mention individuals." className="mb-4" />
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-2">
                                    <Paperclip className="h-5 w-5" />
                                    <LinkIcon className="h-5 w-5" />
                                    <List className="h-5 w-5" />
                                </div>
                                <Button>Share</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {dummyPosts.map(post => (
                        <Card key={post.id}>
                            <CardContent>
                                <p className="font-bold">{post.author}</p>
                                <p>{post.content}</p>
                                <p className="text-sm text-gray-500">{post.timestamp}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="w-1/3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome to the Employee Network</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>A place to communicate with the entire organization. Use the activity stream to share status updates, files, questions, and links with all your co-workers.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Employee Network Tasks (0)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>No tasks to show</p>
                            <Button variant="outline" className="mt-4">+ CREATE TASK</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Employee Network Files (0)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>No files to show</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default EmployeeNetwork;
