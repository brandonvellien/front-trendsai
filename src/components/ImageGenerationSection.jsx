import { useState, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { Modal, Button, Stack, Select, MultiSelect, Image, Center, Loader, Alert, Paper, Title, Group, ColorSwatch, Text } from '@mantine/core';
import { generateCreativeImage } from '../api/analysisApi';
import { notifications } from '@mantine/notifications';

const renderSelectOption = ({ option }) => (
  <Group flex="1" gap="xs">
    <ColorSwatch color={option.hex} size={14} />
    {option.label}
  </Group>
);

export function ImageGenerationSection({ report }) {
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

  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0] || '');
  const [selectedGarments, setSelectedGarments] = useState([]);
  const [garmentColors, setGarmentColors] = useState({});

  const handleGarmentChange = (garments) => {
    setSelectedGarments(garments);
  };

  const handleColorChange = (garment, colorValue) => {
    setGarmentColors(prev => ({ ...prev, [garment]: colorValue }));
  };

  const mutation = useMutation({
    mutationFn: generateCreativeImage,
    onSuccess: () => {
        notifications.show({ title: 'Image générée !', message: 'Votre image est prête.', color: 'green' });
    },
    onError: () => {
        notifications.show({ title: 'Erreur', message: 'La génération de l\'image a échoué.', color: 'red' });
    }
  });

  const handleGenerate = () => {
    for (const garment of selectedGarments) {
        if (!garmentColors[garment]) {
            notifications.show({ title: 'Sélection incomplète', message: `Veuillez choisir une couleur pour ${garment}`, color: 'red' });
            return;
        }
    }

    const coloredGarments = selectedGarments.map(g => {
      const selectedHex = garmentColors[g];
      const fullColorObject = dominantColors.find(c => c.hex === selectedHex);
      return {
        garment: g,
        color: fullColorObject || {}
      }
    });

    mutation.mutate({ style: selectedStyle, coloredGarments });
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Génération d'Image Créative" size="lg">
        <Stack>
          <Select label="1. Choisissez un style" data={styleOptions} value={selectedStyle} onChange={setSelectedStyle} />
          <MultiSelect label="2. Choisissez des vêtements" data={garmentOptions} value={selectedGarments} onChange={handleGarmentChange} searchable />
          
          {selectedGarments.length > 0 && (
            <Stack mt="md" gap="sm">
              <Text fw={500}>3. Attribuez une couleur à chaque vêtement</Text>
              {selectedGarments.map(garment => (
                <Select
                  key={garment}
                  label={garment}
                  placeholder="Veuillez sélectionner une couleur"
                  data={colorOptions}
                  value={garmentColors[garment]}
                  onChange={(value) => handleColorChange(garment, value)}
                  renderOption={renderSelectOption}
                  allowDeselect={false}
                />
              ))}
            </Stack>
          )}

          <Button onClick={handleGenerate} loading={mutation.isPending} mt="lg">
            Générer l'Image
          </Button>

          {mutation.isPending && <Center><Loader /></Center>}
          {mutation.isError && <Alert color="red" title="Erreur">La génération a échoué.</Alert>}
          
          {/* --- MODIFICATION ICI --- */}
          {/* On accède à l'URL via mutation.data.data.imageUrl */}
          {mutation.isSuccess && (
            <Image src={mutation.data.data.imageUrl} radius="md" alt="Image générée par IA" mt="md" />
          )}
        </Stack>
      </Modal>

      <Paper withBorder shadow="sm" p="lg" radius="md" mt="xl">
        <Title order={3} mb="md">Génération d'Image par IA</Title>
        <Button onClick={open}>Ouvrir l'outil de génération créative</Button>
      </Paper>
    </>
  );
}