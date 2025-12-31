import React from 'react';
import { Layout } from './Layout';
import { site } from '../config/site';
import { projects } from '../config/projects';
import type { Project } from '../config/projects';

export function ProjectsPage() {
  const getTagPastelColor = (tag: string): string => {
    const colors = [
      'pink', 'mauve', 'red', 'maroon',
      'peach', 'yellow', 'green', 'teal',
      'sky', 'sapphire', 'blue', 'lavender'
    ];

    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selectedColor = colors[hash % colors.length];

    return `bg-ctp-${selectedColor} text-ctp-crust`;
  };

  return (
    <Layout title={`Projects - ${site.title}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-ctp-mauve">Projects</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project: Project) => (
            <article
              key={project.id}
              className="border border-ctp-surface1 rounded-lg overflow-hidden hover:border-ctp-mauve transition-colors"
            >
              {project.imgSrc && (
                <img
                  src={project.imgSrc}
                  alt={project.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3">
                  {project.name}
                </h2>
                <p className="text-ctp-subtext0 mb-4">
                  {project.descriptionLess}
                </p>
                {project.descriptionMore && (
                  <div className="text-ctp-subtext0 mb-4">
                    {project.descriptionMore}
                  </div>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 text-sm rounded-full ${getTagPastelColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {project.actionButtons && (
                  <div dangerouslySetInnerHTML={{ __html: project.actionButtons }} />
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}
