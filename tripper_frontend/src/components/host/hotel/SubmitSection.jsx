import React from "react";
import { Button, CircularProgress } from "@mui/material";

const SubmitSection = ({ loading }) => {
  return (
    <Button
      variant="contained"
      sx={{
        bgcolor: "#f27244",
        borderRadius: 3,
        px: 4,
        py: 1.2,
        fontWeight: "bold",
        textTransform: "none",
        "&:hover": { bgcolor: "#034959" },
      }}
      type="submit"                // <-- keep only submit
      disabled={loading}
    >
      {loading ? (
        <CircularProgress
          size={24}
          sx={{
            color: "white",
          }}
        />
      ) : (
        "Save"
      )}
    </Button>
  );
};

export default SubmitSection;
