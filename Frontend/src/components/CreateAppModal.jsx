import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Activity, Briefcase } from 'lucide-react';

const availableIcons = [
    { value: 'ActivityIcon', label: 'Activity', icon: <Activity className="h-5 w-5" /> },
    { value: 'BriefcaseIcon', label: 'Briefcase', icon: <Briefcase className="h-5 w-5" /> },
    // Add more icons as needed
];

const CreateAppModal = ({ isOpen, onClose, onCreateApp }) => {
    const [appName, setAppName] = useState('');
    const [itemName, setItemName] = useState('');
    const [appType, setAppType] = useState('standard');
    const [appIcon, setAppIcon] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Basic validation
        if (!appName.trim() || !itemName.trim() || !appIcon) {
            setError('Please fill in all required fields.');
            setIsSubmitting(false);
            return;
        }

        // Prepare app data
        const appData = {
            appName: appName.trim(),
            itemName: itemName.trim(),
            appType,
            appIcon,
        };

        try {
            // Call the onCreateApp callback passed from parent
            await onCreateApp(appData);
            // If onCreateApp handles navigation and closing, no need to do it here
        } catch (err) {
            console.error('Error creating app:', err);
            setError('Failed to create app. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setError('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New App</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        {/* App Name */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="appName" className="text-right">
                                App Name
                            </Label>
                            <Input
                                id="appName"
                                value={appName}
                                onChange={(e) => setAppName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        {/* Item Name */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="itemName" className="text-right">
                                Item Name
                            </Label>
                            <Input
                                id="itemName"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        {/* App Type */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">App Type</Label>
                            <RadioGroup
                                value={appType}
                                onValueChange={setAppType}
                                className="col-span-3"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="standard" id="standard" />
                                    <Label htmlFor="standard">Standard</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="event" id="event" />
                                    <Label htmlFor="event">Event</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="contact" id="contact" />
                                    <Label htmlFor="contact">Contact</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {/* App Icon */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="appIcon" className="text-right">
                                Icon
                            </Label>
                            <Select
                                onValueChange={setAppIcon}
                                className="col-span-3"
                                value={appIcon}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an icon..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableIcons.map((icon) => (
                                        <SelectItem key={icon.value} value={icon.value}>
                                            <span className="mr-2">{icon.icon}</span>
                                            {icon.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                !appName.trim() ||
                                !itemName.trim() ||
                                !appIcon ||
                                isSubmitting
                            }
                        >
                            {isSubmitting ? 'Creating...' : 'Create App'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAppModal;