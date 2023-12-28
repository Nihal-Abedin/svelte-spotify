import { json, type RequestHandler } from "@sveltejs/kit";
import sharp from "sharp";

export const GET: RequestHandler = async ({ url, fetch }) => {
    const imageUrl = url.searchParams.get('image');
    if (imageUrl) {
        const image = await fetch(imageUrl).then(res => res.arrayBuffer());
        const stats = await sharp(Buffer.from(image)).stats();
        const [r, g, b] = stats.channels.map(stat => stat.mean);
        return json({ color: `rgb(${r},${g},${b})` })
    }

    return json({ color: null })
}