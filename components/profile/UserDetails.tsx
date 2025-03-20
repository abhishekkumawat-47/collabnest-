"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Mail, MapPin, Briefcase, QrCode, University } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Loader } from './Loader'; // Import the Loader component

export const UserDetails = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/forProfile/byEmail/${session?.user?.email}`);
        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError('Error fetching user details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session?.user?.email]);

  if (loading) return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-32">
          <Loader center text="Loading user information..." />
        </div>
      </CardContent>
    </Card>
  );
  
  if (error) return <p className="text-red-500">{error}</p>;

  const detailsData = [
    {
      icon: MapPin,
      label: 'Name',
      value: userData?.name || 'N/A', 
    },
    {
      icon: QrCode,
      label: 'Roll No',
      value: userData?.roll || 'N/A',
    },
    {
      icon: GraduationCap,
      label: 'Degree',
      value: userData?.degree || 'N/A',
    },
    {
      icon: Briefcase,
      label: 'Department',
      value: userData?.department || 'N/A',
    },
    {
      icon: Mail,
      label: 'Email',
      value: userData?.email || 'N/A',
    },
    {
      icon: University,
      label: 'College',
      value: 'Indian Institute of Technology, Patna',
    },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid xl:grid-cols-2 gap-4">
          {detailsData.map((detail) => (
            <div key={detail.label} className="flex items-center space-x-3">
              <detail.icon className="h-5 w-5 min-w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">{detail.label}</div>
                <div className={detail.label === 'Email' ? 'font-medium break-all' : 'font-medium'}>
                  {detail.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};