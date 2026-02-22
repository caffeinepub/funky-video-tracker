import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import StatusButton from './StatusButton';
import { VideoStatus } from '../backend';
import { useGetUserVideoStatus, useSetUserVideoStatus } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface VideoCardProps {
  video: string;
}

export default function VideoCard({ video }: VideoCardProps) {
  const { identity } = useInternetIdentity();
  const userPrincipal = identity?.getPrincipal();

  const { data: currentStatus } = useGetUserVideoStatus(userPrincipal?.toString() || '', video);
  const setStatusMutation = useSetUserVideoStatus();

  const handleStatusChange = async (status: VideoStatus) => {
    if (!userPrincipal) return;
    try {
      await setStatusMutation.mutateAsync({ videoId: video, status });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Mock video data for display (since backend returns strings)
  const mockVideoData = {
    title: `Video ${video}`,
    url: 'https://youtube.com',
    thumbnailUrl: '/assets/generated/app-logo.dim_256x256.png',
    postedAt: new Date().toISOString(),
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-border/50">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Thumbnail */}
          <div className="relative sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-muted">
            <img
              src={mockVideoData.thumbnailUrl}
              alt={mockVideoData.title}
              className="w-full h-full object-cover"
            />
            <a
              href={mockVideoData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="h-8 w-8 text-white" />
            </a>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{mockVideoData.title}</h3>
              <Badge variant="outline" className="text-xs">
                {new Date(mockVideoData.postedAt).toLocaleDateString()}
              </Badge>
            </div>

            {/* Status Buttons */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Your Status:</p>
              <div className="flex flex-col gap-2">
                <StatusButton
                  label="Yeah, I've watched it! 🎉"
                  selected={currentStatus === VideoStatus.watched}
                  onClick={() => handleStatusChange(VideoStatus.watched)}
                  variant="watched"
                  disabled={setStatusMutation.isPending}
                />
                <StatusButton
                  label="I'll watch it later 📌"
                  selected={currentStatus === VideoStatus.watchLater}
                  onClick={() => handleStatusChange(VideoStatus.watchLater)}
                  variant="later"
                  disabled={setStatusMutation.isPending}
                />
                <StatusButton
                  label="Already watched it elsewhere ✓"
                  selected={currentStatus === VideoStatus.notInterested}
                  onClick={() => handleStatusChange(VideoStatus.notInterested)}
                  variant="skip"
                  disabled={setStatusMutation.isPending}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
