package com.iamkaf.simpletidy.neoforge;

import com.iamkaf.simpletidy.SimpleTidy;
import com.iamkaf.simpletidy.SimpleTidyMod;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.fml.common.Mod;

@Mod(SimpleTidy.MOD_ID)
public final class NeoForgeEntrypoint {
    public NeoForgeEntrypoint(IEventBus eventBus) {
        SimpleTidyMod.init();
    }
}
