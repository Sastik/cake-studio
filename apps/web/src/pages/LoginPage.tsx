import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthCard3D from "../components/auth/AuthCard3D";
import AuthField from "../components/auth/AuthField";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import { useAuth } from "../state/auth";

export default function LoginPage() {
  const auth = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<"password" | "otp">("otp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const nextPath = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get("next") ?? "/";
  }, [location.search]);

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="w-full max-w-md">
        <AuthCard3D
          title="Welcome back"
          subtitle="Login to save details and manage orders."
        >
          <div className="space-y-3">
            <AuthField
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
            />

            <div className="flex items-center gap-2">
              <button
                className={
                  mode === "otp"
                    ? "btn-primary px-3 py-2"
                    : "btn-secondary px-3 py-2"
                }
                onClick={() => {
                  setError(null);
                  setMode("otp");
                }}
                type="button"
              >
                OTP
              </button>
              <button
                className={
                  mode === "password"
                    ? "btn-primary px-3 py-2"
                    : "btn-secondary px-3 py-2"
                }
                onClick={() => {
                  setError(null);
                  setMode("password");
                }}
                type="button"
              >
                Password
              </button>
              <div className="ml-auto text-xs text-slate-600">
                {mode === "otp" ? "Minimal typing" : "Classic login"}
              </div>
            </div>

            {mode === "password" ? (
              <AuthField
                label="Password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
              />
            ) : (
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
                disabled={busy || mode !== "password"}
                onClick={async () => {
                  setError(null);
                  setBusy(true);
                  try {
                    await auth.login(email.trim(), password);
                    nav(nextPath);
                  } catch (e: any) {
                    setError(e?.message ?? "Login failed");
                  } finally {
                    setBusy(false);
                  }
                }}
                type="button"
              >
                {mode !== "password" ? "Use OTP above" : busy ? "Signing in…" : "Sign in"}
              </motion.button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-slate-200/70" />
                <div className="text-xs font-semibold text-slate-600">or</div>
                <div className="h-px flex-1 bg-slate-200/70" />
              </div>

              <GoogleSignInButton />
            </div>

            <div className="pt-2 text-sm text-slate-700">
              New here?{" "}
              <Link to="/signup" className="font-semibold text-slate-900 underline">
                Create account
              </Link>
            </div>
          </div>
        </AuthCard3D>
      </div>
    </div>
  );
}
