import React from 'react';
import { Badge } from "@/components/ui/badge";

interface LeaderboardUserDomainsProps {
  domains: string[];
}

export const LeaderboardUserDomains: React.FC<LeaderboardUserDomainsProps> = ({ 
  domains = []
}) => {
  return (
    <div className="flex space-x-2">
      {domains.map((domain) => (
        <Badge key={domain} variant="secondary">
          {domain}
        </Badge>
      ))}
    </div>
  );
};