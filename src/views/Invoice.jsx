import { useToPng } from "@hugocxl/react-to-image";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "../Invoice.css";


const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {customer, job} = location.state;
  console.log(customer);
  console.log(job);
  const [_, convert, ref] = useToPng({
    quality: 0.8,
    onSuccess: data => {
      const link = document.createElement('a');
      link.download = 'my-image-name.jpeg';
      link.href = data;
      link.click();
    }
  })

  return (
    <div>
      <Button onClick={convert} className="downloadButton">Download Invoice</Button>
      <Button onClick={() => navigate("/working-board")} className="dashboardButton">Back to Dashboard</Button>
      <div ref={ref} className="invoice">
        <img src="/public/TGTR.png" alt="Image" className="image" />
        <div className="formContainer">
          <div className="formElementParent">
            <div>Customer: <span>{customer.name}</span></div>
            <div>Address: <span>{customer.address}</span></div>
            <div>Job Name: <span>{job.name}</span></div>
          </div>
          <div className="formElementParent">
            <div>Invoice Id: <span>{job.id}</span></div>
            <div>Invoice Date: <span>{new Date().toDateString()}</span></div>
            <div>Invoice Status: <span>{"Not Paid"}</span></div>
          </div>
        </div>
        <div className="invoiceAmount">Invoice Amount: ${job.price}</div>
      </div>
    </div>
  );
};

export default Invoice;
