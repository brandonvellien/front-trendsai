import { useMutation } from '@tanstack/react-query';
import { Button, Paper, Title, Box, LoadingOverlay, Alert } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { enrichAnalysisReport } from '../api/analysisApi';
import { IconAlertCircle } from '@tabler/icons-react';

export function EnrichmentSection({ jobId }) {
  const mutation = useMutation({
    mutationFn: () => enrichAnalysisReport(jobId),
  });

  return (
    <Paper withBorder shadow="sm" p="lg" radius="md" mt="xl">
      <Title order={3} mb="md">Recherche Intelligente</Title>
      
      <Box pos="relative">
        <LoadingOverlay visible={mutation.isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

        {/* Si on a déjà un résultat, on l'affiche */}
        {mutation.isSuccess && (
          <Box p="md" bg="gray.0" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
            <ReactMarkdown>{mutation.data.enrichedText}</ReactMarkdown>
          </Box>
        )}

        {/* Si on a une erreur, on l'affiche */}
        {mutation.isError && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Erreur" color="red" variant="light">
            Impossible de générer le rapport enrichi.
          </Alert>
        )}

        {/* Le bouton n'est visible que si on n'a pas encore de résultat */}
        {!mutation.isSuccess && (
           <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            Lancer la recherche et générer la synthèse
          </Button>
        )}
      </Box>
    </Paper>
  );
}