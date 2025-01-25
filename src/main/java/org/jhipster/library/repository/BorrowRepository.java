package org.jhipster.library.repository;

import java.util.List;
import java.util.Optional;
import org.jhipster.library.domain.Borrow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Borrow entity.
 */
@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {
    @Query("select borrow from Borrow borrow where borrow.user.login = ?#{authentication.name}")
    Page<Borrow> findByUserIsCurrentUser(Pageable pageable);

    default Optional<Borrow> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Borrow> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Borrow> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select borrow from Borrow borrow left join fetch borrow.book left join fetch borrow.user where borrow.user.login = ?#{authentication.name}",
        countQuery = "select count(borrow) from Borrow borrow"
    )
    Page<Borrow> findAllWithToOneRelationships(Pageable pageable);

    @Query("select borrow from Borrow borrow left join fetch borrow.book left join fetch borrow.user")
    List<Borrow> findAllWithToOneRelationships();

    @Query("select borrow from Borrow borrow left join fetch borrow.book left join fetch borrow.user where borrow.id =:id")
    Optional<Borrow> findOneWithToOneRelationships(@Param("id") Long id);

    @Query(
        value = "select borrow from Borrow borrow left join fetch borrow.book left join fetch borrow.user",
        countQuery = "select count(borrow) from Borrow borrow"
    )
    Page<Borrow> findAllWithEagerRelationshipsAdmin(Pageable pageable);
}
