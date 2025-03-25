import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import authService from "../lib/api.mjs";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { token, user } = await authService.register({
        name: formData.name,
        username: formData.username,
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast({ title: "Registration Successful", description: "Your account has been created" });
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="py-20 portfolio-container flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
            <CardDescription>Enter your details to sign up</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input id="name" name="name" placeholder="Name" required value={formData.name} onChange={handleChange} />
                <Input id="username" name="username" placeholder="Username" required value={formData.username} onChange={handleChange} />
                <Input id="email" name="email" type="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
                <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} />
                <Input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} />
                <Button type="submit" disabled={isLoading}>{isLoading ? "Creating account..." : "Register"}</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm">Already have an account? <Link to="/login" className="text-primary">Login</Link></p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
