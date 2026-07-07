import type { Database } from '@atimar/db-types';
import { getSupabaseClient } from '../client';

type FeedbackAppInsert =
  Database['public']['Tables']['Feedback_App']['Insert'];

export function createFeedbackApp(feedback: FeedbackAppInsert) {
  return getSupabaseClient()
    .from('Feedback_App')
    .insert(feedback)
    .select()
    .single();
}
