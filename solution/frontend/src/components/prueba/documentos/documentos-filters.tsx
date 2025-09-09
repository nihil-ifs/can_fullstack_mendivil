'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass } from '@phosphor-icons/react';
import Button from '@mui/material/Button';

interface DocumentosFiltersProps {
  onSearch: (query: string) => void;
}

export function DocumentosFilters({ onSearch }: DocumentosFiltersProps): React.JSX.Element {
  const [query, setQuery] = React.useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <Card sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
      <OutlinedInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        placeholder="Buscar archivo o documento"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlass size={18} />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
      />
      <Button variant="contained" onClick={handleSearch}>
        Buscar
      </Button>
    </Card>
  );
}
