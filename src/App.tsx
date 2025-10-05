import { useState, useMemo, useRef } from 'react';
import { Snippet, SearchFilters } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SnippetCard } from './components/SnippetCard';
import { SnippetEditor } from './components/SnippetEditor';
import { EmptyState } from './components/EmptyState';
import { generateId, createSnippetVersion, exportSnippets, importSnippets, copyToClipboard } from './utils/snippetStorage';


function App() {
  const [snippets, setSnippets] = useLocalStorage<Snippet[]>('snippets', []);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    language: '',
    tags: [],
    showFavoritesOnly: false,
  });
  const [notification, setNotification] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get all unique tags from snippets
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    snippets.forEach(snippet => {
      snippet.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [snippets]);

  // Filter snippets 
  const filteredSnippets = useMemo(() => {
    return snippets.filter(snippet => {
      const matchesQuery = !filters.query || 
        snippet.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        snippet.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        snippet.code.toLowerCase().includes(filters.query.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()));

      const matchesLanguage = !filters.language || snippet.language === filters.language;
      
      const matchesTags = filters.tags.length === 0 || 
        filters.tags.every(tag => snippet.tags.includes(tag));

      const matchesFavorites = !filters.showFavoritesOnly || snippet.isFavorite;

      return matchesQuery && matchesLanguage && matchesTags && matchesFavorites;
    });
  }, [snippets, filters]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCreateNew = () => {
    setEditingSnippet(null);
    setShowEditor(true);
  };

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setShowEditor(true);
  };

  const handleSave = (snippetData: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'versions'>) => {
    if (editingSnippet) {
      // Update existing snippet
      const updatedSnippet: Snippet = {
        ...editingSnippet,
        ...snippetData,
        updatedAt: new Date(),
        versions: [
          ...editingSnippet.versions,
          createSnippetVersion(editingSnippet.code, 'Previous version'),
        ].slice(-10), // Keep only last 10 versions
      };

      setSnippets(snippets.map(s => s.id === editingSnippet.id ? updatedSnippet : s));
      showNotification('Snippet updated successfully!');
    } else {
      // Create new snippet
      const newSnippet: Snippet = {
        id: generateId(),
        ...snippetData,
        createdAt: new Date(),
        updatedAt: new Date(),
        versions: [],
      };

      setSnippets([newSnippet, ...snippets]);
      showNotification('Snippet created successfully!');
    }

    setShowEditor(false);
    setEditingSnippet(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      setSnippets(snippets.filter(s => s.id !== id));
      showNotification('Snippet deleted successfully!');
    }
  };

  const handleToggleFavorite = (id: string) => {
    setSnippets(snippets.map(snippet =>
      snippet.id === id ? { ...snippet, isFavorite: !snippet.isFavorite } : snippet
    ));
  };

  const handleCopy = async (code: string) => {
    const success = await copyToClipboard(code);
    if (success) {
      showNotification('Code copied to clipboard!');
    } else {
      showNotification('Failed to copy code. Please try again.');
    }
  };

  const handleExport = () => {
    const dataStr = exportSnippets(snippets);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snippets-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Snippets exported successfully!');
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const importedSnippets = importSnippets(content);
        if (importedSnippets.length > 0) {
          const existingIds = new Set(snippets.map(s => s.id));
          const newSnippets = importedSnippets.filter(s => !existingIds.has(s.id));
          
          if (newSnippets.length > 0) {
            setSnippets([...snippets, ...newSnippets]);
            showNotification(`Successfully imported ${newSnippets.length} snippets!`);
          } else {
            showNotification('No new snippets to import.');
          }
        } else {
          showNotification('Failed to import snippets. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasActiveFilters = filters.query || filters.language || filters.tags.length > 0 || filters.showFavoritesOnly;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        onCreateNew={handleCreateNew}
        onExport={handleExport}
        onImport={handleImport}
        snippetCount={snippets.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <SearchBar
            filters={filters}
            onFiltersChange={setFilters}
            availableTags={allTags}
          />

          {filteredSnippets.length === 0 ? (
            <EmptyState onCreateNew={handleCreateNew} hasFilters={hasActiveFilters} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSnippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showEditor && (
        <SnippetEditor
          snippet={editingSnippet || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingSnippet(null);
          }}
          existingTags={allTags}
        />
      )}

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dark {
          color-scheme: dark;
        }
      `}</style>
    </div>
  );
}

export default App;
