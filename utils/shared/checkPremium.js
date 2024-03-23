export const checkPremium = (userInfo, condition, action, enqueueSnackbar) => {
  if (userInfo.shop.pack.type === "FREE" && condition) {
    return () =>
      enqueueSnackbar("Action restricted to PREMIUM !", {
        variant: "warning",
      });
  } else {
    return action;
  }
};
