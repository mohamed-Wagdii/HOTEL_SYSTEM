import { Box, Pagination } from "@mui/material";

export default function PaginationBar({ page, totalPages, onChange }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(e, value) => onChange(value)}
        color="primary"
        size="medium"
        sx={{
          "& .MuiPaginationItem-root": {
            borderRadius: "50%",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          },
        }}
      />
    </Box>
  );
}
