import { http, HttpResponse } from 'msw';

// Mock Kodi API responses
export const handlers = [
  // Mock VideoLibrary.GetMovies
  http.post('/jsonrpc', async ({ request }) => {
    const body = (await request.json()) as { method: string; params?: unknown };

    if (body.method === 'VideoLibrary.GetMovies') {
      return HttpResponse.json({
        id: 1,
        jsonrpc: '2.0',
        result: {
          movies: [
            {
              movieid: 1,
              title: 'Test Movie 1',
              year: 2024,
              rating: 8.5,
              runtime: 120,
              playcount: 0,
              art: {
                poster: 'image://test-poster-1/',
                fanart: 'image://test-fanart-1/',
              },
            },
            {
              movieid: 2,
              title: 'Test Movie 2',
              year: 2023,
              rating: 7.2,
              runtime: 95,
              playcount: 1,
              art: {
                poster: 'image://test-poster-2/',
              },
            },
          ],
          limits: { end: 2, start: 0, total: 2 },
        },
      });
    }

    // Mock VideoLibrary.GetMovieDetails
    if (body.method === 'VideoLibrary.GetMovieDetails') {
      return HttpResponse.json({
        id: 1,
        jsonrpc: '2.0',
        result: {
          moviedetails: {
            movieid: 1,
            title: 'Test Movie 1',
            year: 2024,
            rating: 8.5,
            runtime: 120,
            playcount: 0,
            plot: 'This is a test movie plot.',
            director: ['Test Director'],
            genre: ['Action', 'Thriller'],
            cast: [
              { name: 'Actor 1', role: 'Role 1', thumbnail: 'image://actor-1/' },
              { name: 'Actor 2', role: 'Role 2', thumbnail: 'image://actor-2/' },
            ],
            art: {
              poster: 'image://test-poster-1/',
              fanart: 'image://test-fanart-1/',
              clearlogo: 'image://test-logo-1/',
            },
          },
        },
      });
    }

    // Mock VideoLibrary.GetTVShows
    if (body.method === 'VideoLibrary.GetTVShows') {
      return HttpResponse.json({
        id: 1,
        jsonrpc: '2.0',
        result: {
          tvshows: [
            {
              tvshowid: 1,
              title: 'Test TV Show 1',
              year: 2023,
              rating: 9.0,
              episode: 20,
              watchedepisodes: 10,
              art: {
                poster: 'image://test-tvshow-poster-1/',
                fanart: 'image://test-tvshow-fanart-1/',
              },
            },
          ],
          limits: { end: 1, start: 0, total: 1 },
        },
      });
    }

    // Mock VideoLibrary.GetSeasons
    if (body.method === 'VideoLibrary.GetSeasons') {
      return HttpResponse.json({
        id: 1,
        jsonrpc: '2.0',
        result: {
          seasons: [
            {
              season: 1,
              label: 'Season 1',
              episode: 10,
              watchedepisodes: 5,
              art: {
                poster: 'image://season-1-poster/',
              },
            },
          ],
        },
      });
    }

    // Mock VideoLibrary.GetEpisodes
    if (body.method === 'VideoLibrary.GetEpisodes') {
      return HttpResponse.json({
        id: 1,
        jsonrpc: '2.0',
        result: {
          episodes: [
            {
              episodeid: 1,
              title: 'Test Episode 1',
              season: 1,
              episode: 1,
              playcount: 0,
              runtime: 45,
              plot: 'Test episode plot',
              art: {
                thumb: 'image://episode-1-thumb/',
              },
            },
          ],
        },
      });
    }

    // Mock Player.Open
    if (body.method === 'Player.Open') {
      return HttpResponse.json({
        id: 1,
        jsonrpc: '2.0',
        result: 'OK',
      });
    }

    // Mock Player.GetActivePlayers
    if (body.method === 'Player.GetActivePlayers') {
      return HttpResponse.json({
        id: 1,
        jsonrpc: '2.0',
        result: [],
      });
    }

    // Default response for unhandled methods
    return HttpResponse.json(
      {
        id: 1,
        jsonrpc: '2.0',
        error: { code: -32601, message: 'Method not found' },
      },
      { status: 404 }
    );
  }),
];
