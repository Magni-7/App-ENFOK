import sharp from "sharp";

// Recompresse et redimensionne une photo uploadée avant stockage : les photos
// prises au téléphone (plusieurs Mo, plusieurs milliers de pixels de large)
// ralentissent sinon le chargement des pages qui les affichent.
export async function resizeImage(file: File, maxWidth: number): Promise<{ buffer: Buffer; contentType: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = await sharp(Buffer.from(arrayBuffer))
    .rotate() // applique l'orientation EXIF puis la retire
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  return { buffer, contentType: "image/jpeg" };
}
