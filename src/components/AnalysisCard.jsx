import { Card, Text, Badge, Button, Group, Stack, ColorSwatch } from '@mantine/core';
import { Link } from 'react-router-dom';

const statusColors = {
  completed: 'green',
  processing: 'blue',
  pending: 'gray',
  failed: 'red',
};

export function AnalysisCard({ job }) {
  const dominantColors = job.result?.color_trends?.dominant_colors?.slice(0, 3) || [];
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack justify="space-between" h="100%">
        <div>
          <Group justify="space-between" mb="xs">
            <Text fw={500} truncate>{job.sourceInput}</Text>
            <Badge color={statusColors[job.status] || 'gray'} variant="light">
              {job.status}
            </Badge>
          </Group>

          <Text size="sm" c="dimmed" mb="md">
            Lancée le {new Date(job.createdAt).toLocaleDateString('fr-FR')}
          </Text>

          {dominantColors.length > 0 && (
            <Group gap="xs">
                <Text size="sm">Couleurs clés :</Text>
                {dominantColors.map(color => (
                    <ColorSwatch key={color.hex} color={color.hex} size={20} radius="sm" />
                ))}
            </Group>
          )}
        </div>

        <Button 
          component={Link} 
          to={`/report/${job._id}`} 
          variant="light" 
          color="blue" 
          fullWidth 
          mt="md" 
          radius="md"
        >
          Voir le rapport
        </Button>
      </Stack>
    </Card>
  );
}