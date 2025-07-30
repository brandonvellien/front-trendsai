// Dans src/components/ColorPalette.jsx
import { SimpleGrid, Text, ColorSwatch, Group, Stack, Paper, Accordion } from '@mantine/core';

export function ColorPalette({ dominantColors, allColors }) {
  if (!dominantColors || dominantColors.length === 0) {
    return <Text c="dimmed">Aucune donnée de couleur disponible.</Text>;
  }

  return (
    <Stack>
      {/* Grille des couleurs dominantes (inchangée) */}
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="lg">
        {dominantColors.map((color, index) => (
          <Paper withBorder key={index} p="sm" radius="md">
            <Group>
              <ColorSwatch color={color.hex} size={50} radius="sm" />
              <Stack gap={0}>
                <Text fw={500} size="sm">{color.color_name}</Text>
                <Text size="xs" c="dimmed">{color.percentage.toFixed(1)}%</Text>
              </Stack>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      {/* AJOUT DE LA SECTION DÉPLIANTE POUR TOUTES LES COULEURS */}
      <Accordion mt="lg" variant="separated">
        <Accordion.Item value="all-colors">
          <Accordion.Control>Voir les {allColors.length} couleurs uniques détectées</Accordion.Control>
          <Accordion.Panel>
            <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
              {allColors.map(color => (
                <Group key={color.hex}>
                  <ColorSwatch color={color.hex} size={20} radius="sm" />
                  <Text size="sm">{color.color_name}</Text>
                </Group>
              ))}
            </SimpleGrid>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}