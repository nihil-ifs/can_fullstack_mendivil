'use client';

import * as React from 'react';
import { Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { DocumentosFilters } from '@/components/prueba/documentos/documentos-filters';
import { DocumentosTable } from '@/components/prueba/documentos/documentos-table';
import SubirCsv from '@/components/prueba/documentos/documentos-subir';
import type { CsvFile } from '@/types/models';

export default function Page(): React.JSX.Element {
  const [csvFiles, setCsvFiles] = React.useState<CsvFile[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState('');

  const loadCsvFiles = () => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? '';
    setLoading(true);
    fetch(`${base}/files`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener archivos');
        return res.json();
      })
      .then((data: CsvFile[]) => setCsvFiles(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSearch = async (query: string) => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? '';
    const res = await fetch(`${base}/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    
    setCsvFiles(Array.isArray(data) ? data : data.results || []);
  };


  const ProcesarCsv = async (csvId: number) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? '';
      const res = await fetch(`${base}/process/${csvId}`, { method: 'POST' });

      if (!res.ok) throw new Error('Error al procesar CSV');

      const data = await res.json();
      setDialogMessage('CSV encolado para procesamiento:');
      setDialogOpen(true);

      loadCsvFiles();
    } catch (err: any) {
      setDialogMessage(`No se pudo procesar el CSV:\n${err.message || err}`);
      setDialogOpen(true);
    }
  };

  React.useEffect(() => {
    loadCsvFiles();
    const interval = setInterval(loadCsvFiles, process.env.NEXT_PUBLIC_REFRESH_INTERVAL_MS ? Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL_MS) : 30000);
    return () => clearInterval(interval);
  }, []);

  const paginated = csvFiles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Documentos cargados</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <SubirCsv onUploadSuccess={loadCsvFiles} />
          </Stack>
        </Stack>
      </Stack>

      <DocumentosFilters onSearch={handleSearch} />

      {loading ? (
        <Typography>Cargando...</Typography>
      ) : (
        <DocumentosTable
          count={csvFiles.length}
          page={page}
          rows={paginated}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            const v = Number((e.target as HTMLInputElement).value);
            setRowsPerPage(v);
            setPage(0);
          }}
          ProcesarCsv={ProcesarCsv}
        />
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Información</DialogTitle>
        <DialogContent>
          <Typography style={{ whiteSpace: 'pre-wrap' }}>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
