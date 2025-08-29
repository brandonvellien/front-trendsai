import { useMemo } from 'react';
import { Container, Title, Stack, Grid, Paper } from '@mantine/core';
import { ColorPalette } from './ColorPalette';
import { TrendDistribution } from './TrendDistribution';
import { ScrapedImages } from './ScrapedImages';
import { StylePieChart } from './StylePieChart';

export function ReportDataDisplay({ report }) {
  // Extrait le nom du fichier ou de la source pour le titre
  
  const getSourceName = () => {
  const source = report?.source_file;
  if (!source) return "Rapport d'analyse";

  const formatPart = (str) => str.replace(/[_-]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  // Cas 1: Si c'est une analyse Tag Walk (depuis un chemin S3)
  if (source.includes('tagwalk/')) {
    const parts = source.split('/').filter(p => p); // Sépare le chemin et retire les éléments vides
    if (parts.length >= 2) {
      // Prend les deux dernières parties : la marque et la collection
      const collection = parts[parts.length - 1];
      const brand = parts[parts.length - 2];
      return `${formatPart(brand)} - ${formatPart(collection)}`;
    }
  }

  // Cas 2: Cas par défaut pour les fichiers JSON Instagram
  return formatPart(source.split('/').pop().replace('.json', ''));
};

const sourceName = getSourceName();

  // Calcule la liste de toutes les couleurs uniques une seule fois
  const allUniqueColors = useMemo(() => {
    if (!report.detailed_image_analysis) return [];
    
    // Récupère toutes les couleurs de toutes les images
    const allColors = report.detailed_image_analysis.flatMap(item => item.colors || []);
    const uniqueColors = new Map();
    
    // Filtre pour ne garder que les couleurs uniques basées sur leur code HEX
    allColors.forEach(color => {
      if (color && color.hex && !uniqueColors.has(color.hex)) {
        uniqueColors.set(color.hex, color);
      }
    });
    
    return Array.from(uniqueColors.values());
  }, [report]);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title order={1} ta="center">{sourceName}</Title>
        
        <Paper withBorder shadow="sm" p="lg" radius="md">
          <Title order={3} mb="md">Palette de Couleurs Dominantes</Title>
          <ColorPalette 
            dominantColors={report.color_trends?.dominant_colors || []}
            allColors={allUniqueColors}
          />
        </Paper>

        <Grid>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            {/* On garde les barres de progression pour les vêtements */}
            <TrendDistribution title="Top Vêtements" data={report.garment_trends?.distribution || {}} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
             {/* On utilise le diagramme circulaire pour les styles */}
            <StylePieChart data={report.style_trends?.distribution || {}} />
          </Grid.Col>
        </Grid>

        <Paper withBorder shadow="sm" p="lg" radius="md">
            <Title order={3} mb="md">Images Analysées</Title>
            <ScrapedImages images={report.detailed_image_analysis || []} />
        </Paper>

      </Stack>
    </Container>
  );
}