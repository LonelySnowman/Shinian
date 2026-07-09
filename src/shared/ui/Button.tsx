import { Pressable, Text, type PressableProps } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-sena-primary',
  secondary: 'bg-violet-100 dark:bg-violet-900',
  ghost: 'bg-transparent border border-slate-200 dark:border-slate-700',
  danger: 'bg-red-500',
};

const labelClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-violet-700 dark:text-violet-100',
  ghost: 'text-slate-700 dark:text-slate-100',
  danger: 'text-white',
};

export function Button({ label, variant = 'primary', disabled, className, ...props }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={`rounded-2xl px-4 py-3 items-center justify-center ${variantClasses[variant]} ${
        disabled ? 'opacity-50' : ''
      } ${className ?? ''}`}
      {...props}>
      <Text className={`text-base font-semibold ${labelClasses[variant]}`}>{label}</Text>
    </Pressable>
  );
}
