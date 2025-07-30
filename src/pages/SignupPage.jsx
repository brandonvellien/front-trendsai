import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Container, Title, Paper, TextInput, PasswordInput, Button, Text, Anchor } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      notifications.show({
        title: 'Compte créé !',
        message: 'Bienvenue ! Vous êtes maintenant connecté.',
        color: 'green',
      });
      navigate('/'); // Redirige vers le dashboard après l'inscription
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Cette adresse e-mail est déjà utilisée.');
      } else if (err.code === 'auth/weak-password') {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
      } else {
        setError("Erreur lors de la création du compte.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" my={40}>
      <Title ta="center">Créer un compte</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Vous avez déjà un compte ?{' '}
        <Anchor component={Link} to="/login" size="sm">
          Se connecter
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSignup}>
          <TextInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
          <PasswordInput label="Mot de passe" value={password} onChange={(e) => setPassword(e.currentTarget.value)} required mt="md" />
          <PasswordInput label="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.currentTarget.value)} required mt="md" />
          
          {error && <Text color="red" size="sm" mt="sm">{error}</Text>}
          
          <Button type="submit" fullWidth mt="xl" loading={loading}>
            S'inscrire
          </Button>
        </form>
      </Paper>
    </Container>
  );
}