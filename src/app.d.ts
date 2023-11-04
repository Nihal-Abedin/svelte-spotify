// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			user: SpotifyApi.CurrentUsersProfileResponse | null;
			title?: string;
			album?: SpotifyApi.SingleAlbumResponse
		}
		// interface Platform {}
	}
}
declare interface Window {
	refreshPromise: Promise<Response> | null;
}

// export { };
