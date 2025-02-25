import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobType, ExperienceLevel, WorkLocation, Currency } from "@/lib/types/job";

interface JobPostingFormProps {
  startupId: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

interface FormState {
  title: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  locationType: WorkLocation;
  city: string;
  country: string;
  salaryMin: string;
  salaryMax: string;
  currency: Currency;
  description: string;
  requirements: string;
  responsibilities: string;
  skills: string;
  department: string;
}

interface JobApiRequest {
  title: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  location: {
    type: WorkLocation;
    city: string | null;
    country: string;
  };
  salary: {
    min: number;
    max: number;
    currency: Currency;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  department: string;
  startup: {
    id: string;
  };
  status: "active";
  postedAt: string;
  expiresAt: string;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ 
  startupId,
  onSuccess,
  onError
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormState>({
    title: "",
    type: "full-time",
    experienceLevel: "mid",
    locationType: "hybrid",
    city: "",
    country: "",
    salaryMin: "",
    salaryMax: "",
    currency: "EUR",
    description: "",
    requirements: "",
    responsibilities: "",
    skills: "",
    department: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startup: {
            id: startupId
          },
          requirements: formData.requirements.split('\n').filter(Boolean),
          responsibilities: formData.responsibilities.split('\n').filter(Boolean),
          skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
          salary: {
            min: parseInt(formData.salaryMin),
            max: parseInt(formData.salaryMax),
            currency: formData.currency
          },
          location: {
            type: formData.locationType,
            city: formData.city || null,
            country: formData.country
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create job posting');
      }

      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred while creating the job posting';
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Job Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: JobType) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Experience Level</Label>
            <Select
              value={formData.experienceLevel}
              onValueChange={(value: ExperienceLevel) => handleChange('experienceLevel', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label>Location Type</Label>
            <Select
              value={formData.locationType}
              onValueChange={(value: WorkLocation) => handleChange('locationType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="on-site">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="salaryMin">Minimum Salary</Label>
            <Input
              id="salaryMin"
              type="number"
              min="0"
              step="1000"
              value={formData.salaryMin}
              onChange={(e) => handleChange('salaryMin', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="salaryMax">Maximum Salary</Label>
            <Input
              id="salaryMax"
              type="number"
              min="0"
              step="1000"
              value={formData.salaryMax}
              onChange={(e) => handleChange('salaryMax', e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={(value: Currency) => handleChange('currency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="NOK">NOK</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Job Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="h-32"
            required
          />
        </div>

        <div>
          <Label htmlFor="requirements">Requirements (one per line)</Label>
          <Textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => handleChange('requirements', e.target.value)}
            placeholder="Enter each requirement on a new line"
            className="h-32"
            required
          />
        </div>

        <div>
          <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
          <Textarea
            id="responsibilities"
            value={formData.responsibilities}
            onChange={(e) => handleChange('responsibilities', e.target.value)}
            placeholder="Enter each responsibility on a new line"
            className="h-32"
            required
          />
        </div>

        <div>
          <Label htmlFor="skills">Required Skills (comma-separated)</Label>
          <Textarea
            id="skills"
            value={formData.skills}
            onChange={(e) => handleChange('skills', e.target.value)}
            placeholder="Enter skills separated by commas"
            required
          />
        </div>

        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Posting Job..." : "Post Job"}
      </Button>
    </form>
  );
};

export default JobPostingForm;