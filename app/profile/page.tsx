import React from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { RecentActivity } from "@/components/profile/RecentActivity";
import { ProfileBadges } from "@/components/profile/ProfileBadges";
import { CompletedProjects } from "@/components/profile/CompletedProjects";
import { UserDetails } from "@/components/profile/UserDetails";
import { CVSection } from "@/components/profile/CVSection";

export default function ProfilePage() {
  return (
    <>
      <div className='container mx-auto py-8 px-4 md:px-8 lg:max-w-320'>
        <div className='grid lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2'>
            <ProfileHeader />
            <ProfileStats />
            <CompletedProjects />
            <RecentActivity />
          </div>
          <div>
            <UserDetails />
            <ProfileBadges />
            <CVSection />
          </div>
        </div>
      </div>
    </>
  );
}
