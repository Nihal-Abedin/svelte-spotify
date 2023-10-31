import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { SPOTIFY_BASE_URL } from "$env/static/private";

export const load: LayoutServerLoad = async ({ fetch, cookies, url }) => {
    const access_token = cookies.get('access_token');
    const refresh_token = cookies.get('refresh_token');

    if (!access_token) {
        return {
            user: null
        }
    }
    const userRes = await fetch(`${SPOTIFY_BASE_URL}/me`, {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })
    if (userRes.ok) {
        const user: SpotifyApi.CurrentUsersProfileResponse = await userRes.json();
        return {
            user
        }
    }
    if (userRes.status === 401 && refresh_token) {
        const refreshRes = await fetch('/api/auth/refresh');
        if (refreshRes.ok) {
            throw redirect(307, url.pathname)
        }
        return {
            user: null
        }
    } else {
        return { user: null }
    }

}