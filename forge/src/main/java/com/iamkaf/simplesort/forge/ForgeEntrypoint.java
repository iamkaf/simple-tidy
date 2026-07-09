package com.iamkaf.simplesort.forge;

import com.iamkaf.simplesort.SimpleSort;
import com.iamkaf.simplesort.SimpleSortMod;
import net.minecraftforge.fml.common.Mod;

@Mod(SimpleSort.MOD_ID)
public final class ForgeEntrypoint {
    public ForgeEntrypoint() {
        SimpleSortMod.init();
    }
}
