package org.jhipster.library.repository;

import org.jhipster.library.domain.BookCategory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BookCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BookCategoryRepository extends JpaRepository<BookCategory, Long> {}
