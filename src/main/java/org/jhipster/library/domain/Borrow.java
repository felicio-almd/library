package org.jhipster.library.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Borrow.
 */
@Entity
@Table(name = "borrow")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Borrow implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "borrow_date_time", nullable = false)
    private Instant borrowDateTime;

    @Column(name = "return_date_time")
    private Instant returnDateTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "location", "authors", "categories" }, allowSetters = true)
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Borrow id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getBorrowDateTime() {
        return this.borrowDateTime;
    }

    public Borrow borrowDateTime(Instant borrowDateTime) {
        this.setBorrowDateTime(borrowDateTime);
        return this;
    }

    public void setBorrowDateTime(Instant borrowDateTime) {
        this.borrowDateTime = borrowDateTime;
    }

    public Instant getReturnDateTime() {
        return this.returnDateTime;
    }

    public Borrow returnDateTime(Instant returnDateTime) {
        this.setReturnDateTime(returnDateTime);
        return this;
    }

    public void setReturnDateTime(Instant returnDateTime) {
        this.returnDateTime = returnDateTime;
    }

    public Book getBook() {
        return this.book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public Borrow book(Book book) {
        this.setBook(book);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Borrow user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Borrow)) {
            return false;
        }
        return getId() != null && getId().equals(((Borrow) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Borrow{" +
            "id=" + getId() +
            ", borrowDateTime='" + getBorrowDateTime() + "'" +
            ", returnDateTime='" + getReturnDateTime() + "'" +
            "}";
    }
}
