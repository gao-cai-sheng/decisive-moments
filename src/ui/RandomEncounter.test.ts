import { describe, expect, it } from "vitest";
import { maskName } from "./RandomEncounter";

// 盲盒的全部价值在于揭晓前不知道是谁。库里的 questionZh 绝大多数以人名起句，
// 这组测试守住「钩子里不出现姓名」这条线。
describe("maskName", () => {
  const vico = { zh: "维柯", en: "Giambattista Vico" };
  const shangYang = { zh: "商鞅", en: "Shang Yang" };

  it("遮掉句首人名，并收敛成自然问法", () => {
    expect(maskName("维柯为什么认为人类最能认识自己所制造的历史世界？", vico, "zh")).toBe(
      "为什么认为人类最能认识自己所制造的历史世界？",
    );
  });

  it("遮掉句中人名", () => {
    expect(maskName("在商鞅看来，民众的强弱意味着什么？", shangYang, "zh")).toBe(
      "在这个人看来，民众的强弱意味着什么？",
    );
  });

  it("同一句里多次出现也全部遮掉", () => {
    const masked = maskName("商鞅如何论证？商鞅的依据是什么？", shangYang, "zh");
    expect(masked).not.toContain("商鞅");
  });

  it("英文名同样遮蔽，占位符随 locale 变化", () => {
    expect(maskName("Why does Giambattista Vico hold that we know what we make?", vico, "en")).toBe(
      "Why does This thinker hold that we know what we make?",
    );
  });

  it("中英文名混排时都被遮住", () => {
    const masked = maskName("维柯（Giambattista Vico）为什么这样主张？", vico, "zh");
    expect(masked).not.toContain("维柯");
    expect(masked).not.toContain("Giambattista Vico");
  });

  it("不含人名的问题原样返回", () => {
    const text = "如果一切都没有自性，这句话本身还成立吗？";
    expect(maskName(text, { zh: "龙树", en: "Nagarjuna" }, "zh")).toBe(text);
  });

  it("句首收敛只吃掉疑问词前的占位符，不误伤句中的", () => {
    expect(maskName("商鞅如何看待商鞅的批评者？", shangYang, "zh")).toBe("如何看待这个人的批评者？");
  });
});
