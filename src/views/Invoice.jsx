import { useToPng } from "@hugocxl/react-to-image";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "../Invoice.css";
import { useEffect, useState } from "react";
import { getJobAndCustomerById, setJobPaidStatus } from "../api/jobs";
import { useAppContext } from "../context/appContext";

const Invoice = () => {
  const [customer, setCustomer] = useState(null);
  const [job, setJob] = useState(null);
  const { user } = useAppContext();
  const navigate = useNavigate();
  console.log(job);

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
                window.location.reload();
              }}
              className="paidButton"
            >
              Mark as Not Paid
            </Button>
          ) : (
            <Button
              onClick={() => {
                setJobPaidStatus({ id: job.id, isPaid: true });
                window.location.reload();
              }}
              className="paidButton"
            >
              Mark as Paid
            </Button>
          )}
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
            {/* Additional Notes section */}
            {job.notes && (
              <div className="invoice-section">
                <h3>Additional Notes:</h3>
                <p>{job.notes}</p>
              </div>
            )}
            <h3>Customer Details:</h3>
            <div>
              Customer: <span>{customer.name}</span>
            </div>
            <div>
              Address: <span>{customer.address}</span>
            </div>
            {/* <div>
              Job Name: <span>{job.name}</span>
            </div> */}
            <div>
              Job Date: <span>{new Date(job.jobDate).toDateString()}</span>
            </div>
          </div>
          <div className="formElementParent">
            {/* <div>
              Invoice Id: <span>{job.id}</span>
            </div>
            <div>
              Invoice Date: <span>{new Date().toDateString()}</span>
            </div> */}
            {/* <div>
              Invoice Status: <span>{job.isPaid ? "Paid" : "Not Paid"}</span>
            </div> */}
          </div>
        </div>
        <div className="invoiceAmount">Total Price: ${job.price}</div>
        <div className="invoice-footer">
          <div className="customer-signature">
            <strong>Customer Name:</strong> <span>______________________</span>
          </div>
          <div className="customer-signature">
            <strong>Customer Signature:</strong>{" "}
            <span>______________________</span>
          </div>
          <div className="company-signature">
            <strong>Company Rep Name:</strong>{" "}
            <span>______________________</span>
          </div>
          <div className="company-signature">
            <strong>Company Rep Signature:</strong>{" "}
            <span>______________________</span>
          </div>
          <div className="email-insurance">
            <div>Email: twoguystreeservice@outlook.com</div>
            <div>Fully Insured</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
