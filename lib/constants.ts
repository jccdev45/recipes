export const apiUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3000/api`
    : `https://family-recipes-v2.vercel.app/api`

export const loginFormItems = [
  {
    type: "email",
    fieldName: "email",
    placeholder: "what@mark.com",
    label: "Email",
    required: true,
  },
  {
    type: "password",
    fieldName: "password",
    placeholder: "********",
    label: "Password",
    required: true,
  },
] as const

export const registerFormItems = [
  {
    type: "text",
    fieldName: "first_name",
    placeholder: "Mark",
    label: "First Name",
    required: true,
  },
  {
    type: "text",
    fieldName: "last_name",
    placeholder: "Jobber",
    label: "Last Name",
    required: false,
  },
  {
    type: "email",
    fieldName: "email",
    placeholder: "what@mark.com",
    label: "Email",
    required: true,
  },
  {
    type: "password",
    fieldName: "password",
    placeholder: "********",
    label: "Password",
    required: true,
  },
  {
    type: "password",
    fieldName: "confirm_password",
    placeholder: "********",
    label: "Confirm Password",
    required: true,
  },
] as const

export const minAmount = 0.1
export const maxAmount = 1000
