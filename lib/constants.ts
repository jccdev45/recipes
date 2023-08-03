export const apiUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3000/api`
    : `https://family-recipes-v2.vercel.app/api`;

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
