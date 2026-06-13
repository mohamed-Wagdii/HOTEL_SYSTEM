import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

export default function RoomsForm({ showRooms = false }) {
  const { control, register } = useFormContext();
  const type = useWatch({ control, name: "type" });

  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  const shouldShow = type === "hotel" || showRooms;
  if (!shouldShow) return null;

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Rooms
      </Typography>

      {fields.map((field, index) => (
        <Box key={field.id} sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
          <Typography fontWeight="bold" mb={1}>
            Room {index + 1}
          </Typography>

          <TextField label="Room Name" fullWidth margin="dense" {...register(`rooms.${index}.name`)} />
          <TextField label="Room Price" type="number" fullWidth margin="dense" {...register(`rooms.${index}.price`)} />
          <TextField label="Quantity" type="number" fullWidth margin="dense" {...register(`rooms.${index}.quantity`)} />
          <TextField label="Max Guests" type="number" fullWidth margin="dense" {...register(`rooms.${index}.maxGuests`)} />

          <IconButton onClick={() => remove(index)} color="error" sx={{ mt: 1 }}>
            <Delete />
          </IconButton>
        </Box>
      ))}

      <Button startIcon={<Add />} variant="outlined" sx={{ mt: 1 }} onClick={() => append({ name: "", price: "", quantity: 1, maxGuests: 2 })}>
        Add Room
      </Button>
    </Box>
  );
}
