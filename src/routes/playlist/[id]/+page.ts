import fetchRefresh from "$helpers/fetchRefresh";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch: _fetch, params }) => {
    const fetch = (path: string) => fetchRefresh(_fetch, path)

    const playlistRes = await fetch(`/api/spotify/playlists/${params.id}`);
    if (!playlistRes.ok) {
        throw error(playlistRes.status, "Failed to load playlists!")
    }

    const playlistJson: SpotifyApi.SinglePlaylistResponse = await playlistRes.json();

    let color = null;
    if (playlistJson.images.length > 0) {
        const colorRes = await fetch(
            `/api/average-color?${new URLSearchParams({
                image: playlistJson.images[0].url
            }).toString()}`
        );
        if (colorRes.ok) {
            color = (await colorRes.json()).color;
        }
    }
    return {
        playlist: playlistJson,
        color,
        title: playlistJson.name
    }
}
