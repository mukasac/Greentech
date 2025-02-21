"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string;
  linkedin: string | null;
  twitter: string | null;
}
interface TeamFormProps {
  onChange: (members: Omit<TeamMember, "id">[]) => void;
}

export function TeamForm({ onChange }: TeamFormProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "",
      role: "",
      bio: "",
      image: "",
      linkedin: "",
      twitter: "",
    },
  ]);

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: "",
      role: "",
      bio: "",
      image: "",
      linkedin: "",
      twitter: "",
    };
    const updatedMembers = [...teamMembers, newMember];
    setTeamMembers(updatedMembers);
    updateParent(updatedMembers);
  };

  const removeTeamMember = (id: string) => {
    const updatedMembers = teamMembers.filter((member) => member.id !== id);
    setTeamMembers(updatedMembers);
    updateParent(updatedMembers);
  };

  const handleChange = (id: string, field: keyof TeamMember, value: string) => {
    const updatedMembers = teamMembers.map((member) =>
      member.id === id ? { ...member, [field]: value } : member
    );
    setTeamMembers(updatedMembers);
    updateParent(updatedMembers);
  };

  const updateParent = (members: TeamMember[]) => {
    const membersWithoutId = members.map(({ id, ...member }) => ({
      ...member,
      bio: member.bio || null,
      linkedin: member.linkedin || null,
      twitter: member.twitter || null,
    }));
    onChange(membersWithoutId);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Team Members</h3>
              <Button type="button" onClick={addTeamMember} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </div>

            {teamMembers.map((member) => (
              <div key={member.id} className="space-y-4 rounded-lg border p-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTeamMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={member.name}
                      onChange={(e) =>
                        handleChange(member.id, "name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={member.role}
                      onChange={(e) =>
                        handleChange(member.id, "role", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={member.bio || ""}
                    onChange={(e) =>
                      handleChange(member.id, "bio", e.target.value)
                    }
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>LinkedIn Profile</Label>
                    <Input
                      type="url"
                      value={member.linkedin || ""}
                      onChange={(e) =>
                        handleChange(member.id, "linkedin", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter Profile</Label>
                    <Input
                      type="url"
                      value={member.twitter || ""}
                      onChange={(e) =>
                        handleChange(member.id, "twitter", e.target.value)
                      }
                    />
                  </div>
                </div>
                {/* Placeholder for image upload - you might want to add this later */}
                <div className="space-y-2">
                  <Label>Profile Image URL</Label>
                  <Input
                    type="url"
                    value={member.image}
                    onChange={(e) =>
                      handleChange(member.id, "image", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );


}
