import axios from "axios";

const API_BASE = "/api";

export async function sendChatMessage(question: string): Promise<string> {
  try {
    const res = await axios.post(`${API_BASE}/chat`, { question });
    return res.data?.response || res.data?.answer || JSON.stringify(res.data);
  } catch (error) {
    throw new Error("Failed to get response from Raavan AI");
  }
}

export interface PlanetPosition {
  planet: string;
  sign: string;
  degree: number;
  retrograde?: boolean;
}

export interface AstrologyResult {
  planets: PlanetPosition[];
  name?: string;
}

export async function getAstrologyData(data: {
  name: string;
  dob: string;
  time: string;
  location: string;
}): Promise<AstrologyResult> {
  try {
    const res = await axios.post(`${API_BASE}/astrology`, data);
    return res.data;
  } catch (error) {
    throw new Error("Failed to generate horoscope");
  }
}
