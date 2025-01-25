package org.jhipster.library.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.jhipster.library.domain.Book;
import org.jhipster.library.domain.Borrow;
import org.jhipster.library.repository.BookRepository;
import org.jhipster.library.repository.BorrowRepository;
import org.jhipster.library.security.AuthoritiesConstants;
import org.jhipster.library.security.SecurityUtils;
import org.jhipster.library.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.jhipster.library.domain.Borrow}.
 */
@RestController
@RequestMapping("/api/borrows")
@Transactional
public class BorrowResource {

    private static final Logger LOG = LoggerFactory.getLogger(BorrowResource.class);

    private static final String ENTITY_NAME = "borrow";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BorrowRepository borrowRepository;
    private final BookRepository bookRepository; //repo dos livros

    public BorrowResource(BorrowRepository borrowRepository, BookRepository bookRepository) {
        this.borrowRepository = borrowRepository;
        this.bookRepository = bookRepository;
    }

    /**
     * {@code POST  /borrows} : Create a new borrow.
     *
     * @param borrow the borrow to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new borrow, or with status {@code 400 (Bad Request)} if the borrow has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Borrow> createBorrow(@Valid @RequestBody Borrow borrow) throws URISyntaxException {
        LOG.debug("REST request to save Borrow : {}", borrow);

        if (borrow.getId() != null) {
            throw new BadRequestAlertException("A new borrow cannot already have an ID", "borrow", "idexists");
        }

        // Verifica se o livro está associado ao empréstimo
        if (borrow.getBook() == null || borrow.getBook().getId() == null) {
            throw new BadRequestAlertException("O empréstimo deve estar associado a um livro válido", "borrow", "booknotfound");
        }

        Book book = bookRepository.findById(borrow.getBook().getId())
            .orElseThrow(() -> new BadRequestAlertException("Livro não encontrado", "book", "notfound"));

        // Verifica se há cópias disponíveis para o livro
        int availableCopies = book.getAvailableCopies();
        if (availableCopies > 0) {
            book.setAvailableCopies(availableCopies - 1); // Reduz uma cópia disponível
            bookRepository.save(book); // Atualiza o livro no banco de dados
        } else {
            throw new IllegalStateException("Não há cópias disponíveis para este livro");
        }

        // Salva o registro do empréstimo
        Borrow savedBorrow = borrowRepository.save(borrow);

        return ResponseEntity.created(new URI("/api/borrows/" + savedBorrow.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, "borrow", savedBorrow.getId().toString()))
            .body(savedBorrow);
    }

    /**
     * {@code PUT  /borrows/:id} : Updates an existing borrow.
     *
     * @param id the id of the borrow to save.
     * @param borrow the borrow to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated borrow,
     * or with status {@code 400 (Bad Request)} if the borrow is not valid,
     * or with status {@code 500 (Internal Server Error)} if the borrow couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Borrow> updateBorrow(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Borrow borrow
    ) throws URISyntaxException {
        LOG.debug("REST request to update Borrow : {}, {}", id, borrow);
        if (borrow.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, borrow.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!borrowRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        borrow = borrowRepository.save(borrow);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, borrow.getId().toString()))
            .body(borrow);
    }

    /**
     * {@code PATCH  /borrows/:id} : Partial updates given fields of an existing borrow, field will ignore if it is null
     *
     * @param id the id of the borrow to save.
     * @param borrow the borrow to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated borrow,
     * or with status {@code 400 (Bad Request)} if the borrow is not valid,
     * or with status {@code 404 (Not Found)} if the borrow is not found,
     * or with status {@code 500 (Internal Server Error)} if the borrow couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Borrow> partialUpdateBorrow(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Borrow borrow
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Borrow partially : {}, {}", id, borrow);
        if (borrow.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, borrow.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!borrowRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Borrow> result = borrowRepository
            .findById(borrow.getId())
            .map(existingBorrow -> {
                if (borrow.getBorrowDateTime() != null) {
                    existingBorrow.setBorrowDateTime(borrow.getBorrowDateTime());
                }
                if (borrow.getReturnDateTime() != null) {
                    existingBorrow.setReturnDateTime(borrow.getReturnDateTime());
                }

                return existingBorrow;
            })
            .map(borrowRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, borrow.getId().toString())
        );
    }

    /**
     * {@code GET  /borrows} : get all the borrows.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of borrows in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Borrow>> getAllBorrows(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of Borrows");
        Page<Borrow> page;
        if (SecurityUtils.hasCurrentUserAnyOfAuthorities(AuthoritiesConstants.ADMIN)) {
            if (eagerload) {
                page = borrowRepository.findAllWithEagerRelationshipsAdmin(pageable);
            } else {
                page = borrowRepository.findAll(pageable);
            }
        } else {
            if (eagerload) {
                page = borrowRepository.findAllWithEagerRelationships(pageable);
            } else {
                page = borrowRepository.findByUserIsCurrentUser(pageable);
            }
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /borrows/:id} : get the "id" borrow.
     *
     * @param id the id of the borrow to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the borrow, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Borrow> getBorrow(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Borrow : {}", id);
        Optional<Borrow> borrow = borrowRepository.findOneWithEagerRelationships(id);
        if (borrow.isPresent()) {
            borrow
                .filter(b -> b.getUser() != null &&
                    b.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse("")))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));
        }
        return ResponseUtil.wrapOrNotFound(borrow);
    }

    /**
     * {@code DELETE  /borrows/:id} : delete the "id" borrow.
     *
     * @param id the id of the borrow to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorrow(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Borrow : {}", id);
        borrowRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
