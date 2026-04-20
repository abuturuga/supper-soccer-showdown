import { BrowserRouter, Routes, Route } from 'react-router'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { TeamGeneration } from './pages/TeamGeneration'
import { MatchResults } from './pages/MatchResults'


export const Router = () => {
  return <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/team-generation" element={<TeamGeneration />} />
        <Route path="/match-results" element={<MatchResults />} />
      </Route>
    </Routes>
  </BrowserRouter>
}