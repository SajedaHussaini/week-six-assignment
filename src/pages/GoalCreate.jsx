import React, { useContext, useEffect, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoalContext } from "../context/GoalContext";
import { v4 as uuidv4 } from "uuid";
import GoalForm from "../components/goals/GoalForm";
import GoalSidePanel from "../components/goals/GoalSlidePanel";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { goalSchema } from "../validation/goalValidation";
import { LocaleContext } from "../context/LocaleContext";

import { createNotification } from "../api/notifications";
import { useNotification } from "../context/NotificationContext";

export default function GoalCreate() {
  const { setGoals, goals } = useContext(GoalContext);
  const navigate = useNavigate();
  const { t } = useContext(LocaleContext);
  const { showNotification } = useNotification();

  const schema = useMemo(() => goalSchema(t), [t]);

  const form = useForm({
    defaultValues: {
      title: "",
      category: "",
      type: "daily",
      target: "",
      startDate: new Date(),
      endDate: null,
      notes: ""
    },
    resolver: yupResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange"
  });

  useEffect(() => {
    form.reset(form.getValues());
  }, [form, schema]);

  const onSubmit = (data) => {
    const newGoal = {
      ...data,
      id: uuidv4(),
      progress: 0,
      status: "active",
      logs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setGoals(prev => [newGoal, ...prev]);

    createNotification({
      text: "🎯 New goal created",
      type: "goal_created",
      goalId: newGoal.id,
      route: `/goals/${newGoal.id}`
    });

    showNotification(`Goal created: ${data.title}`, "success");
    navigate("/goals");
  };

  return (
    <Box
      sx={{
        p: 3,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" },
        gap: 3,
        alignItems: "start"
      }}
    >
      <Box sx={{ gridColumn: "1/-1", mb: 1 }}>
        <Typography variant="h5" mb={1} fontWeight={700} fontSize={{xs:21, sm:32}}>
          {t("createNewGoal") || "Create New Goal"}
        </Typography>
        <Typography variant="body2" color="gray" fontSize={{xs:13, sm:16}}>
          {t("buildHabitsTrackProgressAndBecomeUnstoppable") || "Build habits, track progress, and become unstoppable."}
        </Typography>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <GoalForm form={form} onSubmit={onSubmit} onCancel={() => navigate("/goals")} />
      </Box>

      <Box
        sx={{
          position: { md: "sticky", xs: "static" },
          top: 24,
          height: "fit-content"
        }}
      >
        <GoalSidePanel watch={form.watch} />
      </Box>
    </Box>
  );
}
