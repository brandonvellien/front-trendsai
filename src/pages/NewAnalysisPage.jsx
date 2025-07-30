// src/pages/NewAnalysisPage.jsx
import { Container, Title, Paper } from '@mantine/core';
import { NewAnalysisForm } from '../components/NewAnalysisForm';

export function NewAnalysisPage() {
  return (
    <Container size="md" my="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="xl">
          Lancer une Nouvelle Analyse de Tendance
        </Title>
        <NewAnalysisForm />
      </Paper>
    </Container>
  );
}