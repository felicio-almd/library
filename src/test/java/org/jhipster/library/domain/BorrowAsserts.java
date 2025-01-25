package org.jhipster.library.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class BorrowAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertBorrowAllPropertiesEquals(Borrow expected, Borrow actual) {
        assertBorrowAutoGeneratedPropertiesEquals(expected, actual);
        assertBorrowAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertBorrowAllUpdatablePropertiesEquals(Borrow expected, Borrow actual) {
        assertBorrowUpdatableFieldsEquals(expected, actual);
        assertBorrowUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertBorrowAutoGeneratedPropertiesEquals(Borrow expected, Borrow actual) {
        assertThat(expected)
            .as("Verify Borrow auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertBorrowUpdatableFieldsEquals(Borrow expected, Borrow actual) {
        assertThat(expected)
            .as("Verify Borrow relevant properties")
            .satisfies(e -> assertThat(e.getBorrowDateTime()).as("check borrowDateTime").isEqualTo(actual.getBorrowDateTime()))
            .satisfies(e -> assertThat(e.getReturnDateTime()).as("check returnDateTime").isEqualTo(actual.getReturnDateTime()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertBorrowUpdatableRelationshipsEquals(Borrow expected, Borrow actual) {
        assertThat(expected)
            .as("Verify Borrow relationships")
            .satisfies(e -> assertThat(e.getBook()).as("check book").isEqualTo(actual.getBook()));
    }
}
