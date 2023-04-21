import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchNFTImage = (imageUrl: string) => {
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null | unknown>(null);

    useEffect(() => {
        const fetchImage = async () => {
            setIsLoading(true);

            try {
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

                const blob = new Blob([response.data], { type: 'image/jpeg' });
                const objectURL = URL.createObjectURL(blob);

                setImage(objectURL);
                setIsLoading(false);
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        if (imageUrl && imageUrl.length > 10) {
            fetchImage();
        }

        return () => {
            if (image) {
                URL.revokeObjectURL(image);
            }
        };
    }, [imageUrl, image]);

    return { image, isLoading, error };
};

export default useFetchNFTImage;
