// src/pages/NewAnalysisPage.jsx
import { NewAnalysisForm } from '../components/NewAnalysisForm';

// Cette page devient un simple conteneur pour le formulaire, 
// ce qui est beaucoup plus propre.
export function NewAnalysisPage() {
  return <NewAnalysisForm />;
}

export default NewAnalysisPage;