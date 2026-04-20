import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  /**
   * Sube un archivo a Cloudinary
   * @param file - Archivo de Multer (Express.Multer.File)
   * @param folder - Carpeta destino en Cloudinary (opcional)
   * @returns Respuesta de Cloudinary con URL pública y public_id
   */
  async uploadFile(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto', // Detecta automáticamente image/video/raw
        },
        (error, result) => {
          if (error) return reject(new BadRequestException(error.message));
          if (!result) return reject(new BadRequestException('Error desconocido al subir archivo'));
          resolve(result);
        },
      );

      // Convertir el buffer del archivo a un stream legible
      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  /**
   * Elimina un archivo de Cloudinary por su public_id
   * @param publicId - El public_id retornado al subir la imagen
   */
  async deleteFile(publicId: string): Promise<{ result: string }> {
    return cloudinary.uploader.destroy(publicId);
  }
}
