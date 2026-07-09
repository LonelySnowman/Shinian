import { Text, View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
}

export function Card({ title, subtitle, children, className, ...props }: CardProps) {
  return (
    <View
      className={`rounded-3xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800 ${className ?? ''}`}
      {...props}>
      {title ? (
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</Text>
      ) : null}
      {subtitle ? <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text> : null}
      {children}
    </View>
  );
}
