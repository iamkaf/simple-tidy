package com.iamkaf.simplesort.fabric;

import com.iamkaf.simplesort.SimpleSortMod;
import net.fabricmc.api.ModInitializer;

public final class FabricEntrypoint implements ModInitializer {
    @Override
    public void onInitialize() {
        SimpleSortMod.init();
    }
}
