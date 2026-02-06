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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
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
} from 'lucide-react';
import type { SettingLevel, KodiSetting } from '@/api/types/settings';

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
  const [userSelectedSection, setUserSelectedSection] = useState<string | null>(null);
  const [userSelectedCategory, setUserSelectedCategory] = useState<string | null>(null);
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

  // Compute effective section - use user selection or default to first
  const selectedSection = useMemo(() => {
    if (userSelectedSection) return userSelectedSection;
    return sections?.[0]?.id ?? '';
  }, [userSelectedSection, sections]);

  const { data: categories, isLoading: categoriesLoading } = useKodiSettingCategories(
    selectedSection,
    level
  );

  // Compute effective category - use user selection or default to first
  // Reset to null when section changes (userSelectedSection changes)
  const selectedCategory = useMemo(() => {
    if (userSelectedCategory) {
      // Check if category is still valid for current section
      const isValid = categories?.some((c) => c.id === userSelectedCategory);
      if (isValid) return userSelectedCategory;
    }
    return categories?.[0]?.id ?? '';
  }, [userSelectedCategory, categories]);

  const {
    data: allSettings,
    isLoading: allSettingsLoading,
    isError: settingsError,
  } = useKodiSettings(level);

  // Fetch settings filtered by section/category (proper API filtering)
  const { data: categorySettings, isLoading: categorySettingsLoading } = useKodiSettingsByCategory(
    selectedSection,
    selectedCategory,
    level
  );

  // Handle section selection - reset category when section changes
  const handleSectionSelect = (sectionId: string) => {
    setUserSelectedSection(sectionId);
    setUserSelectedCategory(null); // Reset category to default to first
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setUserSelectedCategory(categoryId);
  };

  // Get settings for display - use API-filtered results for category view, client-filtered for search
  const filteredSettings = useMemo(() => {
    let result: KodiSetting[] = [];

    if (searchQuery.trim()) {
      // Search across all settings
      if (!allSettings) return [];
      const query = searchQuery.toLowerCase();
      result = allSettings.filter(
        (s) =>
          s.label.toLowerCase().includes(query) ||
          s.id.toLowerCase().includes(query) ||
          s.help?.toLowerCase().includes(query)
      );
    } else {
      // Use API-filtered category settings
      result = categorySettings ?? [];
    }

    // Filter out action types (they're typically buttons that trigger dialogs we can't show)
    return result.filter((s) => s.type !== 'action');
  }, [allSettings, categorySettings, searchQuery]);

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
          {/* Sidebar - Sections & Categories */}
          <div className="space-y-4">
            {/* Sections */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Sections</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                {sectionsLoading ? (
                  <div className="space-y-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-9 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {sections?.map((section) => (
                      <Button
                        key={section.id}
                        variant={selectedSection === section.id ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          handleSectionSelect(section.id);
                        }}
                      >
                        {sectionIcons[section.id] ?? <Settings className="h-4 w-4" />}
                        {section.label}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Categories */}
            {selectedSection && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {categoriesLoading ? (
                    <div className="space-y-1 p-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-full" />
                      ))}
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px]">
                      <div className="p-2">
                        {categories?.map((category) => (
                          <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => {
                              handleCategorySelect(category.id);
                            }}
                          >
                            <span className="truncate">{category.label}</span>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main content - Settings */}
          <Card>
            <CardHeader>
              <CardTitle>
                {categories?.find((c) => c.id === selectedCategory)?.label ?? 'Settings'}
              </CardTitle>
              {selectedCategory && (
                <CardDescription>
                  {filteredSettings.length} settings in this category
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {settingsLoading ? (
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
