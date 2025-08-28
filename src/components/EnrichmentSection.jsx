import { useState, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { Modal, Button, Stack, Select, MultiSelect, Paper, Title, Box, LoadingOverlay, Alert, Text, ColorSwatch, Group } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { enrichAnalysisReport } from '../api/analysisApi';
import { IconAlertCircle } from '@tabler/icons-react';

const renderSelectOption = ({ option }) => (
    <Group flex="1" gap="xs">
      <ColorSwatch color={option.hex} size={14} />
      {option.label}
    </Group>
);

export function EnrichmentSection({ jobId, report }) {
  if (!report) return null;

  const [opened, { open, close }] = useDisclosure(false);

  // Préparation des données pour les menus déroulants
  const styleOptions = Object.keys(report.style_trends?.distribution || {});
  const garmentOptions = Object.keys(report.garment_trends?.distribution || {});
  const dominantColors = report.color_trends?.dominant_colors || [];
  const colorOptions = useMemo(() => 
    dominantColors.map(c => ({
      value: c.hex,
      label: c.color_name,
      hex: c.hex
    })), 
  [dominantColors]);

  // --- MODIFICATION ICI : Les états initiaux sont nuls (non sélectionnés) ---
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedGarments, setSelectedGarments] = useState([]);
  const [selectedColorHex, setSelectedColorHex] = useState(null);
  
  const mutation = useMutation({
    mutationFn: (selections) => enrichAnalysisReport(jobId, selections),
  });

  const handleEnrich = () => {
    // On ne construit l'objet qu'avec les sélections qui ont été faites
    const selections = {};
    if (selectedStyle) selections.style = selectedStyle;
    if (selectedGarments.length > 0) selections.garments = selectedGarments;
    if (selectedColorHex) {
      const colorObject = dominantColors.find(c => c.hex === selectedColorHex);
      if (colorObject) selections.color = colorObject.color_name;
    }

    // On s'assure qu'au moins un critère est sélectionné
    if (Object.keys(selections).length === 0) {
        notifications.show({ title: 'Erreur', message: 'Veuillez sélectionner au moins un critère de recherche.', color: 'red' });
        return;
    }

    mutation.mutate(selections);
    close();
  };

  return (
    <Paper withBorder shadow="sm" p="lg" radius="md" mt="xl">
      <Modal opened={opened} onClose={close} title="Personnaliser la Recherche Intelligente" size="lg">
        <Stack>
          {/* --- MODIFICATION ICI : Ajout de placeholder et 'clearable' --- */}
          <Select 
            label="Focus sur un style" 
            placeholder="Tous les styles (Optionnel)"
            data={styleOptions} 
            value={selectedStyle} 
            onChange={setSelectedStyle} 
            clearable 
          />
          <MultiSelect 
            label="Focus sur des vêtements"
            placeholder="Tous les vêtements (Optionnel)" 
            data={garmentOptions} 
            value={selectedGarments} 
            onChange={setSelectedGarments} 
            searchable
            clearable
          />
          <Select
            label="Focus sur une couleur"
            placeholder="Toutes les couleurs (Optionnel)"
            data={colorOptions}
            value={selectedColorHex}
            onChange={setSelectedColorHex}
            renderOption={renderSelectOption}
            clearable
          />
          <Button onClick={handleEnrich} loading={mutation.isPending} mt="lg">
            Lancer la recherche et générer la synthèse
          </Button>
        </Stack>
      </Modal>

      <Title order={3} mb="md">Rapport Stratégique Enrichi</Title>
      
      <Box pos="relative">
        <LoadingOverlay visible={mutation.isPending} />
        {mutation.isSuccess && (
          <Box p="md" bg="gray.0" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
            <ReactMarkdown>{mutation.data.enrichedText}</ReactMarkdown>
          </Box>
        )}
        {mutation.isError && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Erreur" color="red">
            Impossible de générer le rapport enrichi.
          </Alert>
        )}
        {!mutation.data && !mutation.isPending && (
          <Text c="dimmed">Cliquez sur le bouton pour personnaliser et lancer une recherche.</Text>
        )}
      </Box>

       <Button onClick={open} mt="md">
        Personnaliser la Recherche
      </Button>
    </Paper>
  );
}