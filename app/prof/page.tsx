"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProfessorProjectsPage = () => {
  // Sample data for demonstration
  const [projects, setProjects] = useState([
    {
      id: 'RL-2025-003',
      title: 'Autonomous Robot Navigation using Deep RL',
      status: 'Active',
      selectionCapacity: 5,
      applicantCapacity: 6,
      mentor: 'Dr. Anita Kumar',
      applications: [
        { id: 'app1', name: 'Raj Patel', avatar: 'R', date: 'Mar 10, 2025', status: 'Pending' },
        { id: 'app2', name: 'Maria Chen', avatar: 'M', date: 'Mar 9, 2025', status: 'Pending' }
      ]
    },
    {
      id: 'AI-2025-012',
      title: 'AI-Driven Climate Data Analysis',
      status: 'Active',
      selectionCapacity: 4,
      applicantCapacity: 4,
      mentor: 'Self-mentored',
      applications: [
        { id: 'app3', name: 'James Wilson', avatar: 'J', date: 'Mar 8, 2025', status: 'Pending' }
      ]
    }
  ]);

  // Demo function to handle application status changes
  const handleApplicationStatus = (projectId: string, appId: string, newStatus: string) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          applications: project.applications.map(app => 
            app.id === appId ? {...app, status: newStatus} : app
          ),
          selectionCapacity: newStatus === 'Accepted' && project.selectionCapacity < project.applicantCapacity ? 
            project.selectionCapacity + 1 : project.selectionCapacity
        };
      }
      return project;
    }));
  };




  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, Professor Sharma!</h1>
            <p className="text-gray-600">You currently manage 4 active projects with 23 students.</p>
          </div>
          <Button className="mt-4 md:mt-0 bg-black hover:bg-gray-800">Create New Project</Button>
        </div>

        {/* Projects list */}
        <div className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold">{project.title}</h2>
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                    <div className="text-sm text-gray-500 flex flex-wrap gap-x-6 gap-y-1">
                      <span>Project ID: {project.id}</span>
                      <span>Students: {project.selectionCapacity}/{project.applicantCapacity} positions filled</span>
                      <span>Mentor: {project.mentor}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Manage Team</Button>
                    <Button variant="outline" size="sm">Edit Project</Button>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="applications" className="w-full">
                <TabsList className="border-b w-full justify-start rounded-none px-6 bg-gray-50">
                  <TabsTrigger 
                    value="applications" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
                  >
                    Applications ({project.applications.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="description" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
                  >
                    Description
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="applications" className="p-0 m-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-left">
                        <tr>
                          <th className="px-6 py-3 text-sm font-medium text-gray-500">Student</th>
                          <th className="px-6 py-3 text-sm font-medium text-gray-500">Applied On</th>
                          <th className="px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                          <th className="px-6 py-3 text-sm font-medium text-gray-500">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {project.applications.map((app) => (
                          <tr key={app.id}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{app.avatar}</AvatarFallback>
                                </Avatar>
                                <span>{app.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">{app.date}</td>
                            <td className="px-6 py-4">
                              <Badge 
                                variant={app.status === 'Accepted' ? 'default' : 
                                        app.status === 'Rejected' ? 'destructive' : 'outline'}
                                className={app.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                              >
                                {app.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              {app.status === 'Pending' && (
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm"
                                    disabled={project.selectionCapacity >= project.applicantCapacity}
                                    onClick={() => handleApplicationStatus(project.id, app.id, 'Accepted')}
                                  >
                                    Accept
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleApplicationStatus(project.id, app.id, 'Rejected')}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="description" className="p-6 m-0">
                  <p className="text-sm text-gray-700">
                    This project focuses on developing autonomous navigation capabilities for robots using Deep Reinforcement Learning techniques.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">Deep Learning</Badge>
                    <Badge variant="secondary">Robotics</Badge>
                    <Badge variant="secondary">Navigation</Badge>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfessorProjectsPage;