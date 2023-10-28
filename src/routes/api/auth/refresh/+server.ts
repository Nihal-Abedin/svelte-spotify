import { error, json, type RequestHandler } from "@sveltejs/kit";
import { SPOTIFY_APP_CLIENT_ID, SPOTIFY_APP_CLIENT_SECRET } from "$env/static/private";

export const GET: RequestHandler = async ({ cookies, fetch }) => {
    const refreshToken = cookies.get('refresh_token') || '';

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                `${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`
            ).toString('base64')}`
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    });

    const resJson = await res.json();

    if (resJson.error) {
        cookies.delete('refresh_token', { path: '/' });
        cookies.delete('access_token',{path:'/'})
        throw error(401, resJson.error_description);
    }
    cookies.set('refresh_token', resJson.refresh_token, { path: '/' });
    cookies.set('access_token', resJson.access_token,{ path: '/' });

    return json(resJson);
}