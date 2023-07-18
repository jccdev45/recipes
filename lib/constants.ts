export const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1`;

export const userFormItems = [
  {
    id: 1,
    fieldName: "first_name",
    placeholder: "Mark",
    label: "First Name",
  },
  { id: 2, fieldName: "last_name", placeholder: "Jobber", label: "Last Name" },
  { id: 3, fieldName: "email", placeholder: "what@mark.com", label: "Email" },
  { id: 4, fieldName: "password", placeholder: "********", label: "Password" },
  {
    id: 5,
    fieldName: "confirm_password",
    placeholder: "********",
    label: "Confirm Password",
  },
];

export const minAmount = 0.1;
export const maxAmount = 1000;
