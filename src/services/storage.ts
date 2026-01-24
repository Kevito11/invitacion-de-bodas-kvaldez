
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads an image file to Firebase Storage and returns the public download URL.
 * @param file The file to upload
 * @returns Promise<string> The download URL
 */
export const uploadImage = async (file: File): Promise<string> => {
    try {
        // Create a unique filename: date_originalName
        const uniqueName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, `invitations/images/${uniqueName}`);

        // Upload
        const snapshot = await uploadBytes(storageRef, file);

        // Get URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("No se pudo subir la imagen. Intenta de nuevo.");
    }
};
