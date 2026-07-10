package com.iamkaf.simpletidy.network;

import com.iamkaf.amber.api.networking.v1.NetworkChannel;
import com.iamkaf.simpletidy.SimpleTidy;

public final class SimpleTidyNetwork {
    private static final NetworkChannel CHANNEL = NetworkChannel.create(SimpleTidy.resource("main"));
    private static boolean initialized;

    private SimpleTidyNetwork() {
    }

    public static synchronized void init() {
        if (initialized) {
            return;
        }
        initialized = true;
        CHANNEL.register(
                SortContainerPayload.class,
                SortContainerPayload.ENCODER,
                SortContainerPayload.DECODER,
                SortContainerPayload.HANDLER
        );
    }

    public static void sortContainer(int containerId) {
        CHANNEL.sendToServer(new SortContainerPayload(
                containerId,
                SortContainerPayload.SortTarget.CONTAINER,
                SortContainerPayload.SortMode.REGISTRY_ID
        ));
    }
}
