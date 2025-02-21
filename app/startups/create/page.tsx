import { StartupProfileForm } from "@/components/startups/forms/startup-profile-form";

export default function CreateStartupPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Create Your Startup Profile</h1>
          <p className="text-muted-foreground">
            Share your sustainable innovation with the Nordic community
          </p>
        </div>
        <StartupProfileForm />
      </div>
    </div>
  );
}