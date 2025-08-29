// Dans src/components/ColorPalette.jsx
import { SimpleGrid, Text, ColorSwatch, Stack, Paper } from '@mantine/core';

// On retire 'Group' des imports s'il n'est plus utilisé ailleurs

export function ColorPalette({ dominantColors }) { // On peut retirer allColors des props
  if (!dominantColors || dominantColors.length === 0) {
    return <Text c="dimmed">Aucune donnée de couleur disponible.</Text>;
  }

  return (
    // La grille principale ne change pas
    <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="lg">
      {dominantColors.map((color, index) => (
        <Paper withBorder key={index} p="sm" radius="md">
          <Stack align="flex-start" gap="xs">
            <ColorSwatch color={color.hex} size={50} radius="sm" />
            <Text fw={500} size="sm">{color.color_name}</Text>
            <Text size="xs" c="dimmed">{color.percentage.toFixed(1)}%</Text>
          </Stack>
        </Paper>
      ))}
    </SimpleGrid>
  );
}