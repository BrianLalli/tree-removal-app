import { useToPng } from "@hugocxl/react-to-image";
import { Alert, Button, Chip, CircularProgress, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import "../Invoice.css";
import { useEffect, useState } from "react";
import {
  getJobAndCustomerById,
  setJobPaidStatus,
  updateCustomerSigned,
} from "../api/jobs";
import { useAppContext } from "../context/appContext";

const Invoice = () => {
  const { invoiceId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [job, setJob] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { severity, message }
  const [copied, setCopied] = useState(false);
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await getJobAndCustomerById(invoiceId);
      if (data?.customer && data?.job) {
        setCustomer(data.customer);
        setJob(data.job);
      } else {
        setLoadError(true);
      }
    };
    fetchData();
  }, [invoiceId]);

  const [_, convert, ref] = useToPng({
    quality: 0.8,
    onSuccess: (data) => {
      const link = document.createElement("a");
      link.download = customer
        ? `TGTR ${customer.name} ${new Date(
            job.jobDate
          ).toDateString()} Invoice.jpeg`
        : "invoice.jpeg";
      link.href = data;
      link.click();
    },
  });

  if (loadError)
    return (
      <div className="invoice-page">
        <div className="invoice-state">
          This invoice could not be found. Please check the link and try again.
        </div>
      </div>
    );

  if (!customer || !job)
    return (
      <div className="invoice-page">
        <div className="invoice-state">
          <CircularProgress size={28} />
        </div>
      </div>
    );

  const customerName = (job.signedCustomerName || "").trim();
  const repName = (job.companyRepName || "").trim();

  const togglePaid = async () => {
    await setJobPaidStatus({ id: job.id, isPaid: !job.isPaid });
    setJob((prev) => ({ ...prev, isPaid: !prev.isPaid }));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy link", e);
    }
  };

  // Customers (not logged in) sign their name and submit, which locks the invoice.
  // The company rep (logged in) can pre-sign before sending the link; that does not
  // lock the invoice unless the customer's signature is also filled in.
  const handleSubmit = async () => {
    setSubmitting(true);
    setStatus(null);
    try {
      const saved = await updateCustomerSigned(
        user
          ? {
              id: job.id,
              signedCustomerName: customerName || null,
              companyRepName: repName || null,
              lock: !!customerName,
            }
          : {
              id: job.id,
              signedCustomerName: customerName,
              lock: true,
            }
      );
      setJob((prev) => ({ ...prev, ...saved }));
      setStatus({
        severity: "success",
        message: saved.customerSigned
          ? "Thank you! Your signed invoice has been sent to Two Guys Tree Service."
          : "Rep signature saved. Send the link to the customer to sign.",
      });
    } catch (e) {
      setStatus({
        severity: "error",
        message:
          "Something went wrong saving the signature. Please try again, or contact us at twoguystreeservice@outlook.com.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = user ? !!(customerName || repName) : !!customerName;

  return (
    <div className="invoice-page">
      <div className="invoice-toolbar">
        <Button variant="outlined" onClick={convert}>
          Download Invoice
        </Button>
        {user && (
          <>
            <Button variant="outlined" onClick={togglePaid}>
              {job.isPaid ? "Mark as Not Paid" : "Mark as Paid"}
            </Button>
            <Button variant="outlined" onClick={copyLink}>
              {copied ? "Link Copied!" : "Copy Link"}
            </Button>
            <Button variant="text" onClick={() => navigate("/working-board")}>
              Back to Dashboard
            </Button>
          </>
        )}
      </div>

      <div ref={ref} className="invoice">
        <div className="invoice-header">
          <img src="/TGTR.png" alt="Two Guys Tree Service" className="image" />
          <div className="invoice-badges">
            {job.customerSigned && (
              <Chip label="Signed" color="primary" size="small" />
            )}
            {job.isPaid && <Chip label="Paid" color="success" size="small" variant="outlined" />}
          </div>
        </div>

        <div className="invoice-section">
          <h3>Customer Details</h3>
          <div className="invoice-row">
            <span className="invoice-label">Name</span>
            <span>{customer.name}</span>
          </div>
          <div className="invoice-row">
            <span className="invoice-label">Address</span>
            <span>{customer.address}</span>
          </div>
        </div>

        <div className="invoice-section">
          <h3>Tasks to be performed</h3>
          <ul className="tasksList">
            {(job.tasks || [])
              .filter((task) => task && task.trim())
              .map((task, index) => (
                <li key={index}>{task}</li>
              ))}
          </ul>
        </div>

        <div className="invoice-total">
          <span>Total Price</span>
          <span className="invoiceAmount">${job.price}</span>
        </div>

        <div className="invoice-date">
          <TextField
            type="date"
            label="Invoice Date"
            size="small"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        <div className="invoice-footer">
          <div className="signatures-container">
            <TextField
              label="Customer Signature (type your full name)"
              name="customerSignatureName"
              variant="standard"
              disabled={job.customerSigned}
              value={job.signedCustomerName || ""}
              onChange={(e) => {
                setJob((prev) => ({
                  ...prev,
                  signedCustomerName: e.target.value,
                }));
              }}
              fullWidth
            />
            <TextField
              label="Company Rep. Signature"
              name="companyRepName"
              onChange={(e) => {
                setJob((prev) => ({
                  ...prev,
                  companyRepName: e.target.value,
                }));
              }}
              variant="standard"
              disabled={job.customerSigned || !user}
              value={job.companyRepName || ""}
              fullWidth
            />
          </div>
          <p className="signature-disclaimer">
            By completing the typed signature input, I agree that my electronic
            signature is the legal equivalent of my manual/handwritten signature
            on this document. I consent to the legally binding terms and
            conditions of this document.
          </p>

          <div className="email-insurance">
            <span>Email: twoguystreeservice@outlook.com</span>
            <span>Fully Insured</span>
          </div>
        </div>
      </div>

      {status && (
        <Alert severity={status.severity} className="invoice-alert">
          {status.message}
        </Alert>
      )}

      {!job.customerSigned && (
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="submitButton"
        >
          {submitting ? "Submitting…" : "Sign and Submit"}
        </Button>
      )}
    </div>
  );
};

export default Invoice;
