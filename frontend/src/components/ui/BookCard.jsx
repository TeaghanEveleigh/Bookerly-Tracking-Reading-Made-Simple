import {
  Card, CardMedia, CardContent, CardActions,
  Typography, Button, Box, Chip, Skeleton,
} from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';

/**
 * BookCard — renders a single book from Google Books API format.
 * @param {object} book        — Google Books volume object (data from /discover/discover)
 * @param {function} onAddToLibrary — callback when "Add to Library" is clicked
 * @param {boolean} loading    — shows skeleton while data is loading
 */
const BookCard = ({ book, onAddToLibrary, loading = false }) => {
  if (loading) {
    return (
      <Card sx={{ width: 200, flexShrink: 0 }}>
        <Skeleton variant="rectangular" height={260} />
        <CardContent>
          <Skeleton variant="text" />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    );
  }

  const info = book?.volumeInfo ?? {};
  const thumbnail =
    info.imageLinks?.thumbnail?.replace('http://', 'https://') ??
    'https://via.placeholder.com/128x196?text=No+Cover';
  const title = info.title ?? 'Unknown Title';
  const authors = info.authors?.join(', ') ?? 'Unknown Author';
  const pageCount = info.pageCount;
  const publisher = info.publisher;

  return (
    <Card
      sx={{
        width: 200,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
      }}
    >
      <CardMedia
        component="img"
        image={thumbnail}
        alt={title}
        sx={{ height: 260, objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap title={title}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {authors}
        </Typography>
        <Box mt={0.5} display="flex" gap={0.5} flexWrap="wrap">
          {pageCount && (
            <Chip label={`${pageCount} pages`} size="small" variant="outlined" />
          )}
          {publisher && (
            <Chip label={publisher} size="small" variant="outlined" />
          )}
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<BookmarkAddIcon />}
          onClick={() => onAddToLibrary?.(book)}
          fullWidth
          variant="outlined"
          color="primary"
        >
          Add to Library
        </Button>
      </CardActions>
    </Card>
  );
};

export default BookCard;
