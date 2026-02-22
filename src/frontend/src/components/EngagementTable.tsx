import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

interface EngagementTableProps {
  videos: string[];
  records: string[];
}

export default function EngagementTable({ videos, records }: EngagementTableProps) {
  const [filterType, setFilterType] = useState<'all' | 'video' | 'user'>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  // Mock engagement data for display
  const mockEngagements = records.map((record, index) => ({
    id: record,
    userName: `User ${index + 1}`,
    videoTitle: videos[index % videos.length] || 'Unknown Video',
    status: ['watched', 'watchLater', 'notInterested'][index % 3],
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      watched: { label: 'Watched', className: 'bg-chart-1 text-white' },
      watchLater: { label: 'Watch Later', className: 'bg-chart-4 text-white' },
      notInterested: { label: 'Not Interested', className: 'bg-chart-2 text-white' },
    };
    const variant = variants[status] || { label: status, className: '' };
    return (
      <Badge className={variant.className} variant="outline">
        {variant.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Engagement Records
            </CardTitle>
            <CardDescription>View and filter user engagement data</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="video">By Video</SelectItem>
                <SelectItem value="user">By User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {mockEngagements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No engagement data available yet</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Video</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEngagements.map((engagement) => (
                  <TableRow key={engagement.id}>
                    <TableCell className="font-medium">{engagement.userName}</TableCell>
                    <TableCell>{engagement.videoTitle}</TableCell>
                    <TableCell>{getStatusBadge(engagement.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(engagement.timestamp).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
