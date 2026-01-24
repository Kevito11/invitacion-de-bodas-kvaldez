import { supabase } from '../supabaseClient';

/**
 * Uploads an image file to Supabase Storage and returns the public download URL.
 * @param file The file to upload
 * @param folderName The folder to store the image in (e.g. "Juan_y_Maria")
 * @returns Promise<string> The download URL
 */
export const uploadImage = async (file: File, folderName: string = 'general'): Promise<string> => {
    try {
        // Sanitize file name
        const fileExt = file.name.split('.').pop();
        // Create clean filename with timestamp to avoid collisions
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;

        // Final path: Juan_y_Maria/1739999_foto.jpg
        const sanitizedFolder = folderName.replace(/[^a-zA-Z0-9-_]/g, '_');
        const filePath = `${sanitizedFolder}/${fileName}`;

        // Upload to 'invitacion-de-boda-kvaldez' bucket
        const { error: uploadError } = await supabase.storage
            .from('invitacion-de-boda-kvaldez')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            throw uploadError;
        }

        // Get Public URL
        const { data } = supabase.storage
            .from('invitacion-de-boda-kvaldez')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error: any) {
        console.error("❌ ERROR DETALLADO SUPABASE:", error);
        console.error("Mensaje:", error.message);
        console.error("Código/Status:", error.statusCode || error.status);

        if (error.message && error.message.includes('Bucket not found')) {
            throw new Error("El sistema no encuentra la carpeta 'invitacion-de-boda-kvaldez' en Supabase. Verifica el nombre exacto.");
        }
        if (error.message && error.message.includes('row-level security')) {
            throw new Error("Permiso denegado. Falta correr el SQL de permisos en Supabase.");
        }

        throw new Error(`Error de subida: ${error.message}`);
    }
};
