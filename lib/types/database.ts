export type Substrate = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type SessionStatus = "running" | "completed";

export type Session = {
  id: number;
  substrate_id: number;
  ph: number | null;
  temperature: number | null;
  volume: number | null;
  load_resistance: number | null;
  started_at: string | null;
  ended_at: string | null;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
};

export type SensorReading = {
  id: number;
  session_id: number;
  voltage: number;
  current: number;
  power: number;
  recorded_at: string;
};