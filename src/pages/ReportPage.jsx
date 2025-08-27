import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Container, Loader, Text, Title, Center, Stack, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { getJobStatus } from '../api/analysisApi';
import { ReportDataDisplay } from '../components/ReportDataDisplay';
import { EnrichmentSection } from '../components/EnrichmentSection'; 
import { ImageGenerationSection } from '../components/ImageGenerationSection'; 

export function ReportPage() {
  const { jobId } = useParams();
  const queryClient = useQueryClient();

  const { data: response, error, isLoading } = useQuery({
    queryKey: ['analysisJob', jobId],
    queryFn: () => getJobStatus(jobId), // Cette fonction renvoie la réponse axios complète
    
    // On vérifie maintenant response.data.status
    refetchInterval: (query) =>
      (query.state.data?.data?.status === 'completed' || query.state.data?.data?.status === 'failed') ? false : 10000,
      
    staleTime: (query) => 
      (query.state.data?.data?.status === 'completed' || query.state.data?.data?.status === 'failed') ? Infinity : 0,

    onSuccess: (res) => {
      // On vérifie la bonne propriété
      if (res.data.status === 'completed' || res.data.status === 'failed') {
        queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      }
    },
  });
  
  // On gère l'état de chargement initial
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

  // On gère l'état d'erreur
  if (error) {
    return (
      <Container pt="lg">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Erreur" color="red" variant="light">
          Une erreur est survenue lors de la récupération du rapport : {error.message}
        </Alert>
      </Container>
    );
  }

  // CORRECTION MAJEURE : On extrait les vraies données de la réponse axios
  const job = response?.data;

  // Si pour une raison quelconque on n'a pas de job, on affiche un message
  if (!job) {
     return <Center style={{ height: '80vh' }}><Text>Aucune donnée pour ce rapport.</Text></Center>;
  }

  // À partir de maintenant, on utilise `job.status`, `job.error`, etc.
  if (job.status === 'pending' || job.status === 'processing') {
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

  if (job.status === 'failed') {
    return (
      <Container pt="lg">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Échec de l'analyse" color="red" variant="light">
          {job.error || "Une erreur inconnue est survenue côté backend."}
        </Alert>
      </Container>
    );
  }

  if (job.status === 'completed') {
    return (
      <>
        <ReportDataDisplay report={job.result} />
        <Container size="xl" pb="xl">
           <EnrichmentSection jobId={jobId} />
           <ImageGenerationSection report={job.result} />
        </Container>
      </>
    );
  }

  return null;
}

export default ReportPage;