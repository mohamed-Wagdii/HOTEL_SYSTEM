import { Box, Typography, Slider } from "@mui/material";

export default function PriceFilter({ minPrice, maxPrice, value, onChange }) {
  return (
    <Box sx={{ width: 300 }}>
      <Typography sx={{ mb: 1, fontWeight: 600, textAlign: "center" }}>
        Price Range: {value[0]} — {value[1]} ج.م
      </Typography>

      <Slider
        value={value}
        onChange={(e, newValue) => onChange(newValue)}
        valueLabelDisplay="auto"
        min={minPrice}
        max={maxPrice}
        step={100}
      />
    </Box>
  );
}
