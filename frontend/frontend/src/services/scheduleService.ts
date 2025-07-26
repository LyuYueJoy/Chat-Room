import { API_BASE_URL } from "./api";
import { Schedule } from "@/models/schedule";


// get all schedules for current user
export async function getMySchedules(): Promise<Schedule[]> {
  const res = await fetch(`${API_BASE_URL}/api/schedule`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch schedules");
  return res.json();
}

// add a new schedule
export async function createSchedule(data: {
  date: string;
  content: string;
}): Promise<Schedule> {
  const res = await fetch(`${API_BASE_URL}/api/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create schedule");
  return res.json();
}

// renew schedule
export async function updateSchedule(id: string, data: Partial<Schedule>): Promise<Schedule> {
  const res = await fetch(`${API_BASE_URL}/api/schedule/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update schedule");
  return res.json();
}

// delete schedule 
export async function deleteSchedule(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/schedule/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete schedule");
}
