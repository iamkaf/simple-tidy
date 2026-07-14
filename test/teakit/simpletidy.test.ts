import { Capability, Readiness, describe, expect, pos, test } from "@teakit/test";
import type { BlockPos, TeaKitTestContext } from "@teakit/test";

describe.configure({
  timeout: "6m",
  readiness: [Readiness.World, Readiness.Player],
  capabilities: [
    Capability.ClientScreen,
    Capability.ClientScreens,
    Capability.PlayerInteractions,
    Capability.RuntimeTiming,
    Capability.ServerCommands,
    Capability.WorldBlock,
    Capability.WorldInspection,
  ],
});

const containerPos: BlockPos = pos(0, 71, 0);
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
        .sort((left, right) => left.slot - right.slot);

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
    await prepareStorage(ctx, "minecraft:chest[facing=north]");
    await ctx.player.openBlock(containerPos);
    const screen = await ctx.client.waitForScreen("net.minecraft.client.gui.screens.inventory.ContainerScreen", {
      timeoutMs: 8_000,
    });
    await screen.menu().slot(1).click({ button: 0, clickType: "PICKUP" });
    await ctx.runtime.wait(250);
    await screen.widgets().activate("↕");
    await ctx.runtime.wait(250);

    const items = (await ctx.world.container(containerPos).inspect()).items
      .map(projectItem)
      .sort((left, right) => left.slot - right.slot);
    expect(items).toEqual([
      { id: "minecraft:stone", count: 20, slot: 0 },
      { id: "minecraft:stone", count: 50, slot: 2 },
      { id: "minecraft:dirt", count: 2, slot: 3 },
    ]);
    await ctx.client.closeMenus();
  });

  test("does not expose sorting on a special-purpose menu", async (ctx) => {
    await prepareArea(ctx);
    await ctx.commands.run("/setblock 0 71 0 minecraft:anvil");
    await ctx.runtime.wait(500);
    await ctx.player.openBlock(containerPos);
    const screen = await ctx.client.waitForScreen("net.minecraft.client.gui.screens.inventory.AnvilScreen", {
      timeoutMs: 8_000,
    });
    await expect(screen.widgets().find("↕").activate()).rejects.toThrow();
    await ctx.client.closeMenus();
  });
});

async function openAndActivateSort(ctx: TeaKitTestContext, block: string, screenClass: string) {
  await prepareStorage(ctx, block);
  await ctx.player.openBlock(containerPos);
  const screen = await ctx.client.waitForScreen(screenClass, { timeoutMs: 8_000 });
  await screen.widgets().activate("↕");
  await ctx.runtime.wait(250);
}

async function prepareArea(ctx: TeaKitTestContext) {
  await ctx.commands.batch([
    "/gamemode survival @a[limit=1]",
    "/clear @a[limit=1]",
    "/fill -3 70 -3 3 70 3 minecraft:stone",
    "/fill -3 71 -3 3 75 3 minecraft:air",
    "/tp @a[limit=1] 0 72 -2",
  ]);
}

async function prepareStorage(ctx: TeaKitTestContext, block: string) {
  await prepareArea(ctx);
  await ctx.commands.run(`/setblock 0 71 0 ${block}`);
  await ctx.runtime.wait(500);
  await ctx.commands.batch([
    "/item replace block 0 71 0 container.0 with minecraft:stone 20",
    "/item replace block 0 71 0 container.1 with minecraft:apple 3",
    "/item replace block 0 71 0 container.2 with minecraft:stone 50",
    "/item replace block 0 71 0 container.3 with minecraft:dirt 2",
  ], { requireSuccess: true });
}

function projectItem(item: Record<string, unknown>): { id: string; count: number; slot: number } {
  const id = item.id ?? item.item ?? item.itemId ?? item.type;
  return { id: String(id), count: Number(item.count), slot: Number(item.slot) };
}
