import { useCallback } from "react";

import { useAuthentication } from "./use-authentication";

export function useAuthorization() {
  const { currentUser, isAdmin, isLogged } = useAuthentication();

  const checkAccess = useCallback(
    function ({ accessRoles = [] }) {
      if (!isLogged) return false;
      if (isAdmin) return true;
      if (!Array.isArray(accessRoles)) return false;

      return accessRoles.includes(currentUser?.role || "");
    },
    [currentUser?.role, isAdmin, isLogged]
  );

  return { checkAccess };
}
