import fetchRefresh from "$lib/helpers/fetchRefresh";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ fetch: _fetch, parent }) => {
    const { user } = await parent();
    
    const fetch = (path: string) => fetchRefresh(_fetch, path);

    const newReleases = fetch('/api/spotify/browse/new-releases?limit=6');
    const featuresReleases = fetch('/api/spotify/browse/featured-playlists?limit=6');
    const userPlaylists = fetch(`/api/spotify/users/${user?.id}/playlists?limit=6`);

    const catsRes = await fetch(`/api/spotify/browse/categories`);

    const catResJson: SpotifyApi.MultipleCategoriesResponse | undefined = catsRes.ok ? await catsRes.json() : undefined;

    const randomCats = catResJson ? catResJson.categories.items.sort(() => 0.5 - Math.random()).slice(0, 3) : [];

    const randomCatsPromise = randomCats.map(cats => fetch(`/api/spotify/browse/categories/${cats.id}/playlists?limit=6`))

    const [newReleasesRes, featureReleasesRes, ueserPlaylistRes, ...randomCatsRes] = await Promise.all([newReleases, featuresReleases, userPlaylists, ...randomCatsPromise])

    return {
        newReleases: newReleasesRes.ok ? newReleasesRes.json() as Promise<SpotifyApi.ListOfNewReleasesResponse> : undefined,
        featuresReleases: featureReleasesRes.ok ? featureReleasesRes.json() as Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse> : undefined,
        userPlaylists: ueserPlaylistRes.ok ? ueserPlaylistRes.json() as Promise<SpotifyApi.ListOfUsersPlaylistsResponse> : undefined,
        homeCategories: randomCats,
        categoriesPlaylists: Promise.all(randomCatsRes.map(cat => cat.ok ? cat.json() as Promise<SpotifyApi.CategoryPlaylistsResponse> : undefined))
    }
}