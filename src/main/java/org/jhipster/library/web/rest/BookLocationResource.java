package org.jhipster.library.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.jhipster.library.domain.BookLocation;
import org.jhipster.library.repository.BookLocationRepository;
import org.jhipster.library.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.jhipster.library.domain.BookLocation}.
 */
@RestController
@RequestMapping("/api/book-locations")
@Transactional
public class BookLocationResource {

    private static final Logger LOG = LoggerFactory.getLogger(BookLocationResource.class);

    private static final String ENTITY_NAME = "bookLocation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookLocationRepository bookLocationRepository;

    public BookLocationResource(BookLocationRepository bookLocationRepository) {
        this.bookLocationRepository = bookLocationRepository;
    }

    /**
     * {@code POST  /book-locations} : Create a new bookLocation.
     *
     * @param bookLocation the bookLocation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bookLocation, or with status {@code 400 (Bad Request)} if the bookLocation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BookLocation> createBookLocation(@Valid @RequestBody BookLocation bookLocation) throws URISyntaxException {
        LOG.debug("REST request to save BookLocation : {}", bookLocation);
        if (bookLocation.getId() != null) {
            throw new BadRequestAlertException("A new bookLocation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        bookLocation = bookLocationRepository.save(bookLocation);
        return ResponseEntity.created(new URI("/api/book-locations/" + bookLocation.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, bookLocation.getId().toString()))
            .body(bookLocation);
    }

    /**
     * {@code PUT  /book-locations/:id} : Updates an existing bookLocation.
     *
     * @param id the id of the bookLocation to save.
     * @param bookLocation the bookLocation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookLocation,
     * or with status {@code 400 (Bad Request)} if the bookLocation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bookLocation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BookLocation> updateBookLocation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BookLocation bookLocation
    ) throws URISyntaxException {
        LOG.debug("REST request to update BookLocation : {}, {}", id, bookLocation);
        if (bookLocation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bookLocation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookLocationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        bookLocation = bookLocationRepository.save(bookLocation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookLocation.getId().toString()))
            .body(bookLocation);
    }

    /**
     * {@code PATCH  /book-locations/:id} : Partial updates given fields of an existing bookLocation, field will ignore if it is null
     *
     * @param id the id of the bookLocation to save.
     * @param bookLocation the bookLocation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookLocation,
     * or with status {@code 400 (Bad Request)} if the bookLocation is not valid,
     * or with status {@code 404 (Not Found)} if the bookLocation is not found,
     * or with status {@code 500 (Internal Server Error)} if the bookLocation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BookLocation> partialUpdateBookLocation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BookLocation bookLocation
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update BookLocation partially : {}, {}", id, bookLocation);
        if (bookLocation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bookLocation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookLocationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BookLocation> result = bookLocationRepository
            .findById(bookLocation.getId())
            .map(existingBookLocation -> {
                if (bookLocation.getAisle() != null) {
                    existingBookLocation.setAisle(bookLocation.getAisle());
                }
                if (bookLocation.getShelf() != null) {
                    existingBookLocation.setShelf(bookLocation.getShelf());
                }

                return existingBookLocation;
            })
            .map(bookLocationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bookLocation.getId().toString())
        );
    }

    /**
     * {@code GET  /book-locations} : get all the bookLocations.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bookLocations in body.
     */
    @GetMapping("")
    public ResponseEntity<List<BookLocation>> getAllBookLocations(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "filter", required = false) String filter
    ) {
        if ("book-is-null".equals(filter)) {
            LOG.debug("REST request to get all BookLocations where book is null");
            return new ResponseEntity<>(
                StreamSupport.stream(bookLocationRepository.findAll().spliterator(), false)
                    .filter(bookLocation -> bookLocation.getBook() == null)
                    .toList(),
                HttpStatus.OK
            );
        }
        LOG.debug("REST request to get a page of BookLocations");
        Page<BookLocation> page = bookLocationRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /book-locations/:id} : get the "id" bookLocation.
     *
     * @param id the id of the bookLocation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bookLocation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookLocation> getBookLocation(@PathVariable("id") Long id) {
        LOG.debug("REST request to get BookLocation : {}", id);
        Optional<BookLocation> bookLocation = bookLocationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bookLocation);
    }

    /**
     * {@code DELETE  /book-locations/:id} : delete the "id" bookLocation.
     *
     * @param id the id of the bookLocation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteBookLocation(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete BookLocation : {}", id);
        bookLocationRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
