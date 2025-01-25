package org.jhipster.library.repository;

import org.jhipster.library.domain.BookLocation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BookLocation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BookLocationRepository extends JpaRepository<BookLocation, Long> {}
