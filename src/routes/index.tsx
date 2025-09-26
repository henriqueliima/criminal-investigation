import { createFileRoute } from '@tanstack/react-router'

import CriminalInvestigationPage from '../pages/CriminalInvestigation'

export const Route = createFileRoute('/')({
  component: CriminalInvestigationPage,
})
