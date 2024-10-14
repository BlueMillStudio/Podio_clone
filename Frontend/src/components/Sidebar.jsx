import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Settings,
  UserCog,
  Shield,
  PieChart,
  ShoppingBag,
  ArrowUpCircle,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [organizations, setOrganizations] = useState([]);
  const [openOrgs, setOpenOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/organizations/user-organizations', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrganizations(data.organizations);

          // Initialize all organizations as open
          setOpenOrgs(data.organizations.map(() => true));
          setLoading(false);
        } else {
          setError('Failed to fetch organizations');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setError('An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [navigate]);

  const toggleOrg = (index) => {
    setOpenOrgs(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  if (loading) {
    return (
      <aside className={`bg-white w-64 min-h-screen flex flex-col border-r border-gray-200 fixed transition-all duration-300 ease-in-out ${isOpen ? 'left-0' : '-left-64'} z-50`}>
        <div className="p-4">Loading...</div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={`bg-white w-64 min-h-screen flex flex-col border-r border-gray-200 fixed transition-all duration-300 ease-in-out ${isOpen ? 'left-0' : '-left-64'} z-50`}>
        <div className="p-4 text-red-500">{error}</div>
      </aside>
    );
  }

  return (
    <aside className={`bg-white w-64 min-h-screen flex flex-col border-r border-gray-200 fixed transition-all duration-300 ease-in-out ${isOpen ? 'left-0' : '-left-64'} z-50`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-semibold text-teal-600">Organizations</h2>
        <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {organizations.map((org, orgIndex) => (
          <div key={org.id} className="border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center">
                <button onClick={() => toggleOrg(orgIndex)} className="text-gray-500 hover:text-gray-700">
                  {openOrgs[orgIndex] ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                </button>
                <span className="font-semibold text-sm text-gray-700">{org.name}</span>
              </div>
              {/* ... DropdownMenu as before ... */}
            </div>
            {openOrgs[orgIndex] && (
              <>
                <ul className="py-1">
                  {org.workspaces.map((item, index) => (
                    <li key={item.id}>
                      <Link to={`/workspaces/${item.id}`} className="flex items-center px-9 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                        <Briefcase className="h-4 w-4" />
                        <span className="ml-2">{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="px-9 py-1.5 space-y-1.5">
                  <button className="flex items-center w-full px-3 py-1.5 text-sm font-medium text-teal-600 hover:bg-gray-100 rounded">
                    <Plus className="h-4 w-4 mr-2" />
                    Create a workspace
                  </button>
                  <button className="flex items-center w-full px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage workspaces
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
