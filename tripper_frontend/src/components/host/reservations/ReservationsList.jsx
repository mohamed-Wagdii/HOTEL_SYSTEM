import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const statusColors = {
  pending: "warning",
  confirmed: "success",
  cancelled: "error",
  completed: "info",
};

const ReservationsList = ({
  title,
  reservations,
  loading,
  onAccept,
  onReject,
  detailsBasePath,
  fields,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedRes, setSelectedRes] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReservations = reservations.filter((r) =>
    statusFilter === "all" ? true : r.status === statusFilter
  );

  const handleConfirm = async () => {
    if (!selectedRes) return;

    if (dialogType === "accept") {
      await onAccept(selectedRes);
    } else if (dialogType === "reject") {
      await onReject(selectedRes);
    }

    setDialogType(null);
    setSelectedRes(null);
  };

  return (
    <Fade in timeout={400}>
      <Box p={3} maxWidth="1200px" mx="auto" width="100%">
        {/* Title */}
        <Typography
          variant={isSmall ? "h5" : "h4"}
          fontWeight="bold"
          color="#034959"
          textAlign="center"
          mb={3}
        >
          {title}
        </Typography>

        {/* Filter */}
        <Box mb={2} display="flex" justifyContent="flex-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontWeight: "bold",
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={8}>
            <CircularProgress sx={{ color: "#FF385C" }} />
          </Box>
        ) : filteredReservations.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" mt={4}>
            No reservations found.
          </Typography>
        ) : isSmall ? (
          // MOBILE VIEW
          <Stack spacing={2}>
            {filteredReservations.map((res) => (
              <Card key={res._id} sx={{ p: 2, borderRadius: 3 }}>
                <CardContent>
                  {fields.map((f) => (
                    <Typography key={f.key} variant="body2" mb={0.5}>
                      {f.label}: {f.render ? f.render(res) : res[f.key]}
                    </Typography>
                  ))}

                  <Chip
                    label={res.status}
                    color={statusColors[res.status]}
                    sx={{ mt: 1, textTransform: "capitalize" }}
                  />

                  {/* ACTIONS */}
                  <Stack spacing={1.2} mt={2}>
                    {res.status === "pending" && (
                      <>
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#4CAF50" }}
                          onClick={() => {
                            setSelectedRes(res);
                            setDialogType("accept");
                          }}
                        >
                          Accept
                        </Button>

                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#D32F2F" }}
                          onClick={() => {
                            setSelectedRes(res);
                            setDialogType("reject");
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    <Button
                      variant="outlined"
                      onClick={() => navigate(`${detailsBasePath}/${res._id}`)}
                    >
                      Details
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          // DESKTOP TABLE
          <Box sx={{ overflowX: filteredReservations.length > 0 ? "auto" : "visible" }}>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table sx={{ minWidth: 700, width: "100%" }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#FFF8F8" }}>
                    {fields.map((f) => (
                      <TableCell key={f.key} sx={{ fontWeight: "bold" }}>
                        {f.label}
                      </TableCell>
                    ))}
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredReservations.map((res) => (
                    <TableRow key={res._id} hover>
                      {fields.map((f) => (
                        <TableCell key={f.key}>
                          {f.render ? f.render(res) : res[f.key]}
                        </TableCell>
                      ))}

                      <TableCell>
                        <Chip
                          label={res.status}
                          color={statusColors[res.status]}
                          sx={{ textTransform: "capitalize" }}
                        />
                      </TableCell>

                      <TableCell>
                        {res.status === "pending" ? (
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{ backgroundColor: "#4CAF50" }}
                              onClick={() => {
                                setSelectedRes(res);
                                setDialogType("accept");
                              }}
                            >
                              Accept
                            </Button>

                            <Button
                              variant="contained"
                              size="small"
                              sx={{ backgroundColor: "#D32F2F" }}
                              onClick={() => {
                                setSelectedRes(res);
                                setDialogType("reject");
                              }}
                            >
                              Reject
                            </Button>
                          </Stack>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            navigate(`${detailsBasePath}/${res._id}`)
                          }
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* DIALOG */}
        <Dialog open={dialogType !== null} onClose={() => setDialogType(null)}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            {dialogType === "accept"
              ? "Confirm Reservation"
              : "Reject Reservation"}
          </DialogTitle>

          <DialogContent>
            <Typography>
              Are you sure you want to{" "}
              <b>{dialogType === "accept" ? "accept" : "reject"}</b> this
              reservation?
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDialogType(null)}>Cancel</Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor:
                  dialogType === "accept" ? "#4CAF50" : "#D32F2F",
              }}
              onClick={handleConfirm}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default ReservationsList;
