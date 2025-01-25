package org.jhipster.library.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.jhipster.library.domain.BookCategoryTestSamples.*;
import static org.jhipster.library.domain.BookTestSamples.*;

import java.util.HashSet;
import java.util.Set;
import org.jhipster.library.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BookCategoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BookCategory.class);
        BookCategory bookCategory1 = getBookCategorySample1();
        BookCategory bookCategory2 = new BookCategory();
        assertThat(bookCategory1).isNotEqualTo(bookCategory2);

        bookCategory2.setId(bookCategory1.getId());
        assertThat(bookCategory1).isEqualTo(bookCategory2);

        bookCategory2 = getBookCategorySample2();
        assertThat(bookCategory1).isNotEqualTo(bookCategory2);
    }

    @Test
    void booksTest() {
        BookCategory bookCategory = getBookCategoryRandomSampleGenerator();
        Book bookBack = getBookRandomSampleGenerator();

        bookCategory.addBooks(bookBack);
        assertThat(bookCategory.getBooks()).containsOnly(bookBack);
        assertThat(bookBack.getCategories()).isEqualTo(bookCategory);

        bookCategory.removeBooks(bookBack);
        assertThat(bookCategory.getBooks()).doesNotContain(bookBack);
        assertThat(bookBack.getCategories()).isNull();

        bookCategory.books(new HashSet<>(Set.of(bookBack)));
        assertThat(bookCategory.getBooks()).containsOnly(bookBack);
        assertThat(bookBack.getCategories()).isEqualTo(bookCategory);

        bookCategory.setBooks(new HashSet<>());
        assertThat(bookCategory.getBooks()).doesNotContain(bookBack);
        assertThat(bookBack.getCategories()).isNull();
    }
}
