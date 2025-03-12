import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Mail, MapPin, Briefcase, QrCode, University } from 'lucide-react';

const detailsData = [
    {
        icon: QrCode,
        label: 'Roll No',
        value: '2301CS1234',
    },
    {
        icon: University,
        label: 'College',
        value: 'Indian Institute of Technology, Patna',
    },
    {
        icon: GraduationCap,
        label: 'Degree',
        value: 'B.Tech in Computer Science and Engineering',
    },
    {
        icon: Briefcase,
        label: 'Branch',
        value: 'CSE',
    },
    {
        icon: Mail,
        label: 'Email',
        value: 'frank.ocean@iitp.ac.in',
    },
    {
        icon: MapPin,
        label: 'Location',
        value: 'Patna, Bihar',
    },
];

export const UserDetails = () => {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                    {detailsData.map((detail) => (
                        <div key={detail.label} className="flex items-center space-x-3">
                            <detail.icon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <div className="text-sm text-muted-foreground">{detail.label}</div>
                                <div className="font-medium">{detail.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
