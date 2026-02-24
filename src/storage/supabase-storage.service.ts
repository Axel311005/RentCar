import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { extname } from 'path';

@Injectable()
export class SupabaseStorageService {
  private readonly client: SupabaseClient;
  private readonly bucketName: string;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error(
        'SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos para Storage',
      );
    }

    this.bucketName = process.env.SUPABASE_BUCKET_VEHICULOS ?? 'vehiculos';
    this.client = createClient(supabaseUrl, supabaseServiceRoleKey);
  }

  async uploadVehiculoImagen(file: Express.Multer.File, vehiculoId: string) {
    const extension = extname(file.originalname) || '.jpg';
    const randomPart = Math.random().toString(36).slice(2, 10);
    const fileName = `${Date.now()}-${randomPart}${extension}`;
    const storagePath = `vehiculos/${vehiculoId}/${fileName}`;

    const { error } = await this.client.storage
      .from(this.bucketName)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Error subiendo archivo a Supabase: ${error.message}`,
      );
    }

    const { data } = this.client.storage
      .from(this.bucketName)
      .getPublicUrl(storagePath);

    return {
      storagePath,
      publicUrl: data.publicUrl,
    };
  }

  async removeFile(storagePath: string) {
    const { error } = await this.client.storage
      .from(this.bucketName)
      .remove([storagePath]);

    if (error) {
      throw new InternalServerErrorException(
        `Error eliminando archivo de Supabase: ${error.message}`,
      );
    }
  }
}
