import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw, Loader2 } from 'lucide-react';
import {
  useUpdateKodiSetting,
  useResetKodiSetting,
  useKodiAddons,
} from '@/api/hooks/useKodiSettings';
import { toast } from 'sonner';
import type { KodiSetting } from '@/api/types/settings';
import { cn } from '@/lib/utils';

interface SettingInputProps {
  setting: KodiSetting;
  showReset?: boolean;
}

export function SettingInput({ setting, showReset = true }: SettingInputProps) {
  const updateSetting = useUpdateKodiSetting();
  const resetSetting = useResetKodiSetting();
  const [localValue, setLocalValue] = useState<string | number | boolean | null>(null);

  // For addon-type settings, fetch available addons
  const addonType = setting.type === 'addon' ? setting.addontype : undefined;
  const { data: addons } = useKodiAddons(addonType);

  const isUpdating = updateSetting.isPending;
  const isResetting = resetSetting.isPending;
  const isDisabled = !setting.enabled || isUpdating || isResetting;

  // Use local value if set, otherwise use setting value
  const currentValue = localValue ?? setting.value;
  const isModified = currentValue !== setting.default;

  const handleChange = async (value: boolean | number | string) => {
    try {
      await updateSetting.mutateAsync({ setting: setting.id, value });
      setLocalValue(null); // Clear local value on success
      toast.success('Setting updated');
    } catch {
      toast.error('Failed to update setting');
    }
  };

  const handleReset = async () => {
    try {
      await resetSetting.mutateAsync(setting.id);
      setLocalValue(null);
      toast.success('Setting reset to default');
    } catch {
      toast.error('Failed to reset setting');
    }
  };

  const renderInput = () => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Switch
            checked={currentValue as boolean}
            onCheckedChange={(checked) => void handleChange(checked)}
            disabled={isDisabled}
          />
        );

      case 'integer':
      case 'number': {
        // Check if it has options (dropdown) or min/max (slider)
        if (setting.options && setting.options.length > 0) {
          return (
            <Select
              value={String(currentValue)}
              onValueChange={(val) => void handleChange(Number(val))}
              disabled={isDisabled}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {setting.options.map((opt) => (
                  <SelectItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        if (
          setting.minimum !== undefined &&
          setting.maximum !== undefined &&
          setting.control.type === 'slider'
        ) {
          const formatLabel = setting.control.formatlabel;
          const displayValue = formatLabel
            ? formatLabel
                .replace('{0:d}', String(currentValue))
                .replace('{0:.1f}', String(currentValue))
            : String(currentValue);

          return (
            <div className="flex w-64 items-center gap-4">
              <Slider
                value={[currentValue as number]}
                min={setting.minimum}
                max={setting.maximum}
                step={setting.step ?? 1}
                onValueChange={([val]) => {
                  setLocalValue(val ?? 0);
                }}
                onValueCommit={([val]) => {
                  if (val !== undefined) {
                    void handleChange(val);
                  }
                }}
                disabled={isDisabled}
                className="flex-1"
              />
              <span className="text-muted-foreground w-20 text-sm">{displayValue}</span>
            </div>
          );
        }

        // Fallback to number input
        return (
          <Input
            type="number"
            value={currentValue as number}
            onChange={(e) => {
              setLocalValue(Number(e.target.value));
            }}
            onBlur={() => {
              if (localValue !== null && localValue !== setting.value) {
                void handleChange(localValue as number);
              }
            }}
            min={setting.minimum}
            max={setting.maximum}
            step={setting.step}
            disabled={isDisabled}
            className="w-32"
          />
        );
      }

      case 'string': {
        // Check if it has options (dropdown)
        if (setting.options && setting.options.length > 0) {
          return (
            <Select
              value={String(currentValue)}
              onValueChange={(val) => void handleChange(val)}
              disabled={isDisabled}
            >
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {setting.options.map((opt) => (
                  <SelectItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        // Text input (potentially hidden/password)
        return (
          <Input
            type={setting.control.hidden ? 'password' : 'text'}
            value={currentValue as string}
            onChange={(e) => {
              setLocalValue(e.target.value);
            }}
            onBlur={() => {
              if (localValue !== null && localValue !== setting.value) {
                void handleChange(localValue as string);
              }
            }}
            disabled={isDisabled}
            className="w-64"
          />
        );
      }

      case 'path':
        return (
          <Input
            type="text"
            value={currentValue as string}
            onChange={(e) => {
              setLocalValue(e.target.value);
            }}
            onBlur={() => {
              if (localValue !== null && localValue !== setting.value) {
                void handleChange(localValue as string);
              }
            }}
            disabled={isDisabled}
            className="w-80"
            placeholder="Enter path..."
          />
        );

      case 'action':
        return (
          <Button
            variant="outline"
            onClick={() => void handleChange(setting.value)}
            disabled={isDisabled}
          >
            {setting.label}
          </Button>
        );

      case 'addon': {
        // Use fetched addons or fallback to setting options
        const addonOptions =
          addons?.map((addon) => ({
            value: addon.addonid,
            label: addon.name,
          })) ??
          setting.options ??
          [];

        if (addonOptions.length === 0) {
          return <span className="text-muted-foreground text-sm">No addons available</span>;
        }

        return (
          <Select
            value={String(currentValue)}
            onValueChange={(val) => void handleChange(val)}
            disabled={isDisabled}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select addon..." />
            </SelectTrigger>
            <SelectContent>
              {addonOptions.map((opt) => (
                <SelectItem key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      case 'list': {
        // List settings typically have a definition with options
        const options = setting.options ?? setting.definition?.options ?? [];
        if (options.length > 0) {
          return (
            <Select
              value={String(currentValue)}
              onValueChange={(val) => void handleChange(val)}
              disabled={isDisabled}
            >
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        // Fallback for lists without options
        return (
          <span className="text-muted-foreground text-sm">List configuration not available</span>
        );
      }

      default: {
        // This handles any unknown/future setting types
        const _exhaustiveCheck: never = setting;
        return (
          <span className="text-muted-foreground text-sm">
            Unsupported setting type: {(_exhaustiveCheck as KodiSetting).type}
          </span>
        );
      }
    }
  };

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 rounded-lg border p-4',
        !setting.enabled && 'opacity-50'
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <Label
          htmlFor={setting.id}
          className={cn('text-sm font-medium', isModified && 'text-primary')}
        >
          {setting.label}
          {isModified && <span className="text-primary ml-1">*</span>}
        </Label>
        {setting.help && (
          <p className="text-muted-foreground text-xs leading-relaxed">{setting.help}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {renderInput()}

        {showReset && isModified && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => void handleReset()}
            disabled={isDisabled}
            title="Reset to default"
          >
            {isResetting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
