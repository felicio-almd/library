package org.jhipster.library.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BookLocation.
 */
@Entity
@Table(name = "book_location")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BookLocation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "aisle", nullable = false)
    private String aisle;

    @NotNull
    @Column(name = "shelf", nullable = false)
    private String shelf;

    @JsonIgnoreProperties(value = { "location", "authors", "categories" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "location")
    private Book book;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BookLocation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAisle() {
        return this.aisle;
    }

    public BookLocation aisle(String aisle) {
        this.setAisle(aisle);
        return this;
    }

    public void setAisle(String aisle) {
        this.aisle = aisle;
    }

    public String getShelf() {
        return this.shelf;
    }

    public BookLocation shelf(String shelf) {
        this.setShelf(shelf);
        return this;
    }

    public void setShelf(String shelf) {
        this.shelf = shelf;
    }

    public Book getBook() {
        return this.book;
    }

    public void setBook(Book book) {
        if (this.book != null) {
            this.book.setLocation(null);
        }
        if (book != null) {
            book.setLocation(this);
        }
        this.book = book;
    }

    public BookLocation book(Book book) {
        this.setBook(book);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BookLocation)) {
            return false;
        }
        return getId() != null && getId().equals(((BookLocation) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BookLocation{" +
            "id=" + getId() +
            ", aisle='" + getAisle() + "'" +
            ", shelf='" + getShelf() + "'" +
            "}";
    }
}
