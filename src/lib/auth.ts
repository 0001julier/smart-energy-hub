// Mock auth using localStorage. Backed by mockUsers JSON.
import { mockUsers, type MockUser, type Role } from "@/data/mockData";

const KEY = "slf_session";

export interface Session {
  userId: string;
  role: Role;
  name: string;
  email: string;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function setSession(s: Session | null) {
  if (typeof window === "undefined") return;
  if (s) window.localStorage.setItem(KEY, JSON.stringify(s));
  else window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("auth-change"));
}

export function login(email: string, password: string): Session {
  const u = mockUsers.find(
    (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password
  );
  if (!u) throw new Error("Invalid email or password");
  const s: Session = { userId: u.id, role: u.role, name: u.name, email: u.email };
  setSession(s);
  return s;
}

export function register(name: string, email: string, password: string): MockUser {
  if (mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Email already registered");
  }
  const u: MockUser = {
    id: `u${mockUsers.length + 1}`,
    name, email, password,
    role: "user",
    meterId: `SM-${1000 + mockUsers.length + 1}`,
    joined: new Date().toISOString().slice(0, 10),
  };
  mockUsers.push(u);
  return u;
}

export function logout() { setSession(null); }

// Mock OTP — always "123456" for demo
export const MOCK_OTP = "123456";
export function verifyOtp(code: string) {
  if (code !== MOCK_OTP) throw new Error("Invalid OTP. Hint: 123456");
}
