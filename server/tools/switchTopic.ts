import { genres } from "@/lib/genres";
import { SwitchTopicInput, SwitchTopicResult } from "@/types/mcp";

export function switchTopicHandler(input: SwitchTopicInput): SwitchTopicResult {
  const topicInfo = genres.find((genre) => genre.id === input.nextTopic);
  const label = topicInfo?.label ?? input.nextTopic;

  return {
    confirmation: `Switched to ${label} interview practice.`,
    starterMessage: `Great choice. I am ready to coach you in ${label}.`,
    triggerFirstQuestion: true,
  };
}
