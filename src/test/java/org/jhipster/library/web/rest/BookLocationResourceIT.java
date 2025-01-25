package org.jhipster.library.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.jhipster.library.domain.BookLocationAsserts.*;
import static org.jhipster.library.web.rest.TestUtil.createUpdateProxyForBean;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.jhipster.library.IntegrationTest;
import org.jhipster.library.domain.BookLocation;
import org.jhipster.library.repository.BookLocationRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BookLocationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BookLocationResourceIT {

    private static final String DEFAULT_AISLE = "AAAAAAAAAA";
    private static final String UPDATED_AISLE = "BBBBBBBBBB";

    private static final String DEFAULT_SHELF = "AAAAAAAAAA";
    private static final String UPDATED_SHELF = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/book-locations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private BookLocationRepository bookLocationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBookLocationMockMvc;

    private BookLocation bookLocation;

    private BookLocation insertedBookLocation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BookLocation createEntity() {
        return new BookLocation().aisle(DEFAULT_AISLE).shelf(DEFAULT_SHELF);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BookLocation createUpdatedEntity() {
        return new BookLocation().aisle(UPDATED_AISLE).shelf(UPDATED_SHELF);
    }

    @BeforeEach
    public void initTest() {
        bookLocation = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedBookLocation != null) {
            bookLocationRepository.delete(insertedBookLocation);
            insertedBookLocation = null;
        }
    }

    @Test
    @Transactional
    void createBookLocation() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the BookLocation
        var returnedBookLocation = om.readValue(
            restBookLocationMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bookLocation)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            BookLocation.class
        );

        // Validate the BookLocation in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertBookLocationUpdatableFieldsEquals(returnedBookLocation, getPersistedBookLocation(returnedBookLocation));

        insertedBookLocation = returnedBookLocation;
    }

    @Test
    @Transactional
    void createBookLocationWithExistingId() throws Exception {
        // Create the BookLocation with an existing ID
        bookLocation.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBookLocationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bookLocation)))
            .andExpect(status().isBadRequest());

        // Validate the BookLocation in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAisleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        bookLocation.setAisle(null);

        // Create the BookLocation, which fails.

        restBookLocationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bookLocation)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkShelfIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        bookLocation.setShelf(null);

        // Create the BookLocation, which fails.

        restBookLocationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bookLocation)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBookLocations() throws Exception {
        // Initialize the database
        insertedBookLocation = bookLocationRepository.saveAndFlush(bookLocation);

        // Get all the bookLocationList
        restBookLocationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bookLocation.getId().intValue())))
            .andExpect(jsonPath("$.[*].aisle").value(hasItem(DEFAULT_AISLE)))
            .andExpect(jsonPath("$.[*].shelf").value(hasItem(DEFAULT_SHELF)));
    }

    @Test
    @Transactional
    void getBookLocation() throws Exception {
        // Initialize the database
        insertedBookLocation = bookLocationRepository.saveAndFlush(bookLocation);

        // Get the bookLocation
        restBookLocationMockMvc
            .perform(get(ENTITY_API_URL_ID, bookLocation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bookLocation.getId().intValue()))
            .andExpect(jsonPath("$.aisle").value(DEFAULT_AISLE))
            .andExpect(jsonPath("$.shelf").value(DEFAULT_SHELF));
    }

    @Test
    @Transactional
    void getNonExistingBookLocation() throws Exception {
        // Get the bookLocation
        restBookLocationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBookLocation() throws Exception {
        // Initialize the database
        insertedBookLocation = bookLocationRepository.saveAndFlush(bookLocation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bookLocation
        BookLocation updatedBookLocation = bookLocationRepository.findById(bookLocation.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedBookLocation are not directly saved in db
        em.detach(updatedBookLocation);
        updatedBookLocation.aisle(UPDATED_AISLE).shelf(UPDATED_SHELF);

        restBookLocationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBookLocation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedBookLocation))
            )
            .andExpect(status().isOk());

        // Validate the BookLocation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedBookLocationToMatchAllProperties(updatedBookLocation);
    }

    @Test
    @Transactional
    void putNonExistingBookLocation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bookLocation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookLocationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bookLocation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(bookLocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookLocation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBookLocation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bookLocation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookLocationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(bookLocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookLocation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBookLocation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bookLocation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookLocationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bookLocation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BookLocation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBookLocationWithPatch() throws Exception {
        // Initialize the database
        insertedBookLocation = bookLocationRepository.saveAndFlush(bookLocation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bookLocation using partial update
        BookLocation partialUpdatedBookLocation = new BookLocation();
        partialUpdatedBookLocation.setId(bookLocation.getId());

        restBookLocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBookLocation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedBookLocation))
            )
            .andExpect(status().isOk());

        // Validate the BookLocation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertBookLocationUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedBookLocation, bookLocation),
            getPersistedBookLocation(bookLocation)
        );
    }

    @Test
    @Transactional
    void fullUpdateBookLocationWithPatch() throws Exception {
        // Initialize the database
        insertedBookLocation = bookLocationRepository.saveAndFlush(bookLocation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bookLocation using partial update
        BookLocation partialUpdatedBookLocation = new BookLocation();
        partialUpdatedBookLocation.setId(bookLocation.getId());

        partialUpdatedBookLocation.aisle(UPDATED_AISLE).shelf(UPDATED_SHELF);

        restBookLocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBookLocation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedBookLocation))
            )
            .andExpect(status().isOk());

        // Validate the BookLocation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertBookLocationUpdatableFieldsEquals(partialUpdatedBookLocation, getPersistedBookLocation(partialUpdatedBookLocation));
    }

    @Test
    @Transactional
    void patchNonExistingBookLocation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bookLocation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookLocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bookLocation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(bookLocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookLocation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBookLocation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bookLocation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookLocationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(bookLocation))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookLocation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBookLocation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bookLocation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookLocationMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(bookLocation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BookLocation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBookLocation() throws Exception {
        // Initialize the database
        insertedBookLocation = bookLocationRepository.saveAndFlush(bookLocation);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the bookLocation
        restBookLocationMockMvc
            .perform(delete(ENTITY_API_URL_ID, bookLocation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return bookLocationRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected BookLocation getPersistedBookLocation(BookLocation bookLocation) {
        return bookLocationRepository.findById(bookLocation.getId()).orElseThrow();
    }

    protected void assertPersistedBookLocationToMatchAllProperties(BookLocation expectedBookLocation) {
        assertBookLocationAllPropertiesEquals(expectedBookLocation, getPersistedBookLocation(expectedBookLocation));
    }

    protected void assertPersistedBookLocationToMatchUpdatableProperties(BookLocation expectedBookLocation) {
        assertBookLocationAllUpdatablePropertiesEquals(expectedBookLocation, getPersistedBookLocation(expectedBookLocation));
    }
}
