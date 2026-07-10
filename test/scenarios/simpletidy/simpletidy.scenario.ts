import { Capability, Readiness, describe, expect, test } from "@teakit/test";
import type { BlockPos, ScenarioDefinition, ScenarioResult, TeaKitTestContext } from "@teakit/test";

describe.configure({
  timeout: "6m",
  readiness: [Readiness.ClientReady, Readiness.IntegratedServerReady, Readiness.PlayerSpawned],
  capabilities: [
    Capability.LegacyJsonScenarios,
    Capability.ServerCommands,
    Capability.WorldInspection,
    Capability.ClientScreen,
    Capability.ClientScreens,
  ],
});

const containerPos: BlockPos = { x: 0, y: 71, z: 0 };
const storageBlocks = [
  { block: "minecraft:chest[facing=north]", screen: "net.minecraft.client.gui.screens.inventory.ContainerScreen" },
  { block: "minecraft:barrel[facing=north,open=false]", screen: "net.minecraft.client.gui.screens.inventory.ContainerScreen" },
  { block: "minecraft:shulker_box", screen: "net.minecraft.client.gui.screens.inventory.ShulkerBoxScreen" },
  { block: "minecraft:dispenser[facing=north,triggered=false]", screen: "net.minecraft.client.gui.screens.inventory.DispenserScreen" },
  { block: "minecraft:dropper[facing=north,triggered=false]", screen: "net.minecraft.client.gui.screens.inventory.DispenserScreen" },
  { block: "minecraft:hopper[enabled=false,facing=down]", screen: "net.minecraft.client.gui.screens.inventory.HopperScreen" },
] as const;

describe("Simple Tidy", () => {
  for (const storage of storageBlocks) {
    test(`sorts and compacts ${storage.block.split("[")[0]}`, async (ctx) => {
      await openAndActivateSort(ctx, storage.block, storage.screen);

      const items = (await ctx.world.container(containerPos).inspect()).items
        .map(projectItem)
        .sort((left, right) => (left.slot ?? 0) - (right.slot ?? 0));

      expect(items).toEqual([
        { id: "minecraft:apple", count: 3, slot: 0 },
        { id: "minecraft:dirt", count: 2, slot: 1 },
        { id: "minecraft:stone", count: 64, slot: 2 },
        { id: "minecraft:stone", count: 6, slot: 3 },
      ]);
      await ctx.client.closeMenus();
    });
  }

  test("rejects sorting while the cursor carries a stack", async (ctx) => {
    const result = await ctx.scenario.run({
      name: "simpletidy-reject-carried-stack",
      steps: [
        ...storageSetupSteps("minecraft:chest[facing=north]"),
        { action: "use_block", x: 0, y: 71, z: 0, direction: "up", hand: "main_hand" },
        { action: "wait_for_screen", screenClass: "net.minecraft.client.gui.screens.inventory.ContainerScreen", timeoutMs: 8000 },
        { action: "click_menu_slot", slot: 1, button: 0, clickType: "PICKUP" },
        { action: "wait_ms", durationMs: 250 },
        { action: "activate_widget", label: "↕", waitAfterMs: 250 },
      ],
    } satisfies ScenarioDefinition);
    expect(failedSteps(result)).toEqual([]);
    const items = (await ctx.world.container(containerPos).inspect()).items
      .map(projectItem)
      .sort((left, right) => (left.slot ?? 0) - (right.slot ?? 0));

    expect(items).toEqual([
      { id: "minecraft:stone", count: 20, slot: 0 },
      { id: "minecraft:stone", count: 50, slot: 2 },
      { id: "minecraft:dirt", count: 2, slot: 3 },
    ]);
    await ctx.client.closeMenus();
  });

  test("does not expose sorting on a special-purpose menu", async (ctx) => {
    let rejected = false;
    try {
      await ctx.scenario.run({
        name: "simpletidy-special-menu-has-no-sort-control",
        steps: [
          ...areaSetupSteps(),
          { action: "command", command: "/setblock 0 71 0 minecraft:anvil" },
          { action: "wait_for_block", x: 0, y: 71, z: 0, blockId: "minecraft:anvil", timeoutMs: 8000 },
          { action: "wait_ms", durationMs: 500 },
          { action: "use_block", x: 0, y: 71, z: 0, direction: "up", hand: "main_hand" },
          { action: "wait_for_screen", screenClass: "net.minecraft.client.gui.screens.inventory.AnvilScreen", timeoutMs: 8000 },
          { action: "activate_widget", label: "↕", waitAfterMs: 100 },
        ],
      } satisfies ScenarioDefinition);
    } catch {
      rejected = true;
    }
    expect(rejected).toBe(true);
    await ctx.client.closeMenus();
  });
});

async function openAndActivateSort(ctx: TeaKitTestContext, block: string, screenClass: string) {
  const result = await ctx.scenario.run({
    name: "simpletidy-open-and-activate-sort-control",
    steps: [
      ...storageSetupSteps(block),
      { action: "use_block", x: 0, y: 71, z: 0, direction: "up", hand: "main_hand" },
      { action: "wait_for_screen", screenClass, timeoutMs: 8000 },
      { action: "activate_widget", label: "↕", waitAfterMs: 250 },
    ],
  } satisfies ScenarioDefinition);
  expect(failedSteps(result)).toEqual([]);
}

function areaSetupSteps(): ScenarioDefinition["steps"] {
  return [
    { action: "command", command: "/gamemode survival @a[limit=1]" },
    { action: "command", command: "/clear @a[limit=1]" },
    { action: "command", command: "/fill -3 70 -3 3 70 3 minecraft:stone" },
    { action: "command", command: "/fill -3 71 -3 3 75 3 minecraft:air" },
    { action: "command", command: "/tp @a[limit=1] 0 72 -2" },
  ];
}

function storageSetupSteps(block: string): ScenarioDefinition["steps"] {
  const blockId = block.split("[")[0] as `${string}:${string}`;
  return [
    ...areaSetupSteps(),
    { action: "command", command: `/setblock 0 71 0 ${block}` },
    { action: "wait_for_block", x: 0, y: 71, z: 0, blockId, timeoutMs: 8000 },
    { action: "wait_ms", durationMs: 500 },
    { action: "assert_command", command: "/item replace block 0 71 0 container.0 with minecraft:stone 20" },
    { action: "assert_command", command: "/item replace block 0 71 0 container.1 with minecraft:apple 3" },
    { action: "assert_command", command: "/item replace block 0 71 0 container.2 with minecraft:stone 50" },
    { action: "assert_command", command: "/item replace block 0 71 0 container.3 with minecraft:dirt 2" },
  ];
}

function failedSteps(result: ScenarioResult): string[] {
  return ["setup", "steps", "cleanup"].flatMap((phase) => {
    const phaseResults = result[phase as keyof ScenarioResult];
    if (!Array.isArray(phaseResults)) {
      return [];
    }
    return phaseResults
      .filter((step) => {
        const stepResult = step.result as Record<string, unknown> | undefined;
        if (stepResult?.failure != null || stepResult?.failed === true) {
          return true;
        }
        return step.action !== "command" && stepResult?.success === false;
      })
      .map((step) => `${phase}[${step.index ?? "?"}] ${step.action ?? "unknown"}`);
  });
}

function projectItem(item: Record<string, unknown>): { id: string; count: number; slot: number } {
  const id = item.id ?? item.item ?? item.itemId ?? item.type;
  return {
    id: String(id),
    count: Number(item.count),
    slot: Number(item.slot),
  };
}
