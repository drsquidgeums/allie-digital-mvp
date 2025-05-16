
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface NdaRecord {
  id: string;
  name: string;
  email: string;
  ip_address: string;
  agreed_at: string;
  agreement_version: string;
}

interface NdaAdminViewProps {
  isAdmin: boolean;
}

export const NdaAdminView: React.FC<NdaAdminViewProps> = ({ isAdmin }) => {
  const [records, setRecords] = useState<NdaRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('nda_agreements')
        .select('*')
        .order('agreed_at', { ascending: false });
        
      if (error) throw error;
      
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching NDA records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin || isAuthenticated) {
      fetchRecords();
    }
  }, [isAdmin, isAuthenticated]);

  const handleAdminLogin = () => {
    // Simple password check - for a real app, use proper authentication
    if (adminPassword === "admin2025") {
      setIsAuthenticated(true);
      localStorage.setItem("nda_admin_authenticated", "true");
    } else {
      alert("Incorrect password");
    }
  };

  const handleExportCsv = () => {
    if (!records.length) return;
    
    // Create CSV content
    const headers = ["Name", "Email", "IP Address", "Agreed At", "Agreement Version"];
    const csvContent = [
      headers.join(","),
      ...records.map(record => {
        const formattedDate = new Date(record.agreed_at).toLocaleString();
        return [
          `"${record.name.replace(/"/g, '""')}"`, 
          `"${record.email.replace(/"/g, '""')}"`, 
          `"${record.ip_address || ''}"`,
          `"${formattedDate}"`, 
          `"${record.agreement_version}"`
        ].join(",");
      })
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nda-agreements-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      record.name.toLowerCase().includes(searchLower) ||
      record.email.toLowerCase().includes(searchLower)
    );
  });

  if (!isAdmin && !isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>NDA Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium">
                Admin Password
              </label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleAdminLogin}>Login</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full my-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>NDA Agreement Records</CardTitle>
        <div className="flex space-x-2">
          <Input
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleExportCsv} variant="outline">
            Export CSV
          </Button>
          <Button onClick={fetchRecords} variant="outline">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6">Loading...</div>
        ) : records.length === 0 ? (
          <div className="text-center py-6">No NDA agreements found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-background border-b">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">IP Address</th>
                  <th className="px-4 py-2 text-left">Agreed At</th>
                  <th className="px-4 py-2 text-left">Version</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-2">{record.name}</td>
                    <td className="px-4 py-2">{record.email}</td>
                    <td className="px-4 py-2">{record.ip_address || 'Not collected'}</td>
                    <td className="px-4 py-2">
                      {new Date(record.agreed_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{record.agreement_version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
