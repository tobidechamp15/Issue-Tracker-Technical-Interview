const avatarColors = [
  "avatar-blue",
  "avatar-gray",
  "avatar-amber",
  "avatar-emerald",
  "avatar-rose",
  "avatar-cyan",
];

function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function initials(name: string): string {
  if (!name || name === "Unassigned") return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export default function Avatar({ name, size = "md" }: AvatarProps) {
  const displayName = name || "Unassigned";
  const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold shrink-0 ${colorFromName(displayName)}`}
      title={displayName}
    >
      {initials(displayName)}
    </div>
  );
}
