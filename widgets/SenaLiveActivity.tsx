import { Image, Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle, padding } from '@expo/ui/swift-ui/modifiers';
import { createLiveActivity, type LiveActivityEnvironment } from 'expo-widgets';

import type { LiveActivityPayload } from '@/src/core/domain/ports/LiveActivityPort';

const PRIMARY = '#6366F1';
const MUTED = '#64748B';

function CountdownText({
  payload,
  size,
}: {
  payload: LiveActivityPayload;
  size: number;
}) {
  return (
    <VStack>
      <Text modifiers={[font({ weight: 'bold', size }), foregroundStyle(payload.color)]}>
        {payload.primaryLabel}
      </Text>
      {payload.primaryLabel !== '今天' ? (
        <Text modifiers={[font({ size: 12 }), foregroundStyle(MUTED)]}>天</Text>
      ) : null}
    </VStack>
  );
}

function SenaLiveActivityView(
  props: LiveActivityPayload,
  environment: LiveActivityEnvironment,
) {
  'widget';

  const accent = environment.colorScheme === 'dark' ? '#FFFFFF' : PRIMARY;

  return {
    banner: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ weight: 'bold', size: 14 }), foregroundStyle(accent)]}>
          时念
        </Text>
        <Text modifiers={[font({ weight: 'bold', size: 18 }), foregroundStyle(props.color)]}>
          {props.title}
        </Text>
        <Text modifiers={[font({ size: 14 }), foregroundStyle(MUTED)]}>{props.secondaryLabel}</Text>
      </VStack>
    ),
    compactLeading: <Image systemName="heart.fill" color={props.color} />,
    compactTrailing: (
      <Text modifiers={[font({ weight: 'bold', size: 14 }), foregroundStyle(props.color)]}>
        {props.primaryLabel}
      </Text>
    ),
    minimal: <Image systemName="heart.fill" color={props.color} />,
    expandedLeading: (
      <VStack modifiers={[padding({ all: 8 })]}>
        <Image systemName="heart.fill" color={props.color} />
        <Text modifiers={[font({ size: 11 }), foregroundStyle(MUTED)]}>时念</Text>
      </VStack>
    ),
    expandedTrailing: <CountdownText payload={props} size={24} />,
    expandedBottom: (
      <VStack modifiers={[padding({ all: 8 })]}>
        <Text modifiers={[font({ weight: 'bold', size: 16 }), foregroundStyle(props.color)]}>
          {props.title}
        </Text>
        <Text modifiers={[font({ size: 13 }), foregroundStyle(MUTED)]}>{props.secondaryLabel}</Text>
      </VStack>
    ),
  };
}

const SenaLiveActivity = createLiveActivity('SenaLiveActivity', SenaLiveActivityView);

export default SenaLiveActivity;
