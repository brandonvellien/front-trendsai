import { useState, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { Modal, Button, Stack, Select, MultiSelect, Image, Center, Loader, Alert, Paper, Title, Group, ColorSwatch, Text } from '@mantine/core';
import { generateCreativeImage } from '../api/analysisApi';
import { notifications } from '@mantine/notifications';

// On définit la fonction pour rendre les options en dehors du composant principal
// C'est une fonction qui retourne du JSX pour chaque option du menu déroulant
const renderSelectOption = ({ option, checked }) => (
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

  // --- MODIFICATION ICI ---
  // La structure des données est maintenant simple et optimisée pour `renderOption`
  const colorOptions = useMemo(() => 
    dominantColors.map(c => ({
      value: c.hex,          // La valeur reste le code HEX unique
      label: c.color_name,     // Le label est maintenant juste le nom (texte simple)
      hex: c.hex             // On garde le hex pour l'utiliser dans renderOption
    })), 
  [dominantColors]);

  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0] || '');
  const [selectedGarments, setSelectedGarments] = useState([]);
  const [garmentColors, setGarmentColors] = useState({});

  const handleGarmentChange = (garments) => {
    setSelectedGarments(garments);
    // On n'initialise plus de couleur par défaut, le placeholder s'affichera
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
    // On vérifie que chaque vêtement sélectionné a une couleur assignée
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
                  renderOption={renderSelectOption} // <-- LA MAGIE EST ICI
                  allowDeselect={false} // Empêche de dé-sélectionner pour garder le placeholder propre
                />
              ))}
            </Stack>
          )}

          <Button onClick={handleGenerate} loading={mutation.isPending} mt="lg">
            Générer l'Image
          </Button>

          {mutation.isPending && <Center><Loader /></Center>}
          {mutation.isError && <Alert color="red" title="Erreur">La génération a échoué.</Alert>}
          {mutation.isSuccess && (
            <Image src={mutation.data.imageUrl} radius="md" alt="Image générée par IA" mt="md" />
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