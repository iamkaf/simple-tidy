package com.iamkaf.minisort.forge;

import com.iamkaf.minisort.MiniSort;
import com.iamkaf.minisort.MiniSortMod;
import net.minecraftforge.fml.common.Mod;

@Mod(MiniSort.MOD_ID)
public final class ForgeEntrypoint {
    public ForgeEntrypoint() {
        MiniSortMod.init();
    }
}
