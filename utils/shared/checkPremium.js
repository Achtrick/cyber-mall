export const checkPremium = (userInfo, condition, action, enqueueSnackbar) => {
  if (userInfo.shop.pack.type === "FREE" && condition) {
    return () =>
      enqueueSnackbar("Action limitée à PREMIUM !", {
        variant: "warning",
      });
  } else {
    return action;
  }
};
