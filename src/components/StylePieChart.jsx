import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Title, Text, Paper } from '@mantine/core';

// Un jeu de couleurs pour rendre le diagramme joli
const COLORS = ['#8884d8', '#82ca9d', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28'];

export function StylePieChart({ data }) {
  if (Object.keys(data).length === 0) {
    return (
      <>
        <Title order={3} mb="md">Top Styles</Title>
        <Text c="dimmed">Aucune donnée de style disponible.</Text>
      </>
    );
  }

  // On transforme les données pour Recharts et on ne garde que les styles principaux
  const chartData = Object.entries(data)
    .map(([name, values]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Met une majuscule
      value: parseFloat(values.percentage.toFixed(1)),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7); // On garde les 7 styles les plus pertinents pour la lisibilité

  return (
    <Paper withBorder shadow="sm" p="lg" radius="md" h="100%">
        <Title order={3} mb="xl">Top Styles</Title>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                    {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </Paper>
  );
}