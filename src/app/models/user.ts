export interface User {
  uid: string | undefined;
  email: string | null | undefined;
  displayName: string | null | undefined;
  photoURL: string | null | undefined;
  emailVerified: boolean | undefined;
}
