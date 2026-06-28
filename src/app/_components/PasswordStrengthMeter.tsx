"use client";

interface PasswordStrengthMeterProps {
  password: string;
}

const getStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return { label: "弱い", color: "text-red-600", width: "w-1/3" };
  }
  if (score <= 4) {
    return { label: "普通", color: "text-yellow-600", width: "w-2/3" };
  }
  return { label: "強い", color: "text-green-600", width: "w-full" };
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;

  const strength = getStrength(password);

  return (
    <div className="mt-2">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-600">パスワード強度</span>
        <span className={strength.color}>{strength.label}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div className={`h-2 rounded-full bg-current ${strength.color} ${strength.width}`} />
      </div>
    </div>
  );
};
