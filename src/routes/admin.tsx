import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { useSession } from "@/hooks/use-session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line,
} from "recharts";
import { Users, Bolt, DollarSign, Activity, Zap } from "lucide-react";
import { getAllUserSummaries, getDailyConsumption, mockUsers, RATE_PER_KWH } from "@/data/mockData";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — SmartLoad DR" }] }),
  component: AdminPage,
});

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function AdminPage() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session === null) navigate({ to: "/login" });
    else if (session.role !== "admin") navigate({ to: "/dashboard" });
  }, [session, navigate]);

  if (!session || session.role !== "admin") return null;

  const summaries = useMemo(() => getAllUserSummaries(), []);
  const totalKwh = summaries.reduce((a, s) => a + s.monthKwh, 0);
  const totalCost = summaries.reduce((a, s) => a + s.monthCost, 0);
  const totalSavings = summaries.reduce((a, s) => a + s.savings, 0);
  const avgDr = Math.round(summaries.reduce((a, s) => a + s.drParticipation, 0) / summaries.length);

  // Aggregate daily consumption across all users (last 30d)
  const aggDaily = useMemo(() => {
    const map = new Map<string, number>();
    summaries.forEach((s) => {
      getDailyConsumption(s.userId, 30).forEach((d) => {
        map.set(d.date, (map.get(d.date) ?? 0) + d.kwh);
      });
    });
    return [...map.entries()].sort(([a],[b]) => a < b ? -1 : 1)
      .map(([date, kwh]) => ({ date, kwh: +kwh.toFixed(2), cost: +(kwh * RATE_PER_KWH).toFixed(2) }));
  }, [summaries]);

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin overview</h1>
          <p className="text-sm text-muted-foreground">Fleet-wide analytics across {summaries.length} users.</p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Users} label="Active users" value={String(summaries.length)} />
          <Stat icon={Bolt}  label="Total kWh (30d)" value={`${totalKwh.toFixed(0)} kWh`} />
          <Stat icon={DollarSign} label="Total billed" value={`$${totalCost.toFixed(2)}`} />
          <Stat icon={Zap}   label="Avg DR participation" value={`${avgDr}%`} />
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Aggregated daily consumption (30d)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={aggDaily}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" fontSize={10} tickFormatter={(d) => d.slice(5)} />
                  <YAxis fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Line dataKey="kwh" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Share by user</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={summaries} dataKey="monthKwh" nameKey="name" innerRadius={50} outerRadius={90}>
                    {summaries.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Per-user kWh & savings (30d)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={summaries}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="monthKwh" name="kWh" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="savings" name="Savings ($)" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Users</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Meter</TableHead>
                  <TableHead className="text-right">kWh (30d)</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Savings</TableHead>
                  <TableHead className="text-right">DR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries.map((s) => {
                  const u = mockUsers.find((m) => m.id === s.userId)!;
                  return (
                    <TableRow key={s.userId}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-muted-foreground">{s.email}</TableCell>
                      <TableCell><code>{u.meterId}</code></TableCell>
                      <TableCell className="text-right">{s.monthKwh.toFixed(1)}</TableCell>
                      <TableCell className="text-right">${s.monthCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-green-600">${s.savings.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={s.drParticipation > 75 ? "default" : "secondary"}>
                          {s.drParticipation}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <p className="mt-3 text-xs text-muted-foreground">
              Total fleet savings: <span className="font-semibold text-green-600">${totalSavings.toFixed(2)}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
