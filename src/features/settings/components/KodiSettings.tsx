import { useState, useMemo, useEffect } from 'react';
import {
  useKodiSettingSections,
  useKodiSettingCategories,
  useKodiSettings,
  useKodiSettingsByCategory,
} from '@/api/hooks/useKodiSettings';
import { SettingInput } from '@/components/settings/SettingInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useBreadcrumbs } from '@/components/layout/BreadcrumbContext';
import {
  Settings,
  Search,
  Gamepad2,
  MonitorSmartphone,
  Film,
  Play,
  Tv2,
  Globe,
  Server,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import type { SettingLevel, KodiSettingSection, KodiSetting } from '@/api/types/settings';

/** Map section IDs to icons */
const sectionIcons: Record<string, React.ReactNode> = {
  games: <Gamepad2 className="h-4 w-4" />,
  interface: <MonitorSmartphone className="h-4 w-4" />,
  media: <Film className="h-4 w-4" />,
  player: <Play className="h-4 w-4" />,
  pvr: <Tv2 className="h-4 w-4" />,
  services: <Globe className="h-4 w-4" />,
  system: <Server className="h-4 w-4" />,
};

export function KodiSettings() {
  const [level, setLevel] = useState<SettingLevel>('standard');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [viewingSection, setViewingSection] = useState<string | null>(null);
  const [viewingCategory, setViewingCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { setItems } = useBreadcrumbs();

  // Set breadcrumbs
  useEffect(() => {
    setItems([{ label: 'Settings', href: '/settings' }, { label: 'Kodi Settings' }]);
  }, [setItems]);

  const {
    data: sections,
    isLoading: sectionsLoading,
    isError: sectionsError,
  } = useKodiSettingSections(level);

  const { data: categories } = useKodiSettingCategories(viewingSection ?? '', level);

  const {
    data: allSettings,
    isLoading: allSettingsLoading,
    isError: settingsError,
  } = useKodiSettings(level);

  // Fetch settings filtered by section/category (proper API filtering)
  const { data: categorySettings, isLoading: categorySettingsLoading } = useKodiSettingsByCategory(
    viewingSection ?? '',
    viewingCategory ?? '',
    level
  );

  // Handle expanding/collapsing a section in the sidebar (does not change main content)
  const handleToggleSection = (sectionId: string, open: boolean) => {
    setExpandedSection(open ? sectionId : null);
  };

  // Handle selecting a category (updates main content)
  const handleSelectCategory = (sectionId: string, categoryId: string) => {
    setViewingSection(sectionId);
    setViewingCategory(categoryId);
  };

  // Get settings for display - use API-filtered results for category view, client-filtered for search
  const filteredSettings = useMemo(() => {
    let result: KodiSetting[] = [];

    if (searchQuery.trim()) {
      if (!allSettings) return [];
      const query = searchQuery.toLowerCase();
      result = allSettings.filter(
        (s) =>
          s.label.toLowerCase().includes(query) ||
          s.id.toLowerCase().includes(query) ||
          s.help?.toLowerCase().includes(query)
      );
    } else if (viewingCategory) {
      result = categorySettings ?? [];
    }

    // Filter out action types (they're typically buttons that trigger dialogs we can't show)
    return result.filter((s) => s.type !== 'action');
  }, [allSettings, categorySettings, viewingCategory, searchQuery]);

  // Loading state depends on which data we're showing
  const settingsLoading = searchQuery.trim() ? allSettingsLoading : categorySettingsLoading;

  if (sectionsError || settingsError) {
    return (
      <div className="container py-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Settings
            </CardTitle>
            <CardDescription>
              Could not connect to Kodi to retrieve settings. Make sure Kodi is running and the
              connection is configured correctly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Settings className="h-6 w-6" />
            Kodi Settings
          </h1>
          <p className="text-muted-foreground mt-1">Configure your Kodi media center settings</p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={level}
            onValueChange={(v) => {
              setLevel(v as SettingLevel);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search all settings..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          className="pl-9"
        />
      </div>

      {searchQuery ? (
        // Search results
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Found {filteredSettings.length} settings matching "{searchQuery}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {settingsLoading ? (
              <SettingsLoadingSkeleton />
            ) : filteredSettings.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                No settings found. Try a different search term.
              </p>
            ) : (
              filteredSettings.map((setting) => <SettingInput key={setting.id} setting={setting} />)
            )}
          </CardContent>
        </Card>
      ) : (
        // Section / Category navigation
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar - Sections with nested Categories */}
          <Card>
            <CardContent className="p-2">
              {sectionsLoading ? (
                <div className="space-y-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SidebarMenuSkeleton key={i} showIcon />
                  ))}
                </div>
              ) : (
                <SidebarMenu>
                  {sections?.map((section) => (
                    <SectionItem
                      key={section.id}
                      section={section}
                      level={level}
                      isOpen={expandedSection === section.id}
                      selectedCategory={
                        viewingSection === section.id ? (viewingCategory ?? '') : ''
                      }
                      onToggle={(open) => {
                        handleToggleSection(section.id, open);
                      }}
                      onSelectCategory={(categoryId) => {
                        handleSelectCategory(section.id, categoryId);
                      }}
                    />
                  ))}
                </SidebarMenu>
              )}
            </CardContent>
          </Card>

          {/* Main content - Settings */}
          <Card>
            <CardHeader>
              <CardTitle>
                {categories?.find((c) => c.id === viewingCategory)?.label ?? 'Settings'}
              </CardTitle>
              {viewingCategory && (
                <CardDescription>
                  {filteredSettings.length} settings in this category
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {!viewingCategory ? (
                <p className="text-muted-foreground py-8 text-center">
                  Select a category to view settings.
                </p>
              ) : settingsLoading ? (
                <SettingsLoadingSkeleton />
              ) : filteredSettings.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  No configurable settings in this category.
                </p>
              ) : (
                filteredSettings.map((setting) => (
                  <SettingInput key={setting.id} setting={setting} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface SectionItemProps {
  section: KodiSettingSection;
  level: SettingLevel;
  isOpen: boolean;
  selectedCategory: string;
  onToggle: (open: boolean) => void;
  onSelectCategory: (categoryId: string) => void;
}

function SectionItem({
  section,
  level,
  isOpen,
  selectedCategory,
  onToggle,
  onSelectCategory,
}: SectionItemProps) {
  const { data: categories, isLoading } = useKodiSettingCategories(section.id, level);

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="group/collapsible" asChild>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            {sectionIcons[section.id] ?? <Settings className="h-4 w-4" />}
            <span>{section.label}</span>
            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <SidebarMenuSubItem key={i}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuSubItem>
                ))
              : categories?.map((category) => (
                  <SidebarMenuSubItem key={category.id}>
                    <SidebarMenuSubButton
                      isActive={selectedCategory === category.id}
                      onClick={() => {
                        onSelectCategory(category.id);
                      }}
                    >
                      <span>{category.label}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}
