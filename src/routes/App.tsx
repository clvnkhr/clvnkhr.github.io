import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Home } from './Home';
import { Posts } from './Posts';
import { Projects } from './Projects';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Layout>
  );
}
