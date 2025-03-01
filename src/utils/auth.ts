export const isAuthenticated = (): boolean => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  };
  