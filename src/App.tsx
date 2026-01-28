import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage, WorksPage, ProjectPage, AboutPage, ExperiencePage, ArticlesPage, IllustrationsPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="works" element={<WorksPage />} />
          <Route path="works/:slug" element={<ProjectPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="illustrations" element={<IllustrationsPage />} />
          <Route path="experience" element={<ExperiencePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
