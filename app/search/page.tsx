"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserReservations, Reservation } from "@/app/services/reservationService";

export default function SearchPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) {
      router.push("/auth/signin?redirect=/search");
      return;
    }
    const fetchReservations = async () => {
      setLoading(true);
      setError("");
      const response = await getUserReservations();
      if (response.status === "success" && response.data) {
        // Handle paginated or direct array
        if (Array.isArray(response.data)) {
          setReservations(response.data);
        } else if (typeof response.data === "object" && response.data !== null && "data" in response.data && Array.isArray((response.data as any).data)) {
          setReservations((response.data as any).data);
        } else {
          setReservations([]);
        }
      } else {
        setError(response.message || "Failed to fetch reservations.");
      }
      setLoading(false);
    };
    fetchReservations();
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Reservations</h1>
      {loading && <div>Loading reservations...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {!loading && !error && reservations.length === 0 && (
        <div>No reservations found.</div>
      )}
      {!loading && !error && reservations.length > 0 && (
        <ul className="space-y-4">
          {reservations.map((res) => (
            <li key={res.id} className="border rounded p-4 bg-white/80 shadow">
              <div className="font-semibold">Listing: {res.listing?.title || res.listing_id}</div>
              <div>From: {res.start_date}</div>
              <div>To: {res.end_date}</div>
              <div>Status: <span className="capitalize font-medium">{res.status}</span></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 