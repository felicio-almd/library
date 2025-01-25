package org.jhipster.library.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.jhipster.library.domain.BookCategoryAsserts.*;
import static org.jhipster.library.web.rest.TestUtil.createUpdateProxyForBean;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.jhipster.library.IntegrationTest;
import org.jhipster.library.domain.BookCategory;
import org.jhipster.library.repository.BookCategoryRepository;
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
 * Integration tests for the {@link BookCategoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BookCategoryResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/book-categories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private BookCategoryRepository bookCategoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBookCategoryMockMvc;

    private BookCategory bookCategory;

    private BookCategory insertedBookCategory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BookCategory createEntity() {
        return new BookCategory().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BookCategory createUpdatedEntity() {
        return new BookCategory().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
    }

    @BeforeEach
    public void initTest() {
        bookCategory = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedBookCategory != null) {
            bookCategoryRepository.delete(insertedBookCategory);
            insertedBookCategory = null;
        }
    }

    @Test
    @Transactional
    void createBookCategory() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the BookCategory
        var returnedBookCategory = om.readValue(
            restBookCategoryMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bookCategory)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            BookCategory.class
        );

        // Validate the BookCategory in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertBookCategoryUpdatableFieldsEquals(returnedBookCategory, getPersistedBookCategory(returnedBookCategory));

        insertedBookCategory = returnedBookCategory;
    }

    @Test
    @Transactional
    void createBookCategoryWithExistingId() throws Exception {
        // Create the BookCategory with an existing ID
        bookCategory.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBookCategoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bookCategory)))
            .andExpect(status().isBadRequest());

        // Validate the BookCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        bookCategory.setName(null);

        // Create the BookCategory, which fails.

        restBookCategoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bookCategory)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBookCategories() throws Exception {
        // Initialize the database
        insertedBookCategory = bookCategoryRepository.saveAndFlush(bookCategory);

        // Get all the bookCategoryList
        restBookCategoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bookCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getBookCategory() throws Exception {
        // Initialize the database
        insertedBookCategory = bookCategoryRepository.saveAndFlush(bookCategory);

        // Get the bookCategory
        restBookCategoryMockMvc
            .perform(get(ENTITY_API_URL_ID, bookCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bookCategory.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingBookCategory() throws Exception {
        // Get the bookCategory
        restBookCategoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBookCategory() throws Exception {
        // Initialize the database
        insertedBookCategory = bookCategoryRepository.saveAndFlush(bookCategory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bookCategory
        BookCategory updatedBookCategory = bookCategoryRepository.findById(bookCategory.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedBookCategory are not directly saved in db
        em.detach(updatedBookCategory);
        updatedBookCategory.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restBookCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBookCategory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedBookCategory))
            )
            .andExpect(status().isOk());

        // Validate the BookCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedBookCategoryToMatchAllProperties(updatedBookCategory);
    }

    @Test
    @Transactional
    void putNonExistingBookCategory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bookCategory.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bookCategory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(bookCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBookCategory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bookCategory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(bookCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBookCategory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bookCategory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookCategoryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bookCategory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BookCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBookCategoryWithPatch() throws Exception {
        // Initialize the database
        insertedBookCategory = bookCategoryRepository.saveAndFlush(bookCategory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bookCategory using partial update
        BookCategory partialUpdatedBookCategory = new BookCategory();
        partialUpdatedBookCategory.setId(bookCategory.getId());

        partialUpdatedBookCategory.name(UPDATED_NAME);

        restBookCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBookCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedBookCategory))
            )
            .andExpect(status().isOk());

        // Validate the BookCategory in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertBookCategoryUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedBookCategory, bookCategory),
            getPersistedBookCategory(bookCategory)
        );
    }

    @Test
    @Transactional
    void fullUpdateBookCategoryWithPatch() throws Exception {
        // Initialize the database
        insertedBookCategory = bookCategoryRepository.saveAndFlush(bookCategory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bookCategory using partial update
        BookCategory partialUpdatedBookCategory = new BookCategory();
        partialUpdatedBookCategory.setId(bookCategory.getId());

        partialUpdatedBookCategory.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restBookCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBookCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedBookCategory))
            )
            .andExpect(status().isOk());

        // Validate the BookCategory in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertBookCategoryUpdatableFieldsEquals(partialUpdatedBookCategory, getPersistedBookCategory(partialUpdatedBookCategory));
    }

    @Test
    @Transactional
    void patchNonExistingBookCategory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bookCategory.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bookCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(bookCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBookCategory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bookCategory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(bookCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBookCategory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bookCategory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookCategoryMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(bookCategory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BookCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBookCategory() throws Exception {
        // Initialize the database
        insertedBookCategory = bookCategoryRepository.saveAndFlush(bookCategory);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the bookCategory
        restBookCategoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, bookCategory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return bookCategoryRepository.count();
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

    protected BookCategory getPersistedBookCategory(BookCategory bookCategory) {
        return bookCategoryRepository.findById(bookCategory.getId()).orElseThrow();
    }

    protected void assertPersistedBookCategoryToMatchAllProperties(BookCategory expectedBookCategory) {
        assertBookCategoryAllPropertiesEquals(expectedBookCategory, getPersistedBookCategory(expectedBookCategory));
    }

    protected void assertPersistedBookCategoryToMatchUpdatableProperties(BookCategory expectedBookCategory) {
        assertBookCategoryAllUpdatablePropertiesEquals(expectedBookCategory, getPersistedBookCategory(expectedBookCategory));
    }
}
