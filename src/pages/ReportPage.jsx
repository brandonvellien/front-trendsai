import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container, Loader, Text, Title, Center, Stack, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { fetchJobStatus } from '../api/analysisApi';
import { ReportDataDisplay } from '../components/ReportDataDisplay';
import { EnrichmentSection } from '../components/EnrichmentSection'; 
import { ImageGenerationSection } from '../components/ImageGenerationSection'; 

export function ReportPage() {
  const { jobId } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: ['analysisJob', jobId],
    queryFn: () => fetchJobStatus(jobId),
    
    // Arrête la vérification périodique (toutes les 10s) si la tâche est terminée
    refetchInterval: (query) =>
      (query.state.data?.status === 'completed' || query.state.data?.status === 'failed') ? false : 10000,
      
    // Empêche le rafraîchissement automatique au retour sur la page si la tâche est terminée
    staleTime: (query) => 
      (query.state.data?.status === 'completed' || query.state.data?.status === 'failed') ? Infinity : 0,

    onSuccess: (data) => {
      // Si la tâche est terminée, on invalide la liste du dashboard
      if (data.status === 'completed' || data.status === 'failed') {
        queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      }
    },
  });
  

  // 1. On vérifie l'état de chargement EN PREMIER
  if (isLoading) {
    return (
      <Center style={{ height: '80vh' }}>
        <Stack align="center">
          <Loader size="xl" />
          <Text>Chargement du rapport...</Text>
        </Stack>
      </Center>
    );
  }

  // 2. On vérifie l'état d'erreur ENSUITE
  if (error) {
    return (
      <Container pt="lg">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Erreur" color="red" variant="light">
          Une erreur est survenue lors de la récupération du rapport. Veuillez réessayer.
        </Alert>
      </Container>
    );
  }

  // 3. SEULEMENT MAINTENANT, on peut utiliser "data" en toute sécurité

  if (data.status === 'pending' || data.status === 'processing') {
    return (
      <Center style={{ height: '80vh' }}>
        <Stack align="center" gap="lg">
          <Loader size="xl" color="violet" />
          <Title order={3}>Analyse en cours...</Title>
          <Text c="dimmed">Le rapport pour la tâche {jobId} est en cours de génération.</Text>
          <Text size="sm" c="dimmed">Cette page se mettra à jour automatiquement.</Text>
        </Stack>
      </Center>
    );
  }

  if (data.status === 'failed') {
    return (
      <Container pt="lg">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Échec de l'analyse" color="red" variant="light">
          {data.error || "Une erreur inconnue est survenue côté backend."}
        </Alert>
      </Container>
    );
  }

  if (data.status === 'completed') {
    return (
      <>
        <ReportDataDisplay report={data.result} />
        <Container size="xl" pb="xl">
           <EnrichmentSection jobId={jobId} />
           <ImageGenerationSection report={data.result} />
        </Container>
      </>
    );
  }

  // Si aucun des états ci-dessus n'est vrai, on ne rend rien.
  return null;
}