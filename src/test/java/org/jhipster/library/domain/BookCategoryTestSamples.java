package org.jhipster.library.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class BookCategoryTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static BookCategory getBookCategorySample1() {
        return new BookCategory().id(1L).name("name1").description("description1");
    }

    public static BookCategory getBookCategorySample2() {
        return new BookCategory().id(2L).name("name2").description("description2");
    }

    public static BookCategory getBookCategoryRandomSampleGenerator() {
        return new BookCategory()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString());
    }
}
