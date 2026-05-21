import ImageKit from "imagekit";
import { config } from "../config/config.js";

const client = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

export async function uploadFile(buffer, fileName, folder = "roomSync") {

  const response = await client.upload({
    file: buffer,
    fileName,
    folder,
  });

  return response.url;
}