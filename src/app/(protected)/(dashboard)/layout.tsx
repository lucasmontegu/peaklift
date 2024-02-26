import Sidebar from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 bg-muted p-2">
        {children}
      </main>
    </div>
  )
}