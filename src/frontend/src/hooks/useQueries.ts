import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { VideoStatus } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<string | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAllVideos() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideos();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ url, title, thumbnailUrl }: { url: string; title: string; thumbnailUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVideo(url, title, thumbnailUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

export function useGetUserVideoStatus(userPrincipal: string, videoId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<VideoStatus>({
    queryKey: ['videoStatus', userPrincipal, videoId],
    queryFn: async () => {
      if (!actor || !userPrincipal) return VideoStatus.noResponse;
      const principal = await import('@dfinity/principal').then((m) => m.Principal.fromText(userPrincipal));
      return actor.getUserVideoStatus(principal, videoId);
    },
    enabled: !!actor && !actorFetching && !!userPrincipal && !!videoId,
  });
}

export function useSetUserVideoStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, status }: { videoId: string; status: VideoStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setUserVideoStatus(videoId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoStatus'] });
    },
  });
}

export function useGetAdminDashboard() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ videos: string[]; records: string[] }>({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const [videos, records] = await actor.getAdminDashboard();
      return { videos, records };
    },
    enabled: !!actor && !actorFetching,
  });
}
