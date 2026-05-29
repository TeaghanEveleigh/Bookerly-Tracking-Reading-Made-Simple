import { useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert, Grid,
  CircularProgress, InputAdornment, MenuItem, Select,
  FormControl, InputLabel, Chip, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PageLayout from '../../components/layout/PageLayout';
import BookCard from '../../components/ui/BookCard';
import { discoverBooks } from '../../api/bookApi';
import { getUserLibraries, getLibraryBooks } from '../../api/libraryApi';
import { createBook } from '../../api/bookApi';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [orderBy, setOrderBy] = useState('relevance');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Add-to-library dialog
  const [selectedBook, setSelectedBook] = useState(null);
  const [libraries, setLibraries] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      // TODO: This calls POST /discover/discover on your backend (requires JWT)
      // Backend proxies to Google Books API with your query
      const result = await discoverBooks(query, orderBy);
      if (!result.success) throw new Error(result.error);
      setResults(result.books ?? []);
    } catch (err) {
      setError('Search failed. Make sure the backend is running and you are logged in.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleAddToLibrary = async (book) => {
    setSelectedBook(book);
    setAddError('');
    setAddSuccess('');
    setSelectedLibrary('');

    try {
      // TODO: This calls GET /library/userLibraries on your backend (requires JWT)
      const result = await getUserLibraries();
      setLibraries(result.libraries ?? []);
    } catch {
      setLibraries([]);
    }
    setDialogOpen(true);
  };

  const handleConfirmAdd = async () => {
    if (!selectedLibrary) {
      setAddError('Please select a library.');
      return;
    }
    setAddLoading(true);
    setAddError('');
    setAddSuccess('');

    const info = selectedBook?.volumeInfo ?? {};
    const saleInfo = selectedBook?.saleInfo ?? {};

    const payload = {
      bookName: info.title ?? 'Unknown',
      bookPreviewPicture: info.imageLinks?.thumbnail ?? '',
      bookDescription: info.description ?? '',
      bookAuthors: info.authors?.join(', ') ?? '',
      numberOfPages: info.pageCount ?? 0,
      estimatedReadTime: info.pageCount ? Math.ceil(info.pageCount / 250) : 0, // rough estimate: 250 pages/hr
      publisher: info.publisher ?? '',
      bookLink: saleInfo.buyLink ?? info.previewLink ?? '',
      libraryId: selectedLibrary,
    };

    try {
      // TODO: This calls POST /book/createBook on your backend (requires JWT)
      const result = await createBook(payload);
      if (result.success) {
        setAddSuccess(`"${info.title}" added to your library!`);
      } else {
        setAddError(result.error ?? 'Failed to add book.');
      }
    } catch {
      setAddError('Could not reach backend. Is it running?');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <PageLayout>
      {/* Search header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} mb={0.5}>
          Discover Books
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search millions of books powered by Google Books
        </Typography>
      </Box>

      {/* Search bar */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by title, author, or ISBN…"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={orderBy}
            label="Sort by"
            onChange={(e) => setOrderBy(e.target.value)}
          >
            <MenuItem value="relevance">Relevance</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Search
        </Button>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Results count */}
      {searched && !loading && (
        <Box mb={2} display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="text.secondary">
            {results.length > 0
              ? `Found ${results.length} results for`
              : 'No results for'}
          </Typography>
          <Chip label={query} size="small" color="primary" variant="outlined" />
        </Box>
      )}

      {/* Results grid */}
      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item key={i}>
              <BookCard loading />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {results.map((book, idx) => (
            <BookCard
              key={book.id ?? idx}
              book={book}
              onAddToLibrary={handleAddToLibrary}
            />
          ))}
        </Box>
      )}

      {/* Add to Library dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add to Library</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            <strong>{selectedBook?.volumeInfo?.title}</strong>
          </Typography>

          {addError && <Alert severity="error" sx={{ mb: 2 }}>{addError}</Alert>}
          {addSuccess && <Alert severity="success" sx={{ mb: 2 }}>{addSuccess}</Alert>}

          <FormControl fullWidth size="small">
            <InputLabel>Select a library</InputLabel>
            <Select
              value={selectedLibrary}
              label="Select a library"
              onChange={(e) => setSelectedLibrary(e.target.value)}
              disabled={!!addSuccess}
            >
              {libraries.map((lib) => (
                <MenuItem key={lib.id} value={lib.id}>
                  {lib.name ?? lib.library_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          {!addSuccess && (
            <Button
              variant="contained"
              onClick={handleConfirmAdd}
              disabled={addLoading}
            >
              {addLoading ? <CircularProgress size={18} /> : 'Add'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default SearchPage;
