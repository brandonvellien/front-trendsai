// 1. Importer `Title` depuis Mantine
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppShell, Burger, Group, NavLink, Button, Stack, Title } from '@mantine/core'; 
import { useDisclosure } from '@mantine/hooks';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
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

          <Title 
            order={3} // Vous pouvez ajuster ce chiffre (de 1 à 6) pour changer la taille
            component={Link} 
            to="/" 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            TrendsAI
          </Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack justify="space-between" style={{ height: '100%' }}>
          <Stack>
            <NavLink component={Link} to="/" label="Dashboard" onClick={toggle} />
            <NavLink component={Link} to="/new" label="Nouvelle Analyse" onClick={toggle} />
          </Stack>
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