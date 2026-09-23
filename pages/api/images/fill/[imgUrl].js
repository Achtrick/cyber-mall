import nc from "next-connect";
import { serveImage } from "../../../../utils/shared/serveImage";

const handler = nc();

handler.get(serveImage);

export default handler;
