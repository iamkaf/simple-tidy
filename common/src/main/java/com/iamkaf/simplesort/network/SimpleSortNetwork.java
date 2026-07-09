package com.iamkaf.simplesort.network;

import com.iamkaf.amber.api.networking.v1.NetworkChannel;
import com.iamkaf.simplesort.SimpleSort;

public final class SimpleSortNetwork {
    private static final NetworkChannel CHANNEL = NetworkChannel.create(SimpleSort.resource("main"));
    private static boolean initialized;

    private SimpleSortNetwork() {
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
