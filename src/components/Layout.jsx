import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppShell, Burger, Group, NavLink, Button, Stack } from '@mantine/core'; // 1. Importer Button et Stack
import { useDisclosure } from '@mantine/hooks';
import { signOut } from 'firebase/auth'; // 2. Importer la fonction de déconnexion
import { auth } from '../firebase'; // 3. Importer l'instance d'authentification

export function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate(); // 4. Pour rediriger l'utilisateur

  // 5. Créer la fonction de déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Une fois déconnecté, on redirige vers la page de login
      navigate('/login'); 
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
            TrendsAI Pro
          </Link>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {/* On utilise un Stack pour mieux organiser le contenu du menu */}
        <Stack justify="space-between" style={{ height: '100%' }}>
          {/* Section des liens de navigation */}
          <Stack>
            <NavLink component={Link} to="/" label="Dashboard" onClick={toggle} />
            <NavLink component={Link} to="/new" label="Nouvelle Analyse" onClick={toggle} />
          </Stack>

          {/* 6. Ajouter le bouton de déconnexion en bas */}
          <Button onClick={handleLogout} color="red" variant="light">
            Se déconnecter
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}