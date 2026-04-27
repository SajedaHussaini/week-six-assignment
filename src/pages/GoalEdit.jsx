import React, { useContext, useMemo, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { GoalContext } from "../context/GoalContext";
import GoalForm from "../components/goals/GoalForm";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { goalSchema } from "../validation/goalValidation";
import { LocaleContext } from "../context/LocaleContext";

export default function GoalEdit() {
  const { id } = useParams();
  const { goals, setGoals } = useContext(GoalContext);
  const navigate = useNavigate();
  const { t } = useContext(LocaleContext);

  const goal = goals.find(g => g.id === id);

  const schema = useMemo(() => goalSchema(t), [t]);

  const form = useForm({
    defaultValues: goal,
    resolver: yupResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange"
  });

  useEffect(() => {
    form.reset(form.getValues());
  }, [form, schema]);

  useEffect(() => {
    if (goal) {
      form.reset(goal);
    }
  }, [goal, form]);

  const onSubmit = (data) => {
    const updated = goals.map(g =>
      g.id === id
        ? { ...g, ...data, updatedAt: new Date().toISOString() }
        : g
    );
    setGoals(updated);
    navigate("/goals");
  };

  if (!goal) return <Typography>{t("goalNotFound") || "Goal not found"}</Typography>;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth:{xs:"100%", sm:600},
        mx: "auto",
        px: { xs: 1.5, sm: 2 },
        boxSizing:"border-box",
      }}
    >
      <Typography variant="h5" mb={2} fontWeight={700} fontSize={{xs: 20, sm: 28, md: 34}} >

        {t("editGoal") || "Edit Goal"}
      </Typography>

      <GoalForm
        form={form}
        onSubmit={onSubmit}
        onCancel={() => navigate("/goals")}
        isEdit
      />
    </Box>
  );
}
