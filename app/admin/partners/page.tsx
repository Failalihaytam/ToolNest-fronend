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
import { Search, Plus, MoreVertical, Archive, Building2 } from "lucide-react";

// Données fictives pour la démonstration
const partnersData = [
  {
    id: 1,
    name: "Real Estate Pro",
    type: "Real Estate Agency",
    email: "contact@realestatepro.com",
    status: "Active",
    joinDate: "2024-01-10",
    listings: 45
  },
  {
    id: 2,
    name: "Urban Developers",
    type: "Property Developer",
    email: "info@urbandevelopers.com",
    status: "Active",
    joinDate: "2024-02-15",
    listings: 28
  },
  {
    id: 3,
    name: "Modern Architecture",
    type: "Architecture Firm",
    email: "contact@modernarch.com",
    status: "Archived",
    joinDate: "2023-11-20",
    listings: 12
  },
  {
    id: 4,
    name: "Property Masters",
    type: "Property Manager",
    email: "info@propertymasters.com",
    status: "Active",
    joinDate: "2024-03-01",
    listings: 35
  },
  {
    id: 5,
    name: "BuildRight Construction",
    type: "Construction Company",
    email: "contact@buildright.com",
    status: "Active",
    joinDate: "2024-02-20",
    listings: 18
  }
];

export default function PartnerManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [partners, setPartners] = useState(partnersData);

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleArchive = (partnerId: number) => {
    setPartners(partners.map(partner => 
      partner.id === partnerId 
        ? { ...partner, status: partner.status === "Active" ? "Archived" : "Active" }
        : partner
    ));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Partner Management</h1>
          <Button className="bg-[rgb(10,197,178)] hover:bg-[rgb(10,197,178)]/90">
            <Plus className="mr-2 h-4 w-4" />
            Add New Partner
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Partner List</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search partners..."
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
                  <TableHead>Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Listings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>{partner.type}</TableCell>
                    <TableCell>{partner.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        partner.status === "Active" 
                          ? "bg-[rgb(10,197,178)]/10 text-[rgb(10,197,178)]" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {partner.status}
                      </span>
                    </TableCell>
                    <TableCell>{partner.joinDate}</TableCell>
                    <TableCell>{partner.listings}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleArchive(partner.id)}
                            className="flex items-center gap-2"
                          >
                            <Archive className="h-4 w-4" />
                            {partner.status === "Active" ? "Archive" : "Unarchive"}
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