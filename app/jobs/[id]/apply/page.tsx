"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Building2, 
  Loader2, 
  AlertCircle,
  Upload,
  Send
} from "lucide-react";
import Link from "next/link";
import { Job } from "@/lib/types/job";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  resume: File | null;
  coverLetter: string;
}

export default function JobApplyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: ""
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        console.log("Fetching job with ID:", params.id);
        const response = await fetch(`/api/jobs/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Job not found");
          }
          throw new Error("Failed to fetch job");
        }
        
        const data = await response.json();
        console.log("Job data fetched:", data);
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
        setError(error instanceof Error ? error.message : "Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        resume: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (!formData.fullName || !formData.email || !formData.resume) {
        throw new Error("Please fill in all required fields and upload your resume");
      }

      // This would normally submit to an API endpoint
      // For development, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        resume: null,
        coverLetter: ""
      });
      
      // Redirect after success with a delay
      setTimeout(() => {
        router.push(`/jobs/${params.id}?applied=true`);
      }, 2000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Job not found. The job listing may have been removed or expired."}
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 text-center">
          <Button asChild>
            <Link href="/jobs">View All Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6 px-6 pb-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for applying to {job?.title} at {job?.startup?.name}. 
                We have received your application and will be in touch soon.
              </p>
              <Button asChild>
                <Link href="/jobs">Browse More Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/jobs/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Details
          </Link>
        </Button>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Apply for {job?.title}</CardTitle>
            <CardDescription>
              {job?.startup?.name && (
                <div className="flex items-center mt-1">
                  <Building2 className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{job.startup.name}</span>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resume">Resume/CV *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                    disabled={submitting}
                    className="flex-1"
                  />
                  <div className="bg-secondary rounded-md p-2">
                    <Upload className="h-5 w-5 text-secondary-foreground" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Accepted formats: PDF, DOC, DOCX. Maximum size: 5MB.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  placeholder="Tell us why you're interested in this position and what makes you a good fit."
                  rows={6}
                  disabled={submitting}
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}