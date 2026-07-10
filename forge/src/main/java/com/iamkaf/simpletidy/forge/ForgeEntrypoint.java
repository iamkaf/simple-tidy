package com.iamkaf.simpletidy.forge;

import com.iamkaf.simpletidy.SimpleTidy;
import com.iamkaf.simpletidy.SimpleTidyMod;
import net.minecraftforge.fml.common.Mod;

@Mod(SimpleTidy.MOD_ID)
public final class ForgeEntrypoint {
    public ForgeEntrypoint() {
        SimpleTidyMod.init();
    }
}
