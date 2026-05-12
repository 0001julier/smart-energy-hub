import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  { t: "Live forecast", d: "24-hour rolling forecast vs actual consumption." },
  { t: "Demand response", d: "Automated DR events with credits & savings tracking." },
  { t: "Notifications", d: "Push alerts for peaks, anomalies and DR opportunities." },
  { t: "Multi-period analytics", d: "Day, week, month and year breakdowns." },
  { t: "Predictions", d: "Bill prediction based on rolling 7-day average." },
  { t: "Admin overview", d: "Per-user analytics and fleet-wide totals." },
];

export const Route = createFileRoute("/features")({
  head: () => ({ meta: [{ title: "Features — SmartLoad DR" }] }),
  component: () => (
    <SiteLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-6 text-4xl font-bold">Features</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <Card key={i.t}>
              <CardContent className="p-6">
                <h3 className="mb-1 font-semibold">{i.t}</h3>
                <p className="text-sm text-muted-foreground">{i.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SiteLayout>
  ),
});
