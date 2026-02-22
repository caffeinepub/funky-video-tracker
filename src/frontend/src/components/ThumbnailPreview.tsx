import { Card, CardContent } from '@/components/ui/card';
import { ImageOff } from 'lucide-react';

interface ThumbnailPreviewProps {
  url: string;
  thumbnailUrl: string;
}

export default function ThumbnailPreview({ url, thumbnailUrl }: ThumbnailPreviewProps) {
  if (!thumbnailUrl) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
          <div className="text-center space-y-2">
            <ImageOff className="h-8 w-8 mx-auto" />
            <p className="text-sm">No thumbnail preview available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm font-medium mb-2">Thumbnail Preview:</p>
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/assets/generated/app-logo.dim_256x256.png';
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
