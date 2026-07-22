package com.iamkaf.minisort.fabric;

import com.iamkaf.minisort.MiniSortMod;
import net.fabricmc.api.ModInitializer;

public final class FabricEntrypoint implements ModInitializer {
    @Override
    public void onInitialize() {
        MiniSortMod.init();
    }
}
