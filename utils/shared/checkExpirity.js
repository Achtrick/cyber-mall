export const checkExpirity = async (error, dispatch) => {
  if (error.response.data.expired) {
    dispatch({ type: "USER_LOGOUT" });
  }
};
