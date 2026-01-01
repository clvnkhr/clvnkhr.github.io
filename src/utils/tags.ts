import React from 'react';

export function getTagColorClass(tagName: string): string {
  const colors = [
    'pink', 'mauve', 'red', 'maroon',
    'peach', 'yellow', 'green', 'teal',
    'sky', 'sapphire', 'blue', 'lavender'
  ];

  const hash = tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedColor = colors[hash % colors.length];

  return `tag-${selectedColor}`;
}
