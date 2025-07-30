import { Outlet, Link } from 'react-router-dom';
import { AppShell, Burger, Group, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications'; // Très important !

export function Layout() {
  const [opened, { toggle }] = useDisclosure();

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
            TrendsAI
          </Link>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink component={Link} to="/" label="Dashboard" onClick={toggle} />
        <NavLink component={Link} to="/new" label="Nouvelle Analyse" onClick={toggle} />
      </AppShell.Navbar>

      <AppShell.Main>
        {/* Le composant qui affiche les popups de notification */}
        <Notifications position="top-right" /> 
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}