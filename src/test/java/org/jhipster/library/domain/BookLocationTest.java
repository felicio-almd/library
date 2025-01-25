package org.jhipster.library.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.jhipster.library.domain.BookLocationTestSamples.*;
import static org.jhipster.library.domain.BookTestSamples.*;

import org.jhipster.library.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BookLocationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BookLocation.class);
        BookLocation bookLocation1 = getBookLocationSample1();
        BookLocation bookLocation2 = new BookLocation();
        assertThat(bookLocation1).isNotEqualTo(bookLocation2);

        bookLocation2.setId(bookLocation1.getId());
        assertThat(bookLocation1).isEqualTo(bookLocation2);

        bookLocation2 = getBookLocationSample2();
        assertThat(bookLocation1).isNotEqualTo(bookLocation2);
    }

    @Test
    void bookTest() {
        BookLocation bookLocation = getBookLocationRandomSampleGenerator();
        Book bookBack = getBookRandomSampleGenerator();

        bookLocation.setBook(bookBack);
        assertThat(bookLocation.getBook()).isEqualTo(bookBack);
        assertThat(bookBack.getLocation()).isEqualTo(bookLocation);

        bookLocation.book(null);
        assertThat(bookLocation.getBook()).isNull();
        assertThat(bookBack.getLocation()).isNull();
    }
}
