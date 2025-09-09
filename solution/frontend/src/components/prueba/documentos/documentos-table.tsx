'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';
import type { CsvFile } from '@/types/models';
import { EstadoBadge } from './documentos-estado';

function noop(): void {
  // do nothing
}

interface DocumentosTableProps {
  count?: number;
  page?: number;
  rows?: CsvFile[];
  rowsPerPage?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ProcesarCsv?: (csvId: number) => void;
}

export function DocumentosTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 5,
  onPageChange = noop,
  onRowsPerPageChange = noop,
  ProcesarCsv,
}: DocumentosTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => rows.map((r) => String(r.id)), [rows]);
  const { selected } = useSelection(rowIds);

  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});
  const [openDialog, setOpenDialog] = React.useState(false);
  const [docSeleccionado, setDocSeleccionado] = React.useState<any>(null);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenDialog = (doc: any) => {
    setDocSeleccionado(doc);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDocSeleccionado(null);
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>CSV</TableCell>
              <TableCell>Subido en</TableCell>
              <TableCell>Subido por</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Documentos</TableCell>
              <TableCell>Procesados</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(String(row.id));
              return (
                <React.Fragment key={row.id}>
                  <TableRow hover selected={isSelected}>
                    <TableCell>{row.nombre}</TableCell>
                    <TableCell>{dayjs(row.fechaSubida).format('DD/MM/YYYY HH:mm')}</TableCell>
                    <TableCell>{row.usuario}</TableCell>
                    <TableCell>
                      <EstadoBadge estado={row.estado} />
                    </TableCell>
                    <TableCell>{row.documentos.length}</TableCell>
                    <TableCell>{row.enlacesProcesados}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {row.estado === 'QUEUED' && (
                          <Button
                            size="small"
                            onClick={() => ProcesarCsv(row.id)}
                            sx={{
                              backgroundColor: '#FF9B32',
                              color: 'white',
                              '&:hover': { backgroundColor: '#F5B46E' }
                            }}
                          >
                            Procesar CSV
                          </Button>
                        )}
                          <Button size="small" 
                            onClick={() => toggleExpand(row.id)}
                            sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#115293' } }}
                          >
                          {expanded[row.id] ? 'Ocultar' : 'Ver documentos'}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>

                  {expanded[row.id] && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Box sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 1 }}>
                          <Typography variant="subtitle2">
                            Documentos ({row.documentos.length})
                          </Typography>

                          <Table size="small" sx={{ mt: 1 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>Nomenclatura</TableCell>
                                <TableCell>Título</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acción</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {row.documentos.map((doc) => (
                                <TableRow key={doc.id}>
                                  <TableCell>{doc.nomenclatura}</TableCell>
                                  <TableCell>{doc.titulo}</TableCell>
                                  <TableCell>
                                    <EstadoBadge estado={doc.estado} />
                                  </TableCell>
                                  <TableCell>
                                    <Stack direction="row" spacing={1}>
                                      <Button size="small" 
                                        onClick={() => handleOpenDialog(doc)}
                                        sx={{ backgroundColor: '#110011', color: 'white', '&:hover': { backgroundColor: '#554455' } }}>
                                        Ver más
                                      </Button>
                                    </Stack>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      <Divider />

      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Detalles del Documento</DialogTitle>
        <DialogContent dividers>
          {docSeleccionado && (
            <>
              <Typography><strong>Nomenclatura:</strong> {docSeleccionado.nomenclatura}</Typography>
              <Typography><strong>Título:</strong> {docSeleccionado.titulo}</Typography>
              <Typography><strong>Publicado en fecha:</strong> {dayjs(docSeleccionado.fechaPublicacion).format('DD/MM/YYYY HH:mm')}</Typography>
              <Typography><strong>Nombre del documento:</strong> {docSeleccionado.documentoNombre}</Typography>
              <Typography><strong>Páginas:</strong> {docSeleccionado.paginas}</Typography>
              <Typography><strong>Tipo de documento:</strong> {docSeleccionado.tipoDocumento}</Typography>
              <Typography><strong>Contenido:</strong> {docSeleccionado.texto}</Typography>
              <Typography>
                <a href={docSeleccionado.urlDocumento} target="_blank" rel="noreferrer">
                  Descargar el documento
                </a>
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
