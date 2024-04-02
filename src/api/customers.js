import supabase from "../utils/supabaseClient";

export const saveCustomer = async (customerDetails) => {
  if (!customerDetails.name) throw "name required to create customer";
  if (!customerDetails.totalPrice) customerDetails.totalPrice = 0;
  try {
    if (!customerDetails.id) {
      delete customerDetails.id;
      const { data } = await supabase.from("customers").insert(customerDetails);
      console.log("Successfully created customer!", data);
      return;
    } else {
      const { data } = await supabase
        .from("customers")
        .update(customerDetails)
        .eq("id", customerDetails.id);
      console.log("Successfully updated customer!", data);
    }
  } catch (e) {
    console.error("Failed to update customer", e);
  }
};

export const updateCustomerStatus = async ({ id, status }) => {
  try {
    const { data } = await supabase
      .from("customers")
      .update({ status })
      .eq("id", id);
    console.log("Successfully updated customer status!", data);
  } catch (e) {
    console.error("Failed to update customer status", e);
  }
};

export const archiveCustomer = async ({ id }) => {
  try {
    const { data } = await supabase
      .from("customers")
      .update({ archived: true })
      .eq("id", id);
    console.log("Successfully archived customer!", data);
  } catch (e) {
    console.error("Failed to archive customer", e);
  }
};

export const restoreCustomer = async ({ id }) => {
  try {
    const { data } = await supabase
      .from("customers")
      .update({ archived: false })
      .eq("id", id);
    console.log("Successfully restored customer!", data);
  } catch (e) {
    console.error("Failed to restore customer", e);
  }
};

export const getCustomers = async () => {
  try {
    const { data } = await supabase.from("customers").select();
    console.log("Successfully fetched customer!", data);
    return data;
  } catch (e) {
    console.error("Failed to fetch customers", e);
  }
};
