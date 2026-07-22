package com.iamkaf.minisort.neoforge;

import com.iamkaf.minisort.MiniSort;
import com.iamkaf.minisort.MiniSortMod;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.fml.common.Mod;

@Mod(MiniSort.MOD_ID)
public final class NeoForgeEntrypoint {
    public NeoForgeEntrypoint(IEventBus eventBus) {
        MiniSortMod.init();
    }
}
