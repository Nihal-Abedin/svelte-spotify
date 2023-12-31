import { BASE_URL, SPOTIFY_BASE_URL } from "$env/static/private";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ fetch, cookies, params, url }) => {
    const accessToken = cookies.get("access_token");
    const res = await fetch(`${SPOTIFY_BASE_URL}/${params.path}${url.search }`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const resJson = await res.json()
    if (resJson.error) {
        throw error(resJson.error.status, resJson.error.message)
    }
    return json(resJson)

};
