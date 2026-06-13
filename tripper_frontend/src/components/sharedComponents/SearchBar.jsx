import { Box, TextField, InputAdornment, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: 0.5,
          borderRadius: "40px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 380,
          background: "#ffffff",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ color: "#1976d2", opacity: 0.8, fontSize: 26 }}
                />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "40px",
              "& fieldset": { border: "none" }, // remove border
            },
          }}
          sx={{
            "& .MuiInputBase-input": {
              padding: "10px 14px",
              fontSize: "0.95rem",
              fontWeight: 500,
            },
            "& .MuiOutlinedInput-root": {
              "&:hover": {
                backgroundColor: "#f5faff",
              },
              "&.Mui-focused": {
                backgroundColor: "#f0f7ff",
                boxShadow: "0 0 0 3px rgba(25,118,210,0.2)",
              },
            },
          }}
        />
      </Paper>
    </Box>
  );
}
