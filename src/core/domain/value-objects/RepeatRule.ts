export type RepeatRuleType = 'none' | 'yearly' | 'monthly' | 'weekly';

export interface RepeatRule {
  type: RepeatRuleType;
}

export const DEFAULT_REPEAT_RULE: RepeatRule = { type: 'yearly' };

export function normalizeRepeatRule(rule?: RepeatRule | null): RepeatRule {
  if (!rule?.type) {
    return DEFAULT_REPEAT_RULE;
  }
  return rule;
}
