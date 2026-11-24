import { useEffect, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HistoryIcon from "@mui/icons-material/History";
import { getJobsByCustomerId } from "../api/jobs";

const STATUS_META = {
  "group-1": { label: "Opportunity", color: "#E0A800" },
  "group-2": { label: "Pending", color: "#F57C00" },
  "group-3": { label: "Upcoming", color: "#1E88E5" },
  "group-4": { label: "Completed", color: "#2E9E44" },
};

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatMoney = (value) => {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return "—";
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  });
};

const JobRow = ({ job, onSelectJob }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const meta = job.archived
    ? { label: "Archived", color: "#8A8F8C" }
    : STATUS_META[job.status] || { label: "—", color: "#8A8F8C" };
  const tasks = (job.tasks || []).filter((t) => t && t.trim());
  const date = formatDate(job.jobDate) || formatDate(job.callDate) || formatDate(job.created_at);

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderLeft: `3px solid ${meta.color}`,
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Box
        onClick={() => setOpen((o) => !o)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 1.5,
          py: 1,
          cursor: "pointer",
          textAlign: "left",
          "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
            {job.name || "Untitled job"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {date || "No date"} · {meta.label}
            {job.isPaid ? " · Paid" : ""}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
          {formatMoney(job.price)}
        </Typography>
        <IconButton
          size="small"
          aria-label={open ? "Hide details" : "Show details"}
          sx={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 150ms",
          }}
        >
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Box>
      <Collapse in={open} unmountOnExit>
        <Box sx={{ px: 1.5, pb: 1.5, textAlign: "left" }}>
          {tasks.length > 0 && (
            <Box component="ul" sx={{ m: 0, pl: 2.5, typography: "body2" }}>
              {tasks.map((task, i) => (
                <li key={i} style={{ whiteSpace: "pre-wrap" }}>
                  {task}
                </li>
              ))}
            </Box>
          )}
          {job.notes && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: tasks.length ? 1 : 0, whiteSpace: "pre-wrap" }}
            >
              <strong>Notes:</strong> {job.notes}
            </Typography>
          )}
          {!tasks.length && !job.notes && (
            <Typography variant="body2" color="text.secondary">
              No tasks or notes recorded.
            </Typography>
          )}
          {onSelectJob && (
            <Chip
              label="Open job"
              size="small"
              variant="outlined"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onSelectJob(job);
              }}
              sx={{ mt: 1.25 }}
            />
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

/**
 * Shows every job on file for a customer (newest first) with totals, so past
 * work and pricing can be referenced when quoting a new job.
 */
const CustomerJobHistory = ({ customerId, excludeJobId, onSelectJob, title = "Job History" }) => {
  const theme = useTheme();
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!customerId) {
      setJobs(null);
      return;
    }
    setJobs(null);
    setError(false);
    getJobsByCustomerId(customerId)
      .then((data) => !cancelled && setJobs(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [customerId]);

  if (!customerId) return null;

  const list = (jobs || []).filter((j) => j.id !== excludeJobId);
  const priced = list.filter((j) => !j.archived && !Number.isNaN(parseFloat(j.price)) && parseFloat(j.price) > 0);
  const total = priced.reduce((sum, j) => sum + parseFloat(j.price), 0);
  const avg = priced.length ? Math.round(total / priced.length) : 0;

  return (
    <Box
      sx={{
        borderRadius: 3,
        p: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.06),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
        textAlign: "left",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <HistoryIcon fontSize="small" color="primary" />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1 }}>
          {title}
        </Typography>
        {jobs && (
          <Typography variant="caption" color="text.secondary">
            {list.length} {list.length === 1 ? "job" : "jobs"}
          </Typography>
        )}
      </Box>

      {error && (
        <Typography variant="body2" color="error">
          Could not load job history.
        </Typography>
      )}

      {!jobs && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={22} />
        </Box>
      )}

      {jobs && list.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No previous jobs for this customer.
        </Typography>
      )}

      {jobs && list.length > 0 && (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              mb: 1.5,
            }}
          >
            {[
              ["Jobs", list.length],
              ["Total billed", formatMoney(total)],
              ["Avg. price", priced.length ? formatMoney(avg) : "—"],
            ].map(([label, value]) => (
              <Box
                key={label}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  px: 1.25,
                  py: 1,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="caption" color="text.secondary" display="block">
                  {label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              maxHeight: 360,
              overflowY: "auto",
              pr: 0.5,
            }}
          >
            {list.map((job) => (
              <JobRow key={job.id} job={job} onSelectJob={onSelectJob} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomerJobHistory;
