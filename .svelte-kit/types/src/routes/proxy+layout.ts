// @ts-nocheck
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load = async ({data, url}: Parameters<LayoutLoad>[0]) => {
    const { user } = data || {};
    
    if (user && url.pathname === '/login') {
        throw redirect(307, '/');
    } 
    if (!user && url.pathname !== '/login') {
		throw redirect(307, '/login');
	}
    return {
        user
    }
}