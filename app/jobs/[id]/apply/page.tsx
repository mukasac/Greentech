"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
  Send,
  CheckCircle,
  ClipboardCheck,
  Calendar,
  MapPin,
  Briefcase,
  User
} from "lucide-react";
import Link from "next/link";
import { Job } from "@/lib/types/job";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  resume: File | null;
  coverLetter: string;
  linkedin?: string;
  portfolio?: string;
  heardFrom?: string;
  // Using company logo as profile image
  profileImage?: string;
}

export default function JobApplyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: "",
    linkedin: "",
    portfolio: "",
    heardFrom: "",
    profileImage: ""
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
        
        // Set the profile image to company logo
        if (data.startup?.logo) {
          setFormData(prev => ({
            ...prev,
            profileImage: data.startup.logo
          }));
        }
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
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
      setResumeFileName(file.name);
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
        coverLetter: "",
        linkedin: "",
        portfolio: "",
        heardFrom: "",
        profileImage: ""
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

  // Format location
  const formatLocation = (location: any) => {
    if (!location) return "N/A";
    
    const { type, city, country } = location;
    
    if (type === "remote") {
      return `Remote${country ? ` (${country})` : ''}`;
    }
    
    if (city && country) {
      return `${city}, ${country}`;
    }
    
    return country || 'Unknown location';
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
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
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
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/jobs/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Details
          </Link>
        </Button>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          {/* Job summary sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader className="border-b">
                <CardTitle>Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {job?.startup && (
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-lg border overflow-hidden flex-shrink-0 bg-white p-1">
                      {job.startup.logo ? (
                        <Image
                          src={job.startup.logo}
                          alt={job.startup.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                          <Building2 className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{job.title}</h3>
                      <p className="text-muted-foreground">{job.startup.name}</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p>{job?.location ? formatLocation(job.location) : 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Job Type</h3>
                      <p>{job?.type ? job.type.replace('-', ' ') : 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Posted</h3>
                      <p>{job?.postedAt ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }) : 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job?.skills?.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Application form */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-2xl font-bold">Apply for {job?.title}</CardTitle>
              <CardDescription>
                Fill out the form below to apply for this position
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16 border-2">
                    {formData.profileImage ? (
                      <AvatarImage src={formData.profileImage} alt="Profile" />
                    ) : (
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="text-base font-medium">Application Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Your application profile uses the company logo as your profile image
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                        placeholder="johndoe@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={submitting}
                        placeholder="+47 123 456 789"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        type="url"
                        value={formData.linkedin || ''}
                        onChange={handleChange}
                        disabled={submitting}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio or Website</Label>
                    <Input
                      id="portfolio"
                      name="portfolio"
                      type="url"
                      value={formData.portfolio || ''}
                      onChange={handleChange}
                      disabled={submitting}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume/CV <span className="text-red-500">*</span></Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="resume"
                          name="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          required
                          disabled={submitting}
                          className={resumeFileName ? "text-transparent" : ""}
                        />
                        {resumeFileName && (
                          <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                            <ClipboardCheck className="h-4 w-4 text-green-600 mr-2" />
                            <span className="truncate">{resumeFileName}</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-primary/10 rounded-md p-2 flex-shrink-0">
                        <Upload className="h-5 w-5 text-primary" />
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
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="heardFrom">How did you hear about this position?</Label>
                    <Input
                      id="heardFrom"
                      name="heardFrom"
                      value={formData.heardFrom || ''}
                      onChange={handleChange}
                      disabled={submitting}
                      placeholder="LinkedIn, friend, company website, etc."
                    />
                  </div>
                </div>
              
                <CardFooter className="flex justify-end px-0 pt-4 pb-0">
                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      disabled={submitting}
                      asChild
                    >
                      <Link href={`/jobs/${params.id}`}>Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}