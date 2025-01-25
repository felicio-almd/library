package org.jhipster.library.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class BookLocationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static BookLocation getBookLocationSample1() {
        return new BookLocation().id(1L).aisle("aisle1").shelf("shelf1");
    }

    public static BookLocation getBookLocationSample2() {
        return new BookLocation().id(2L).aisle("aisle2").shelf("shelf2");
    }

    public static BookLocation getBookLocationRandomSampleGenerator() {
        return new BookLocation().id(longCount.incrementAndGet()).aisle(UUID.randomUUID().toString()).shelf(UUID.randomUUID().toString());
    }
}
