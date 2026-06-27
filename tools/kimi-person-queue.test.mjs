import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildPersonQueue, detectKimiRateLimit, findNextStage } from "./kimi-person-queue.mjs";

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function makeProjectRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kimi-person-queue-project-"));
  const index = [
    philosopherIndexEntry("confucius", "孔子", "Confucius"),
    philosopherIndexEntry("laozi", "老子", "Laozi"),
    philosopherIndexEntry("zhuangzi", "庄子", "Zhuangzi"),
  ];
  writeJson(path.join(root, "public/data/philosophers.index.json"), index);
  writeJson(path.join(root, "public/data/philosophers", "confucius.json"), {
    ...philosopherDetail("confucius", "孔子", "Confucius"),
    thoughtSystem: {
      problems: [
        {
          id: "confucius:problem:001",
          titleZh: "仁与礼",
          questionZh: "仁如何经由礼展开？",
          summaryZh: "测试用思想系统，表示该哲人已经完成正式落库。",
          themeIds: ["ethics"],
          weight: 3,
          claims: [
            {
              id: "confucius:claim:001",
              titleZh: "仁礼相成",
              claimZh: "仁与礼相互支撑。",
              explanationZh: "测试用解释文本，长度足够满足 schema 的最低要求。",
              themeIds: ["ethics"],
              weight: 3,
              evidence: [
                {
                  id: "confucius:evidence:001",
                  titleZh: "论语摘要",
                  summaryZh: "测试用证据摘要，长度足够满足 schema 的最低要求。",
                  source: { workId: "confucius-primary-work", excerptStatus: "summary_only" },
                },
              ],
            },
          ],
        },
      ],
    },
  });
  writeJson(path.join(root, "public/data/philosophers", "laozi.json"), philosopherDetail("laozi", "老子", "Laozi"));
  writeJson(path.join(root, "public/data/philosophers", "zhuangzi.json"), philosopherDetail("zhuangzi", "庄子", "Zhuangzi"));
  writeJson(path.join(root, "public/data/works.json"), [
    work("confucius-primary-work", "confucius"),
    work("laozi-primary-work", "laozi"),
    work("zhuangzi-primary-work", "zhuangzi"),
  ]);
  writeJson(path.join(root, ".research/tmp/kimi/2026-06-26-batch-01-chinese-classical/thought-systems.json"), {
    schemaVersion: 1,
    items: [{ philosopherId: "laozi", problems: [] }],
  });
  return root;
}

function philosopherIndexEntry(id, zh, en) {
  return {
    id,
    names: { zh, en },
    life: { display: "测试年代" },
    civilization: "test-civilization",
    traditions: ["test-tradition"],
    periods: ["first_release"],
    themes: ["ethics", "metaphysics"],
    keywordsZh: ["伦理"],
    oneLineZh: zh + "测试条目。",
    influenceWeight: 1,
    reviewStatus: "draft",
  };
}

function philosopherDetail(id, zh, en) {
  return {
    ...philosopherIndexEntry(id, zh, en),
    summaryZh: zh + "测试摘要，长度足够用于构造队列夹具。",
    works: [id + "-primary-work"],
    sourceNotes: [{ label: "fixture", noteZh: "测试用来源说明。" }],
  };
}

function work(id, philosopherId) {
  return {
    id,
    philosopherId,
    titleZh: id,
    titleEn: id,
    noteZh: "测试用作品条目。",
  };
}

describe("kimi person queue", () => {
  it("builds resumable one-person stage queues and marks legacy research as review pending", () => {
    const projectRoot = makeProjectRoot();
    const queueRoot = path.join(projectRoot, ".research/tmp/kimi/person-queue");

    const manifest = buildPersonQueue({ projectRoot, queueRoot, createdAt: "2026-06-26T00:00:00+08:00" });

    expect(manifest.queueVersion).toBe(2);
    expect(manifest.unitPolicy).toMatch(/one philosopher per session/i);
    expect(manifest.people.map((person) => person.philosopherId)).toEqual(["laozi", "zhuangzi"]);
    expect(manifest.people.find((person) => person.philosopherId === "laozi").status).toBe("research_complete_needs_review");
    expect(manifest.people.find((person) => person.philosopherId === "laozi").stages.map((stage) => stage.status)).toEqual([
      "done_legacy",
      "done_legacy",
      "done_legacy",
    ]);
    const zhuangzi = manifest.people.find((person) => person.philosopherId === "zhuangzi");
    expect(zhuangzi.stages.map((stage) => stage.id)).toEqual(["sources-notes", "claims", "thought-system"]);
    expect(zhuangzi.stages.every((stage) => stage.status === "pending")).toBe(true);
    expect(findNextStage(manifest)).toMatchObject({ philosopherId: "zhuangzi", stageId: "sources-notes" });

    const promptPath = path.join(projectRoot, zhuangzi.stages[2].promptPath);
    const prompt = fs.readFileSync(promptPath, "utf8");
    expect(prompt).toMatch(/只研究 1 位哲人/);
    expect(prompt).toMatch(/zhuangzi-primary-work/);
    expect(prompt).toMatch(/不要创造新的 workId/);
  });


  it("retries a rate-limited stage before later pending stages", () => {
    const manifest = {
      people: [
        {
          philosopherId: "zhu-xi",
          stages: [
            { id: "sources-notes", status: "blocked_rate_limit" },
            { id: "claims", status: "pending" },
            { id: "thought-system", status: "pending" },
          ],
        },
      ],
    };

    expect(findNextStage(manifest)).toMatchObject({ philosopherId: "zhu-xi", stageId: "sources-notes" });
  });

  it("detects Kimi rate limits even when the CLI exits cleanly", () => {
    const output = `Error code: 429 - {'error': {'message': "You've reached your usage limit for this period", 'type': 'rate_limit_reached_error'}}`;

    expect(detectKimiRateLimit(output)).toBe(true);
  });
});
