import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Container, Title, Paper, TextInput, PasswordInput, Button, Text, Anchor } from '@mantine/core';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirige vers le dashboard après connexion
    } catch (err) {
      setError('Email ou mot de passe incorrect.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" my={40}>
      <Title ta="center">Connexion</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Vous n'avez pas de compte ?{' '}
        <Anchor component={Link} to="/signup" size="sm">
          Créer un compte
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleLogin}>
          <TextInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
          <PasswordInput label="Mot de passe" value={password} onChange={(e) => setPassword(e.currentTarget.value)} required mt="md" />
          
          {error && <Text color="red" size="sm" mt="sm">{error}</Text>}
          
          <Button type="submit" fullWidth mt="xl" loading={loading}>
            Se connecter
          </Button>
        </form>
      </Paper>
    </Container>
  );
}