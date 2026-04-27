import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthCard3D from "../components/auth/AuthCard3D";
import AuthField from "../components/auth/AuthField";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import { useAuth } from "../state/auth";

export default function SignupPage() {
  const auth = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useOtp, setUseOtp] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const nextPath = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get("next") ?? "/";
  }, [location.search]);

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="w-full max-w-md">
        <AuthCard3D
          title="Create your account"
          subtitle="Fast checkout, saved details, and updates."
        >
          <div className="space-y-3">
            <AuthField
              label="Name"
              value={name}
              onChange={setName}
              placeholder="Your name"
              autoComplete="name"
            />
            <AuthField
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
            />

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3">
              <div className="text-sm font-semibold text-slate-800">Verify by email OTP</div>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setUseOtp((v) => !v);
                }}
                className="text-sm font-semibold text-slate-900 underline"
              >
                {useOtp ? "Use password" : "Use OTP"}
              </button>
            </div>

            {useOtp ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileTap={{ scale: 0.99 }}
                    className="btn-secondary"
                    disabled={busy}
                    onClick={async () => {
                      setError(null);
                      setBusy(true);
                      setDevOtp(null);
                      try {
                        const resp = await auth.requestOtp(email.trim());
                        setOtpSent(true);
                        setDevOtp(resp.devCode ?? null);
                      } catch (e: any) {
                        setError(e?.message ?? "OTP request failed");
                      } finally {
                        setBusy(false);
                      }
                    }}
                    type="button"
                  >
                    {busy ? "Sending…" : otpSent ? "Resend OTP" : "Send OTP"}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.99 }}
                    className="btn-primary"
                    disabled={busy || !otpSent}
                    onClick={async () => {
                      setError(null);
                      setBusy(true);
                      try {
                        await auth.verifyOtp(email.trim(), otp.trim());
                        nav(nextPath);
                      } catch (e: any) {
                        setError(e?.message ?? "OTP verify failed");
                      } finally {
                        setBusy(false);
                      }
                    }}
                    type="button"
                  >
                    {busy ? "Verifying…" : "Verify"}
                  </motion.button>
                </div>
                <AuthField
                  label="OTP code"
                  value={otp}
                  onChange={setOtp}
                  placeholder="6-digit code"
                  autoComplete="one-time-code"
                />
                {devOtp ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                    Dev OTP: <span className="font-bold">{devOtp}</span>
                  </div>
                ) : null}
              </div>
            ) : (
              <AuthField
                label="Password"
                value={password}
                onChange={setPassword}
                placeholder="Min 6 characters"
                type="password"
                autoComplete="new-password"
              />
            )}

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {error}
              </div>
            ) : null}

            <div className="grid gap-2">
              <motion.button
                whileTap={{ scale: 0.99 }}
                className="btn-primary w-full"
                disabled={busy || useOtp}
                onClick={async () => {
                  setError(null);
                  setBusy(true);
                  try {
                    await auth.signup(name.trim(), email.trim(), password);
                    nav(nextPath);
                  } catch (e: any) {
                    setError(e?.message ?? "Signup failed");
                  } finally {
                    setBusy(false);
                  }
                }}
                type="button"
              >
                {useOtp ? "Verify OTP above" : busy ? "Creating…" : "Create account"}
              </motion.button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-slate-200/70" />
                <div className="text-xs font-semibold text-slate-600">or</div>
                <div className="h-px flex-1 bg-slate-200/70" />
              </div>

              <GoogleSignInButton />
            </div>

            <div className="pt-2 text-sm text-slate-700">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-slate-900 underline">
                Sign in
              </Link>
            </div>
          </div>
        </AuthCard3D>
      </div>
    </div>
  );
}
