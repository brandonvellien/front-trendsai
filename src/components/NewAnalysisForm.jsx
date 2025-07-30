import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button, Stack, ActionIcon, Group, Tabs } from '@mantine/core';
import { IconPlus, IconTrash, IconLink, IconBrandInstagram } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { startAnalysisJob } from '../api/analysisApi';

export function NewAnalysisForm() {
  const navigate = useNavigate();
  
  // États pour les deux types d'analyse
  const [instagramAccounts, setInstagramAccounts] = useState(['']);
  const [webUrl, setWebUrl] = useState('');
  
  const mutation = useMutation({
    mutationFn: startAnalysisJob,
    onSuccess: (response) => {
      const { jobId } = response.data;
      notifications.show({
        title: 'Analyse lancée !',
        message: `L'analyse a démarré. Vous allez être redirigé.`,
        color: 'green',
      });
      navigate(`/report/${jobId}`);
    },
    onError: () => {
      notifications.show({
        title: 'Erreur',
        message: "Impossible de lancer l'analyse.",
        color: 'red',
      });
    },
  });

  // Fonctions pour gérer les comptes Instagram
  const handleAccountChange = (index, value) => {
    const newAccounts = [...instagramAccounts];
    newAccounts[index] = value;
    setInstagramAccounts(newAccounts);
  };

  const addAccountField = () => {
    setInstagramAccounts([...instagramAccounts, '']);
  };

  const removeAccountField = (index) => {
    const newAccounts = instagramAccounts.filter((_, i) => i !== index);
    setInstagramAccounts(newAccounts);
  };

  // Fonction de soumission
  const handleSubmit = (sourceType) => {
    const sourceInput = sourceType === 'instagram'
      ? instagramAccounts.filter(acc => acc.trim() !== '').join(',')
      : webUrl;

    if (!sourceInput) {
        notifications.show({ title: 'Erreur', message: 'Veuillez remplir au moins un champ.', color: 'red' });
        return;
    }

    mutation.mutate({ sourceType, sourceInput });
  };

  return (
    <Tabs defaultValue="instagram">
      <Tabs.List grow>
        <Tabs.Tab value="instagram" leftSection={<IconBrandInstagram size={16} />}>
          Comptes Instagram
        </Tabs.Tab>
        <Tabs.Tab value="web" leftSection={<IconLink size={16} />}>
          URL de défilé
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="instagram" pt="lg">
        <Stack>
          {instagramAccounts.map((account, index) => (
            <Group key={index}>
              <TextInput
                placeholder="Saississez un compte Instagram"
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
          <Button onClick={addAccountField} leftSection={<IconPlus size={16} />} variant="light">
            Ajouter un compte
          </Button>
          <Button onClick={() => handleSubmit('instagram')} loading={mutation.isPending} size="lg">
            Lancer l'Analyse Instagram
          </Button>
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="web" pt="lg">
        <Stack>
          <TextInput
            label="URL du défilé"
            placeholder="https://www.tag-walk.com/..."
            value={webUrl}
            onChange={(e) => setWebUrl(e.currentTarget.value)}
            size="lg"
            required
          />
          <Button onClick={() => handleSubmit('web')} loading={mutation.isPending} size="lg">
            Lancer l'Analyse Web
          </Button>
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
}