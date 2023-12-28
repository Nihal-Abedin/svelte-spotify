import fetchRefresh from "$lib/helpers/fetchRefresh";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
    const { id } = params;

    const albumRes = await fetchRefresh(fetch, `/api/spotify/albums/${id}`);

    if (!albumRes.ok) {
        throw error(albumRes.status, 'Failed to load album!')
    }

    const album: SpotifyApi.SingleAlbumResponse = await albumRes.json();

    return {
        album,
        title: album.name
    }
}