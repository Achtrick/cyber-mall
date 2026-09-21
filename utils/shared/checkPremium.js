export const checkPremium = (userInfo, condition, action, enqueueSnackbar) => {
  if (userInfo.shop.pack.type === "FREE" && condition) {
    return () =>
      enqueueSnackbar("Action limited to PREMIUM!", {
        variant: "warning",
      });
  } else {
    return action;
  }
};
