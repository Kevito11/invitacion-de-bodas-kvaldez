/**
 * Resizes an image ensuring the largest dimension does not exceed maxDimension.
 * Returns a Promise that resolves to the resized image as a Data URL (Base64).
 */
export const resizeImage = (file: File, maxDimension: number = 1000, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxDimension) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

/**
 * Processes a URL to ensure it is a direct image link.
 * specialized in converting Google Drive sharing links to direct embed links.
 */
export const processImageUrl = (val: string): string => {
    let finalUrl = val.trim();

    // 0. Safety check
    if (!finalUrl) return '';

    // 1. Google Drive (Drive & Docs)
    if (finalUrl.includes('google.com')) {
        // Pattern A: /file/d/ID/view, /open?id=ID, /uc?id=ID
        // We look for the ID specifically.

        // Try identifying ID by /d/ pattern first (common in share links)
        // regex: match /d/ followed by any char except / until end or /
        const dMatch = finalUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);

        if (dMatch && dMatch[1]) {
            return `https://lh3.googleusercontent.com/d/${dMatch[1]}=w1000`;
        }

        // Try identifying ID by id= pattern (common in export/open links)
        const idMatch = finalUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
            return `https://lh3.googleusercontent.com/d/${idMatch[1]}=w1000`;
        }
    }

    // 2. Dropbox (Convert 'dl=0' to 'raw=1' for direct link)
    if (finalUrl.includes('dropbox.com') && finalUrl.includes('dl=0')) {
        return finalUrl.replace('dl=0', 'raw=1');
    }

    return finalUrl;
};
