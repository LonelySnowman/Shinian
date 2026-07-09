import { z } from 'zod';

export const REMINDER_OFFSET_OPTIONS = [
  { value: 0, label: '当天' },
  { value: -1, label: '提前 1 天' },
  { value: -7, label: '提前 7 天' },
] as const;

export const anniversaryFormSchema = z.object({
  title: z.string().trim().min(1, '请输入标题').max(50, '标题最多 50 字'),
  date: z.date({ message: '请选择日期' }),
  isLunar: z.boolean(),
  repeatType: z.enum(['none', 'yearly', 'monthly', 'weekly']),
  categoryId: z.string().min(1, '请选择分类'),
  icon: z.string().min(1),
  color: z.string().min(1),
  notes: z.string().max(500, '备注最多 500 字').optional(),
  reminderEnabled: z.boolean(),
  reminderOffsetDays: z.number(),
  calendarSyncEnabled: z.boolean(),
});

export type AnniversaryFormValues = z.infer<typeof anniversaryFormSchema>;

export const ANNIVERSARY_COLORS = [
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#F97316',
  '#22C55E',
  '#3B82F6',
  '#64748B',
] as const;

export const ANNIVERSARY_ICONS = [
  'heart',
  'gift',
  'star',
  'briefcase',
  'home',
  'airplane',
] as const;
