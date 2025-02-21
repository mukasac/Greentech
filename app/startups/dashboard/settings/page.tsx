"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/startups/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  User,
  Lock,
  Bell,
  ShieldAlert,
  Globe,
  Trash2
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

export default function SettingsDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    bio: ""
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
          // Update form with startup data
          if (data[0].name) {
            setProfileForm(prev => ({
              ...prev,
              name: data[0].name || "",
              // email would come from user profile
              bio: data[0].description || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching startups:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchStartups();
      if (session?.user?.email) {
        setProfileForm(prev => ({
          ...prev,
          email: session.user.email
        }));
      }
    }
  }, [status, router, session]);

  const handleProfileUpdate = () => {
    setSaveLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaveLoading(false);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion initiated. You will receive a confirmation email.");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardSidebar />
        
        <main>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and startup settings
            </p>
          </div>

          {startups.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <Settings className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-xl font-semibold">No Startups Yet</h2>
                <p className="mb-6 text-center text-muted-foreground">
                  Create a startup before configuring settings.
                </p>
                <Button asChild size="lg">
                  <Link href="/startups/create">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Your First Startup
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {startups.length > 1 && (
                <div className="mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <label className="mb-2 block text-sm font-medium">
                        Select Startup
                      </label>
                      <select
                        className="w-full rounded-md border p-2"
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

              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>
                        Manage your public profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio"
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                          placeholder="Tell us about yourself and your startup"
                          rows={5}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Profile Picture</Label>
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 overflow-hidden rounded-full border bg-muted">
                            <img
                              src="/placeholder-avatar.png"
                              alt="Profile picture"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <Button variant="outline" size="sm">
                            Change
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button onClick={handleProfileUpdate} disabled={saveLoading}>
                          {saveLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your account preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
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
                        <Select defaultValue="utc+1">
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
                          className="mt-4"
                          onClick={handleDeleteAccount}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
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
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>New Message Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when you receive new messages
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Job Application Updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications about your job postings
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Event Reminders</Label>
                            <p className="text-sm text-muted-foreground">
                              Get reminded about upcoming events
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Marketing Communications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive updates about new features and offers
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>Save Preferences</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Manage your account security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
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
                      
                      <div className="flex justify-end">
                        <Button>Update Password</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>
      </div>
    </div>
  );
}