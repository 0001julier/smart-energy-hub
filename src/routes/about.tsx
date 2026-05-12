import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — SmartLoad DR" }, { name: "description", content: "About the SmartLoad DR project." }] }),
  component: () => (
    <SiteLayout>
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-4 text-4xl font-bold">About this project</h1>
        <p className="text-muted-foreground">
          AI-Based Smart Load Forecasting and Demand Response is a 5-phase project that ingests
          smart-meter data per user, sends alerts and DR actions, and optimizes consumption with a
          hybrid rule-based + reinforcement-learning engine. This frontend is a demo dashboard
          backed by mock JSON data, designed to plug into a Django REST API and Docker-based
          cloud deployment.
        </p>
      </div>
    </SiteLayout>
  ),
});
