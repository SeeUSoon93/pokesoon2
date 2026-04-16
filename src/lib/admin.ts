const DEFAULT_ADMIN_UIDS = ['Q2yXz2O4zRRPfQOQBykjxXpVwBE3'];

function parseAdminUids(value?: string) {
  return value
    ? value
        .split(',')
        .map((uid) => uid.trim())
        .filter(Boolean)
    : [];
}

export function getAdminUids() {
  const configuredUids = parseAdminUids(
    process.env.NEXT_PUBLIC_ADMIN_UIDS ?? process.env.ADMIN_UIDS,
  );

  return configuredUids.length > 0 ? configuredUids : DEFAULT_ADMIN_UIDS;
}

export function isAdminUid(uid?: string | null) {
  return Boolean(uid && getAdminUids().includes(uid));
}
