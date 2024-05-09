import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

export default function Home() {
  return (
    <main>
      <h2>Hello World</h2>

      <LoginLink>Sign in</LoginLink>
      <RegisterLink>Sign up</RegisterLink>
      <LogoutLink>Sign out</LogoutLink>
    </main>
  );
}
