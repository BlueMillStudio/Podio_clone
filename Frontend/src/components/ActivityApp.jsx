import React, { useState, useEffect } from 'react';
import {
    Activity,
    Users,
    Send,
    Lightbulb,
    Calendar,
    Briefcase,
    Plus,
    Paperclip,
    Link as LinkIcon,
    List,
    Image,
    MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea'; // New import

const ActivityApp = ({ workspace }) => {
    const appNavItems = [
        { icon: <Activity className="h-5 w-5" />, label: 'Activity' },
        { icon: <Users className="h-5 w-5" />, label: 'Contacts' },
        { icon: <Send className="h-5 w-5" />, label: 'Projects' },
        { icon: <Lightbulb className="h-5 w-5" />, label: 'Ideas' },
        { icon: <Calendar className="h-5 w-5" />, label: 'Calendar' },
        { icon: <Briefcase className="h-5 w-5" />, label: 'Expenses' },
    ];

    // State variables for posts
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [error, setError] = useState(null);

    // State variables for tasks
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [taskError, setTaskError] = useState(null);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');

    // Fetch posts from the backend
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `http://localhost:5000/api/activity/workspaces/${workspace.id}/posts`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setPosts(data.posts);
                } else {
                    console.error('Error fetching posts:', data.message);
                    setError(data.message);
                }
            } catch (err) {
                console.error('Error:', err);
                setError('An error occurred while fetching posts.');
            } finally {
                setLoadingPosts(false);
            }
        };

        fetchPosts();
    }, [workspace.id]);

    // Fetch tasks from the backend
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `http://localhost:5000/api/activity/workspaces/${workspace.id}/tasks`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setTasks(data.tasks);
                } else {
                    console.error('Error fetching tasks:', data.message);
                    setTaskError(data.message);
                }
            } catch (err) {
                console.error('Error:', err);
                setTaskError('An error occurred while fetching tasks.');
            } finally {
                setLoadingTasks(false);
            }
        };

        fetchTasks();
    }, [workspace.id]);

    // Handle creating a new post
    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return; // Prevent empty posts
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/activity/workspaces/${workspace.id}/posts`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        content: newPostContent,
                        // imageUrl: null // Handle image upload if needed
                    }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                // Add the new post to the top of the posts array
                setPosts([data.post, ...posts]);
                setNewPostContent('');
            } else {
                console.error('Error creating post:', data.message);
                // Handle error (e.g., show a notification)
            }
        } catch (err) {
            console.error('Error:', err);
            // Handle error (e.g., show a notification)
        }
    };

    // Handle creating a new task
    const handleCreateTask = async () => {
        if (!newTaskTitle.trim()) return; // Prevent empty task title
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/activity/workspaces/${workspace.id}/tasks`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: newTaskTitle,
                        description: newTaskDescription,
                        // dueDate: null, // Add if you have due date input
                        // assignedTo: null, // Add if you have assignee input
                    }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                // Add the new task to the tasks array
                setTasks([data.task, ...tasks]);
                setNewTaskTitle('');
                setNewTaskDescription('');
                setShowTaskForm(false);
            } else {
                console.error('Error creating task:', data.message);
                // Handle error (e.g., show a notification)
            }
        } catch (err) {
            console.error('Error:', err);
            // Handle error (e.g., show a notification)
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <main className="container mx-auto py-6">
                <Card className="mb-4 bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-2">This is your workspace dashboard.</h2>
                        <p className="text-sm text-gray-600">
                            We've included two sections for your use on this page. On the left side, track
                            day-to-day activities and post announcements, polls, and links only relevant to your
                            team. On the right side, build and add reports to keep track of your team's progress at
                            a high level.
                        </p>
                    </CardContent>
                </Card>

                <div className="flex gap-6">
                    <div className="w-3/5 space-y-4">
                        {/* Posts Section */}
                        <Card>
                            <CardHeader className="p-4">
                                <CardTitle className="flex justify-between items-center text-lg">
                                    <span>{workspace.name}</span>
                                    <Button variant="outline" size="sm">
                                        INVITE
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <Input
                                    placeholder="Share something. Use @ to mention individuals."
                                    className="mb-2"
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                />
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm">
                                            <Paperclip className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <LinkIcon className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <List className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button size="sm" onClick={handleCreatePost}>
                                        Share
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {loadingPosts ? (
                            <div>Loading posts...</div>
                        ) : error ? (
                            <div>Error: {error}</div>
                        ) : posts.length === 0 ? (
                            <div>No posts to display.</div>
                        ) : (
                            posts.map((post) => (
                                <Card key={post.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start space-x-3 mb-2">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                            <div>
                                                <p className="font-semibold text-sm">{post.author_name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(post.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm mb-2">{post.content}</p>
                                        {post.image_url && (
                                            <img
                                                src={post.image_url}
                                                alt={post.content}
                                                className="w-full h-48 object-cover rounded mb-2"
                                            />
                                        )}
                                        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                                            <div className="flex space-x-2">
                                                <span>
                                                    <MessageSquare className="h-4 w-4 inline mr-1" />
                                                    {post.comments_count || 0}
                                                </span>
                                                <span>👍 {post.likes_count || 0}</span>
                                            </div>
                                            <span>{post.taskName}</span>
                                        </div>
                                        <div className="flex space-x-2 text-xs">
                                            <Button variant="link" size="sm" className="p-0 text-blue-600">
                                                Like
                                            </Button>
                                            <Button variant="link" size="sm" className="p-0 text-blue-600">
                                                Comment
                                            </Button>
                                            <Button variant="link" size="sm" className="p-0 text-blue-600">
                                                Task
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}

                        <div className="text-center py-2">
                            <Button variant="link" size="sm" className="text-blue-600">
                                Create a status via email
                            </Button>
                            <span className="mx-2 text-gray-400">•</span>
                            <Button variant="link" size="sm" className="text-blue-600">
                                Unfollow
                            </Button>
                        </div>
                    </div>

                    <div className="w-2/5 space-y-4">
                        {/* Tasks Card */}
                        <Card>
                            <CardHeader className="p-4">
                                <CardTitle className="text-lg">
                                    {workspace.name} Tasks ({tasks.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                {loadingTasks ? (
                                    <p>Loading tasks...</p>
                                ) : taskError ? (
                                    <p>Error: {taskError}</p>
                                ) : tasks.length === 0 ? (
                                    <p className="text-sm text-gray-500 mb-2">No tasks to show</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {tasks.map((task) => (
                                            <li key={task.id} className="border p-2 rounded">
                                                <p className="font-semibold">{task.title}</p>
                                                {task.description && (
                                                    <p className="text-sm text-gray-600">{task.description}</p>
                                                )}
                                                {task.due_date && (
                                                    <p className="text-xs text-gray-500">
                                                        Due: {new Date(task.due_date).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-2"
                                    onClick={() => setShowTaskForm(true)}
                                >
                                    + CREATE TASK
                                </Button>
                                {showTaskForm && (
                                    <div className="mt-4">
                                        <Input
                                            placeholder="Task Title"
                                            className="mb-2"
                                            value={newTaskTitle}
                                            onChange={(e) => setNewTaskTitle(e.target.value)}
                                        />
                                        <Textarea
                                            placeholder="Task Description"
                                            className="mb-2"
                                            value={newTaskDescription}
                                            onChange={(e) => setNewTaskDescription(e.target.value)}
                                        />
                                        <div className="flex space-x-2">
                                            <Button size="sm" onClick={handleCreateTask}>
                                                Create Task
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => setShowTaskForm(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* You can implement Calendar, Files, Contacts similarly */}
                        {/* For brevity, we'll leave these sections as is */}
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
                <a href="#" className="mx-2 hover:text-gray-700">
                    About
                </a>
                <a href="#" className="mx-2 hover:text-gray-700">
                    Blog
                </a>
                <a href="#" className="mx-2 hover:text-gray-700">
                    App Market
                </a>
                <a href="#" className="mx-2 hover:text-gray-700">
                    Terms of Service
                </a>
                <a href="#" className="mx-2 hover:text-gray-700">
                    Privacy Policy
                </a>
                <a href="#" className="mx-2 hover:text-gray-700">
                    Status
                </a>
            </footer>
        </div>
    );
};

export default ActivityApp;