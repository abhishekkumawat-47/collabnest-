import { ProjectProvider } from "../context/projectContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProjectProvider>
      {children}
    </ProjectProvider>
  );
}
