<template>
    <div class="reviews">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Reviews & Ratings</h1>
        <div class="header-actions">
          <button class="btn-secondary" @click="exportReviews">
            <i class="fas fa-download"></i> Export
          </button>
          <button class="btn-primary" @click="respondToReviews">
            <i class="fas fa-reply"></i> Respond to All
          </button>
        </div>
      </div>

      <!-- Stats Banner -->
      <div class="stats-banner">
        <div class="stat-item">
          <span class="stat-label">Overall Rating:</span>
          <span class="stat-value">{{ overallRating }} <i class="fas fa-star"></i></span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Reviews:</span>
          <span class="stat-value">{{ totalReviews }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Positive:</span>
          <span class="stat-value positive">{{ positivePercentage }}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Response Rate:</span>
          <span class="stat-value">{{ responseRate }}%</span>
        </div>
      </div>

      <!-- Rating Distribution -->
      <div class="rating-distribution">
        <h3>Rating Distribution</h3>
        <div class="distribution-grid">
          <div class="distribution-chart">
            <div v-for="rating in ratingDistribution" :key="rating.stars" class="rating-row">
              <div class="rating-info">
                <span class="rating-stars">
                  <i v-for="star in 5" :key="star" class="fas fa-star" :class="{ filled: star <= rating.stars }"></i>
                </span>
                <span class="rating-count">{{ rating.count }} reviews</span>
              </div>
              <div class="rating-bar">
                <div class="rating-fill" :style="{ width: getPercentage(rating.count) + '%' }"></div>
              </div>
              <div class="rating-percentage">{{ Math.round((rating.count / totalReviews) * 100) }}%</div>
            </div>
          </div>
          
          <div class="distribution-summary">
            <div class="summary-item">
              <span class="summary-label">Average Rating</span>
              <span class="summary-value">{{ overallRating }}/5.0</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">5 Star</span>
              <span class="summary-value">{{ ratingDistribution[4]?.count || 0 }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">4 Star</span>
              <span class="summary-value">{{ ratingDistribution[3]?.count || 0 }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">3 Star</span>
              <span class="summary-value">{{ ratingDistribution[2]?.count || 0 }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">2 Star</span>
              <span class="summary-value">{{ ratingDistribution[1]?.count || 0 }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">1 Star</span>
              <span class="summary-value">{{ ratingDistribution[0]?.count || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filter-group">
          <select v-model="selectedRating" class="filter-select" @change="filterReviews">
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          
          <select v-model="selectedStatus" class="filter-select" @change="filterReviews">
            <option value="all">All Reviews</option>
            <option value="responded">Responded</option>
            <option value="unresponded">Unresponded</option>
          </select>
          
          <select v-model="selectedSort" class="filter-select" @change="sortReviews">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
        
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search reviews..." 
            class="search-input"
            @input="searchReviews"
          >
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="reviews-section">
        <div v-if="filteredReviews.length === 0" class="empty-state">
          <i class="fas fa-star-half-alt"></i>
          <h3>No reviews found</h3>
          <p>No reviews match your current filters.</p>
        </div>

        <div 
          v-for="review in paginatedReviews" 
          :key="review.id" 
          class="review-card"
          :class="{ unresponded: !review.responded }"
        >
          <!-- Review Header -->
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">
                {{ getInitials(review.customer.name) }}
              </div>
              <div class="reviewer-details">
                <div class="reviewer-name">{{ review.customer.name }}</div>
                <div class="reviewer-location">{{ review.customer.location }}</div>
                <div class="reviewer-order">Order #{{ review.orderId }}</div>
              </div>
            </div>
            
            <div class="review-meta">
              <div class="review-rating">
                <div class="stars">
                  <i v-for="star in 5" :key="star" class="fas fa-star" :class="{ filled: star <= review.rating }"></i>
                </div>
                <span class="rating-value">{{ review.rating }}/5</span>
              </div>
              <div class="review-date">{{ formatDate(review.date) }}</div>
              <span class="review-status" :class="{ responded: review.responded }">
                {{ review.responded ? 'Responded' : 'Unresponded' }}
              </span>
            </div>
          </div>

          <!-- Review Content -->
          <div class="review-content">
            <div class="review-title">{{ review.title }}</div>
            <div class="review-text">{{ review.text }}</div>
            
            <div v-if="review.product" class="review-product">
              <img :src="review.product.image" :alt="review.product.name" class="product-image">
              <div class="product-info">
                <div class="product-name">{{ review.product.name }}</div>
                <div class="product-variant">{{ review.product.variant }}</div>
              </div>
            </div>
          </div>

          <!-- Review Tags -->
          <div v-if="review.tags.length > 0" class="review-tags">
            <span v-for="tag in review.tags" :key="tag" class="review-tag">{{ tag }}</span>
          </div>

          <!-- Review Response -->
          <div v-if="review.response" class="review-response">
            <div class="response-header">
              <span class="response-label">Seller Response</span>
              <span class="response-date">{{ formatDate(review.responseDate) }}</span>
            </div>
            <div class="response-text">{{ review.response }}</div>
          </div>

          <!-- Review Actions -->
          <div class="review-actions">
            <button class="btn-respond" @click="respondToReview(review)" :disabled="review.responded">
              <i class="fas fa-reply"></i> {{ review.responded ? 'View Response' : 'Respond' }}
            </button>
            <button class="btn-helpful" @click="markHelpful(review)">
              <i class="fas fa-thumbs-up"></i> Helpful ({{ review.helpfulCount }})
            </button>
            <button class="btn-flag" @click="flagReview(review)">
              <i class="fas fa-flag"></i> Flag
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          Previous
        </button>
        <div class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          Next
        </button>
      </div>

      <!-- Review Analytics -->
      <div class="analytics-section">
        <h3>Review Analytics</h3>
        <div class="analytics-grid">
          <div class="analytics-card">
            <div class="analytics-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="analytics-content">
              <div class="analytics-title">Rating Trend</div>
              <div class="analytics-value">{{ ratingTrend }}%</div>
              <div class="analytics-change" :class="ratingTrendChange >= 0 ? 'positive' : 'negative'">
                {{ ratingTrendChange >= 0 ? '+' : '' }}{{ ratingTrendChange }}% vs last month
              </div>
            </div>
          </div>
          
          <div class="analytics-card">
            <div class="analytics-icon">
              <i class="fas fa-comments"></i>
            </div>
            <div class="analytics-content">
              <div class="analytics-title">Review Volume</div>
              <div class="analytics-value">{{ reviewVolume }}</div>
              <div class="analytics-change positive">
                {{ reviewGrowth }}% growth
              </div>
            </div>
          </div>
          
          <div class="analytics-card">
            <div class="analytics-icon">
              <i class="fas fa-heart"></i>
            </div>
            <div class="analytics-content">
              <div class="analytics-title">Customer Satisfaction</div>
              <div class="analytics-value">{{ satisfactionScore }}%</div>
              <div class="analytics-change" :class="satisfactionChange >= 0 ? 'positive' : 'negative'">
                {{ satisfactionChange >= 0 ? '+' : '' }}{{ satisfactionChange }}% satisfaction
              </div>
            </div>
          </div>
          
          <div class="analytics-card">
            <div class="analytics-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="analytics-content">
              <div class="analytics-title">Avg Response Time</div>
              <div class="analytics-value">{{ avgResponseTime }} hours</div>
              <div class="analytics-change positive">
                {{ responseTimeImprovement }}% faster
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Review Response Modal -->
      <div v-if="showResponseModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3>Respond to Review</h3>
            <button class="btn-close" @click="closeResponseModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-content">
            <div class="review-preview">
              <div class="reviewer-name">{{ selectedReview?.customer.name }}</div>
              <div class="review-rating">
                <div class="stars">
                  <i v-for="star in 5" :key="star" class="fas fa-star" :class="{ filled: star <= selectedReview?.rating }"></i>
                </div>
                <span>{{ selectedReview?.rating }}/5</span>
              </div>
              <div class="review-title">{{ selectedReview?.title }}</div>
              <div class="review-text">{{ selectedReview?.text }}</div>
            </div>
            
            <div class="response-form">
              <label for="response-text">Your Response</label>
              <textarea 
                id="response-text"
                v-model="responseText"
                placeholder="Write your response to this review..."
                class="response-textarea"
              ></textarea>
              <div class="response-actions">
                <button class="btn-secondary" @click="closeResponseModal">Cancel</button>
                <button class="btn-primary" @click="submitResponse">Submit Response</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import SellerLayout from '@/Components/SellerLayout.vue'

export default {
  name: 'Reviews',
  components: {
    SellerLayout
  },
  setup() {
    const searchQuery = ref('')
    const selectedRating = ref('all')
    const selectedStatus = ref('all')
    const selectedSort = ref('newest')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const showResponseModal = ref(false)
    const selectedReview = ref(null)
    const responseText = ref('')

    // Mock review data
    const reviews = ref([
      {
        id: 1,
        customer: {
          name: 'Maria Santos',
          location: 'Manila, Philippines'
        },
        orderId: 'ORD-2024-001',
        rating: 5,
        title: 'Excellent Quality and Fast Delivery!',
        text: 'I absolutely love the handwoven abaca bag I purchased! The quality is outstanding and the craftsmanship is beautiful. It arrived earlier than expected and was well-packaged. Will definitely buy from this seller again.',
        tags: ['Quality', 'Fast Delivery', 'Recommended'],
        product: {
          name: 'Handwoven Abaca Bag',
          variant: 'Large, Natural',
          image: '/images/products/bag1.jpg'
        },
        date: '2024-01-15T10:30:00',
        responded: true,
        response: 'Thank you for your wonderful review, Maria! We are so happy to hear that you love your abaca bag. Our artisans put a lot of care into each piece, and we are thrilled that it met your expectations. We look forward to serving you again!',
        responseDate: '2024-01-16T14:20:00',
        helpfulCount: 12
      },
      {
        id: 2,
        customer: {
          name: 'Juan Dela Cruz',
          location: 'Cebu, Philippines'
        },
        orderId: 'ORD-2024-002',
        rating: 4,
        title: 'Good Product with Minor Issues',
        text: 'The traditional weaving set is beautiful and well-made. However, one of the smaller pieces was slightly damaged during shipping. The seller was very responsive and offered to send a replacement, which I appreciate.',
        tags: ['Good Quality', 'Responsive Seller', 'Shipping Issue'],
        product: {
          name: 'Traditional Weaving Set',
          variant: 'Standard',
          image: '/images/products/weaving1.jpg'
        },
        date: '2024-01-14T14:20:00',
        responded: true,
        response: 'Thank you for your feedback, Juan. We apologize for the shipping damage and are glad we could resolve this quickly for you. We always strive to ensure our products arrive in perfect condition.',
        responseDate: '2024-01-15T09:45:00',
        helpfulCount: 8
      },
      {
        id: 3,
        customer: {
          name: 'Ana Reyes',
          location: 'Davao, Philippines'
        },
        orderId: 'ORD-2024-003',
        rating: 3,
        title: 'Average Quality for the Price',
        text: 'The bamboo home decor set is okay, but not exceptional for the price point. The craftsmanship is decent, but some pieces have minor imperfections. Delivery was on time though.',
        tags: ['Average', 'Minor Issues', 'On Time Delivery'],
        product: {
          name: 'Bamboo Home Decor',
          variant: 'Set of 3',
          image: '/images/products/decor1.jpg'
        },
        date: '2024-01-13T16:45:00',
        responded: false,
        helpfulCount: 3
      },
      {
        id: 4,
        customer: {
          name: 'Pedro Gomez',
          location: 'Baguio, Philippines'
        },
        orderId: 'ORD-2024-004',
        rating: 5,
        title: 'Outstanding Craftsmanship!',
        text: 'This is my second purchase from this seller and once again, I am thoroughly impressed. The handmade pottery set is not only beautiful but also functional. Every piece is unique and full of character. Highly recommended!',
        tags: ['Outstanding', 'Repeat Customer', 'Functional'],
        product: {
          name: 'Handmade Pottery Set',
          variant: 'Complete Set',
          image: '/images/products/pottery1.jpg'
        },
        date: '2024-01-12T09:15:00',
        responded: true,
        response: 'Thank you so much, Pedro! We are honored to have you as a repeat customer. Our potters will be thrilled to hear your kind words. We look forward to your next visit to our shop!',
        responseDate: '2024-01-12T15:30:00',
        helpfulCount: 15
      },
      {
        id: 5,
        customer: {
          name: 'Liza Cruz',
          location: 'Iloilo, Philippines'
        },
        orderId: 'ORD-2024-005',
        rating: 2,
        title: 'Not as Expected',
        text: 'I was disappointed with the wooden spoon set. The wood quality is not as described and some spoons have rough edges. The packaging was also not very secure, which may have contributed to the damage.',
        tags: ['Disappointed', 'Quality Issue', 'Packaging'],
        product: {
          name: 'Wooden Spoon Set',
          variant: '5-piece',
          image: '/images/products/spoon1.jpg'
        },
        date: '2024-01-11T11:30:00',
        responded: false,
        helpfulCount: 2
      }
    ])

    const filteredReviews = computed(() => {
      let filtered = reviews.value

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(review => 
          review.title.toLowerCase().includes(query) ||
          review.text.toLowerCase().includes(query) ||
          review.customer.name.toLowerCase().includes(query) ||
          review.product.name.toLowerCase().includes(query)
        )
      }

      // Rating filter
      if (selectedRating.value !== 'all') {
        filtered = filtered.filter(review => review.rating === parseInt(selectedRating.value))
      }

      // Status filter
      if (selectedStatus.value !== 'all') {
        filtered = filtered.filter(review => {
          if (selectedStatus.value === 'responded') {
            return review.responded
          } else {
            return !review.responded
          }
        })
      }

      // Sort
      filtered.sort((a, b) => {
        switch (selectedSort.value) {
          case 'newest':
            return new Date(b.date) - new Date(a.date)
          case 'oldest':
            return new Date(a.date) - new Date(b.date)
          case 'highest':
            return b.rating - a.rating
          case 'lowest':
            return a.rating - b.rating
          default:
            return 0
        }
      })

      return filtered
    })

    const paginatedReviews = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredReviews.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredReviews.value.length / itemsPerPage)
    })

    const totalReviews = computed(() => reviews.value.length)
    const overallRating = computed(() => {
      const totalRating = reviews.value.reduce((total, review) => total + review.rating, 0)
      return reviews.value.length > 0 ? (totalRating / reviews.value.length).toFixed(1) : 0
    })
    const positivePercentage = computed(() => {
      const positiveReviews = reviews.value.filter(r => r.rating >= 4).length
      return totalReviews.value > 0 ? Math.round((positiveReviews / totalReviews.value) * 100) : 0
    })
    const responseRate = computed(() => {
      const respondedReviews = reviews.value.filter(r => r.responded).length
      return totalReviews.value > 0 ? Math.round((respondedReviews / totalReviews.value) * 100) : 0
    })

    const ratingDistribution = computed(() => {
      const distribution = [
        { stars: 1, count: 0 },
        { stars: 2, count: 0 },
        { stars: 3, count: 0 },
        { stars: 4, count: 0 },
        { stars: 5, count: 0 }
      ]
      
      reviews.value.forEach(review => {
        distribution[review.rating - 1].count++
      })
      
      return distribution
    })

    const ratingTrend = computed(() => 85)
    const ratingTrendChange = computed(() => 2.5)
    const reviewVolume = computed(() => 24)
    const reviewGrowth = computed(() => 15.6)
    const satisfactionScore = computed(() => 87)
    const satisfactionChange = computed(() => 3.2)
    const avgResponseTime = computed(() => 4.5)
    const responseTimeImprovement = computed(() => 12.8)

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getInitials = (name) => {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    const getPercentage = (count) => {
      return totalReviews.value > 0 ? (count / totalReviews.value) * 100 : 0
    }

    const filterReviews = () => {
      currentPage.value = 1
    }

    const searchReviews = () => {
      currentPage.value = 1
    }

    const sortReviews = () => {
      // Sorting is handled in computed property
    }

    const changePage = (page) => {
      currentPage.value = page
    }

    const respondToReview = (review) => {
      selectedReview.value = review
      responseText.value = review.responded ? review.response : ''
      showResponseModal.value = true
    }

    const closeResponseModal = () => {
      showResponseModal.value = false
      selectedReview.value = null
      responseText.value = ''
    }

    const submitResponse = () => {
      if (selectedReview.value && responseText.value.trim()) {
        selectedReview.value.response = responseText.value
        selectedReview.value.responded = true
        selectedReview.value.responseDate = new Date().toISOString()
        closeResponseModal()
        alert('Response submitted successfully!')
      }
    }

    const respondToReviews = () => {
      const unrespondedReviews = reviews.value.filter(r => !r.responded)
      if (unrespondedReviews.length > 0) {
        alert(`Responding to ${unrespondedReviews.length} unresponded reviews...`)
      } else {
        alert('All reviews have been responded to!')
      }
    }

    const markHelpful = (review) => {
      review.helpfulCount++
      alert('Marked as helpful!')
    }

    const flagReview = (review) => {
      alert(`Flagging review from ${review.customer.name}...`)
    }

    const exportReviews = () => {
      alert('Exporting reviews...')
    }

    return {
      searchQuery,
      selectedRating,
      selectedStatus,
      selectedSort,
      currentPage,
      showResponseModal,
      selectedReview,
      responseText,
      reviews,
      filteredReviews,
      paginatedReviews,
      totalPages,
      totalReviews,
      overallRating,
      positivePercentage,
      responseRate,
      ratingDistribution,
      ratingTrend,
      ratingTrendChange,
      reviewVolume,
      reviewGrowth,
      satisfactionScore,
      satisfactionChange,
      avgResponseTime,
      responseTimeImprovement,
      formatCurrency,
      formatDate,
      getInitials,
      getPercentage,
      filterReviews,
      searchReviews,
      sortReviews,
      changePage,
      respondToReview,
      closeResponseModal,
      submitResponse,
      respondToReviews,
      markHelpful,
      flagReview,
      exportReviews
    }
  }
}
</script>

<style scoped>
.reviews {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.stats-banner {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-value i {
  color: #f59e0b;
  margin-left: 0.5rem;
}

.stat-value.positive {
  color: #10b981;
}

.rating-distribution h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.distribution-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.distribution-chart {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.rating-row:last-child {
  margin-bottom: 0;
}

.rating-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.rating-stars {
  display: flex;
  gap: 0.25rem;
}

.rating-stars .fas {
  font-size: 1rem;
  color: #f59e0b;
}

.rating-stars .filled {
  color: #f59e0b;
}

.rating-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.rating-bar {
  flex: 1;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.rating-percentage {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  width: 40px;
  text-align: right;
}

.distribution-summary {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.summary-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.summary-value {
  font-weight: 600;
  color: #1f2937;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.search-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.reviews-section {
  margin-bottom: 3rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #9ca3af;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.review-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.2s;
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.review-card.unresponded {
  border-left: 4px solid #f59e0b;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.reviewer-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.reviewer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.reviewer-name {
  font-weight: 600;
  color: #1f2937;
}

.reviewer-location {
  font-size: 0.875rem;
  color: #6b7280;
}

.reviewer-order {
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  display: inline-block;
  width: fit-content;
}

.review-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
  gap: 0.125rem;
}

.stars .fas {
  font-size: 1rem;
  color: #f59e0b;
}

.stars .filled {
  color: #f59e0b;
}

.rating-value {
  font-weight: 600;
  color: #1f2937;
}

.review-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.review-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
}

.review-status.responded {
  background-color: #d1fae5;
  color: #065f46;
}

.review-status.unresponded {
  background-color: #fef3c7;
  color: #92400e;
}

.review-content {
  margin-bottom: 1rem;
}

.review-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.review-text {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.review-product {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-name {
  font-weight: 600;
  color: #1f2937;
}

.product-variant {
  font-size: 0.875rem;
  color: #6b7280;
}

.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.review-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  color: #374151;
}

.review-response {
  background-color: #f0f9ff;
  border-left: 4px solid #3b82f6;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.response-label {
  font-weight: 600;
  color: #1f2937;
}

.response-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.response-text {
  color: #374151;
  line-height: 1.6;
}

.review-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-respond,
.btn-helpful,
.btn-flag {
  background-color: #6b7280;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-respond:hover {
  background-color: #4b5563;
}

.btn-helpful:hover {
  background-color: #10b981;
}

.btn-flag:hover {
  background-color: #ef4444;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  border-top: 1px solid #f3f4f6;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.analytics-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.analytics-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.analytics-icon {
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  background-color: #3b82f6;
}

.analytics-content {
  flex: 1;
}

.analytics-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.analytics-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.analytics-change {
  font-size: 0.75rem;
  font-weight: 600;
}

.analytics-change.positive { color: #10b981; }
.analytics-change.negative { color: #ef4444; }

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  padding: 0;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.btn-close:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-content {
  padding: 1.5rem;
}

.review-preview {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.reviewer-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.review-rating .stars {
  display: flex;
  gap: 0.125rem;
}

.review-rating .stars .fas {
  font-size: 1rem;
  color: #f59e0b;
}

.review-rating .stars .filled {
  color: #f59e0b;
}

.review-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.review-text {
  color: #374151;
  line-height: 1.6;
}

.response-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.response-form label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.response-textarea {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.2s;
}

.response-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.response-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-container {
    width: 100%;
  }
  
  .distribution-grid {
    grid-template-columns: 1fr;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .review-product {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .analytics-grid {
    grid-template-columns: 1fr;
  }
}
</style>