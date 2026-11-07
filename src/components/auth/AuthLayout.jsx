// Full-screen card shared by the auth pages; it sets its own color tokens so it stays readable under any theme.
// The church logo replaces the old icon. The `icon` prop is still accepted so other pages don't break.
export function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/logo.png"
            alt="The Redeemed Christian Church of God"
            className="mx-auto mb-4 h-24 w-24 object-contain"
          />
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-sm">{children}</div>
        {footer && <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>}
      </div>
    </div>
  );
}