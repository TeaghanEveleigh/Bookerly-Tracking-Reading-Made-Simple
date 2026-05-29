import { useState, useEffect } from 'react';
import {
  Box, Typography, Alert, CircularProgress, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab,
  Divider, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageLayout from '../../components/layout/PageLayout';
import BookCard from '../../components/ui/BookCard';
import { getUserLibraries, getLibraryBooks, createLibrary } from '../../api/libraryApi';
import { useLocation } from 'react-router-dom';

const LibraryPage = () => {
  const location = useLocation();
  const defaultLibraryId = location.state?.libraryId ?? null;

  const [libraries, setLibraries] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booksLoading, setBooksLoading] = useState(false);
  const [error, setError] = useState('');

  // New library dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newLibraryName, setNewLibraryName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // Load libraries on mount
  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true);
      try {
        // TODO: This calls GET /library/userLibraries on your backend (requires JWT)
        const result = await getUserLibraries();
        if (!result.success) throw new Error(result.error);
        const libs = result.libraries ?? [];
        setLibraries(libs);

        // Jump to the library passed via router state if any
        if (defaultLibraryId && libs.length > 0) {
          const idx = libs.findIndex((l) => l.id === defaultLibraryId);
          if (idx !== -1) setActiveTab(idx);
        }
      } catch (err) {
        setError('Failed to load libraries. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchLibraries();
  }, []);

  // Load books when active tab changes
  useEffect(() => {
    if (libraries.length === 0) return;
    const library = libraries[activeTab];
    if (!library) return;

    const fetchBooks = async () => {
      setBooksLoading(true);
      try {
        // TODO: This calls GET /library/libraryBooks/:libraryId on your backend (requires JWT)
        const result = await getLibraryBooks(library.id);
        if (!result.success) throw new Error(result.error);
        setBooks(result.books ?? []);
      } catch {
        setBooks([]);
      } finally {
        setBooksLoading(false);
      }
    };
    fetchBooks();
  }, [activeTab, libraries]);

  const handleCreateLibrary = async () => {
    if (!newLibraryName.trim()) {
      setCreateError('Please enter a library name.');
      return;
    }
    setCreateLoading(true);
    setCreateError('');
    try {
      // TODO: This calls POST /library/createLibrary on your backend (requires JWT)
      const result = await createLibrary(newLibraryName.trim());
      if (!result.success) throw new Error(result.error);
      // Re-fetch libraries after creation
      const updated = await getUserLibraries();
      setLibraries(updated.libraries ?? []);
      setActiveTab((updated.libraries?.length ?? 1) - 1);
      setDialogOpen(false);
      setNewLibraryName('');
    } catch (err) {
      setCreateError(err.message ?? 'Could not create library.');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <PageLayout>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>My Library</Typography>
          <Typography variant="body1" color="text.secondary">
            All your reading shelves in one place
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setDialogOpen(true); setCreateError(''); }}
        >
          New Shelf
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : libraries.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            You don't have any shelves yet.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            Create your first shelf
          </Button>
        </Box>
      ) : (
        <>
          {/* Library Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
          >
            {libraries.map((lib, i) => (
              <Tab
                key={lib.id}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    {lib.name ?? lib.library_name}
                  </Box>
                }
              />
            ))}
          </Tabs>

          {/* Books in selected library */}
          {booksLoading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : books.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography color="text.secondary">This shelf is empty.</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Search for books and add them here.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {books.length} book{books.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={2}>
                {books.map((book, idx) => (
                  <BookCard key={book.id ?? idx} book={book} />
                ))}
              </Box>
            </Box>
          )}
        </>
      )}

      {/* Create Library Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create a New Shelf</DialogTitle>
        <DialogContent>
          {createError && <Alert severity="error" sx={{ mb: 2 }}>{createError}</Alert>}
          <TextField
            autoFocus
            label="Shelf name"
            fullWidth
            value={newLibraryName}
            onChange={(e) => setNewLibraryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateLibrary()}
            placeholder="e.g. Science Fiction, Summer Reads…"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateLibrary} disabled={createLoading}>
            {createLoading ? <CircularProgress size={18} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default LibraryPage;
