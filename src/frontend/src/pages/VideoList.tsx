import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllVideos } from '../hooks/useQueries';
import VideoCard from '../components/VideoCard';
import { Loader2, Video as VideoIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VideoList() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const { data: videos, isLoading, error } = useGetAllVideos();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
        <div className="text-center space-y-4">
          <VideoIcon className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Please Login</h2>
          <p className="text-muted-foreground">You need to login to view videos</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 mx-auto animate-spin text-chart-1" />
          <p className="text-muted-foreground">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertDescription>Failed to load videos. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      {/* Background Image */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/main-bg.dim_800x1200.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="relative container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-chart-1 via-chart-4 to-chart-2 bg-clip-text text-transparent">
            Video Feed
          </h1>
          <p className="text-muted-foreground">Check out the latest videos and mark your status</p>
        </div>

        {!videos || videos.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <VideoIcon className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">No Videos Yet</h2>
            <p className="text-muted-foreground">Check back later for new content!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {videos.map((video) => (
              <VideoCard key={video} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
