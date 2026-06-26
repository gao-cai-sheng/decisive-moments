import { openDB } from "idb";

export type CollectionTargetType = "philosopher" | "argument" | "search";
export type NoteTargetType = CollectionTargetType;

export type LocalCollectionItem = {
  id: string;
  targetType: CollectionTargetType;
  targetId: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  sortOrder?: number;
  userId: null;
  syncStatus: "local_only";
};

export type LocalNote = {
  id: string;
  targetType: NoteTargetType;
  targetId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  sortOrder?: number;
  userId: null;
  syncStatus: "local_only";
};

export type SaveItemInput = {
  targetType: CollectionTargetType;
  targetId: string;
  label: string;
};

export type SaveNoteInput = {
  targetType: NoteTargetType;
  targetId: string;
  body: string;
};

export type CollectionsRepository = {
  saveItem(input: SaveItemInput): Promise<LocalCollectionItem>;
  listItems(): Promise<LocalCollectionItem[]>;
  removeItem(targetType: CollectionTargetType, targetId: string): Promise<void>;
  saveNote(input: SaveNoteInput): Promise<LocalNote>;
  listNotes(): Promise<LocalNote[]>;
  exportJson(): Promise<string>;
  importJson(serialized: string): Promise<void>;
};

let lastSortOrderMs = 0;
let sortOrderCounter = 0;

function nextSortOrder() {
  const now = Date.now();
  sortOrderCounter = now === lastSortOrderMs ? sortOrderCounter + 1 : 0;
  lastSortOrderMs = now;
  return now * 1000 + sortOrderCounter;
}

function createCollectionItem(input: SaveItemInput): LocalCollectionItem {
  const now = new Date().toISOString();
  return {
    id: collectionItemId(input.targetType, input.targetId),
    targetType: input.targetType,
    targetId: input.targetId,
    label: input.label,
    createdAt: now,
    updatedAt: now,
    sortOrder: nextSortOrder(),
    userId: null,
    syncStatus: "local_only",
  };
}

function createNote(input: SaveNoteInput): LocalNote {
  const now = new Date().toISOString();
  return {
    id: `local-note-${crypto.randomUUID()}`,
    targetType: input.targetType,
    targetId: input.targetId,
    body: input.body,
    createdAt: now,
    updatedAt: now,
    sortOrder: nextSortOrder(),
    userId: null,
    syncStatus: "local_only",
  };
}

function collectionItemId(targetType: CollectionTargetType, targetId: string) {
  return `${targetType}:${targetId}`;
}

function sortByUpdatedAtDescending<T extends { id?: string; updatedAt: string; sortOrder?: number }>(items: T[]) {
  return items.sort(
    (a, b) =>
      b.updatedAt.localeCompare(a.updatedAt) ||
      (b.sortOrder ?? 0) - (a.sortOrder ?? 0) ||
      (b.id ?? "").localeCompare(a.id ?? ""),
  );
}

export function createMemoryCollectionsRepository(): CollectionsRepository {
  let items: LocalCollectionItem[] = [];
  let notes: LocalNote[] = [];
  return {
    async saveItem(input) {
      const id = collectionItemId(input.targetType, input.targetId);
      const existing = items.find((item) => item.id === id);
      if (existing) return existing;
      const item = createCollectionItem(input);
      items = [item, ...items];
      return item;
    },
    async listItems() {
      return sortByUpdatedAtDescending([...items]);
    },
    async removeItem(targetType, targetId) {
      const id = collectionItemId(targetType, targetId);
      items = items.filter((item) => item.id !== id);
    },
    async saveNote(input) {
      const note = createNote(input);
      notes = [note, ...notes];
      return note;
    },
    async listNotes() {
      return sortByUpdatedAtDescending([...notes]);
    },
    async exportJson() {
      return JSON.stringify({ version: 3, items, notes }, null, 2);
    },
    async importJson(serialized) {
      const parsed = JSON.parse(serialized) as { items?: LocalCollectionItem[]; notes?: LocalNote[] };
      items = Array.isArray(parsed.items) ? parsed.items : [];
      notes = Array.isArray(parsed.notes) ? parsed.notes : [];
    },
  };
}

const dbName = "qunxing-shanyaoshi";
const itemsStore = "items";
const notesStore = "notes";

async function getDb() {
  return openDB(dbName, 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(itemsStore)) {
        db.createObjectStore(itemsStore, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(notesStore)) {
        db.createObjectStore(notesStore, { keyPath: "id" });
      }
    },
  });
}

export function createIndexedDbCollectionsRepository(): CollectionsRepository {
  async function listItems() {
    const db = await getDb();
    return sortByUpdatedAtDescending(await db.getAll(itemsStore));
  }

  async function listNotes() {
    const db = await getDb();
    return sortByUpdatedAtDescending(await db.getAll(notesStore));
  }

  return {
    async saveItem(input) {
      const db = await getDb();
      const id = collectionItemId(input.targetType, input.targetId);
      const existing = await db.get(itemsStore, id);
      if (existing) return existing;
      const item = createCollectionItem(input);
      await db.put(itemsStore, item);
      return item;
    },
    listItems,
    async removeItem(targetType, targetId) {
      const db = await getDb();
      await db.delete(itemsStore, collectionItemId(targetType, targetId));
    },
    async saveNote(input) {
      const note = createNote(input);
      const db = await getDb();
      await db.put(notesStore, note);
      return note;
    },
    listNotes,
    async exportJson() {
      return JSON.stringify({ version: 3, items: await listItems(), notes: await listNotes() }, null, 2);
    },
    async importJson(serialized) {
      const parsed = JSON.parse(serialized) as { items?: LocalCollectionItem[]; notes?: LocalNote[] };
      const db = await getDb();
      const tx = db.transaction([itemsStore, notesStore], "readwrite");
      await tx.objectStore(itemsStore).clear();
      await tx.objectStore(notesStore).clear();
      for (const item of parsed.items ?? []) await tx.objectStore(itemsStore).put(item);
      for (const note of parsed.notes ?? []) await tx.objectStore(notesStore).put(note);
      await tx.done;
    },
  };
}
