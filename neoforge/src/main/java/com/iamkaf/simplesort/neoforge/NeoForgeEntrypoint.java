package com.iamkaf.simplesort.neoforge;

import com.iamkaf.simplesort.SimpleSort;
import com.iamkaf.simplesort.SimpleSortMod;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.fml.common.Mod;

@Mod(SimpleSort.MOD_ID)
public final class NeoForgeEntrypoint {
    public NeoForgeEntrypoint(IEventBus eventBus) {
        SimpleSortMod.init();
    }
}
