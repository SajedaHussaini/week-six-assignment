import * as yup from "yup";

export const loginSchema = (t) =>
  yup.object({
    name: yup
      .string()
      .required(t("loginValidation.pleaseEnterYourFullName"))
      .min(4, t("loginValidation.fullNameMustNeAtLeast4Characters")),

    email: yup
      .string()
      .required(t("loginValidation.emailIsRequired"))
      .email(t("loginValidation.pleaseEnteraValidEmail")),

    password: yup
      .string()
      .required(t("loginValidation.passwordIsRequired"))
      .min(6, t("loginValidation.passwordMustBeAtLeast6Characters")),

    remember: yup.boolean()
  });
