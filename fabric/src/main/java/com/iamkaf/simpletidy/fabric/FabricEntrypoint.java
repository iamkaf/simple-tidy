package com.iamkaf.simpletidy.fabric;

import com.iamkaf.simpletidy.SimpleTidyMod;
import net.fabricmc.api.ModInitializer;

public final class FabricEntrypoint implements ModInitializer {
    @Override
    public void onInitialize() {
        SimpleTidyMod.init();
    }
}
