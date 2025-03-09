import React from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function WelcomeHeader() {
    return(
  <div className="mb-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome back, Frank!
        </h1>
        <p className="text-gray-600 mt-2">
          You're making great progress on your projects. Keep up the good work!
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="text-zinc-500 shrink-0 ">
            Switch Projects <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
         
            <DropdownMenuItem
              
            >
              Project title
            </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
  );
}
