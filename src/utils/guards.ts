export const requireAuth = (context: {
  user?: {
    id: string;
    role: string;
  };
}) => {
  if (!context.user) {
    throw new Error("Unauthorized");
  }

  return context.user;
};

export const requireAdmin = (context: {
  user?: {
    id: string;
    role: string;
  };
}) => {
  const user = requireAuth(context);

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }

  return user;
};

export const requireSuperAdmin = (context: {
  user?: {
    id: string;
    role: string;
  };
}) => {
  const user = requireAuth(context);

  if (user.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }

  return user;
};
