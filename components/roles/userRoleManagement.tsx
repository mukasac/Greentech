import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, UserCheck } from "lucide-react"
import { useEffect, useState } from "react"

// Define interfaces for our data types
interface Role {
    id: string;
    name: string;
}

interface User {
    id: string;
    name: string | null;
    email: string;
    role?: Role;
}

const UserRoleManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    // Fetch users when component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError('Failed to fetch users');
                console.error(error);
            }
        };

        fetchUsers();
    }, []);

    // Fetch roles when component mounts
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/roles');
                const data = await response.json();
                setRoles(data);
            } catch (error) {
                setError('Failed to fetch roles');
                console.error(error);
            }
        };

        fetchRoles();
    }, []);

    // Function to handle role changes
    const handleRoleChange = async (userId: string, newRoleId: string) => {
        try {
            // Make API call to update user role
            const response = await fetch('/api/users/role', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    roleId: newRoleId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user role');
            }

            // Update local state
            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, role: roles.find(role => role.id === newRoleId) }
                    : user
            ));

            setSuccess('User role updated successfully');
        } catch (error) {
            setError('Failed to update user role');
            console.error(error);
        }
    };

    return (
        <div className="mt-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <UserCheck className="h-5 w-5" />
                        <CardTitle>User Management</CardTitle>
                        {/* <CardDescription>Assign roles to users</CardDescription> */}
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert className="mb-4">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3">User Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Current Role</th>
                                    <th className="px-6 py-3">Assign Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b">
                                        <td className="px-6 py-4 font-medium">
                                            {user.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                                                {user.role?.name || 'No Role'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Select
                                                value={user.role?.id || ''}
                                                onValueChange={(newRoleId) => handleRoleChange(user.id, newRoleId)}
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.id}>
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserRoleManagement;