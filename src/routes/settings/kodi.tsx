import { createFileRoute } from '@tanstack/react-router';
import { KodiSettings } from '@/features/settings/components/KodiSettings';

function KodiSettingsPage() {
  return <KodiSettings />;
}

export const Route = createFileRoute('/settings/kodi')({
  component: KodiSettingsPage,
});
