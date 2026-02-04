import { createFileRoute } from '@tanstack/react-router';

function Settings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground">Settings feature coming soon...</p>
    </div>
  );
}

export const Route = createFileRoute('/settings/')({
  component: Settings,
});
