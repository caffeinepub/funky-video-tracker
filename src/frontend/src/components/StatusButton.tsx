import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  variant: 'watched' | 'later' | 'skip';
  disabled?: boolean;
}

export default function StatusButton({ label, selected, onClick, variant, disabled }: StatusButtonProps) {
  const variantStyles = {
    watched: selected
      ? 'bg-chart-1 text-white border-chart-1 hover:bg-chart-1/90'
      : 'border-chart-1/30 hover:border-chart-1 hover:bg-chart-1/10',
    later: selected
      ? 'bg-chart-4 text-white border-chart-4 hover:bg-chart-4/90'
      : 'border-chart-4/30 hover:border-chart-4 hover:bg-chart-4/10',
    skip: selected
      ? 'bg-chart-2 text-white border-chart-2 hover:bg-chart-2/90'
      : 'border-chart-2/30 hover:border-chart-2 hover:bg-chart-2/10',
  };

  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full justify-start gap-2 transition-all border-2',
        variantStyles[variant],
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {selected && <Check className="h-4 w-4" />}
      <span className="flex-1 text-left">{label}</span>
    </Button>
  );
}
