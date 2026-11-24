import { Box, IconButton, Typography, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Shared overlay + card used by the job and customer editors.
 */
const ModalShell = ({ title, subtitle, onClose, footer, maxWidth = 600, children }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: { xs: "flex-end", sm: "flex-start" },
        justifyContent: "center",
        bgcolor: "rgba(6, 10, 8, 0.72)",
        backdropFilter: "blur(4px)",
        pt: { xs: 0, sm: "5vh" },
        zIndex: theme.zIndex.modal,
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "92%" },
          maxWidth,
          maxHeight: { xs: "94vh", sm: "88vh" },
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          color: "text.primary",
          borderRadius: { xs: "16px 16px 0 0", sm: "16px" },
          boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
          overflow: "hidden",
          textAlign: "left",
          zIndex: theme.zIndex.modal + 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }} noWrap>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {subtitle}
              </Typography>
            )}
          </Box>
          {onClose && (
            <IconButton aria-label="Close" onClick={onClose} edge="end">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 3,
            py: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {children}
        </Box>
        {footer && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "flex-end",
              px: 3,
              py: 1.75,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.grey[50],
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ModalShell;
