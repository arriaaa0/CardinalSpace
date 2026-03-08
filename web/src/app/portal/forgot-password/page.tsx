export default function PortalForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-slate-900">
          Reset your password
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter your registered email address to receive a password reset link,
          mirroring the behavior described in your TC11 test case.
        </p>
      </header>

      <p className="text-sm text-slate-600">
        Placeholder screen: the actual reset request and email sending flow
        will be implemented later. For now, this page exists so navigation from
        the login screen works without 404.
      </p>
    </div>
  );
}

