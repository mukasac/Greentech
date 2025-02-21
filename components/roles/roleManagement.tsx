"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import UserRoleManagement from "./userRoleManagement";
import { usePermissions } from "@/hooks/usePermissions";

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface Permission {
  id: number;
  name: string;
}

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [isNewRoleDialogOpen, setIsNewRoleDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const fetchRolesAndPermissions = async () => {
    try {
      // Fetch roles
      const rolesRes = await fetch("/api/roles");
      if (!rolesRes.ok) {
        const errorData = await rolesRes.json();
        console.error("Roles fetch error:", errorData);
        throw new Error(`Failed to fetch roles: ${rolesRes.status}`);
      }

      // Fetch permissions
      const permissionsRes = await fetch("/api/permissions");
      if (!permissionsRes.ok) {
        const errorData = await permissionsRes.json();
        console.error("Permissions fetch error:", errorData);
        throw new Error(
          `Failed to fetch permissions: ${permissionsRes.status}`
        );
      }

      const rolesData = await rolesRes.json();
      const permissionsData = await permissionsRes.json();

      console.log("Fetched roles:", rolesData);
      console.log("Fetched permissions:", permissionsData);

      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      console.error("Fetch error details:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch roles and permissions"
      );
    }
  };
  // const fetchRolesAndPermissions = async () => {
  //   try {
  //     const [rolesRes, permissionsRes] = await Promise.all([
  //       fetch("/api/roles"),
  //       fetch("/api/permissions")
  //     ]);

  //     if (!rolesRes.ok || !permissionsRes.ok) {
  //       throw new Error("Failed to fetch data");
  //     }

  //     const rolesData = await rolesRes.json();
  //     const permissionsData = await permissionsRes.json();

  //     setRoles(rolesData);
  //     setPermissions(permissionsData);
  //   } catch (error) {
  //     setError("Failed to fetch roles and permissions");
  //   }
  // };

  const handleCreateRole = async () => {
    try {
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newRoleName,
          permissions: selectedPermissions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create role");
      }

      setSuccess("Role created successfully");
      setNewRoleName("");
      setSelectedPermissions([]);
      setIsNewRoleDialogOpen(false);
      fetchRolesAndPermissions();
    } catch (error) {
      setError("Failed to create role");
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        const response = await fetch(`/api/roles/${roleId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete role");
        }

        setSuccess("Role deleted successfully");
        fetchRolesAndPermissions();
      } catch (error) {
        setError("Failed to delete role");
      }
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };
  const { hasPermission } = usePermissions();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>
                Manage user roles and permissions
              </CardDescription>
            </div>
            <Dialog
              open={isNewRoleDialogOpen}
              onOpenChange={setIsNewRoleDialogOpen}
            >
              <DialogTrigger asChild>
                {hasPermission("ADD_ROLES") && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Role
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>
                    Define a new role and its permissions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Role Name"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Permissions</h4>
                    <div className="max-h-64 overflow-y-auto border p-2 rounded-md">
                      {permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={`perm-${permission.id}`}
                            checked={selectedPermissions.includes(
                              permission.id
                            )}
                            onChange={() =>
                              handlePermissionToggle(permission.id)
                            }
                            className="h-4 w-4"
                          />
                          <label htmlFor={`perm-${permission.id}`}>
                            {permission.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsNewRoleDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  {hasPermission("ADD_ROLES") && (
                    <Button onClick={handleCreateRole}>Create Role</Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Permissions</th>
                  <th className="px-6 py-3 w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr
                    key={role.id}
                    className="bg-blue-100 text-blue-800 text-xs font-medium border-b"
                  >
                    <td className="px-6 py-4 font-medium">{role.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission) => (
                          <span
                            key={permission.id}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded"
                          >
                            {permission.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* <div> */}
            <div className="container mx-auto p-6 space-y-6">
              <UserRoleManagement />
            </div>
            {/* </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;
