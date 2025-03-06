"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { DashboardSidebar } from "@/components/startups/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  PlusCircle, 
  Settings, 
  Lock,
  Bell,
  ShieldAlert,
  Globe,
  Trash2,
  UserCog,
  Palette,
  Moon,
  Sun,
  Users,
  CalendarDays,
  Newspaper,
  Briefcase
} from "lucide-react";
import { Startup } from "@/lib/types/startup";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

export default function SettingsDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [theme, setTheme] = useState<string>("system");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { hasPermission } = usePermissions();

  // Form states
  const [accountForm, setAccountForm] = useState({
    language: "en",
    timezone: "utc+1"
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    currentEmail: session?.user?.email || "",
    newEmail: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newMessageAlerts: true,
    jobApplicationUpdates: true,
    eventReminders: true,
    marketingCommunications: false
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    // Fetch user's startups
    const fetchStartups = async () => {
      try {
        const response = await fetch("/api/startups/user");
        if (!response.ok) {
          throw new Error("Failed to fetch startups");
        }
        const data = await response.json();
        setStartups(data);
        if (data.length > 0) {
          setSelectedStartup(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching startups:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchStartups();
    }
  }, [status, router, session]);

  const handleAccountUpdate = async () => {
    setSaveLoading(true);
    setError(null);
    
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Account settings updated successfully");
    } catch (error) {
      setError("Failed to update account settings");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSecurityUpdate = async () => {
    setSaveLoading(true);
    setError(null);
    
    // Validate passwords and emails
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
      setError("New passwords don't match");
      setSaveLoading(false);
      return;
    }

    if (securityForm.newEmail && !securityForm.currentPassword) {
      setError("Current password is required to change email");
      setSaveLoading(false);
      return;
    }

    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine what was updated for the success message
      let message = "Security settings updated successfully";
      if (securityForm.newPassword && securityForm.newEmail) {
        message = "Password and email updated successfully";
      } else if (securityForm.newPassword) {
        message = "Password updated successfully";
      } else if (securityForm.newEmail) {
        message = "Email updated successfully";
      }
      
      setSuccess(message);
      
      // Reset form fields after successful update
      setSecurityForm({
        ...securityForm,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        newEmail: ""
      });
      
      // If email was changed, update the current email
      if (securityForm.newEmail) {
        setSecurityForm(prev => ({
          ...prev,
          currentEmail: securityForm.newEmail
        }));
      }
    } catch (error) {
      setError("Failed to update security settings");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setSaveLoading(true);
    setError(null);
    
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Notification preferences updated successfully");
    } catch (error) {
      setError("Failed to update notification preferences");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion initiated. You will receive a confirmation email.");
    }
  };

  const handleToggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    // In a real app, you might save this to localStorage or user preferences
    // And toggle the theme class on document.documentElement
  };

  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="container py-4 md:py-8">
      <div className="grid gap-4 md:gap-8 md:grid-cols-[240px_1fr]">
        <div className="md:block hidden">
          <DashboardSidebar />
        </div>
        
        <main>
          <div className="mb-4 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your account and startup settings
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4 md:mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 md:mb-6 border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {startups.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-6 md:py-12">
                <div className="mb-4 rounded-full bg-muted p-4 md:p-6">
                  <Settings className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-lg md:text-xl font-semibold">No Startups Yet</h2>
                <p className="mb-4 md:mb-6 text-center text-muted-foreground text-sm md:text-base">
                  Create a startup before configuring settings.
                </p>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/startups/create">
                    <PlusCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Create Your First Startup
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {startups.length > 1 && (
                <div className="mb-4 md:mb-6">
                  <Card>
                    <CardContent className="p-4 md:pt-6">
                      <label className="mb-2 block text-sm font-medium">
                        Select Startup
                      </label>
                      <select
                        className="w-full rounded-md border p-2 text-sm md:text-base"
                        value={selectedStartup || ''}
                        onChange={(e) => setSelectedStartup(e.target.value)}
                      >
                        {startups.map((startup) => (
                          <option key={startup.id} value={startup.id}>
                            {startup.name}
                          </option>
                        ))}
                      </select>
                    </CardContent>
                  </Card>
                </div>
              )}

          <div className="overflow-x-auto pb-2">
              <Tabs defaultValue="account" className="space-y-4 md:space-y-6">
                <div className="border-b overflow-x-auto">
                  <TabsList className="w-max flex h-auto mb-0 bg-transparent p-0">
                    <TabsTrigger value="account" className="text-xs md:text-sm py-2 px-3 md:px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Account</TabsTrigger>
                    <TabsTrigger value="security" className="text-xs md:text-sm py-2 px-3 md:px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Security</TabsTrigger>
                    <TabsTrigger value="notifications" className="text-xs md:text-sm py-2 px-3 md:px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Notifications</TabsTrigger>
                    <TabsTrigger value="appearance" className="text-xs md:text-sm py-2 px-3 md:px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Appearance</TabsTrigger>
                    <TabsTrigger value="admin" className="text-xs md:text-sm py-2 px-3 md:px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Admin</TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Account Settings */}
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <UserCog className="h-5 w-5" />
                        <CardTitle>Account Settings</CardTitle>
                      </div>
                      <CardDescription>
                        Manage your account preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select 
                          value={accountForm.language}
                          onValueChange={(value) => setAccountForm({...accountForm, language: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="no">Norwegian</SelectItem>
                            <SelectItem value="sv">Swedish</SelectItem>
                            <SelectItem value="da">Danish</SelectItem>
                            <SelectItem value="fi">Finnish</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select 
                          value={accountForm.timezone}
                          onValueChange={(value) => setAccountForm({...accountForm, timezone: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                            <SelectItem value="utc+2">Eastern European Time (UTC+2)</SelectItem>
                            <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                            <SelectItem value="utc-5">Eastern Standard Time (UTC-5)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2 border-t pt-6">
                        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button 
                          variant="destructive" 
                          className="mt-4 w-full sm:w-auto"
                          onClick={handleDeleteAccount}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                        <Button onClick={handleAccountUpdate} disabled={saveLoading} className="w-full sm:w-auto">
                          {saveLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Security Settings */}
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Lock className="h-5 w-5" />
                        <CardTitle>Security Settings</CardTitle>
                      </div>
                      <CardDescription>
                        Manage your account security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Email Address</h3>
                        <div className="space-y-2">
                          <Label htmlFor="current-email">Current Email</Label>
                          <Input 
                            id="current-email" 
                            type="email" 
                            value={securityForm.currentEmail}
                            disabled
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-email">New Email</Label>
                          <Input 
                            id="new-email" 
                            type="email" 
                            value={securityForm.newEmail}
                            onChange={(e) => setSecurityForm({...securityForm, newEmail: e.target.value})}
                            placeholder="Enter new email address"
                          />
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-4">Password</h3>
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input 
                            id="current-password" 
                            type="password" 
                            value={securityForm.currentPassword}
                            onChange={(e) => setSecurityForm({...securityForm, currentPassword: e.target.value})}
                          />
                          <p className="text-sm text-muted-foreground">
                            Current password is required to change email or password
                          </p>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input 
                            id="new-password" 
                            type="password" 
                            value={securityForm.newPassword}
                            onChange={(e) => setSecurityForm({...securityForm, newPassword: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input 
                            id="confirm-password" 
                            type="password" 
                            value={securityForm.confirmPassword}
                            onChange={(e) => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="space-y-0.5">
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between pt-4">
                        <div className="space-y-0.5">
                          <Label>Login Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications for new login attempts
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                        <Button 
                          variant="outline"
                          onClick={() => setSecurityForm({
                            ...securityForm,
                            newEmail: "",
                            newPassword: "",
                            confirmPassword: "",
                            currentPassword: ""
                          })}
                          className="order-1 sm:order-none"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSecurityUpdate} 
                          disabled={saveLoading || Boolean(!securityForm.currentPassword && (securityForm.newPassword || securityForm.newEmail))}
                        >
                          {saveLoading ? "Updating..." : "Update Security Settings"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Notification Settings */}
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5" />
                        <CardTitle>Notification Settings</CardTitle>
                      </div>
                      <CardDescription>
                        Configure how you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive email notifications for important updates
                            </p>
                          </div>
                          <Switch 
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) => 
                              setNotificationSettings({...notificationSettings, emailNotifications: checked})
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>New Message Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when you receive new messages
                            </p>
                          </div>
                          <Switch 
                            checked={notificationSettings.newMessageAlerts}
                            onCheckedChange={(checked) => 
                              setNotificationSettings({...notificationSettings, newMessageAlerts: checked})
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Job Application Updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications about your job postings
                            </p>
                          </div>
                          <Switch 
                            checked={notificationSettings.jobApplicationUpdates}
                            onCheckedChange={(checked) => 
                              setNotificationSettings({...notificationSettings, jobApplicationUpdates: checked})
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Event Reminders</Label>
                            <p className="text-sm text-muted-foreground">
                              Get reminded about upcoming events
                            </p>
                          </div>
                          <Switch 
                            checked={notificationSettings.eventReminders}
                            onCheckedChange={(checked) => 
                              setNotificationSettings({...notificationSettings, eventReminders: checked})
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Marketing Communications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive updates about new features and offers
                            </p>
                          </div>
                          <Switch 
                            checked={notificationSettings.marketingCommunications}
                            onCheckedChange={(checked) => 
                              setNotificationSettings({...notificationSettings, marketingCommunications: checked})
                            }
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <Button 
                          onClick={handleNotificationUpdate} 
                          disabled={saveLoading}
                          className="w-full sm:w-auto"
                        >
                          {saveLoading ? "Saving..." : "Save Preferences"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appearance">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Palette className="h-5 w-5" />
                        <CardTitle>Appearance Settings</CardTitle>
                      </div>
                      <CardDescription>
                        Customize how the platform looks
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="mb-2 md:mb-4 text-lg font-medium">Theme</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            <span className="md:hidden">Tap to select theme</span>
                            <span className="hidden md:inline">Click to select theme</span>
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card 
                              className={`cursor-pointer border-2 ${theme === 'light' ? 'border-primary' : 'border-border'}`}
                              onClick={() => handleToggleTheme("light")}
                            >
                              <CardContent className="p-3 md:p-4 text-center">
                                <Sun className="mx-auto mb-2 h-6 w-6 md:h-8 md:w-8" />
                                <p className="font-medium text-sm md:text-base">Light</p>
                              </CardContent>
                            </Card>
                            
                            <Card 
                              className={`cursor-pointer border-2 ${theme === 'dark' ? 'border-primary' : 'border-border'}`}
                              onClick={() => handleToggleTheme("dark")}
                            >
                              <CardContent className="p-3 md:p-4 text-center">
                                <Moon className="mx-auto mb-2 h-6 w-6 md:h-8 md:w-8" />
                                <p className="font-medium text-sm md:text-base">Dark</p>
                              </CardContent>
                            </Card>
                            
                            <Card 
                              className={`cursor-pointer border-2 ${theme === 'system' ? 'border-primary' : 'border-border'}`}
                              onClick={() => handleToggleTheme("system")}
                            >
                              <CardContent className="p-3 md:p-4 text-center">
                                <div className="mx-auto mb-2 flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-muted">
                                  <Settings className="h-4 w-4 md:h-5 md:w-5" />
                                </div>
                                <p className="font-medium text-sm md:text-base">System</p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="mb-4 text-lg font-medium">Accessibility</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Reduced Motion</Label>
                                <p className="text-sm text-muted-foreground">
                                  Reduce animation and motion effects
                                </p>
                              </div>
                              <Switch />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>High Contrast</Label>
                                <p className="text-sm text-muted-foreground">
                                  Increase contrast between elements
                                </p>
                              </div>
                              <Switch />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Admin Settings */}
                <TabsContent value="admin">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <ShieldAlert className="h-5 w-5" />
                        <CardTitle>Admin Settings</CardTitle>
                      </div>
                      <CardDescription>
                        Manage administrative controls and permissions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {hasPermission("ADMIN_ACCESS") ? (
                        <>
                          <div className="space-y-2">
                            <h3 className="font-medium">Role Management</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Configure user roles and permissions for your organization
                            </p>
                            <Button asChild>
                              <Link href="/roles/roleManagement">
                                Manage Roles & Permissions
                              </Link>
                            </Button>
                          </div>
                          
                          <div className="space-y-2 border-t pt-6">
                            <h3 className="font-medium">User Management</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Manage users and their access levels
                            </p>
                            <Button asChild>
                              <Link href="/admin/users">
                                Manage Users
                              </Link>
                            </Button>
                          </div>
                          
                      
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">Admin Access Required</h3>
                          <p className="text-muted-foreground">
                            You do not have permission to access admin settings.
                            Please contact an administrator if you need access.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}