"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusIcon, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { User } from "@/types/leaderboard";

interface SubTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: string;
    name: string;
  };
  onCreate: (projectData: {
    title: string;
    description: string;
    tags: string[];
    difficulty: string;
    deadlineToApply: string;
    deadlineToComplete: string;
    applicantCapacity: number;
    subheading: string;
    authorId: string;
    author: User;
  }) => void;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  currentUser,
  onCreate,
}: CreateProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("BEGINNER");
  const [deadlineToApply, setDeadlineToApply] = useState("");
  const [deadlineToComplete, setDeadlineToComplete] = useState("");
  const [applicantCapacity, setApplicantCapacity] = useState(1);
  const [subheading, setSubheading] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setDifficulty("BEGINNER");
    setDeadlineToApply("");
    setDeadlineToComplete("");
    setApplicantCapacity(1);
    setSubheading("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreateProject = async () => {
    if (!title || !description || !deadlineToApply || !deadlineToComplete) {
      alert("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    const projectData = {
      title,
      subheading,
      description,
      tags,
      difficulty,
      deadlineToApply,
      deadlineToComplete,
      applicantCapacity: applicantCapacity,

      author: currentUser,
    };

    try {
      // Make POST request to create project
      const response = await fetch("/api/projects/Create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const data = await response.json();
      onCreate(data); // Pass the response data to onCreate
      handleClose();
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='title'>Project Title *</Label>
            <Input
              id='title'
              placeholder='Enter project title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='subheading'>Subheading</Label>
            <Input
              id='subheading'
              placeholder='Enter a short subheading'
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='description'>Project Description *</Label>
            <Textarea
              id='description'
              placeholder='Describe your project'
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='tags'>Tags</Label>
              <Input
                id='tags'
                placeholder='Tags (comma separated)'
                value={tags.join(", ")} // Display tags with a comma and space
                onChange={(e) => {
                  // Allow free typing without processing
                  setTags([e.target.value]);
                }}
                onBlur={(e) => {
                  // Process tags when the input loses focus
                  const processedTags = e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag);
                  setTags(processedTags);
                }}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='difficulty'>Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id='difficulty'>
                  <SelectValue placeholder='Select difficulty' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='BEGINNER'>BEGINNER</SelectItem>
                  <SelectItem value='INTERMEDIATE'>INTERMEDIATE</SelectItem>
                  <SelectItem value='ADVANCED'>ADVANCED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='deadlineToApply'>Deadline to Apply *</Label>
              <Input
                id='deadlineToApply'
                type='date'
                value={deadlineToApply}
                onChange={(e) => setDeadlineToApply(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='deadlineToComplete'>Deadline to Complete *</Label>
              <Input
                id='deadlineToComplete'
                type='date'
                value={deadlineToComplete}
                onChange={(e) => setDeadlineToComplete(e.target.value)}
              />
            </div>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='capacity'>Applicant Capacity</Label>
            <Input
              id='capacity'
              type='number'
              min='1'
              value={applicantCapacity}
              onChange={(e) =>
                setApplicantCapacity(parseInt(e.target.value) || 1)
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleClose}
            variant='outline'
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            className='bg-blue-500 hover:bg-blue-600 text-white'
            disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
