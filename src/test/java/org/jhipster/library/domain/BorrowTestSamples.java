package org.jhipster.library.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class BorrowTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Borrow getBorrowSample1() {
        return new Borrow().id(1L);
    }

    public static Borrow getBorrowSample2() {
        return new Borrow().id(2L);
    }

    public static Borrow getBorrowRandomSampleGenerator() {
        return new Borrow().id(longCount.incrementAndGet());
    }
}
