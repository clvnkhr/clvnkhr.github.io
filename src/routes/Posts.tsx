import { usePosts } from '../hooks/usePosts';
import { PostList } from '../components/posts/PostList';
import { SearchBar } from '../components/search/SearchBar';

export function Posts() {
  const { filteredPosts, allTags, filters, setFilters } = usePosts();
  
  const handleSearch = (query: string, tags: string[]) => {
    setFilters({ query, tags });
  };
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Posts</h1>
      
      <SearchBar 
        onSearch={handleSearch}
        availableTags={allTags}
      />
      
      <PostList posts={filteredPosts} />
    </div>
  );
}
