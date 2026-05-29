import { useState, useEffect } from 'react';
import {
  Box, Typography, CircularProgress, Alert, Button,
  Divider, Skeleton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import BookCard from '../../components/ui/BookCard';
import { useAuth } from '../../context/AuthContext';
import { getUserLibraries, getFirstFiveBooks } from '../../api/libraryApi';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [libraries, setLibraries] = useState([]);
  const [libraryPreviews, setLibraryPreviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true);
      setError('');
      try {
        // TODO: Connect to backend — GET /library/userLibraries (requires JWT)
        const result = await getUserLibraries();
        if (!result.success) throw new Error(result.error);
        setLibraries(result.libraries ?? []);

        // Fetch first 5 books for each library in parallel
        // TODO: Each call hits GET /library/getFirst/:libraryId (requires JWT)
        const previews = await Promise.all(
          (result.libraries ?? []).map(async (lib) => {
            try {
              const bookResult = await getFirstFiveBooks(lib.id);
              return { id: lib.id, books: bookResult.books ?? [] };
            } catch {
              return { id: lib.id, books: [] };
            }
          })
        );
        const previewMap = {};
        previews.forEach(({ id, books }) => { previewMap[id] = books; });
        setLibraryPreviews(previewMap);
      } catch (err) {
        setError('Failed to load your libraries. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchLibraries();
  }, []);

  return (
    <PageLayout>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={0.5}>
          Here's what's on your shelves
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" gap={3} flexDirection="column">
          {[0, 1, 2].map((i) => (
            <Box key={i}>
              <Skeleton variant="text" width={200} height={32} />
              <Box display="flex" gap={2} mt={1}>
                {[0, 1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} variant="rectangular" width={200} height={300} sx={{ borderRadius: 2 }} />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      ) : libraries.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            Your shelves are empty — start by searching for books!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/search')}
          >
            Discover Books
          </Button>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={5}>
          {libraries.map((library) => (
            <Box key={library.id}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Typography variant="h6" fontWeight={600}>
                  {library.name ?? library.library_name ?? 'Library'}
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/library', { state: { libraryId: library.id } })}
                >
                  View all
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box display="flex" gap={2} overflow="auto" pb={1}>
                {(libraryPreviews[library.id] ?? []).length === 0 ? (
                  <Typography variant="body2" color="text.secondary" py={2}>
                    No books yet — add some from the{' '}
                    <Button size="small" onClick={() => navigate('/search')}>
                      Search page
                    </Button>
                  </Typography>
                ) : (
                  (libraryPreviews[library.id] ?? []).map((book, idx) => (
                    <BookCard key={book.id ?? idx} book={book} />
                  ))
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </PageLayout>
  );
};

export default HomePage;
