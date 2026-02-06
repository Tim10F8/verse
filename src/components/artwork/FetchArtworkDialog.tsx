import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Search,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Image as ImageIcon,
  AlertCircle,
  Check,
} from 'lucide-react';
import { tmdb, type TMDBSearchResult } from '@/api/tmdb';
import { useUpdateMovieArtwork, useUpdateTVShowArtwork } from '@/api/hooks/useMovieArtwork';
import { hasTmdbApiKey } from '@/lib/settings';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FetchArtworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaType: 'movie' | 'tv';
  title: string;
  year?: number;
  movieId?: number;
  tvshowId?: number;
  onArtworkUpdated?: () => void;
}

// Map TMDB image types to Kodi artwork types
const ARTWORK_TABS = [
  { key: 'posters', label: 'Poster', kodiType: 'poster' },
  { key: 'backdrops', label: 'Fanart', kodiType: 'fanart' },
  { key: 'logos', label: 'Clear Logo', kodiType: 'clearlogo' },
] as const;

type TabKey = (typeof ARTWORK_TABS)[number]['key'];

export function FetchArtworkDialog({
  open,
  onOpenChange,
  mediaType,
  title,
  year,
  movieId,
  tvshowId,
  onArtworkUpdated,
}: FetchArtworkDialogProps) {
  const [step, setStep] = useState<'search' | 'select' | 'artwork'>('search');
  const [searchQuery, setSearchQuery] = useState(title);
  const [searchYear, setSearchYear] = useState<number | undefined>(year);
  const [selectedResult, setSelectedResult] = useState<TMDBSearchResult | null>(null);
  const [applyingArtwork, setApplyingArtwork] = useState<string | null>(null);

  const updateMovieArtwork = useUpdateMovieArtwork();
  const updateTVShowArtwork = useUpdateTVShowArtwork();

  // Check if API key is configured
  const hasApiKey = hasTmdbApiKey();

  // Search mutation
  const searchMutation = useMutation({
    mutationFn: () =>
      mediaType === 'movie'
        ? tmdb.searchMovies(searchQuery, searchYear)
        : tmdb.searchTVShows(searchQuery, searchYear),
    onSuccess: () => {
      setStep('select');
    },
  });

  // Fetch artwork for selected result
  const { data: artwork, isLoading: artworkLoading } = useQuery({
    queryKey: ['tmdb-images', mediaType, selectedResult?.id],
    queryFn: () => {
      if (!selectedResult) {
        throw new Error('No result selected');
      }
      return mediaType === 'movie'
        ? tmdb.getMovieImages(selectedResult.id)
        : tmdb.getTVShowImages(selectedResult.id);
    },
    enabled: !!selectedResult && step === 'artwork',
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    searchMutation.mutate();
  };

  const handleSelectResult = (result: TMDBSearchResult) => {
    setSelectedResult(result);
    setStep('artwork');
  };

  const handleApplyArtwork = (url: string, kodiType: string) => {
    setApplyingArtwork(kodiType);

    const onSuccess = () => {
      setApplyingArtwork(null);
      if (onArtworkUpdated) {
        onArtworkUpdated();
      }
    };

    const onError = () => {
      setApplyingArtwork(null);
    };

    if (mediaType === 'movie' && movieId) {
      updateMovieArtwork.mutate({ movieId, artworkType: kodiType, url }, { onSuccess, onError });
    } else if (mediaType === 'tv' && tvshowId) {
      updateTVShowArtwork.mutate({ tvshowId, artworkType: kodiType, url }, { onSuccess, onError });
    }
  };

  const handleBack = () => {
    if (step === 'artwork') {
      setStep('select');
      setSelectedResult(null);
    } else if (step === 'select') {
      setStep('search');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after close animation
    setTimeout(() => {
      setStep('search');
      setSearchQuery(title);
      setSearchYear(year);
      setSelectedResult(null);
    }, 200);
  };

  const getArtworkCount = (type: TabKey): number => {
    if (!artwork) return 0;
    return artwork[type].length;
  };

  const getTotalArtworkCount = (): number => {
    if (!artwork) return 0;
    return ARTWORK_TABS.reduce((sum, { key }) => sum + getArtworkCount(key), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchYear(e.target.value ? parseInt(e.target.value, 10) : undefined);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step !== 'search' && (
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <DialogTitle>
                {step === 'search' && 'Fetch Artwork'}
                {step === 'select' && 'Select Match'}
                {step === 'artwork' && selectedResult?.title}
              </DialogTitle>
              <DialogDescription>
                {step === 'search' && `Search TMDB for "${title}" to fetch artwork`}
                {step === 'select' && 'Select the correct match from search results'}
                {step === 'artwork' && 'Select artwork to apply to your library'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!hasApiKey && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              TMDB API key not configured. Please add your API key in Settings to fetch artwork.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-hidden">
          {/* Step 1: Search */}
          {step === 'search' && (
            <div className="space-y-4 py-4">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="search-query">Title</Label>
                  <Input
                    id="search-query"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                    }}
                    placeholder="Enter title to search"
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="w-24 space-y-2">
                  <Label htmlFor="search-year">Year</Label>
                  <Input
                    id="search-year"
                    type="number"
                    value={searchYear ?? ''}
                    onChange={handleYearChange}
                    placeholder="Year"
                  />
                </div>
              </div>
              <Button
                onClick={handleSearch}
                disabled={searchMutation.isPending || !searchQuery.trim() || !hasApiKey}
              >
                {searchMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search TMDB
                  </>
                )}
              </Button>
              {searchMutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {searchMutation.error instanceof Error
                      ? searchMutation.error.message
                      : 'Search failed'}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 2: Select from results */}
          {step === 'select' && (
            <ScrollArea className="h-[400px] py-4">
              {searchMutation.data && searchMutation.data.length > 0 ? (
                <div className="space-y-2">
                  {searchMutation.data.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        handleSelectResult(result);
                      }}
                      className="hover:bg-accent/50 flex w-full items-center gap-4 rounded-lg border p-3 text-left transition-colors"
                    >
                      {result.posterUrl ? (
                        <img
                          src={result.posterUrl}
                          alt={result.title}
                          className="h-24 w-16 rounded object-cover"
                        />
                      ) : (
                        <div className="bg-muted flex h-24 w-16 items-center justify-center rounded">
                          <ImageIcon className="text-muted-foreground h-6 w-6" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{result.title}</p>
                        {result.year && (
                          <Badge variant="secondary" className="mt-1">
                            {result.year}
                          </Badge>
                        )}
                        {result.overview && (
                          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                            {result.overview}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="text-muted-foreground h-5 w-5" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground py-12 text-center">
                  No results found. Try adjusting your search.
                </div>
              )}
            </ScrollArea>
          )}

          {/* Step 3: Browse and apply artwork */}
          {step === 'artwork' && (
            <div className="flex-1 overflow-hidden">
              {artworkLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                </div>
              ) : artwork && getTotalArtworkCount() > 0 ? (
                <Tabs defaultValue="posters" className="flex h-full flex-col">
                  <TabsList className="h-auto flex-wrap">
                    {ARTWORK_TABS.map(({ key, label }) => {
                      const count = getArtworkCount(key);
                      if (count === 0) return null;
                      return (
                        <TabsTrigger key={key} value={key} className="gap-1">
                          {label}
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {count}
                          </Badge>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {ARTWORK_TABS.map(({ key, label, kodiType }) => {
                    const images = artwork[key];
                    if (images.length === 0) return null;

                    return (
                      <TabsContent key={key} value={key} className="mt-4 flex-1">
                        <ScrollArea className="h-[320px]">
                          <div className="grid grid-cols-2 gap-4 pr-4 md:grid-cols-3">
                            {images.map((img, idx) => (
                              <div
                                key={img.filePath}
                                className="group relative overflow-hidden rounded-lg border"
                              >
                                <img
                                  src={img.previewUrl}
                                  alt={`${label} ${String(idx + 1)}`}
                                  className="h-40 w-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      handleApplyArtwork(img.fullUrl, kodiType);
                                    }}
                                    disabled={applyingArtwork === kodiType}
                                  >
                                    {applyingArtwork === kodiType ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Applying...
                                      </>
                                    ) : (
                                      <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Apply
                                      </>
                                    )}
                                  </Button>
                                </div>
                                <div className="absolute right-2 bottom-2 left-2 flex gap-1">
                                  <Badge variant="secondary" className="text-xs">
                                    TMDB
                                  </Badge>
                                  {img.language && (
                                    <Badge variant="outline" className="text-xs">
                                      {img.language.toUpperCase()}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              ) : (
                <div className="text-muted-foreground py-12 text-center">
                  No artwork found for this title.
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
