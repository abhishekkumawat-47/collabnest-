"use client";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Subtask } from "@/types/leaderboard";

type Status = "OPEN" | "IN_PROGRESS" | "CLOSED";

export function ProjectTimeline({ tasks }: { tasks: Subtask[] }) {
  const [showAll, setShowAll] = useState(false);
  const buttonText = showAll ? "Show Less" : "View All";

  const toggleView = () => {
    setShowAll(!showAll);
  };

  const displayedTasks = showAll ? tasks : tasks.slice(-3);

  return (
    <Card>
      <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <CardTitle className='text-xl font-bold'>Task Timeline</CardTitle>
        {tasks.length > 3 && (
          <Button variant='outline' size='sm' onClick={toggleView}>
            {buttonText}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className='relative border-l border-gray-200 pl-6 pb-2 pt-2'>
          {displayedTasks.map((tas, index) => {
            const isLast = index === displayedTasks.length - 1;
            return (
              <TimelineItem
                key={tas.id}
                status={mapping[tas.status.replace(" ", "_") as Status]}
                title={tas.title}
                description={tas.description}
                dueDate={tas.deadline ? tas.deadline.slice(0, 10) : ""}
                isLast={isLast}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

const mapping: { [key in Status]: "completed" | "in-progress" | "upcoming" } = {
  OPEN: "upcoming",
  IN_PROGRESS: "in-progress",
  CLOSED: "completed",
};

interface TimelineItemProps {
  status: "completed" | "in-progress" | "upcoming";
  title: string;
  description: string;
  dueDate: string;
  isLast?: boolean;
}

function TimelineItem({
  status,
  title,
  description,
  dueDate,
  isLast = false,
}: TimelineItemProps) {
  const statusMap = {
    completed: {
      color: "bg-green-500",
      badge: (
        <Badge
          variant='outline'
          className='text-green-600 bg-green-50 hover:bg-green-100 border-green-200'>
          Completed
        </Badge>
      ),
    },
    "in-progress": {
      color: "bg-blue-500",
      badge: (
        <Badge
          variant='outline'
          className='text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200'>
          In Progress
        </Badge>
      ),
    },
    upcoming: {
      color: "bg-gray-300",
      badge: (
        <Badge
          variant='outline'
          className='text-gray-600 bg-gray-50 hover:bg-gray-100 border-gray-200'>
          Upcoming
        </Badge>
      ),
    },
  };

  return (
    <div className={`${!isLast ? "mb-8" : ""}`}>
      <div
        className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full ${statusMap[status].color} border-4 border-white`}></div>
      <div className='flex items-center flex-wrap gap-2 mb-1'>
        <h3 className='font-medium'>{title}</h3>
        {statusMap[status].badge}
      </div>
      <p className='text-sm text-gray-600 mb-1'>{description}</p>
      <p className='text-xs text-gray-500'>Due: {dueDate}</p>
    </div>
  );
}
