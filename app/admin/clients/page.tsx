"use client";

import { useState } from "react";
import { AdminSidebar } from "../components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Archive } from "lucide-react";

// Données fictives pour la démonstration
const clientsData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
    joinDate: "2024-01-15",
    lastActive: "2024-03-20"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Active",
    joinDate: "2024-02-01",
    lastActive: "2024-03-19"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "Archived",
    joinDate: "2023-12-10",
    lastActive: "2024-02-15"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    status: "Active",
    joinDate: "2024-03-01",
    lastActive: "2024-03-20"
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    status: "Active",
    joinDate: "2024-02-15",
    lastActive: "2024-03-18"
  }
];

export default function ClientManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState(clientsData);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleArchive = (clientId: number) => {
    setClients(clients.map(client => 
      client.id === clientId 
        ? { ...client, status: client.status === "Active" ? "Archived" : "Active" }
        : client
    ));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Client Management</h1>
          <Button className="bg-[rgb(10,197,178)] hover:bg-[rgb(10,197,178)]/90">
            <Plus className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Client List</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients..."
                    className="pl-8 w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.status === "Active" 
                          ? "bg-[rgb(10,197,178)]/10 text-[rgb(10,197,178)]" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell>{client.joinDate}</TableCell>
                    <TableCell>{client.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleArchive(client.id)}
                            className="flex items-center gap-2"
                          >
                            <Archive className="h-4 w-4" />
                            {client.status === "Active" ? "Archive" : "Unarchive"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 