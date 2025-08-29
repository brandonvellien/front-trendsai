import { useState, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { Modal, Button, Stack, Select, MultiSelect, Paper, Title, Box, Alert, Text, ColorSwatch, Group, Skeleton } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { enrichAnalysisReport } from '../api/analysisApi';
import { IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';


const renderSelectOption = ({ option }) => (
    <Group flex="1" gap="xs">
      <ColorSwatch color={option.hex} size={14} />
      {option.label}
    </Group>
);

export function EnrichmentSection({ jobId, report }) {
  if (!report) return null;

  const [opened, { open, close }] = useDisclosure(false);

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

  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedGarments, setSelectedGarments] = useState([]);
  const [selectedColorHex, setSelectedColorHex] = useState(null);
  
  const mutation = useMutation({
    mutationFn: (selections) => enrichAnalysisReport(jobId, selections),
    onSuccess: () => {
        notifications.show({
            title: 'Synthèse terminée',
            message: 'Votre rapport stratégique enrichi est prêt.',
            color: 'green'
        });
    },
    onError: () => {
        notifications.show({
            title: 'Erreur',
            message: 'La génération de la synthèse a échoué.',
            color: 'red'
        });
    }
  });

  const handleEnrich = () => {
    const selections = {};
    if (selectedStyle) selections.style = selectedStyle;
    if (selectedGarments.length > 0) selections.garments = selectedGarments;
    if (selectedColorHex) {
      const colorObject = dominantColors.find(c => c.hex === selectedColorHex);
      if (colorObject) {
         selections.coloredGarments = [{
            color: colorObject,
            garment: selectedGarments.length > 0 ? selectedGarments[0] : 'clothing'
         }];
      }
    }

    if (Object.keys(selections).length === 0) {
        notifications.show({ title: 'Aucune sélection', message: 'Veuillez sélectionner au moins un critère à analyser.', color: 'orange' });
        return;
    }

    mutation.mutate(selections);
    // On ferme la modale immédiatement pour voir le chargement sur la page
    close();
  };

  return (
    <Paper withBorder shadow="sm" p="lg" radius="md" mt="xl">
      <Modal opened={opened} onClose={close} title="Personnaliser la Recherche Intelligente" size="lg">
        <Stack>
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
        {/* === C'EST ICI QUE LE CHANGEMENT A LIEU === */}

        {/* 1. Si la tâche est en cours, on affiche un squelette de chargement */}
        {mutation.isPending && (
            <Stack>
                <Skeleton height={12} radius="sm" />
                <Skeleton height={8} radius="sm" />
                <Skeleton height={8} mt="sm" radius="sm" />
                <Skeleton height={8} radius="sm" />
                <Skeleton height={8} width="70%" radius="sm" />
            </Stack>
        )}

        {/* 2. Si la tâche a réussi, on affiche le résultat */}
        {mutation.isSuccess && (
          <Box p="md" bg="gray.0" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
            <ReactMarkdown>{mutation.data.enrichedText}</ReactMarkdown>
          </Box>
        )}

        {/* 3. Si la tâche a échoué, on affiche une alerte */}
        {mutation.isError && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Erreur" color="red">
            Impossible de générer le rapport enrichi.
          </Alert>
        )}

        {/* 4. À l'état initial, on affiche le message par défaut */}
        {!mutation.isPending && !mutation.isSuccess && !mutation.isError &&(
          <Text c="dimmed">Cliquez sur le bouton pour personnaliser la recherche et générer une synthèse stratégique.</Text>
        )}
      </Box>

       <Button onClick={open} mt="md">
        Personnaliser la Recherche
      </Button>
    </Paper>
  );
}