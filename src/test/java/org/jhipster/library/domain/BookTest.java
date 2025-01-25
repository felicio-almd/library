package org.jhipster.library.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.jhipster.library.domain.AuthorTestSamples.*;
import static org.jhipster.library.domain.BookCategoryTestSamples.*;
import static org.jhipster.library.domain.BookLocationTestSamples.*;
import static org.jhipster.library.domain.BookTestSamples.*;

import org.jhipster.library.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BookTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Book.class);
        Book book1 = getBookSample1();
        Book book2 = new Book();
        assertThat(book1).isNotEqualTo(book2);

        book2.setId(book1.getId());
        assertThat(book1).isEqualTo(book2);

        book2 = getBookSample2();
        assertThat(book1).isNotEqualTo(book2);
    }

    @Test
    void locationTest() {
        Book book = getBookRandomSampleGenerator();
        BookLocation bookLocationBack = getBookLocationRandomSampleGenerator();

        book.setLocation(bookLocationBack);
        assertThat(book.getLocation()).isEqualTo(bookLocationBack);

        book.location(null);
        assertThat(book.getLocation()).isNull();
    }

    @Test
    void authorsTest() {
        Book book = getBookRandomSampleGenerator();
        Author authorBack = getAuthorRandomSampleGenerator();

        book.setAuthors(authorBack);
        assertThat(book.getAuthors()).isEqualTo(authorBack);

        book.authors(null);
        assertThat(book.getAuthors()).isNull();
    }

    @Test
    void categoriesTest() {
        Book book = getBookRandomSampleGenerator();
        BookCategory bookCategoryBack = getBookCategoryRandomSampleGenerator();

        book.setCategories(bookCategoryBack);
        assertThat(book.getCategories()).isEqualTo(bookCategoryBack);

        book.categories(null);
        assertThat(book.getCategories()).isNull();
    }
}
