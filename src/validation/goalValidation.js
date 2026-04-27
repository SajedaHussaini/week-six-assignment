import * as yup from "yup";

/**
 * Dynamic schema 
 * @param {Function} t - 
 */
export const goalSchema = (t) =>
  yup.object({
    title: yup
      .string()
      .trim()
      .required(t("validation.titleIsRequired")),
    category: yup
      .string()
      .required(t("validation.categoryIsRequired")),
    type: yup
      .string()
      .oneOf(["daily", "count", "time"])
      .required(t("validation.goalTypeIsRequired")),
    target: yup
      .number()
      .typeError(t("validation.targetMustBeAPositiveNumber"))
      .positive(t("validation.targetMustBeAPositiveNumber"))
      .required(t("validation.targetMustBeAPositiveNumber")),
    startDate: yup
      .date()
      .required(t("validation.startDateIsRequired")),
    endDate: yup
      .date()
      .nullable()
      .min(yup.ref("startDate"), t("validation.endDateCannotBeBeforeStartDate")),
    notes: yup
      .string()
      .max(200, t("validation.max", { max: 200 }))
      .nullable(),
  });
  