// src/components/NewAnalysisForm.jsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button, Stack, ActionIcon, Group, Tabs, Text, Container, Title, Paper } from '@mantine/core';
import { IconPlus, IconTrash, IconLink, IconBrandInstagram } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { startAnalysisJob } from '../api/analysisApi';
import { useAuth } from '../hooks/useAuth';
import PresetManager from './PresetManager';

export function NewAnalysisForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [instagramAccounts, setInstagramAccounts] = useState(['']);
  const [webUrl, setWebUrl] = useState('');
  
  const mutation = useMutation({
    mutationFn: startAnalysisJob,
    onSuccess: (response) => {
      const { jobId } = response.data;
      notifications.show({
        title: 'Analyse lancée !',
        message: 'Vous allez être redirigé vers la page du rapport.',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      navigate(`/report/${jobId}`);
    },
    onError: (error) => {
      notifications.show({
        title: 'Erreur',
        message: error.response?.data?.message || "Impossible de lancer l'analyse.",
        color: 'red',
      });
    },
  });

  const handleAccountChange = (index, value) => {
    const newAccounts = [...instagramAccounts];
    newAccounts[index] = value;
    setInstagramAccounts(newAccounts);
  };

  const addAccountField = () => setInstagramAccounts([...instagramAccounts, '']);
  const removeAccountField = (index) => setInstagramAccounts(instagramAccounts.filter((_, i) => i !== index));

  const handleSubmit = (sourceType) => {
    if (!user) {
        notifications.show({ title: 'Erreur', message: 'Vous devez être connecté pour lancer une analyse.', color: 'red' });
        return;
    }
    const sourceInput = sourceType === 'instagram'
      ? instagramAccounts.filter(acc => acc.trim() !== '').join(',')
      : webUrl;

    if (!sourceInput) {
        notifications.show({ title: 'Erreur', message: 'Veuillez saisir au moins une source.', color: 'red' });
        return;
    }
    mutation.mutate({ sourceType, sourceInput });
  };

  const handleSelectInstagramPreset = (sourceInput) => {
      setInstagramAccounts(sourceInput.split(','));
  };

  return (
    <Container size="lg" py="xl">
        {/* Le Titre et la description sont maintenant ici, ce qui est plus logique */}
        <Title order={1} ta="center">Lancer une nouvelle analyse</Title>
        <Text c="dimmed" ta="center" mt="sm" mb="xl">
            Choisissez une source de données pour commencer à découvrir les prochaines tendances.
        </Text>

        <Tabs defaultValue="instagram">
            <Tabs.List grow>
                <Tabs.Tab value="instagram" leftSection={<IconBrandInstagram size={16} />}>Comptes Instagram</Tabs.Tab>
                <Tabs.Tab value="web" leftSection={<IconLink size={16} />}>URL de défilé</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="instagram" pt="lg">
                <Paper shadow="md" p="xl" radius="md" withBorder>
                    <Stack>
                        {instagramAccounts.map((account, index) => (
                            <Group key={index}>
                                <TextInput
                                    placeholder="Saisissez un compte Instagram"
                                    value={account}
                                    onChange={(e) => handleAccountChange(index, e.currentTarget.value)}
                                    style={{ flex: 1 }}
                                    required
                                />
                                <ActionIcon onClick={() => removeAccountField(index)} color="red" disabled={instagramAccounts.length <= 1}>
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Group>
                        ))}
                        <Button onClick={addAccountField} leftSection={<IconPlus size={16} />} variant="light">Ajouter un compte</Button>
                        <Button onClick={() => handleSubmit('instagram')} loading={mutation.isPending} size="lg">Lancer l'Analyse Instagram</Button>
                    </Stack>
                </Paper>
                <PresetManager 
                    sourceType="instagram"
                    currentInput={instagramAccounts}
                    onSelectPreset={handleSelectInstagramPreset}
                />
            </Tabs.Panel>

            <Tabs.Panel value="web" pt="lg">
                <Paper shadow="md" p="xl" radius="md" withBorder>
                    <Stack>
                        <TextInput
                            label="URL du défilé"
                            placeholder="https://www.tag-walk.com/..."
                            value={webUrl}
                            onChange={(e) => setWebUrl(e.currentTarget.value)}
                            size="lg"
                            required
                        />
                        <Button onClick={() => handleSubmit('web')} loading={mutation.isPending} size="lg">Lancer l'Analyse Web</Button>
                    </Stack>
                </Paper>
                <PresetManager 
                    sourceType="web"
                    currentInput={webUrl}
                    onSelectPreset={setWebUrl}
                />
            </Tabs.Panel>
        </Tabs>
    </Container>
  );
}

export default NewAnalysisForm;