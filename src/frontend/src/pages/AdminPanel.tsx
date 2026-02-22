import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUserRole } from '../hooks/useUserRole';
import { useAddVideo } from '../hooks/useQueries';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import ThumbnailPreview from '../components/ThumbnailPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { extractVideoId, generateThumbnailUrl } from '../utils/videoUrlParser';

export default function AdminPanel() {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const addVideoMutation = useAddVideo();

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    const videoId = extractVideoId(newUrl);
    if (videoId) {
      const generatedThumbnail = generateThumbnailUrl(newUrl, videoId);
      if (generatedThumbnail) {
        setThumbnailUrl(generatedThumbnail);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addVideoMutation.mutateAsync({
        url: url.trim(),
        title: title.trim(),
        thumbnailUrl: thumbnailUrl.trim() || '/assets/generated/app-logo.dim_256x256.png',
      });
      toast.success('Video added successfully! 🎉');
      setUrl('');
      setTitle('');
      setThumbnailUrl('');
    } catch (error) {
      toast.error('Failed to add video. Please try again.');
      console.error('Failed to add video:', error);
    }
  };

  if (roleLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
        <Loader2 className="h-16 w-16 animate-spin text-chart-1" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-chart-4 via-chart-1 to-chart-2 bg-clip-text text-transparent">
            Add New Video
          </CardTitle>
          <CardDescription>Share a YouTube or Instagram Reel link with your community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">Video URL *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://youtube.com/watch?v=... or https://instagram.com/reel/..."
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                disabled={addVideoMutation.isPending}
                required
              />
            </div>

            {url && <ThumbnailPreview url={url} thumbnailUrl={thumbnailUrl} />}

            <div className="space-y-2">
              <Label htmlFor="title">Video Title *</Label>
              <Input
                id="title"
                placeholder="Give your video a catchy title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={addVideoMutation.isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
              <Input
                id="thumbnail"
                type="url"
                placeholder="Custom thumbnail URL (auto-generated for YouTube)"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                disabled={addVideoMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">
                For Instagram Reels, paste the thumbnail URL manually
              </p>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={addVideoMutation.isPending}>
              {addVideoMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Video...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Video
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
