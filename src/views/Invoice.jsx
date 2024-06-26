import { useToPng } from "@hugocxl/react-to-image";
import { Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "../Invoice.css";
import { useEffect, useState } from "react";
import {
  getJobAndCustomerById,
  setJobPaidStatus,
  updateCustomerSigned,
} from "../api/jobs";
import { useAppContext } from "../context/appContext";

const Invoice = () => {
  const [customer, setCustomer] = useState(null);
  const [job, setJob] = useState(null);
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const customDateInputStyle = {
    fontSize: "1rem", // Adjust font size to match the form
    padding: "10px", // Add some padding for better spacing
    maxWidth: "200px", // Set a max width to keep it from getting too large
    margin: "10px 0", // Add some margin for spacing
    borderColor: "lightgray", // Border color to match other inputs
    borderRadius: "4px", // Slightly rounded borders for a modern look
  };

  useEffect(() => {
    const fetchData = async () => {
      let data = await getJobAndCustomerById(
        window.location.href.split("/")[
          window.location.href.split("/").length - 1
        ]
      );
      if (data.customer && data.job) {
        setCustomer(data.customer);
        setJob(data.job);
      }
    };
    fetchData();
  }, []);

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

  if (!customer || !job) return <div>Loading...</div>;

  return (
    <div>
      <Button onClick={convert} className="downloadButton">
        Download Invoice
      </Button>
      {user && (
        <>
          {job.isPaid ? (
            <Button
              onClick={() => {
                setJobPaidStatus({ id: job.id, isPaid: false });
                window.location.href = window.location.href;
              }}
              className="paidButton"
            >
              Mark as Not Paid
            </Button>
          ) : (
            <Button
              onClick={() => {
                setJobPaidStatus({ id: job.id, isPaid: true });
                window.location.href = window.location.href;
              }}
              className="paidButton"
            >
              Mark as Paid
            </Button>
          )}
          <Button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="dashboardButton"
          >
            Copy to Clipboard
          </Button>
          <Button
            onClick={() => navigate("/working-board")}
            className="dashboardButton"
          >
            Back to Dashboard
          </Button>
        </>
      )}
      <div ref={ref} className="invoice">
        <img src="/TGTR.png" alt="Image" className="image" />
        <div className="formContainer">
          <div className="formElementParent">
            {/* Tasks to be performed section */}
            <div className="tasksList">
              <h3>Tasks to be performed:</h3>
              <ul>
                {job.tasks.map((task, index) => (
                  <li key={index}>{task}</li> // Assuming `task` is a string
                ))}
              </ul>
            </div>
            <h3>Customer Details:</h3>
            <div>
              Name: <span>{customer.name}</span>
            </div>
            <div>
              Address: <span>{customer.address}</span>
            </div>
          </div>
          <div className="formElementParent"></div>
        </div>
        <div className="invoiceAmount">Total Price: ${job.price}</div>
        <div style={{ marginTop: '1rem', marginBottom: '0' }}>Invoice Date:</div>
        <div>
          <TextField
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={customDateInputStyle}
          />
        </div>
        <div className="invoice-footer">
          <div className="signatures-container">
            <TextField
              label="Customer Signature"
              name="customerSignatureName"
              variant="standard"
              disabled={job.customerSigned}
              value={job.signedCustomerName}
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
              disabled={job.customerSigned}
              value={job.companyRepName}
              fullWidth
            />
          </div>
          <div>
            <span className="signature-disclaimer">
              By completing the typed signature input, I agree that my
              electronic signature is the legal equivalent of my
              manual/handwritten signature on this document. I consent to the
              legally binding terms and conditions of this document.
            </span>
          </div>

          <div className="email-insurance">
            <div>Email: twoguystreeservice@outlook.com</div>
            <div>Fully Insured</div>
          </div>
        </div>
      </div>

      {!job.customerSigned && user && (
        <Button
          onClick={async () => {
            await updateCustomerSigned({
              id: job.id,
              signedCustomerName: job.signedCustomerName,
              companyRepName: job.companyRepName,
            });
            window.location.href = window.location.href;
          }}
          disabled={!job.signedCustomerName && !job.companyRepName}
          className="submitButton"
        >
          Sign and Submit
        </Button>
      )}
    </div>
  );
};

export default Invoice;
