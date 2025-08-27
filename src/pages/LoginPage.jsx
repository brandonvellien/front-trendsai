import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Container,
  Center, // <-- 1. Importer Center
} from '@mantine/core';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { notifications } from '@mantine/notifications';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      notifications.show({ title: 'Succès', message: 'Connexion réussie !', color: 'green' });
      navigate(from, { replace: true });
    } catch (error) {
      notifications.show({ title: 'Erreur', message: 'Email ou mot de passe incorrect.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    // 2. Envelopper le tout dans un Center pour un centrage vertical et horizontal parfait
    <Center style={{ height: '100vh' }}>
      <Container size={420} style={{ width: '100%' }}>
        <Title ta="center">
          Bienvenue !
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Vous n'avez pas de compte ?{' '}
          <Anchor size="sm" component={Link} to="/signup">
            Créer un compte
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={handleLogin}>
            <TextInput label="Email" placeholder="votre@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <PasswordInput label="Mot de passe" placeholder="Votre mot de passe" required mt="md" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button fullWidth mt="xl" type="submit" loading={loading}>
              Se connecter
            </Button>
          </form>
        </Paper>
      </Container>
    </Center>
  );
}