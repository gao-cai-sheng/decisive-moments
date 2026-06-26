import { describe, expect, it } from "vitest";
import { createMemoryCollectionsRepository } from "./localCollections";

describe("local collections repository", () => {
  it("saves, lists, exports, and imports notes", async () => {
    const repo = createMemoryCollectionsRepository();
    await repo.saveNote({
      targetType: "philosopher",
      targetId: "plato",
      body: "读《理想国》时重看正义问题。",
    });

    const notes = await repo.listNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0].syncStatus).toBe("local_only");

    const exported = await repo.exportJson();
    const nextRepo = createMemoryCollectionsRepository();
    await nextRepo.importJson(exported);
    expect(await nextRepo.listNotes()).toHaveLength(1);
  });

  it("saves, lists, removes, exports, and imports saved collection items", async () => {
    const repo = createMemoryCollectionsRepository();

    await repo.saveItem({ targetType: "philosopher", targetId: "plato", label: "柏拉图" });
    await repo.saveItem({ targetType: "argument", targetId: "plato-forms", label: "理念高于可感事物" });
    await repo.saveItem({ targetType: "search", targetId: "justice", label: "正义" });
    await repo.saveItem({ targetType: "philosopher", targetId: "plato", label: "柏拉图" });

    const items = await repo.listItems();
    expect(items).toHaveLength(3);
    expect(items.map((item) => item.targetType)).toEqual(["search", "argument", "philosopher"]);
    expect(items.every((item) => item.syncStatus === "local_only")).toBe(true);

    const exported = await repo.exportJson();
    const nextRepo = createMemoryCollectionsRepository();
    await nextRepo.importJson(exported);
    expect(await nextRepo.listItems()).toHaveLength(3);

    await nextRepo.removeItem("philosopher", "plato");
    expect((await nextRepo.listItems()).map((item) => item.targetId)).toEqual(["justice", "plato-forms"]);
  });

  it("uses sortOrder when collection items share an updatedAt timestamp", async () => {
    const repo = createMemoryCollectionsRepository();
    const updatedAt = "2026-06-26T01:00:00.000Z";

    await repo.importJson(
      JSON.stringify({
        version: 3,
        items: [
          {
            id: "philosopher:plato",
            targetType: "philosopher",
            targetId: "plato",
            label: "柏拉图",
            createdAt: updatedAt,
            updatedAt,
            sortOrder: 1,
            userId: null,
            syncStatus: "local_only",
          },
          {
            id: "argument:plato-forms",
            targetType: "argument",
            targetId: "plato-forms",
            label: "理念高于可感事物",
            createdAt: updatedAt,
            updatedAt,
            sortOrder: 3,
            userId: null,
            syncStatus: "local_only",
          },
          {
            id: "search:justice",
            targetType: "search",
            targetId: "justice",
            label: "正义",
            createdAt: updatedAt,
            updatedAt,
            sortOrder: 2,
            userId: null,
            syncStatus: "local_only",
          },
        ],
        notes: [],
      }),
    );

    expect((await repo.listItems()).map((item) => item.id)).toEqual([
      "argument:plato-forms",
      "search:justice",
      "philosopher:plato",
    ]);
  });
});
