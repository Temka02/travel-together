<template>
    <div class="trip-details">
      <section class="info-section">
        <router-link to="/trips/all-trips">
          <WhiteBtn class="return-button">← Назад к поиску</WhiteBtn>
        </router-link>
        
        <div v-if="loading" class="loading">Загрузка...</div>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <div v-if="currentTrip && !loading">
          <h1>{{ currentTrip.title }}</h1>
          <p>{{ currentTrip.description }}</p>
          <div class="info-section-meta">
            <div class="section-meta-item">📍 {{ currentTrip.destination }}</div>
            <div class="section-meta-item">📅 {{ formatDate(currentTrip.startDate) }}</div>
            <div class="section-meta-item">💰 {{ currentTrip.price }} ₽</div>
            <div class="section-meta-item">⏱️ {{ currentTrip.durationDays }} дней</div>
          </div>
        </div>
      </section>
      <section class="tabs-section" v-if="currentTrip && !loading">
        <div class="participants-list">
          <div class="participant-card organizer">
            <img src="@/assets/baikal.jpg" alt="" class="participant-avatar">
            <div class="participant-info">
              <div class="participant-name">{{ currentTrip.createdBy.firstName }}</div>
              <div class="participant-role">Организатор</div>
            </div>
          </div>
          <div class="divider"></div>
          <h3>Участники {{ currentTrip.currentParticipants }}/{{ currentTrip.maxParticipants }}</h3>
          <div class="participant-card" v-for="participant in currentTrip.participants">
            <img src="@/assets/baikal.jpg" alt="" class="participant-avatar">
            <div class="participant-info">
              <div class="participant-name">{{ participant.firstName }}</div>
              <div class="participant-role">Участник</div>
            </div>
          </div>
        </div>
        <div class="trip-actions" >
          <div v-if="authStore.user._id == currentTrip.createdBy._id">
            <WhiteBtn @click="$router.push(`/trips/${currentTrip._id}/edit`)">Редактировать поездку</WhiteBtn>
          </div>
          <div v-else>
            <div v-if="checkingStatus" class="loading-status">
              Проверяем статус...
            </div>
            <div v-else>
              <div v-if="userApplication">
                <div class="application-status" :class="userApplication.status">
                  <h4 v-if="userApplication.status === 'pending'">Заявка отправлена! Ожидайте...</h4>
                  <h4 v-if="userApplication.status === 'accepted'">✅ Вы приняты</h4>
                  <h4 v-if="userApplication.status === 'rejected'">❌ Заявка отклонена</h4>
                </div>
              </div>
              <div v-else-if="isParticipant">
                <div class="application-status accepted">
                  <h4>Вы участник этой поездки!</h4> 
                </div>
              </div>
              <div v-else>
                <BlueBtn @click="applyForTrip()" class="apply-button" :disabled="applying">
                  {{ applying ? 'Отправка...' : 'Подать заявку' }}
                </BlueBtn>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
</template>
  
<script>
import { useTripStore } from '@/stores/tripStore';
import { useAuthStore } from '@/stores/authStore';
import BlueBtn from '@/components/ui/BlueBtn.vue';
import WhiteBtn from '@/components/ui/WhiteBtn.vue';

export default {
    name: 'TripDetails',
    components: {
      WhiteBtn,
      BlueBtn
    },
    
    setup() {
      const tripStore = useTripStore();
      const authStore = useAuthStore();
      return { tripStore, authStore };
    },
    
    data(){
      return {
        loading: false,
        error: null,
        applying: false,
        userApplication: null,
        isParticipant: false,
        checkingStatus: false
      }
    },
    
    computed: {
      currentTrip() {
        return this.tripStore.currentTrip;
      }
    },
    
    async created() {
      await this.loadTrip();
      this.checkApplicationStatus();
    },
    
    watch: {
      '$route.params.id': {
        async handler(newId) {
          if (newId) {
            await this.loadTrip();
            this.checkApplicationStatus();
          }
        },
        deep: true
      }
    },
    
    methods: {
      async loadTrip() {
        const tripId = this.$route.params.id;
        if (!tripId) return;
        
        this.loading = true;
        this.error = null;
        
        try {
          await this.tripStore.fetchTripById(tripId);
        
          if (!this.currentTrip) {
            this.error = 'Поездка не найдена';
          }
        } catch (error) {
          console.error('Ошибка загрузки поездки:', error);
          this.error = 'Не удалось загрузить данные поездки';
        } finally {
          this.loading = false;
        }
      },
      
      formatDate(dateString) {
        if (!dateString) return '';
        
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
        } catch (error) {
          console.error('Ошибка форматирования даты:', error);
          return dateString;
        }
      },
      
      async checkApplicationStatus() {
        if (!this.authStore.isAuthenticated || !this.currentTrip) return;
        
        const userId = this.authStore.user._id;
        const tripId = this.currentTrip._id;
        
        if (this.currentTrip.createdBy && this.currentTrip.createdBy.id === userId) {
          return;
        }
        
        if (this.currentTrip.participants && 
            this.currentTrip.participants.some(p => p._id === userId)) {
          this.isParticipant = true;
          return;
        }
        
        const cacheKey = `application_${tripId}_${userId}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            this.userApplication = JSON.parse(cached);
          } catch (e) {
            console.error('Error parsing cached application:', e);
            localStorage.removeItem(cacheKey);
          }
        }
        
        this.checkingStatus = true;
        try {
          const response = await this.authStore.fetchWithAuth(`/applications/check/${tripId}`);
          
          if (response.ok) {
            const data = await response.json();
            if (data.application) {
              this.userApplication = data.application;
              localStorage.setItem(cacheKey, JSON.stringify(data.application));
            } else {
              this.userApplication = null;
              localStorage.removeItem(cacheKey);
            }
          } else {
            const errorData = await response.json();
            console.error('Error checking application:', errorData);
          }
        } catch (error) {
          console.error('Ошибка проверки статуса:', error);
        } finally {
          this.checkingStatus = false;
        }
      },
      
      async applyForTrip() {
        if (!this.authStore.isAuthenticated) {
          alert('Для подачи заявки войдите в систему');
          this.$router.push('/login');
          return;
        }
        
        this.applying = true;
        
        try {
          const userId = this.authStore.user._id;
          const tripId = this.currentTrip._id;
          const cacheKey = `application_${tripId}_${userId}`;
          
          const tempApplication = {
            _id: `temp_${Date.now()}`,
            userId: userId,
            tripId: tripId,
            status: 'pending',
            message: '',
            appliedAt: new Date().toISOString()
          };
          
          this.userApplication = tempApplication;
          localStorage.setItem(cacheKey, JSON.stringify(tempApplication));
          
          const response = await this.authStore.fetchWithAuth('/applications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tripId: tripId,
              message: ''
            })
          });
          
          const responseData = await response.json();
          
          if (response.ok) {
            this.userApplication = responseData.data;
            localStorage.setItem(cacheKey, JSON.stringify(responseData.data));
            alert('Заявка успешно отправлена!');
          } else {
            this.userApplication = null;
            localStorage.removeItem(cacheKey);
            throw new Error(responseData.error || 'Ошибка отправки заявки');
          }
          
        } catch (error) {
          console.error('Ошибка:', error);
          alert('Ошибка: ' + error.message);
        } finally {
          this.applying = false;
        }
      }
    }
}
</script>
<style>
.info-section{
  padding: 3rem 0;
  border-radius: 0 0 2rem 2rem;
  margin-bottom: 3rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}
.info-section h1{
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.2;
}
.info-section-meta{
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}
.section-meta-item{
  background: var(--surface);
  padding: 1rem 2rem;
  border-radius: 15px;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
}
.return-button{
  margin-bottom: 2rem;
}
.profile-tabs .tab-button{
  padding-inline: 1rem;
}
.tabs-section {
    background: var(--surface);
    border-radius: 1.5rem;
    box-shadow: var(--shadow);
    overflow: hidden;
    margin-bottom: 3rem;
    max-width: 1000px;
    margin: 0 auto 2rem auto;
    padding: 2rem;
}
.tabs-section *{
  background: var(--surface);
}

.tabs-section h3 {
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
}
.profile-tabs{
  display: flex;
}
.about-container {
  margin-top: 1rem;
}
.description-section {
    background: var(--surface);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: var(--shadow);
}
.description-section h3 {
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
}
.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
}
.feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--background);
    border-radius: 10px;
    font-weight: 500;
}
.description-text {
  width: 100%;
    color: var(--text-secondary);
    line-height: 1.7;
    margin-bottom: 1.5rem;
}

.participants-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
}
.participant-card {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 1.5rem;
    background: var(--light-gray);
    border-radius: 8px;
    border-left: 4px solid var(--secondary);
}
.participant-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: white;
    font-weight: 600;
}
.participant-info {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex: 1;
}
.participant-name {
    font-weight: 600;
    color: var(--text-primary);
}
.participant-role {
    font-size: 1rem;
    color: var(--text-secondary);
}
.trip-actions{
  text-align: center;
}
.apply-button{
  background: var(--primary);
  padding: 1rem;
}
.plan-timeline {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}
.plan-day {
    background: var(--surface);
    border-radius: 1rem;
    box-shadow: var(--shadow);
    overflow: hidden;
}
.plan-day-header {
    background: var(--gradient-primary);
    color: white;
    padding: 1.5rem 2rem;
    font-weight: 700;
    font-size: 1.2rem;
}
.plan-day-content {
    padding: 1.5rem 2rem;
}
.plan-item {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 1.5rem;
    padding: 1.25rem;
    border-bottom: 1px solid var(--border);
}
.plan-time {
    font-weight: 600;
    color: var(--primary);
    font-size: 1.1rem;
}
.plan-activity {
    color: var(--text-primary);
    line-height: 1.6;
}

.divider{
  width: 100%;
  height: 2px;
  background: var(--border);
}

.loading-status {
  padding: 15px;
  text-align: center;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
}

.application-status h4{
  font-size: 1.4rem;
}
</style>