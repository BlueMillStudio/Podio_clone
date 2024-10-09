import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Avatar } from '../components/ui/avatar';
import { ChevronDown, Mail, Phone } from 'lucide-react';

const Connections = () => {
  const [connections, setConnections] = useState([
    { id: 1, name: 'Kiyonzi Jay', phone: '+94753570996', email: 'kiyonzijay@gmail.com' },
    { id: 2, name: 'Nadeera', phone: '+94753570996', email: 'nadeerapalathiratne@gmail.com' },
  ]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Connections (All 2)</h1>
        <Input type="text" placeholder="Search connections" className="max-w-xs" />
        <Button variant="outline">+ ADD CONNECTION</Button>
      </div>

      <div className="space-y-4">
        {connections.map((connection) => (
          <div key={connection.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-4">
              <input type="checkbox" className="rounded" />
              <Avatar>
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold">
                  {connection.name[0]}
                </div>
              </Avatar>
              <div>
                <h2 className="font-semibold text-teal-900">{connection.name}</h2>
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {connection.phone}
                  </span>
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {connection.email}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost">
              Actions <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;