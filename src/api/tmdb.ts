/**
 * TMDB API Client
 *
 * Browser-based client for The Movie Database API.
 * Fetches movie/TV metadata and artwork images.
 */

import { getTmdbApiKey } from '@/lib/settings';

const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Image size configurations
const IMAGE_SIZES = {
  poster: {
    preview: 'w185',
    full: 'original',
  },
  backdrop: {
    preview: 'w780',
    full: 'original',
  },
  logo: {
    preview: 'w300',
    full: 'original',
  },
} as const;

export interface TMDBSearchResult {
  id: number;
  title: string;
  originalTitle: string;
  year: string | null;
  overview: string;
  posterUrl: string | null;
}

export interface TMDBMovieImages {
  posters: TMDBImage[];
  backdrops: TMDBImage[];
  logos: TMDBImage[];
}

export interface TMDBImage {
  filePath: string;
  width: number;
  height: number;
  aspectRatio: number;
  language: string | null;
  voteAverage: number;
  previewUrl: string;
  fullUrl: string;
}

class TMDBClient {
  private getApiKey(): string {
    const key = getTmdbApiKey();
    if (!key) {
      throw new Error('TMDB API key not configured. Please add your API key in Settings.');
    }
    return key;
  }

  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const apiKey = this.getApiKey();
    const url = new URL(`${TMDB_API_BASE}${endpoint}`);
    url.searchParams.set('api_key', apiKey);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as { status_message?: string };
      throw new Error(error.status_message ?? `TMDB API error: ${String(response.status)}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Search for movies on TMDB
   */
  async searchMovies(query: string, year?: number): Promise<TMDBSearchResult[]> {
    interface TMDBSearchResponse {
      results: Array<{
        id: number;
        title: string;
        original_title: string;
        release_date?: string;
        overview: string;
        poster_path: string | null;
      }>;
    }

    const params: Record<string, string> = { query };
    if (year) {
      params['year'] = String(year);
    }

    const response = await this.fetch<TMDBSearchResponse>('/search/movie', params);

    return response.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      year: movie.release_date ? movie.release_date.substring(0, 4) : null,
      overview: movie.overview,
      posterUrl: movie.poster_path
        ? `${TMDB_IMAGE_BASE}/${IMAGE_SIZES.poster.preview}${movie.poster_path}`
        : null,
    }));
  }

  /**
   * Search for TV shows on TMDB
   */
  async searchTVShows(query: string, year?: number): Promise<TMDBSearchResult[]> {
    interface TMDBSearchResponse {
      results: Array<{
        id: number;
        name: string;
        original_name: string;
        first_air_date?: string;
        overview: string;
        poster_path: string | null;
      }>;
    }

    const params: Record<string, string> = { query };
    if (year) {
      params['first_air_date_year'] = String(year);
    }

    const response = await this.fetch<TMDBSearchResponse>('/search/tv', params);

    return response.results.map((show) => ({
      id: show.id,
      title: show.name,
      originalTitle: show.original_name,
      year: show.first_air_date ? show.first_air_date.substring(0, 4) : null,
      overview: show.overview,
      posterUrl: show.poster_path
        ? `${TMDB_IMAGE_BASE}/${IMAGE_SIZES.poster.preview}${show.poster_path}`
        : null,
    }));
  }

  /**
   * Get images for a movie
   */
  async getMovieImages(movieId: number): Promise<TMDBMovieImages> {
    interface TMDBImagesResponse {
      posters: TMDBRawImage[];
      backdrops: TMDBRawImage[];
      logos: TMDBRawImage[];
    }

    interface TMDBRawImage {
      file_path: string;
      width: number;
      height: number;
      aspect_ratio: number;
      iso_639_1: string | null;
      vote_average: number;
    }

    const response = await this.fetch<TMDBImagesResponse>(`/movie/${String(movieId)}/images`, {
      include_image_language: 'en,null',
    });

    const mapImages = (
      images: TMDBRawImage[],
      type: 'poster' | 'backdrop' | 'logo'
    ): TMDBImage[] => {
      return images.map((img) => ({
        filePath: img.file_path,
        width: img.width,
        height: img.height,
        aspectRatio: img.aspect_ratio,
        language: img.iso_639_1,
        voteAverage: img.vote_average,
        previewUrl: `${TMDB_IMAGE_BASE}/${IMAGE_SIZES[type].preview}${img.file_path}`,
        fullUrl: `${TMDB_IMAGE_BASE}/${IMAGE_SIZES[type].full}${img.file_path}`,
      }));
    };

    return {
      posters: mapImages(response.posters, 'poster'),
      backdrops: mapImages(response.backdrops, 'backdrop'),
      logos: mapImages(response.logos, 'logo'),
    };
  }

  /**
   * Get images for a TV show
   */
  async getTVShowImages(tvshowId: number): Promise<TMDBMovieImages> {
    interface TMDBImagesResponse {
      posters: TMDBRawImage[];
      backdrops: TMDBRawImage[];
      logos: TMDBRawImage[];
    }

    interface TMDBRawImage {
      file_path: string;
      width: number;
      height: number;
      aspect_ratio: number;
      iso_639_1: string | null;
      vote_average: number;
    }

    const response = await this.fetch<TMDBImagesResponse>(`/tv/${String(tvshowId)}/images`, {
      include_image_language: 'en,null',
    });

    const mapImages = (
      images: TMDBRawImage[],
      type: 'poster' | 'backdrop' | 'logo'
    ): TMDBImage[] => {
      return images.map((img) => ({
        filePath: img.file_path,
        width: img.width,
        height: img.height,
        aspectRatio: img.aspect_ratio,
        language: img.iso_639_1,
        voteAverage: img.vote_average,
        previewUrl: `${TMDB_IMAGE_BASE}/${IMAGE_SIZES[type].preview}${img.file_path}`,
        fullUrl: `${TMDB_IMAGE_BASE}/${IMAGE_SIZES[type].full}${img.file_path}`,
      }));
    };

    return {
      posters: mapImages(response.posters, 'poster'),
      backdrops: mapImages(response.backdrops, 'backdrop'),
      logos: mapImages(response.logos, 'logo'),
    };
  }

  /**
   * Validate an API key by making a test request
   */
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const url = new URL(`${TMDB_API_BASE}/configuration`);
      url.searchParams.set('api_key', apiKey);

      const response = await fetch(url.toString());
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const tmdb = new TMDBClient();
