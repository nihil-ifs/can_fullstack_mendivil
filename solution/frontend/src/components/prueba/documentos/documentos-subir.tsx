import { useState, DragEvent } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Paper
} from '@mui/material';
import { Upload as UploadIcon } from '@phosphor-icons/react';

export default function SubirCsv({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0] || null;
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
    } else {
      alert('Solo se permiten archivos CSV');
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
        alert('Debes seleccionar un archivo CSV');
        return;
    }

    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error al subir: ${response.status}`);
        }

        const result = await response.json();
        setDialogMessage(result.mensaje);
        setDialogOpen(true);

        if (onUploadSuccess) {
          onUploadSuccess();
        }

        handleClose();
    } 
    catch (error) {
        console.error("Error al subir archivo:", error);
        setDialogMessage("Ocurrió un error al subir el CSV");
        setDialogOpen(true);
    }
  };

  return (
    <>
      <Button
        sx={{ backgroundColor: '#008000', color: 'white', '&:hover': { backgroundColor: '#008080' } }}
        startIcon={<UploadIcon size={18} />}
        onClick={handleOpen}
      >
        Cargar CSV
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Subir archivo CSV</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                textAlign: 'center',
                borderStyle: 'dashed',
                bgcolor: '#fafafa',
                cursor: 'pointer'
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('csvInput')?.click()}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Arrastra tu archivo CSV aquí o haz click para seleccionarlo
              </Typography>
              <input
                id="csvInput"
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {file && (
                <Typography variant="caption" color="primary">
                  Archivo seleccionado: {file.name}
                </Typography>
              )}
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={handleUpload} variant="contained" color="primary">
            Subir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Resultado de la carga</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
