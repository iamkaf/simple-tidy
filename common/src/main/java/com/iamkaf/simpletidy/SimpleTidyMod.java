package com.iamkaf.simpletidy;

import com.iamkaf.amber.api.core.v2.AmberInitializer;
import com.iamkaf.simpletidy.network.SimpleTidyNetwork;

public final class SimpleTidyMod {
    private static boolean initialized;

    private SimpleTidyMod() {
    }

    public static synchronized void init() {
        if (initialized) {
            return;
        }
        initialized = true;

        AmberInitializer.initialize(SimpleTidy.MOD_ID);
        SimpleTidyNetwork.init();
        SimpleTidy.LOG.info("Initialized {}", SimpleTidy.MOD_NAME);
    }
}
