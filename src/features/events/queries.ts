import { EventItem } from '@/types/event';
import { demoEvents } from '@/lib/demo-data';
import { FIRESTORE_COLLECTIONS, readFirestoreCollection, readFirestoreDocument } from '@/lib/firestore';
import { sortEventsByStart } from './presenter';

export async function getEvents(): Promise<EventItem[]> {
  const items = await readFirestoreCollection<EventItem>(FIRESTORE_COLLECTIONS.events, demoEvents);

  return sortEventsByStart(items);
}

export async function getEvent(id: string): Promise<EventItem | null> {
  const fallback = demoEvents.find((event) => event.id === id);

  return readFirestoreDocument<EventItem>(FIRESTORE_COLLECTIONS.events, id, fallback);
}
