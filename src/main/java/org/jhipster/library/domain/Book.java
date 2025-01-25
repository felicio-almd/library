package org.jhipster.library.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Book.
 */
@Entity
@Table(name = "book")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Book implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Column(name = "publication_year", nullable = false)
    private Integer publicationYear;

    @NotNull
    @Column(name = "total_copies", nullable = false)
    private Integer totalCopies;

    @NotNull
    @Column(name = "available_copies", nullable = false)
    private Integer availableCopies;

    @JsonIgnoreProperties(value = { "book" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private BookLocation location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "books" }, allowSetters = true)
    private Author authors;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "books" }, allowSetters = true)
    private BookCategory categories;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Book id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Book title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getPublicationYear() {
        return this.publicationYear;
    }

    public Book publicationYear(Integer publicationYear) {
        this.setPublicationYear(publicationYear);
        return this;
    }

    public void setPublicationYear(Integer publicationYear) {
        this.publicationYear = publicationYear;
    }

    public Integer getTotalCopies() {
        return this.totalCopies;
    }

    public Book totalCopies(Integer totalCopies) {
        this.setTotalCopies(totalCopies);
        return this;
    }

    public void setTotalCopies(Integer totalCopies) {
        this.totalCopies = totalCopies;
    }

    public Integer getAvailableCopies() {
        return this.availableCopies;
    }

    public Book availableCopies(Integer availableCopies) {
        this.setAvailableCopies(availableCopies);
        return this;
    }

    public void setAvailableCopies(Integer availableCopies) {
        this.availableCopies = availableCopies;
    }

    public BookLocation getLocation() {
        return this.location;
    }

    public void setLocation(BookLocation bookLocation) {
        this.location = bookLocation;
    }

    public Book location(BookLocation bookLocation) {
        this.setLocation(bookLocation);
        return this;
    }

    public Author getAuthors() {
        return this.authors;
    }

    public void setAuthors(Author author) {
        this.authors = author;
    }

    public Book authors(Author author) {
        this.setAuthors(author);
        return this;
    }

    public BookCategory getCategories() {
        return this.categories;
    }

    public void setCategories(BookCategory bookCategory) {
        this.categories = bookCategory;
    }

    public Book categories(BookCategory bookCategory) {
        this.setCategories(bookCategory);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Book)) {
            return false;
        }
        return getId() != null && getId().equals(((Book) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Book{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", publicationYear=" + getPublicationYear() +
            ", totalCopies=" + getTotalCopies() +
            ", availableCopies=" + getAvailableCopies() +
            "}";
    }
}
