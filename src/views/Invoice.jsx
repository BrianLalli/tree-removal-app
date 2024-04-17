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
            <div>
              Customer: <span>{customer.name}</span>
            </div>
            <div>
              Address: <span>{customer.address}</span>
            </div>
            <div>
              Job Name: <span>{job.name}</span>
            </div>
            <div>
              Job Date: <span>{new Date(job.jobDate).toDateString()}</span>
            </div>
          </div>
          <div className="formElementParent">
            <div>
              Invoice Id: <span>{job.id}</span>
            </div>
            <div>
              Invoice Date: <span>{new Date().toDateString()}</span>
            </div>
            <div>
              Invoice Status: <span>{job.isPaid ? "Paid" : "Not Paid"}</span>
            </div>
          </div>
        </div>
        <div className="invoiceAmount">Invoice Amount: ${job.price}</div>
      </div>
    </div>
  );
};

export default Invoice;
