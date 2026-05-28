export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface GraphQLContext {
  user?: AuthUser | null;
}