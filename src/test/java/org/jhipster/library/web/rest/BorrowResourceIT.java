package org.jhipster.library.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.jhipster.library.domain.BorrowAsserts.*;
import static org.jhipster.library.web.rest.TestUtil.createUpdateProxyForBean;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.jhipster.library.IntegrationTest;
import org.jhipster.library.domain.Borrow;
import org.jhipster.library.repository.BorrowRepository;
import org.jhipster.library.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BorrowResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class BorrowResourceIT {

    private static final Instant DEFAULT_BORROW_DATE_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_BORROW_DATE_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_RETURN_DATE_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_RETURN_DATE_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/borrows";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private BorrowRepository borrowRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBorrowMockMvc;

    private Borrow borrow;

    private Borrow insertedBorrow;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Borrow createEntity() {
        return new Borrow().borrowDateTime(DEFAULT_BORROW_DATE_TIME).returnDateTime(DEFAULT_RETURN_DATE_TIME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Borrow createUpdatedEntity() {
        return new Borrow().borrowDateTime(UPDATED_BORROW_DATE_TIME).returnDateTime(UPDATED_RETURN_DATE_TIME);
    }

    @BeforeEach
    public void initTest() {
        borrow = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedBorrow != null) {
            borrowRepository.delete(insertedBorrow);
            insertedBorrow = null;
        }
    }

    @Test
    @Transactional
    void createBorrow() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Borrow
        var returnedBorrow = om.readValue(
            restBorrowMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(borrow)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Borrow.class
        );

        // Validate the Borrow in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertBorrowUpdatableFieldsEquals(returnedBorrow, getPersistedBorrow(returnedBorrow));

        insertedBorrow = returnedBorrow;
    }

    @Test
    @Transactional
    void createBorrowWithExistingId() throws Exception {
        // Create the Borrow with an existing ID
        borrow.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBorrowMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(borrow)))
            .andExpect(status().isBadRequest());

        // Validate the Borrow in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkBorrowDateTimeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        borrow.setBorrowDateTime(null);

        // Create the Borrow, which fails.

        restBorrowMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(borrow)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBorrows() throws Exception {
        // Initialize the database
        insertedBorrow = borrowRepository.saveAndFlush(borrow);

        // Get all the borrowList
        restBorrowMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(borrow.getId().intValue())))
            .andExpect(jsonPath("$.[*].borrowDateTime").value(hasItem(DEFAULT_BORROW_DATE_TIME.toString())))
            .andExpect(jsonPath("$.[*].returnDateTime").value(hasItem(DEFAULT_RETURN_DATE_TIME.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBorrowsWithEagerRelationshipsIsEnabled() throws Exception {
        when(borrowRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBorrowMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(borrowRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBorrowsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(borrowRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBorrowMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(borrowRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getBorrow() throws Exception {
        // Initialize the database
        insertedBorrow = borrowRepository.saveAndFlush(borrow);

        // Get the borrow
        restBorrowMockMvc
            .perform(get(ENTITY_API_URL_ID, borrow.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(borrow.getId().intValue()))
            .andExpect(jsonPath("$.borrowDateTime").value(DEFAULT_BORROW_DATE_TIME.toString()))
            .andExpect(jsonPath("$.returnDateTime").value(DEFAULT_RETURN_DATE_TIME.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBorrow() throws Exception {
        // Get the borrow
        restBorrowMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBorrow() throws Exception {
        // Initialize the database
        insertedBorrow = borrowRepository.saveAndFlush(borrow);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the borrow
        Borrow updatedBorrow = borrowRepository.findById(borrow.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedBorrow are not directly saved in db
        em.detach(updatedBorrow);
        updatedBorrow.borrowDateTime(UPDATED_BORROW_DATE_TIME).returnDateTime(UPDATED_RETURN_DATE_TIME);

        restBorrowMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBorrow.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedBorrow))
            )
            .andExpect(status().isOk());

        // Validate the Borrow in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedBorrowToMatchAllProperties(updatedBorrow);
    }

    @Test
    @Transactional
    void putNonExistingBorrow() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        borrow.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBorrowMockMvc
            .perform(put(ENTITY_API_URL_ID, borrow.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(borrow)))
            .andExpect(status().isBadRequest());

        // Validate the Borrow in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBorrow() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        borrow.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBorrowMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(borrow))
            )
            .andExpect(status().isBadRequest());

        // Validate the Borrow in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBorrow() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        borrow.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBorrowMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(borrow)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Borrow in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBorrowWithPatch() throws Exception {
        // Initialize the database
        insertedBorrow = borrowRepository.saveAndFlush(borrow);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the borrow using partial update
        Borrow partialUpdatedBorrow = new Borrow();
        partialUpdatedBorrow.setId(borrow.getId());

        partialUpdatedBorrow.returnDateTime(UPDATED_RETURN_DATE_TIME);

        restBorrowMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBorrow.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedBorrow))
            )
            .andExpect(status().isOk());

        // Validate the Borrow in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertBorrowUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedBorrow, borrow), getPersistedBorrow(borrow));
    }

    @Test
    @Transactional
    void fullUpdateBorrowWithPatch() throws Exception {
        // Initialize the database
        insertedBorrow = borrowRepository.saveAndFlush(borrow);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the borrow using partial update
        Borrow partialUpdatedBorrow = new Borrow();
        partialUpdatedBorrow.setId(borrow.getId());

        partialUpdatedBorrow.borrowDateTime(UPDATED_BORROW_DATE_TIME).returnDateTime(UPDATED_RETURN_DATE_TIME);

        restBorrowMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBorrow.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedBorrow))
            )
            .andExpect(status().isOk());

        // Validate the Borrow in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertBorrowUpdatableFieldsEquals(partialUpdatedBorrow, getPersistedBorrow(partialUpdatedBorrow));
    }

    @Test
    @Transactional
    void patchNonExistingBorrow() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        borrow.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBorrowMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, borrow.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(borrow))
            )
            .andExpect(status().isBadRequest());

        // Validate the Borrow in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBorrow() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        borrow.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBorrowMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(borrow))
            )
            .andExpect(status().isBadRequest());

        // Validate the Borrow in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBorrow() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        borrow.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBorrowMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(borrow)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Borrow in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBorrow() throws Exception {
        // Initialize the database
        insertedBorrow = borrowRepository.saveAndFlush(borrow);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the borrow
        restBorrowMockMvc
            .perform(delete(ENTITY_API_URL_ID, borrow.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return borrowRepository.count();
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

    protected Borrow getPersistedBorrow(Borrow borrow) {
        return borrowRepository.findById(borrow.getId()).orElseThrow();
    }

    protected void assertPersistedBorrowToMatchAllProperties(Borrow expectedBorrow) {
        assertBorrowAllPropertiesEquals(expectedBorrow, getPersistedBorrow(expectedBorrow));
    }

    protected void assertPersistedBorrowToMatchUpdatableProperties(Borrow expectedBorrow) {
        assertBorrowAllUpdatablePropertiesEquals(expectedBorrow, getPersistedBorrow(expectedBorrow));
    }
}
