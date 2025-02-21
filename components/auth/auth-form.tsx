"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn } from "next-auth/react";

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("login");
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
        setIsLoading(false);
        return;
      }

      router.push("/startups/create");
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Clear form data
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setSuccessMessage("Registration successful! Please login.");
      setActiveTab("login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Add authentication logic
    setTimeout(() => {
      router.push("/startups/create");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="login"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-6">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {successMessage && (
                <div className="text-green-500 text-sm">{successMessage}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="register">
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4 pt-6">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );

  // return (
  //   <Card>
  //     <Tabs defaultValue="login" className="w-full">
  //       <TabsList className="grid w-full grid-cols-2">
  //         <TabsTrigger value="login">Login</TabsTrigger>
  //         <TabsTrigger value="register">Register</TabsTrigger>
  //       </TabsList>

  //       <TabsContent value="login">
  //         <form onSubmit={handleSubmit}>
  //           <CardContent className="space-y-4 pt-6">
  //             <div className="space-y-2">
  //               <Label htmlFor="email">Email</Label>
  //               <Input id="email" type="email" required />
  //             </div>
  //             <div className="space-y-2">
  //               <Label htmlFor="password">Password</Label>
  //               <Input id="password" type="password" required />
  //             </div>
  //           </CardContent>
  //           <CardFooter>
  //             <Button className="w-full" type="submit" disabled={isLoading}>
  //               {isLoading ? "Logging in..." : "Login"}
  //             </Button>
  //           </CardFooter>
  //         </form>
  //       </TabsContent>

  //       <TabsContent value="register">
  //         <form onSubmit={handleSubmit}>
  //           <CardContent className="space-y-4 pt-6">
  //             <div className="space-y-2">
  //               <Label htmlFor="company">Company Name</Label>
  //               <Input id="company" required />
  //             </div>
  //             <div className="space-y-2">
  //               <Label htmlFor="register-email">Email</Label>
  //               <Input id="register-email" type="email" required />
  //             </div>
  //             <div className="space-y-2">
  //               <Label htmlFor="register-password">Password</Label>
  //               <Input id="register-password" type="password" required />
  //             </div>
  //           </CardContent>
  //           <CardFooter>
  //             <Button className="w-full" type="submit" disabled={isLoading}>
  //               {isLoading ? "Creating Account..." : "Create Account"}
  //             </Button>
  //           </CardFooter>
  //         </form>
  //       </TabsContent>
  //     </Tabs>
  //   </Card>
  // );
}
