import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, TextInput, Group, ActionIcon, Text, Loader, SimpleGrid, Paper, UnstyledButton, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconTrash, IconBookmark } from '@tabler/icons-react';
import { useAuth } from '../hooks/useAuth';
import { getUserPresets, createPreset, deletePreset } from '../api/analysisApi';
import { notifications } from '@mantine/notifications';

const PresetManager = ({ sourceType, currentInput, onSelectPreset }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [modalOpened, setModalOpened] = useState(false);

  const { data: presets = [], isLoading } = useQuery({
    queryKey: ['presets', user?.uid],
    queryFn: getUserPresets,
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: createPreset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets', user.uid] });
      setModalOpened(false);
      notifications.show({ title: 'Succès', message: 'Preset sauvegardé !', color: 'green' });
    },
    onError: () => notifications.show({ title: 'Erreur', message: 'Impossible de sauvegarder le preset.', color: 'red' }),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePreset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets', user.uid] });
      notifications.show({ title: 'Succès', message: 'Preset supprimé.', color: 'gray' });
    },
    onError: () => notifications.show({ title: 'Erreur', message: 'Impossible de supprimer le preset.', color: 'red' }),
  });

  const form = useForm({
    initialValues: { name: '', category: '', sourceType, sourceInput: '' },
    validate: {
      name: (value) => (value.trim().length > 2 ? null : 'Le nom doit avoir au moins 3 caractères'),
      sourceInput: (value) => (value.trim().length > 0 ? null : 'Le champ de recherche ne peut pas être vide'),
    },
  });

  const handleOpenModal = () => {
    const currentInputValue = Array.isArray(currentInput) ? currentInput.join(',') : currentInput;
    form.setValues({
      name: '',
      category: '',
      sourceType,
      sourceInput: currentInputValue,
    });
    setModalOpened(true);
  };

  const handleSavePreset = (values) => {
    const presetData = { ...values, category: values.category.trim() || 'Général' };
    createMutation.mutate(presetData);
  };

  const filteredPresets = presets.filter(p => p.sourceType === sourceType);
  const groupedPresets = filteredPresets.reduce((acc, preset) => {
    const category = preset.category || 'Général';
    if (!acc[category]) acc[category] = [];
    acc[category].push(preset);
    return acc;
  }, {});

  return (
    <>
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Sauvegarder cette recherche">
        <form onSubmit={form.onSubmit(handleSavePreset)}>
          <TextInput label="Nom du preset" placeholder="Ex: Marques de luxe SS25" {...form.getInputProps('name')} required />
          <TextInput label="Catégorie (Optionnel)" placeholder="Ex: Luxe, Concurrents..." {...form.getInputProps('category')} />
          <TextInput label="Contenu de la recherche" {...form.getInputProps('sourceInput')} required />
          <Button type="submit" mt="md" loading={createMutation.isPending}>Sauvegarder</Button>
        </form>
      </Modal>

      <Paper withBorder p="md" mt="xl">
        <Group justify="space-between">
          <Text size="lg" fw={500}>Mes recherches sauvegardées</Text>
          <Button leftSection={<IconPlus size={14} />} onClick={handleOpenModal} variant="light">
            Sauvegarder la recherche actuelle
          </Button>
        </Group>

        {isLoading && <Loader mt="md" />}
        {!isLoading && filteredPresets.length === 0 && <Text c="dimmed" mt="md">Aucun preset sauvegardé.</Text>}

        {Object.entries(groupedPresets).map(([category, items]) => (
          <div key={category} mt="lg">
            <Text size="sm" fw={700} tt="uppercase" c="dimmed">{category}</Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xs">
              {items.map(preset => (
                <Paper withBorder p="xs" key={preset._id}>
                  <Group justify="space-between">
                    <UnstyledButton onClick={() => onSelectPreset(preset.sourceInput)}>
                      <Group gap="xs">
                        <IconBookmark size={16} />
                        <Text size="sm">{preset.name}</Text>
                      </Group>
                    </UnstyledButton>
                    <ActionIcon color="red" size="sm" variant="light" onClick={() => deleteMutation.mutate(preset._id)}>
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Paper>
              ))}
            </SimpleGrid>
          </div>
        ))}
      </Paper>
    </>
  );
};

export default PresetManager;