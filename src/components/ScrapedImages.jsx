import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SimpleGrid, Image, Center, Loader, Alert } from '@mantine/core';

const API_URL = 'https://trends-ai-backend-image2-382329904395.europe-west1.run.app';

const fetchPresignedUrls = async (s3Uris) => {
    if (s3Uris.length === 0) return [];
    const { data } = await axios.post(`${API_URL}/api/assets/presigned-urls`, { s3Uris });
    return data.presignedUrls;
};

export function ScrapedImages({ images }) {
    const s3Uris = images.map(img => img.source).filter(Boolean);

    const { data: presignedUrls, isLoading, isError } = useQuery({
        queryKey: ['scrapedImages', s3Uris],
        queryFn: () => fetchPresignedUrls(s3Uris),
        enabled: s3Uris.length > 0, // Ne lance la requête que s'il y a des images
    });

    if (isLoading) return <Center><Loader /></Center>;
    if (isError) return <Alert color="red">Erreur lors du chargement des images.</Alert>;

    return (
        <SimpleGrid cols={{ base: 3, sm: 4, md: 6 }} spacing="md">
            {presignedUrls?.map((url, index) => (
                <Image
                    key={index}
                    src={url}
                    radius="md"
                    fit="cover"
                    alt={`Scraped image ${index + 1}`}
                />
            ))}
        </SimpleGrid>
    );
}