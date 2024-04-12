import supabase from "../utils/supabaseClient";

export const saveCustomer = async (customerDetails) => {
  if (!customerDetails.name) throw new Error("Name is required to create or update a customer.");

  // Prepare the data for insertion or update, removing any fields not part of the customer table
  const { id, name, phoneNumber, address, email } = customerDetails;
  const validData = { name, phoneNumber, address, email };

  try {
    if (id) {
      // Updating an existing customer
      const { data, error } = await supabase
        .from("customers")
        .update(validData)
        .eq("id", id);

      if (error) throw error;
      console.log("Successfully updated customer!", data);
    } else {
      // Creating a new customer, ensure 'id' field is not included in the insert data
      const { data, error } = await supabase
        .from("customers")
        .insert([validData]); // Note: insert expects an array of objects

      if (error) throw error;
      console.log("Successfully created customer!", data);
    }
  } catch (error) {
    console.error("Failed to save customer", error);
    throw error; // Rethrow the error to handle it (e.g., display an error message) in your component
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
