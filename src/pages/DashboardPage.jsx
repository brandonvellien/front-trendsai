// src/pages/DashboardPage.jsx
import { useQuery } from '@tanstack/react-query';
import { Container, Title, SimpleGrid, Loader, Alert, Center, Text } from '@mantine/core';
import { fetchMyJobs } from '../api/analysisApi'; // <-- MODIFICATION ICI
import { AnalysisCard } from '../components/AnalysisCard';

export function DashboardPage() {
  const { data: jobs, isLoading, isError } = useQuery({ 
    queryKey: ['myJobs'], 
    queryFn: fetchMyJobs // On utilise directement la fonction importée
  });

  if (isLoading) return <Center h="80vh"><Loader /></Center>;
  if (isError) return <Alert color="red">Erreur lors du chargement de vos analyses.</Alert>;

  return (
    <Container py="xl">
      <Title order={2} mb="lg">Mon Dashboard</Title>
      
      <Title order={3} my="xl">Mes Analyses Récentes</Title>
      
      {jobs && jobs.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {jobs.map(job => (
            <AnalysisCard key={job._id} job={job} />
          ))}
        </SimpleGrid>
      ) : (
        <Text>Vous n'avez pas encore lancé d'analyse.</Text>
      )}
    </Container>
  );
}