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
    let color = null;
	if (album.images.length > 0) {
		const colorRes = await fetch(
			`/api/average-color?${new URLSearchParams({
				image: album.images[0].url
			}).toString()}`
		);
		if (colorRes.ok) {
			color = (await colorRes.json()).color;
		}
	}
    return {
        album,
        title: album.name,
        color
    }
}