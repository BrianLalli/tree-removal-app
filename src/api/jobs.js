import { formatDateForEasternTime } from "../utils/helper";
import supabase from "../utils/supabaseClient";

export const saveJob = async (jobDetails) => {
  if (!jobDetails.name) throw "name required to create job";
  if (!jobDetails.customerId) throw "customer required to create job";
  if (!jobDetails.price) jobDetails.price = 0;
  jobDetails.jobDate = formatDateForEasternTime(jobDetails.jobDate);
  try {
    if (!jobDetails.id) {
      delete jobDetails.id;
      const { data } = await supabase.from("jobs").insert(jobDetails);
      console.log("Successfully created job!", data);
      return;
    } else {
      const { data } = await supabase
        .from("jobs")
        .update(jobDetails)
        .eq("id", jobDetails.id);
      console.log("Successfully updated job!", data);
    }
  } catch (e) {
    console.error("Failed to update job", e);
  }
};

export const updateJobStatus = async ({ id, status }) => {
  try {
    const { data } = await supabase
      .from("jobs")
      .update({ status })
      .eq("id", id);
    console.log("Successfully updated job status!", data);
  } catch (e) {
    console.error("Failed to update job status", e);
  }
};

export const archiveJob = async ({ id }) => {
  try {
    const { data } = await supabase
      .from("jobs")
      .update({ archived: true })
      .eq("id", id);
    console.log("Successfully archived job!", data);
  } catch (e) {
    console.error("Failed to archive job", e);
  }
};

export const restoreJob = async ({ id }) => {
  try {
    const { data } = await supabase
      .from("jobs")
      .update({ archived: false })
      .eq("id", id);
    console.log("Successfully restored job!", data);
  } catch (e) {
    console.error("Failed to restore job", e);
  }
};

export const getJobs = async () => {
  try {
    const { data } = await supabase.from("jobs").select();
    console.log("Successfully fetched job!", data);
    return data;
  } catch (e) {
    console.error("Failed to fetch jobs", e);
  }
};

export const getJobAndCustomerById = async (jobId) => {
  try {
    const { data: jobData } = await supabase
      .from("jobs")
      .select()
      .eq("id", jobId);
    console.log("Successfully fetched job!", jobData);

    const customerId = jobData[0].customerId;
    const { data: customerData } = await supabase
      .from("customers")
      .select()
      .eq("id", customerId);
    console.log("Successfully fetched customer!", customerData);
    return { job: jobData[0], customer: customerData[0] };
  } catch (e) {
    console.error("Failed to fetch job and customer", e);
  }
};

export const setJobPaidStatus = async ({ id, isPaid }) => {
  try {
    const { data } = await supabase
      .from("jobs")
      .update({ isPaid })
      .eq("id", id);
    console.log("Successfully updated job paid status!", data);
  } catch (e) {
    console.error("Failed to update job paid status", e);
  }
};

export const updateCustomerSigned = async ({
  id,
  signedCustomerName,
  companyRepName,
}) => {
  try {
    const { data } = await supabase
      .from("jobs")
      .update({ customerSigned: true, signedCustomerName, companyRepName })
      .eq("id", id);
    console.log("Successfully updated customer signed status!", data);
  } catch (e) {
    console.error("Failed to update customer signed status", e);
  }
};
