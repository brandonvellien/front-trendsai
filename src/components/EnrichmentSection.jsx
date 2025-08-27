import { useMutation } from '@tanstack/react-query';
import { Button, Paper, Title, Box, LoadingOverlay, Alert } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { enrichAnalysis } from '../api/analysisApi';
import { IconAlertCircle } from '@tabler/icons-react';

export function EnrichmentSection({ jobId }) {
  const mutation = useMutation({
    // La fonction d'appel à l'API est correcte
    mutationFn: () => enrichAnalysis(jobId),
  });

  return (
    <Paper withBorder shadow="sm" p="lg" radius="md" mt="xl">
      <Title order={3} mb="md">Recherche Intelligente</Title>
      
      <Box pos="relative">
        <LoadingOverlay visible={mutation.isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

        {mutation.isSuccess && (
          <Box p="md" bg="gray.0" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
            {/* LA CORRECTION EST ICI : 
              On utilise "mutation.data.data.enrichedText" pour "ouvrir l'enveloppe" (la réponse axios)
              et accéder aux vraies données.
            */}
            <ReactMarkdown>{mutation.data.data.enrichedText}</ReactMarkdown>
          </Box>
        )}

        {mutation.isError && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Erreur" color="red" variant="light">
            Impossible de générer le rapport enrichi.
          </Alert>
        )}

        {/* Le bouton ne s'affiche que si la recherche n'a pas encore été faite */}
        {!mutation.isSuccess && (
           <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            Lancer la recherche et générer la synthèse
          </Button>
        )}
      </Box>
    </Paper>
  );
}