import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useUserRole() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const roleQuery = useQuery({
    queryKey: ['userRole', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const [role, isAdmin] = await Promise.all([actor.getCallerUserRole(), actor.isCallerAdmin()]);
      return { role, isAdmin };
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    role: roleQuery.data?.role,
    isAdmin: roleQuery.data?.isAdmin || false,
    isLoading: actorFetching || roleQuery.isLoading,
    error: roleQuery.error,
  };
}
