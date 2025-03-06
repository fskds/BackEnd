/**
 * @see https://umijs.org/docs/max/access#access
 * */
import type { CurrentAdmin } from '@/services/data.d';
export default function access(initialState: { currentAdmin?: CurrentAdmin } | undefined) {
  const { currentAdmin } = initialState ?? {};
  const access = currentAdmin?.access || [];
  return {
    canAccess: (targetRoles: string[])=> targetRoles.some(role => access.find(item => item.name === role)),
  };
}
