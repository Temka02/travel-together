<template>
  <div class="edit-trip">
    <section class="hero-section">
      <h1>Редактирование поездки</h1>
      <p>Изменение информации о путешествии</p>
    </section>

    <div class="edit-container">
      <form class="trip-form" @submit.prevent="handleUpdateTrip">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="loading" class="loading-message">
          Загрузка данных поездки...
        </div>

        <div v-else-if="!trip" class="no-trip-message">
          Поездка не найдена
        </div>

        <div v-else>
          <div class="form-section">
            <h3 class="section-title">Основная информация</h3>
            
            <div class="form-group">
              <label for="title">Название поездки *</label>
              <input
                v-model="tripData.title"
                type="text"
                id="title"
                placeholder="Например: Горный поход на Кавказ"
                required
                maxlength="100"
              >
              <small class="hint">{{ tripData.title.length }}/100 символов</small>
            </div>

            <div class="form-group">
              <label for="destination">Направление (куда едем) *</label>
              <input
                v-model="tripData.destination"
                type="text"
                id="destination"
                placeholder="Например: Кавказские горы, Россия"
                required
              >
            </div>

            <div class="form-group">
              <label for="description">Описание поездки *</label>
              <textarea
                v-model="tripData.description"
                id="description"
                rows="4"
                placeholder="Расскажите о вашем путешествии, что ждет участников..."
                required
                maxlength="1000"
              ></textarea>
              <small class="hint">{{ tripData.description.length }}/1000 символов</small>
            </div>

            <div class="form-group">
              <label for="maxParticipants">Макс. участников *</label>
              <input
                v-model="tripData.maxParticipants"
                type="number"
                id="maxParticipants"
                min="1"
                max="50"
                required
                placeholder="Сколько человек?"
              >
              <small class="hint">
                Текущее количество участников: {{ trip.participants?.length || 0 }}
              </small>
            </div>

            <div class="readonly-info">
              <p><strong>Организатор:</strong> {{ trip.createdBy?.firstName }} {{ trip.createdBy?.lastName }}</p>
              <p><strong>Статус:</strong> {{ getStatusLabel(trip.status) }}</p>
              <p><strong>Участников:</strong> {{ trip.participants?.length || 0 }} из {{ trip.maxParticipants }}</p>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Даты и бюджет</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="startDate">Дата начала *</label>
                <input
                  v-model="tripData.startDate"
                  type="date"
                  id="startDate"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="endDate">Дата окончания *</label>
                <input
                  v-model="tripData.endDate"
                  type="date"
                  id="endDate"
                  required
                  :min="tripData.startDate"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="price">Цена на человека (₽) *</label>
              <div class="price-input">
                <input
                  v-model.number="tripData.price"
                  type="number"
                  id="price"
                  min="0"
                  step="1000"
                  required
                  placeholder="Сколько стоит участие?"
                >
                <span class="price-suffix">₽</span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Дополнительная информация</h3>
            
            <div class="form-group">
              <label for="difficulty">Сложность маршрута *</label>
              <select v-model="tripData.difficulty" id="difficulty" required>
                <option value="">Выберите сложность</option>
                <option value="easy">Легкая (подходит для новичков)</option>
                <option value="medium">Средняя (требуется опыт)</option>
                <option value="hard">Сложная (требуется хорошая подготовка)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="status">Статус поездки</label>
              <select v-model="tripData.status" id="status">
                <option value="planning">Планируется</option>
                <option value="active">Активна</option>
                <option value="completed">Завершена</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <router-link :to="`/trips/${tripId}`">
              <WhiteBtn type="button" class="cancel-btn">Отмена</WhiteBtn>
            </router-link>
            <button type="submit">
              <BlueBtn :disabled="saving" class="update-btn">
                {{ saving ? 'Сохранение...' : 'Сохранить изменения' }}
              </BlueBtn>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useTripStore } from '@/stores/tripStore';
import { useAuthStore } from '@/stores/authStore';
import BlueBtn from '@/components/ui/BlueBtn.vue';
import WhiteBtn from '@/components/ui/WhiteBtn.vue';

export default {
  name: 'EditTrip',
  components: {
    BlueBtn,
    WhiteBtn
  },
  
  data() {
    return {
      tripId: null,
      tripData: {
        title: '',
        destination: '',
        description: '',
        startDate: '',
        endDate: '',
        price: '',
        maxParticipants: 6,
        difficulty: 'medium',
        status: 'planning'
      },
      loading: false,
      saving: false,
      error: null
    };
  },

  setup() {
    const tripStore = useTripStore();
    const authStore = useAuthStore();
    return { tripStore, authStore };
  },
  
  computed: {
    trip() {
      return this.tripStore.currentTrip;
    },
    isOrganizer() {
      if (!this.authStore.user || !this.trip) return false;
      return this.authStore.user._id === this.trip.createdBy?._id;
    }
  },
  
  async mounted() {
    // Получаем ID из параметров маршрута
    this.tripId = this.$route.params.id;
    
    if (this.tripId) {
      await this.loadTrip();
    }
  },
  
  methods: {
    async loadTrip() {
      this.loading = true;
      this.error = null;
      
      try {
        // Загружаем поездку из хранилища
        await this.tripStore.fetchTripById(this.tripId);
        
        if (this.trip) {
          // Заполняем форму данными поездки
          this.tripData = {
            title: this.trip.title || '',
            destination: this.trip.destination || '',
            description: this.trip.description || '',
            startDate: this.formatDateForInput(this.trip.startDate),
            endDate: this.formatDateForInput(this.trip.endDate),
            price: this.trip.price || 0,
            maxParticipants: this.trip.maxParticipants || 6,
            difficulty: this.trip.difficulty || 'medium',
            status: this.trip.status || 'planning'
          };
          
          // Проверяем права на редактирование
          if (!this.isOrganizer) {
            this.error = 'Вы не можете редактировать эту поездку';
          }
        } else {
          this.error = 'Поездка не найдена';
        }
      } catch (error) {
        console.error('Ошибка загрузки поездки:', error);
        this.error = 'Не удалось загрузить данные поездки';
      } finally {
        this.loading = false;
      }
    },
    
    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },
    
    getStatusLabel(status) {
      const labels = {
        planning: 'Планируется',
        active: 'Активна',
        completed: 'Завершена',
        cancelled: 'Отменена'
      };
      return labels[status] || status;
    },
    
    async handleUpdateTrip() {
      if (!this.validateForm()) {
        return;
      }

      this.saving = true;
      this.error = null;

      try {
        // Проверяем права на редактирование
        if (!this.isOrganizer) {
          throw new Error('Вы не можете редактировать эту поездку');
        }

        // Преобразуем данные для отправки
        const updateData = {
          title: this.tripData.title.trim(),
          destination: this.tripData.destination.trim(),
          description: this.tripData.description.trim(),
          startDate: new Date(this.tripData.startDate).toISOString(),
          endDate: new Date(this.tripData.endDate).toISOString(),
          price: Number(this.tripData.price),
          maxParticipants: Number(this.tripData.maxParticipants),
          difficulty: this.tripData.difficulty,
          status: this.tripData.status
        };

        const response = await this.tripStore.updateTrip(this.tripId, updateData);
        
        if (response && response.data) {
          // Перенаправляем на страницу поездки
          this.$router.push(`/trips/${this.tripId}`);
        } else {
          throw new Error('Не удалось обновить поездку');
        }
      } catch (error) {
        console.error('Ошибка обновления поездки:', error);
        this.error = error.message || 'Произошла ошибка при обновлении поездки';
      } finally {
        this.saving = false;
      }
    },
    
    validateForm() {
      this.error = null;
      
      if (!this.tripData.title.trim()) {
        this.error = 'Введите название поездки';
        return false;
      }
      
      if (!this.tripData.destination.trim()) {
        this.error = 'Введите направление поездки';
        return false;
      }
      
      if (!this.tripData.description.trim()) {
        this.error = 'Введите описание поездки';
        return false;
      }
      
      if (this.tripData.description.trim().length > 1000) {
        this.error = 'Описание не должно превышать 1000 символов';
        return false;
      }
      
      if (!this.tripData.startDate) {
        this.error = 'Выберите дату начала';
        return false;
      }
      
      if (!this.tripData.endDate) {
        this.error = 'Выберите дату окончания';
        return false;
      }
      
      const startDate = new Date(this.tripData.startDate);
      const endDate = new Date(this.tripData.endDate);
      
      if (endDate <= startDate) {
        this.error = 'Дата окончания должна быть позже даты начала';
        return false;
      }
      
      if (!this.tripData.price || this.tripData.price <= 0) {
        this.error = 'Введите корректную цену';
        return false;
      }
      
      if (!this.tripData.maxParticipants || 
          this.tripData.maxParticipants < 1 || 
          this.tripData.maxParticipants > 50) {
        this.error = 'Количество участников должно быть от 1 до 50';
        return false;
      }
      
      if (!this.tripData.difficulty) {
        this.error = 'Выберите сложность маршрута';
        return false;
      }
      
      if (!this.tripData.status) {
        this.error = 'Выберите статус поездки';
        return false;
      }
      
      // Проверка, что количество участников не меньше текущего
      if (this.trip && this.trip.participants) {
        const currentParticipants = this.trip.participants.length;
        if (this.tripData.maxParticipants < currentParticipants) {
          this.error = `Нельзя установить меньше ${currentParticipants} участников (уже участвуют)`;
          return false;
        }
      }
      
      return true;
    }
  }
};
</script>

<style scoped>
.edit-trip {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 3rem 0;
  border-radius: 2rem;
  background: var(--surface);
}

.hero-section h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-section p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.edit-container {
  margin-top: 2rem;
}

.trip-form {
  background: var(--surface);
  padding: 2.5rem;
  border-radius: 1.5rem;
}

.trip-form * {
  background: var(--surface);
}

.loading-message,
.no-trip-message {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
}

.section-title {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 24px;
  background: var(--primary);
  border-radius: 2px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.9rem 1.2rem;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  background: var(--white);
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.hint {
  display: block;
  margin-top: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.price-input {
  position: relative;
}

.price-input input {
  padding-right: 3rem;
}

.price-suffix {
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-weight: 600;
}

.readonly-info {
  background: var(--background);
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  border-left: 4px solid #e9ecef;
}

.readonly-info p {
  background: var(--background);
  margin: 0.5rem 0;
  color: var(--text-secondary);
}

.readonly-info strong {
  color: var(--text-primary);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2.5rem;
  padding-top: 2rem;
}

.cancel-btn {
  border-color: var(--extra);
  color: var(--extra);
}

.cancel-btn:hover {
  background: var(--surface);
}

.update-btn {
  background: var(--gradient-primary);
  min-width: 180px;
  padding: 0.9rem 2rem;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  border-left: 4px solid #dc2626;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 0;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .trip-form {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .update-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>