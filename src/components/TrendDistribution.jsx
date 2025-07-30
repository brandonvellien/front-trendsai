import { Stack, Text, Progress, Title, Group, Accordion, List, ThemeIcon } from '@mantine/core';
import { IconCircleFilled } from '@tabler/icons-react';

export function TrendDistribution({ title, data }) {
  if (Object.keys(data).length === 0) {
    return (
        <>
            <Title order={3} mb="md">{title}</Title>
            <Text c="dimmed">Aucune donnée disponible.</Text>
        </>
    );
  }

  // On garde le tri complet des données ici
  const allSortedData = Object.entries(data)
    .map(([name, values]) => ({ name, percentage: values.percentage }))
    .sort((a, b) => b.percentage - a.percentage);

  // On ne prend que le top 10 pour le graphique principal
  const topData = allSortedData.slice(0, 10);

  return (
    <Stack>
      <Title order={3} mb="md">{title}</Title>
      {topData.map((item) => (
        <div key={item.name}>
          <Group justify="space-between">
            <Text size="sm" fw={500}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
            <Text size="sm" c="dimmed">{item.percentage.toFixed(1)}%</Text>
          </Group>
          <Progress value={item.percentage} color="violet" size="lg" radius="sm" mt={4} />
        </div>
      ))}

      {/* AJOUT DE LA SECTION DÉPLIANTE */}
      <Accordion mt="lg" variant="separated">
        <Accordion.Item value="all-items">
          <Accordion.Control>Voir les {allSortedData.length} types détectés</Accordion.Control>
          <Accordion.Panel>
            <List spacing="xs" size="sm">
              {allSortedData.map(item => (
                <List.Item
                  key={item.name}
                  icon={
                    <ThemeIcon color="violet" size={12} radius="xl">
                      <IconCircleFilled size={12} />
                    </ThemeIcon>
                  }
                >
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)} - {item.percentage.toFixed(1)}%
                </List.Item>
              ))}
            </List>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}