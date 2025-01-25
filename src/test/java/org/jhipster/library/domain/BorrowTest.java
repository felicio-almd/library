package org.jhipster.library.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.jhipster.library.domain.BookTestSamples.*;
import static org.jhipster.library.domain.BorrowTestSamples.*;

import org.jhipster.library.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BorrowTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Borrow.class);
        Borrow borrow1 = getBorrowSample1();
        Borrow borrow2 = new Borrow();
        assertThat(borrow1).isNotEqualTo(borrow2);

        borrow2.setId(borrow1.getId());
        assertThat(borrow1).isEqualTo(borrow2);

        borrow2 = getBorrowSample2();
        assertThat(borrow1).isNotEqualTo(borrow2);
    }

    @Test
    void bookTest() {
        Borrow borrow = getBorrowRandomSampleGenerator();
        Book bookBack = getBookRandomSampleGenerator();

        borrow.setBook(bookBack);
        assertThat(borrow.getBook()).isEqualTo(bookBack);

        borrow.book(null);
        assertThat(borrow.getBook()).isNull();
    }
}
