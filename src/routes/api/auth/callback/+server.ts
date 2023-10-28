import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { BASE_URL, SPOTIFY_APP_CLIENT_ID, SPOTIFY_APP_CLIENT_SECRET } from "$env/static/private";

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
    const code = url.searchParams.get('code') || null;
    const state = url.searchParams.get('state') || null;

    const storedState = cookies.get('spotify_auth_state') || null;
    const storedChallengeVarifier = cookies.get('spotify_auth_challenge_varifire') || null;
    if (state === null || state !== storedState) {
        throw error(400, "State Mismatch")
    }
    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                `${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`
            ).toString('base64')}`
        },
        body: new URLSearchParams({
            code: code || '',
            redirect_uri: `${BASE_URL}/api/auth/callback`,
            grant_type: 'authorization_code',
            code_verifier: storedChallengeVarifier || '',
            client_id: SPOTIFY_APP_CLIENT_ID
        })
    })

    const resJson = await res.json();

    if (resJson.error) {
        throw error(400, resJson.error_description)
    }
    cookies.delete('spotify_auth_state')
    cookies.delete('spotify_auth_challenge_varifire')
    cookies.set('access_token', resJson.access_token,{path:'/'})
    cookies.set('refresh_token', resJson.refresh_token,{path:'/'})

    throw redirect(303, '/')
}