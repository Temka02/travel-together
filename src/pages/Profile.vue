<template>
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-main">
          <div class="profile-avatar">
            <img src="@/assets/baikal.jpg" alt=""class='profile-img'>
          </div>
          <div class="profile-info">
            <h1>{{user.firstName}} {{user.lastName}}</h1>
            <div class="profile-achievments">
              <span>🧳 Участвовал в поездках {{user.tripsAsParticipant}} раз(а)</span>
              <span>👑 Был организатором {{user.tripsAsOrganizer}} раз(а)</span>
            </div>
            <div class="profile-main-skills">
              <span v-for="mainSkill of user.mainSkills" :key="mainSkill.id">
                ⭐ {{getSkillLabel(mainSkill)}}
              </span>
              
            </div>
            <div class="profile-buttons">
              <WhiteBtn class="choose-main-skills" @click="openModalForMainSkills">Выбрать основные навыки</WhiteBtn>
            </div>
            <div class="modal-for-main-skills" v-if="activeModalForMainSkills">
              <div class="modal-header">
                <h3>Выберите до 3 основных навыков</h3>
                <button @click="activeModalForMainSkills = false">Закрыть</button>
              </div>
              <div class="modal-main">
                  <p v-for="skill in selectedSkills"
                     v-if="selectedSkills.length > 0" 
                     @click="addToMainSkills(skill)"
                     class="modal-field"
                     :class="{selected: mainSkills.includes(skill) }">
                    {{ getSkillLabel(skill) }}
                  </p>
                  <div v-else class="no-skills">
                    <h3>Вы пока не выбрали навыки</h3>
                    <WhiteBtn @click="activeTab = 'skills'; activeModalForMainSkills = false" class="link-text">
                      Перейти к выбору навыков
                    </WhiteBtn>
                  </div>

              </div>
              
              <button @click="() => {
                saveSkills();
                activeModalForMainSkills = false}" 
                v-if="selectedSkills.length > 0"
                class="save-main-skills-btn">
                <BlueBtn>Cохранить основные навыки</BlueBtn>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="profile-tabs">
        <button 
          class="tab-button" 
          v-for="tab in tabs"
          :key="tab.id"
          :class="{'active-tab': activeTab == tab.id}"
          @click="activeTab = tab.id"
        >
          {{ tab.title }}
        </button>
      </div>
      <div v-if="activeTab === 'my-trips'" id="my-trips" class="tab-content">
        <section class="trip-section">
          <h3>Предстоящие поездки:</h3>
          <div v-if="currentJoinedTrip" class="section-content">
            <router-link :to="`/trips/${currentJoinedTrip._id}`" class="my-trips-link">
              <div class="my-trip-card">
                <div class="my-trip-badge">Участник</div>
                <div class="my-trip-image">
                  <img src="@/assets/baikal.jpg" alt="">
                </div>
                <div class="my-trip-info">
                  <h3>{{ currentJoinedTrip.title || 'Title' }}</h3>
                  <span>Статус: {{ currentJoinedTrip.status }}</span>
                </div>
              </div>
            </router-link>
          </div>

          <div v-else class="no-trips">
            <p>Вы пока не присоединились ни к одной поездке.</p>
          </div>
          <div class="section-footer">
            <div class="nav-controls" v-if="user.joinedTrips && user.joinedTrips.length > 1">
              <button @click="() => prevTrip('joined')" class="nav-btn" :disabled="currentJoinedTripIndex === 0">
                ←
              </button>
              <span class="trip-counter">{{ currentOrganizedTripIndex + 1 }} / {{ user.joinedTrips.length }}</span>
              <button @click="() => nextTrip('joined')" class="nav-btn" :disabled="currentJoinedTripIndex === user.joinedTrips.length - 1">
                →
              </button>
            </div>
          </div>
        </section>
        <section class="trip-section">
          <h3>Организаторские поездки:</h3>
          <div v-if="currentOrganizedTrip" class="section-content">
            <router-link :to="`/trips/${currentOrganizedTrip._id}`" class="my-trips-link">
              <div class="my-trip-card">
                <div class="my-trip-badge">Организатор</div>
                <div class="my-trip-image">
                  <img src="@/assets/baikal.jpg" alt="">
                </div>
                <div class="my-trip-info">
                  <h3>{{ currentOrganizedTrip.title || 'Title' }}</h3>
                  <span>Статус: {{ currentOrganizedTrip.status }}</span>
                </div>
              </div>
            </router-link>
          </div>

          <div v-else class="no-trips">
            <p>Вы пока не являетесь организатором поездок</p>
          </div>
          <div class="section-footer">
            <div class="nav-controls" v-if="user.organizedTrips && user.organizedTrips.length > 1">
              <button @click="() => prevTrip('organized')" class="nav-btn" :disabled="currentOrganizedTripIndex === 0">
                ←
              </button>
              <span class="trip-counter">{{ currentOrganizedTripIndex + 1 }} / {{ user.organizedTrips.length }}</span>
              <button @click="() => nextTrip('organized')" class="nav-btn" :disabled="currentOrganizedTripIndex === user.organizedTrips.length - 1">
                →
              </button>
            </div>
          </div>
        </section>
      </div>
      <div v-if="activeTab === 'settings'" id="settings" class="tab-content">
        <section class="settings-section">
          <h3>Настройки профиля</h3>
          <form class="settings-form" @submit.prevent="updateProfile">
            <div class="form-group">
              <label for="userName">Имя и фамилия</label>
              <input 
                type="text" 
                id="userName" 
                v-model="profileForm.fullName" 
                required>
            </div>

            <div class="form-group">
              <label for="userEmail">Email</label>
              <input 
                type="email" 
                id="userEmail" 
                :value="user.email" 
                required 
                disabled 
                class="disabled-input">
            </div>

            <div class="form-group">
              <label for="userPhone">Телефон</label>
              <input 
                type="tel" 
                id="userPhone" 
                v-model="profileForm.phone"
                placeholder="+7 (___) ___-__-__">
            </div>

            <div class="form-group">
              <label for="userBio">О себе</label>
              <textarea 
                id="userBio" 
                rows="4"
                v-model="profileForm.aboutMe"
                maxlength="500"></textarea>
              <small class="hint">{{ profileForm.aboutMe.length }}/500 символов</small>
            </div>

            <div class="form-actions">
              <button type="submit" :disabled="loading">
                <BlueBtn>
                  {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
                </BlueBtn>
              </button>
            </div>
          </form>
          <div class="security-section">
            <WhiteBtn 
              class="logout" 
              @click="logout">
              Выйти из аккаунта
            </WhiteBtn>
          </div>
        </section>  
      </div>
      <div v-if="activeTab === 'skills'" id="skills" class="tab-content">
        <div class="skills-section">
          <h3>Мои навыки и умения</h3>
          <p class="section-description">Отметьте навыки, которые могут быть полезны в путешествиях</p>
          <div class="skills-grid">
              <div class="skill-category">
                  <h4>🚗 Транспорт</h4>
                  <div class="skills-list">
                    <label class="skill-checkbox" v-for="skill in skillsConfig.transport" :key="skill.id">
                        <input type="checkbox" :value="skill.id" v-model="selectedSkills">
                        <span class="checkmark"></span>
                        {{ skill.label }}
                    </label>
                  </div>
              </div>

              <div class="skill-category">
                  <h4>🗣️ Языки</h4>
                  <div class="skills-list">
                    <label class="skill-checkbox" v-for="skill in skillsConfig.languages" :key="skill.id">
                        <input type="checkbox" :value="skill.id" v-model="selectedSkills">
                        <span class="checkmark"></span>
                        {{ skill.label }}
                    </label>
                  </div>
              </div>

              <div class="skill-category">
                  <h4>🎯 Навыки</h4>
                  <div class="skills-list">
                    <label class="skill-checkbox" v-for="skill in skillsConfig.general" :key="skill.id">
                        <input type="checkbox" :value="skill.id" v-model="selectedSkills">
                        <span class="checkmark"></span>
                        {{ skill.label }}
                    </label>
                  </div>
              </div>
          </div>
          <div class="medical-info">
            <h4>💊 Медицинская информация</h4>
            <div class="form-group">
              <label for="allergies">Аллергии</label>
              <textarea 
                id="allergies" 
                rows="2" 
                v-model="medicalInfo.allergies"
                placeholder="Например: аллергия на арахис, астма..."
              ></textarea>
            </div>
            <div class="form-group">
              <label for="medicalConditions">Заболевания</label>
              <textarea 
                id="medicalConditions" 
                rows="2" 
                v-model="medicalInfo.medicalConditions"
                placeholder="Например: диабет, гипертония..."
              ></textarea>
            </div>
            <div class="form-group">
              <label for="dietaryRestrictions">Диетические ограничения</label>
              <textarea 
                id="dietaryRestrictions" 
                rows="2" 
                v-model="medicalInfo.dietaryRestrictions"
                placeholder="Вегетарианец, непереносимость лактозы..."
              ></textarea>
            </div>
          </div>
          <div class="form-actions">
            <BlueBtn @click="saveSkills" :disabled="loading">
              {{ loading ? 'Сохранение...' : 'Сохранить навыки' }}
            </BlueBtn>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'application'" class="tab-content">
        <!-- Мои заявки -->
        <div class="my-applications-section">
          <h3>Мои отправленные заявки</h3>
          
          <div v-if="myApplicationsLoading" class="loading-state">
            <p>Загрузка заявок...</p>
          </div>
          
          <div v-else-if="myApplications.length > 0" class="applications-list">
            <div v-for="application in myApplications" :key="application._id" 
                 class="application-card" :class="`status-${application.status}`">
              <div class="application-header">
                <h4>{{ application.tripId?.title || 'Поездка' }}</h4>
                <span class="application-status" :class="`status-${application.status}`">
                  {{ getStatusText(application.status) }}
                </span>
              </div>
              
              <div class="application-info">
                <div v-if="application.tripId">
                  <p><strong>Направление:</strong> {{ application.tripId.destination || 'Не указано' }}</p>
                  <p><strong>Даты: </strong> 
                    <span v-if="application.tripId.startDate">{{ formatDate(application.tripId.startDate) }}</span>
                    <span v-if="application.tripId.endDate"> - {{ formatDate(application.tripId.endDate) }}</span>
                  </p>
                  <p v-if="application.tripId.createdBy">
                    <strong>Организатор: </strong> {{ application.tripId.createdBy.firstName }} {{ application.tripId.createdBy.lastName }}
                  </p>
                </div>
                
                <div class="application-meta">
                  <span class="application-date">
                    Подана: {{ formatDate(application.appliedAt) }}
                  </span>
                  <span v-if="application.status !== 'pending'" class="processed-date">
                    Ответ: {{ formatDate(application.processedAt) }}
                  </span>
                </div>
              </div>
              
              <div v-if="application.status === 'pending'" class="application-actions">
                <WhiteBtn @click="$router.push(`/trips/${application.tripId._id}`)" >
                  Перейти к поездке
                </WhiteBtn>
                <WhiteBtn @click="cancelApplication(application._id)" class="cancel-btn">
                  Отменить заявку
                </WhiteBtn>
              </div>
              
              <div v-if="application.status === 'accepted'" class="application-success">
                <span>Вы приняты в поездку!</span>
              </div>
            </div>
          </div>
          
          <div v-else class="no-applications">
            <h4>Вы пока не подали ни одной заявки на поездки</h4>
            <router-link to="/trips/all-trips">
              <BlueBtn>Найти поездки</BlueBtn>
            </router-link>
          </div>
        </div>
        
        <!-- Заявки на мои поездки (для организатора) -->
        <div class="review-applications-section" v-if="hasOrganizedTrips">
          <h3>Заявки на мои поездки</h3>
          
          <div v-if="tripApplicationsLoading" class="loading-state">
            <p>Загрузка заявок...</p>
          </div>
          
          <div v-else-if="tripApplications.pending.length === 0" 
               class="no-applications">
            <h4>На ваши поездки пока нет заявок</h4>
          </div>
          
          <div v-else>
            <!-- Ожидающие рассмотрения заявки -->
            <div v-if="tripApplications.pending.length > 0" class="pending-applications">
              <h4>Ожидают рассмотрения <div class="badge-count">{{ tripApplications.pending.length }}</div></h4>
              
              <div v-for="application in tripApplications.pending" :key="application._id" 
                   class="application-card pending-card">
                <div class="card-header">
                  <div class="trip-info">
                    <h5>{{ application.tripId?.title || 'Поездка' }}</h5>
                    <span class="trip-destination">{{ application.tripId?.destination || 'Не указано' }}</span>
                  </div>
                  <span class="status-badge pending">ожидает</span>
                </div>
                
                <div class="applicant-info">
                  <div class="applicant-header">
                    <div class="applicant-avatar">
                      <div class="avatar-placeholder">
                        {{ getInitials(application.userId?.firstName, application.userId?.lastName) }}
                      </div>
                    </div>
                    <div class="applicant-details">
                      <h6>{{ application.userId?.firstName }} {{ application.userId?.lastName }}</h6>
                      <p v-if="application.userId?.email" class="applicant-email">
                        {{ application.userId.email }}
                      </p>
                      <p v-if="application.userId?.phone" class="applicant-phone">
                        {{ application.userId.phone }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Навыки участника -->
                  <div v-if="application.userId?.skills && application.userId.skills.length > 0" 
                       class="applicant-skills">
                    <p class="skills-title">Навыки:</p>
                    <div class="skills-tags">
                      <span v-for="skill in getTopSkills(application.userId.skills)" 
                            :key="skill" class="skill-tag">
                        {{ getSkillLabel(skill) }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Медицинская информация -->
                  <div v-if="hasMedicalInfo(application.userId)" class="medical-info-section">
                    <p class="medical-title">Медицинская информация:</p>
                    <div class="medical-details">
                      <span v-if="application.userId.allergies && application.userId.allergies.length > 0" 
                            class="medical-tag warning">
                        Аллергии: {{ formatArray(application.userId.allergies) }}
                      </span>
                      <span v-if="application.userId.medicalConditions && application.userId.medicalConditions.length > 0" 
                            class="medical-tag warning">
                        Заболевания: {{ formatArray(application.userId.medicalConditions) }}
                      </span>
                      <span v-if="application.userId.dietaryRestrictions && application.userId.dietaryRestrictions.length > 0" 
                            class="medical-tag info">
                        Диета: {{ formatArray(application.userId.dietaryRestrictions) }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Сообщение от участника -->
                  <div v-if="application.message" class="applicant-message">
                    <p class="message-title">Сообщение от участника:</p>
                    <div class="message-content">
                      "{{ application.message }}"
                    </div>
                  </div>
                  
                  <!-- Информация о поездке -->
                  <div class="trip-stats">
                    <span class="stat-item">
                      Места: {{ application.tripId?.participants?.length || 0 }}/{{ application.tripId?.maxParticipants || 0 }}
                    </span>
                    <span class="stat-item">
                      Подана: {{ formatDate(application.appliedAt) }}
                    </span>
                  </div>
                </div>
                
                <div class="review-actions">
                  <WhiteBtn @click="acceptApplication(application._id)" 
                          class="accept-btn"
                          :disabled="isTripFull(application.tripId)">
                    Принять
                  </WhiteBtn>
                  <WhiteBtn @click="rejectApplication(application._id)" 
                          class="reject-btn">
                    Отклонить
                  </WhiteBtn>
                </div>
                
                <div v-if="isTripFull(application.tripId)" class="trip-full-warning">
                  ⚠️ В поездке нет свободных мест
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="no-organized-trips">
          <h3>Заявки на мои поездки</h3>
          <div class="empty-state">
            
            <h4>У вас нет поездок для рассмотрения заявок</h4>
            <p>Создайте поездку, чтобы другие участники могли подавать заявки</p>
            <router-link to="/trips/create">
              <BlueBtn>Создать поездку</BlueBtn>
            </router-link>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script>
import { SKILLS_CONFIG, ALL_SKILLS } from '@/utils/skillConfig';
import { useAuthStore } from '@/stores/authStore';
import { useApplicationStore } from '@/stores/applicationStore';
import BlueBtn from '@/components/ui/BlueBtn.vue';
import WhiteBtn from '@/components/ui/WhiteBtn.vue';
export default {
    name: 'Profile',
    data(){
      return {
        activeTab: 'my-trips',
        tabs: [
        { id: 'my-trips', title: 'Мои поездки' },
        { id: 'settings', title: 'Настройки' },
        { id: 'skills', title: 'Навыки' },
        { id: 'application', title: 'Заявки' }
        ],
        currentOrganizedTripIndex: 0,
        currentJoinedTripIndex: 0,
        skillsConfig: SKILLS_CONFIG,
        selectedSkills: [],
        mainSkills: [],
        medicalInfo: {
          allergies: '',
          medicalConditions: '',
          dietaryRestrictions: ''
        },
        loading: false,
        activeModalForMainSkills: false,
        profileForm: {
          fullName: '',
          phone: '',
          aboutMe: ''
        },
        myApplicationsLoading: false,
        tripApplicationsLoading: false,
        showRejected: false,
        applicationsToMyTrips: []
      }
    },
    components: {
      WhiteBtn,
      BlueBtn
    },
    computed: {
      isAuthenticated() {
        const authStore = useAuthStore();
        return authStore.isAuthenticated;
      },
      
      user() {
        const authStore = useAuthStore();
        return authStore.user;
      },
      currentOrganizedTrip(){
        if (this.user.organizedTrips && this.user.organizedTrips.length > 0) {
          return this.user.organizedTrips[this.currentOrganizedTripIndex];
        }
        return null;
      },
      currentJoinedTrip(){
        if (this.user.joinedTrips && this.user.joinedTrips.length > 0) {
          return this.user.joinedTrips[this.currentJoinedTripIndex];
        }
        return null;
      },

      myApplications() {
        const applicationStore = useApplicationStore();
        return applicationStore.myApplications || [];
      },
      
      tripApplications() {
        const pending = this.applicationsToMyTrips.filter(app => app.status === 'pending');
        const rejected = this.applicationsToMyTrips.filter(app => app.status === 'rejected');
        const accepted = this.applicationsToMyTrips.filter(app => app.status === 'accepted');
        
        return { pending, rejected, accepted };
      },
      
      hasOrganizedTrips() {
        return this.user && this.user.organizedTrips && this.user.organizedTrips.length > 0;
      }
    },
    
    async created() {
      if (this.isAuthenticated) {
        await this.loadUserData();
      }
    },

    mounted() {
      this.loadUserSkills();
      if (this.user) {
        this.initProfileForm();
      }
    },
    
    methods: {
      async loadApplications() {
        try {
          const applicationStore = useApplicationStore();
          
          // Загружаем мои заявки (которые я подал)
          this.myApplicationsLoading = true;
          await applicationStore.fetchMyApplications();
          this.myApplicationsLoading = false;
          
          // Загружаем заявки на мои поездки (только если есть организованные поездки)
          if (this.hasOrganizedTrips) {
            this.tripApplicationsLoading = true;
            await this.loadApplicationsToMyTrips();
            this.tripApplicationsLoading = false;
          }
          
        } catch (error) {
          console.error('Ошибка загрузки заявок:', error);
          this.myApplicationsLoading = false;
          this.tripApplicationsLoading = false;
        }
      },
      
      async loadApplicationsToMyTrips() {
        try {
          const authStore = useAuthStore();
          const response = await authStore.fetchWithAuth('/applications/to-my-trips');
          
          if (!response.ok) {
            throw new Error('Ошибка загрузки заявок на поездки');
          }
          
          const data = await response.json();
          this.applicationsToMyTrips = data.data || [];
          
        } catch (error) {
          console.error('Ошибка загрузки заявок на поездки:', error);
          throw error;
        }
      },
      
      async cancelApplication(applicationId) {
        if (!confirm('Вы уверены, что хотите отменить заявку?')) {
          return;
        }
        
        try {
          const authStore = useAuthStore();
          const response = await authStore.fetchWithAuth(`/applications/${applicationId}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Ошибка отмены заявки');
          }
          
          await this.loadApplications();
          alert('Заявка успешно отменена');
          
        } catch (error) {
          console.error('Ошибка отмены заявки:', error);
          alert('Ошибка: ' + error.message);
        }
      },
      
      async acceptApplication(applicationId) {
        try {
          const applicationStore = useApplicationStore();
          await applicationStore.acceptApplication(applicationId);
          
          await this.loadApplications();
          alert('Заявка принята! Участник добавлен в поездку.');
          
        } catch (error) {
          console.error('Ошибка принятия заявки:', error);
          alert('Ошибка: ' + error.message);
        }
      },
      
      async rejectApplication(applicationId) {
        if (!confirm('Вы уверены, что хотите отклонить заявку?')) {
          return;
        }
        
        try {
          const applicationStore = useApplicationStore();
          await applicationStore.rejectApplication(applicationId);
          
          await this.loadApplications();
          alert('Заявка отклонена');
          
        } catch (error) {
          console.error('Ошибка отклонения заявки:', error);
          alert('Ошибка: ' + error.message);
        }
      },
      
      getStatusText(status) {
        const statusMap = {
          'pending': 'На рассмотрении',
          'accepted': 'Принята',
          'rejected': 'Отклонена'
        };
        return statusMap[status] || status;
      },
      
      formatDate(dateString) {
        if (!dateString) return 'не указана';
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        } catch (e) {
          return 'неверная дата';
        }
      },
      
      getSkillLabel(skillId) {
        const skill = ALL_SKILLS.find(s => s.id === skillId);
        return skill ? skill.label : skillId;
      },
      
      getTopSkills(skills, limit = 9) {
        if (!skills || !Array.isArray(skills)) return [];
        return skills.slice(0, limit);
      },
      
      getInitials(firstName, lastName) {
        const first = firstName ? firstName.charAt(0).toUpperCase() : 'U';
        const last = lastName ? lastName.charAt(0).toUpperCase() : 'S';
        return first + last;
      },
      
      hasMedicalInfo(user) {
        if (!user) return false;
        return (user.allergies && user.allergies.length > 0) ||
               (user.medicalConditions && user.medicalConditions.length > 0) ||
               (user.dietaryRestrictions && user.dietaryRestrictions.length > 0);
      },
      
      formatArray(arr) {
        if (!arr || !Array.isArray(arr)) return '';
        if (arr.length === 1) return arr[0];
        if (arr.length === 2) return arr.join(' и ');
        return arr.slice(0, 2).join(', ') + '...';
      },
      
      isTripFull(trip) {
        if (!trip) return false;
        const participants = trip.participants?.length || 0;
        const max = trip.maxParticipants || 0;
        return participants >= max;
      },

      async loadUserData() {
        this.loading = true;
        try {
          const authStore = useAuthStore();
          await authStore.fetchCurrentUser();
          this.initProfileForm();
        } catch (error) {
          console.error('Failed to load user data:', error);
        } finally {
          this.loading = false;
        }
      },
      
      async logout() {
        if (confirm('Вы уверены, что хотите выйти?')) {
          try {
            const authStore = useAuthStore();
            await authStore.logout();
            this.$router.push('/');
          } catch (error) {
            console.error('Ошибка выхода:', error);
            alert('Ошибка выхода');
          }
        }
      },
      
      initProfileForm() {
        if (this.user) {
          this.profileForm.fullName = `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim();
          this.profileForm.phone = this.user.phone || '';
          this.profileForm.aboutMe = this.user.aboutMe || '';
        }
      },

      async updateProfile() {
        try {
          this.loading = true;
          const authStore = useAuthStore();
          
          const nameParts = this.profileForm.fullName.trim().split(' ');
          let firstName = '';
          let lastName = '';
          
          if (nameParts.length >= 2) {
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(' ');
          } else if (nameParts.length === 1) {
            firstName = nameParts[0];
            lastName = this.user?.lastName || '';
          }
          
          if (!firstName && this.user) {
            firstName = this.user.firstName || '';
          }
          
          const updateData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: this.profileForm.phone.trim(),
            aboutMe: this.profileForm.aboutMe.trim()
          };
          
          await authStore.updateProfile(updateData);
          alert('Профиль обновлен');
          
        } catch (error) {
          console.error('Ошибка обновления профиля:', error);
          alert('Ошибка: ' + error.message);
        } finally {
          this.loading = false;
        }
      },

      prevTrip(tripType) {
        if (tripType === 'organized') {
          if (this.currentOrganizedTripIndex > 0) {
            this.currentOrganizedTripIndex--;
          }
        } else if (tripType === 'joined') {
          if (this.currentJoinedTripIndex > 0) {
            this.currentJoinedTripIndex--;
          }
        }
      },
      
      nextTrip(tripType) {
        if (tripType === 'organized') {
          if (this.user.organizedTrips && 
              this.currentOrganizedTripIndex < this.user.organizedTrips.length - 1) {
            this.currentOrganizedTripIndex++;
          }
        } else if (tripType === 'joined') {
          if (this.user.joinedTrips && 
              this.currentJoinedTripIndex < this.user.joinedTrips.length - 1) {
            this.currentJoinedTripIndex++;
          }
        }
      },
      
      getSkillLabel(skillId) {
        const skill = ALL_SKILLS.find(s => s.id === skillId);
        return skill ? skill.label : skillId;
      },

      loadUserSkills() {
        if (this.user) {
          this.selectedSkills = [...(this.user.skills || [])];
          this.mainSkills = [...(this.user.mainSkills || [])];
          
          this.medicalInfo.allergies = Array.isArray(this.user.allergies) 
            ? this.user.allergies.join(', ') 
            : this.user.allergies || '';
          
          this.mainSkills = this.mainSkills.filter(skill => 
            this.selectedSkills.includes(skill)
          );

          this.medicalInfo.medicalConditions = Array.isArray(this.user.medicalConditions)
            ? this.user.medicalConditions.join(', ')
            : this.user.medicalConditions || '';
            
          this.medicalInfo.dietaryRestrictions = Array.isArray(this.user.dietaryRestrictions)
            ? this.user.dietaryRestrictions.join(', ')
            : this.user.dietaryRestrictions || '';
        }
      },
      
      async saveSkills() {
        try {
          this.loading = true;
          const authStore = useAuthStore();
          
          const filteredMainSkills = this.mainSkills.filter(skill => 
            this.selectedSkills.includes(skill)
          ).slice(0, 3);

          const skillsData = {
            skills: this.selectedSkills,
            mainSkills: filteredMainSkills,
            allergies: this.medicalInfo.allergies.split(/[,;\n]/)
              .map(item => item.trim())
              .filter(item => item),
            medicalConditions: this.medicalInfo.medicalConditions.split(/[,;\n]/)
              .map(item => item.trim())
              .filter(item => item),
            dietaryRestrictions: this.medicalInfo.dietaryRestrictions.split(/[,;\n]/)
              .map(item => item.trim())
              .filter(item => item)
          };
          
          await authStore.updateProfile(skillsData);
          
        } catch (error) {
          console.error('Ошибка сохранения навыков:', error);
          alert('Ошибка сохранения навыков: ' + (error.message || 'Попробуйте еще раз'));
        } finally {
          this.loading = false;
        }
      },

      openModalForMainSkills() {
        this.activeModalForMainSkills = true
      },

      addToMainSkills(skill) {
        const skillIndex = this.mainSkills.indexOf(skill);
        if (skillIndex !== -1) {
          this.mainSkills.splice(skillIndex, 1);
        } else {
          if (this.mainSkills.length >= 3) {
            alert('Можно выбрать не более 3 основных навыков');
            return;
          }
          
          this.mainSkills.push(skill);
        }
      }
    },

    watch: {
      activeTab(newTab) {
        if (newTab === 'application') {
          this.loadApplications();
        }
      },
      user() {
        this.loadUserSkills();
        this.initProfileForm();
      },
      selectedSkills(newSkills, oldSkills) {
        const removedSkills = oldSkills.filter(skill => !newSkills.includes(skill));
        
        if (removedSkills.length > 0) {
          this.mainSkills = this.mainSkills.filter(skill => 
            newSkills.includes(skill)
          );
        }
      }
    }
}
</script>
<style>
.profile-container{
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
  border-radius: 0px 0px 2rem 2rem;
}
.profile-header{
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
}
.profile-main{
  font-size: 1.3rem;
  display: flex;
  justify-content: space-between;
  align-items: start;
  flex-direction: row-reverse;

}
.profile-avatar{
  display: flex;
  justify-content: start;
  align-items: end;
  gap: 1rem;
}
.profile-img{
  height: 16rem;
  width: 12rem;
  border: 2px solid var(--border);
  border-radius: 8px;
}
.profile-achievments{
  display: flex;
  flex-direction: column;
  font-size: 1.15rem;
  padding: 1rem 0;
}
.profile-main-skills{
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  font-weight: 400;
  font-size: 1.2rem;
  padding-bottom: 1rem;
}
.profile-buttons{
  display: flex;
  gap: 1rem;
}
.load-photo, .choose-main-skills{
  font-size: 0.9rem;
  padding: 0.6rem 0.9rem;
  font-weight: 700;
}
.profile-tabs{
  margin: 0.5rem 0 0 2rem;
}
.tab-button {
  background: none;
  border: none;
  padding: 0.7rem 0.7rem;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-secondary);
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  font-weight: 600;
  position: relative;
}
.tab-content{
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2rem;
}
.trip-section h3{
  margin-bottom: 1rem;
}
.active-tab{
  color: var(--primary);
  border-bottom-color: var(--primary);
}
.my-trip-card{
  position: relative;
  margin-bottom: 2rem;
  border-radius: 1.5rem;overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border);
  max-width: 560px;
}
.my-trip-info{
  padding: 1.5rem;
}
.my-trips-link{
  text-decoration: none;
}
.my-trip-badge{
    background: var(--accent);
    position: absolute;
    top: 1rem;
    left: 1rem;
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    z-index: 2;
    padding: 0.5rem 1rem;
    border-radius: 20px;
}
.my-trip-image{
    height: 300px;
    width: 100%;
    background: var(--gradient-primary);
    position: relative;
    overflow: hidden;
}
.my-trip-image img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.settings-section, .skills-section {
    background: var(--white);
    padding: 0 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
}
.form-actions{
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.form-actions button{
  border: 0;
}

.security-section{
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border);
}
.security-actions{
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.security-action{
  padding: 0.8rem 1rem;
  color: var(--text-primary);
  border-color: #cdd1d6;
}

.logout{
  border-color: var(--extra);
  color: var(--extra);
}
.section-description {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
}
.skill-category {
    background: var(--background);
    padding: 1.5rem;
    border-radius: 12px;
}
.skills-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
}
.skill-checkbox {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background-color 0.3s ease;
}
.skill-checkbox input[type="checkbox"] {
    display: none;
}
.skill-checkbox input[type="checkbox"]:checked + .checkmark {
    background: var(--primary);
    border-color: var(--primary);
}
.skill-checkbox input[type="checkbox"]:checked + .checkmark::after {
    content: '✓';
    position: absolute;
    color: white;
    font-size: 14px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
}
.medical-info{
    margin-top: 1rem;
    padding: 1.5rem;
    background: #f0f9ff;
    border-radius: 12px;
    border-left: 4px solid var(--primary);
}
.medical-info *{
  background: #f0f9ff;
}

.nav-controls{
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}

.nav-btn {
  width: 60px;
  height: 40px;
  border-radius: 10px;
  border: 2px solid var(--primary);
  background: white;
  color: var(--primary);
  font-size: 1.2rem;
  cursor: pointer;
}

.nav-btn:hover:not(:disabled) {
  background: var(--primary);
  color: white;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #ccc;
  color: #ccc;
}

.trip-counter{
  font-size: 1.4rem;
  font-weight: 700;
}

.modal-for-main-skills{
  display: flex;
  flex-direction: column;
  width: 80%;
  left: 50px;
  top: 30%;
  position: absolute;
  background: var(--background);
  border: 2px solid #e2e8f0;
  padding: 15px;
  z-index: 1000;
}

.modal-for-main-skills button{
  border: 0;
  cursor: pointer;
}

.modal-header{
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.modal-header h3{
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.modal-header button{
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.modal-main{
  display: flex;
  flex-direction: column;
}

.modal-main .modal-field{
  cursor: pointer;
}

.selected{
  color: var(--primary-dark);
}

.modal-main .modal-field:hover{
  color: var(--primary);
}

.save-main-skills-btn{
  margin-top: 25px;
}

.no-skills{
  display: flex;
  flex-direction: column;
  margin: 0px auto;
  width: 50%;
  text-align: center;
  gap: 2rem;
}

.my-applications-section,
.review-applications-section,
.no-organized-trips {
  margin-bottom: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.my-applications-section h3,
.review-applications-section h3,
.no-organized-trips h3{
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1976d2;
}

/* Мои заявки */
.applications-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.application-card {
  background: var(--surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.application-card *{
  background: var(--surface);
}

.application-card.status-pending {
  border-left: 4px solid var(--accent);
}

.application-card.status-accepted {
  border-left: 4px solid var(--secondary);
}

.application-card.status-rejected {
  border-left: 4px solid var(--extra);
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.application-header h4 {
  margin: 0;
  font-size: 18px;
}

.application-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}


.application-info p {
  margin: 8px 0;
}

.application-message {
  margin: 16px 0;
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid #1976d2;
}

.message-content {
  font-style: italic;
  color: #333;
  margin-top: 8px;
}

.application-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
  font-size: 14px;;
}

.application-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.application-actions a{
  padding: 0.75rem;
}

.cancel-btn {
  color: var(--extra);
  border-color: var(--extra);
}

.cancel-btn:hover {
  color: var(--surface);
  background-color: var(--extra);
  
}

.application-success {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
}

.success-icon {
  font-size: 18px;
}

/* Заявки на рассмотрение */
.pending-applications h4,
.rejected-applications h4 {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge-count {
  background: var(--primary);
  color: white;
  border-radius: 18px;
  font-size: 14px;
  min-width: 30px;
  min-height: 30px;
  text-align: center;
  padding: 4px 10px;
}

.pending-card,
.rejected-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.trip-info h5 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.trip-destination {
  font-size: 14px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-badge.pending {
  background-color: var(--accent);
  color: var(--surface);
}

.status-badge .rejected {
  background-color: var(--extra);
  color: var(--extra);
}

.applicant-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.avatar-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.applicant-details h6 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.applicant-email,
.applicant-phone {
  margin: 4px 0;
  font-size: 14px;
}

.applicant-skills {
  margin: 16px 0;
}

.skills-title {
  font-weight: 500;
  margin-bottom: 8px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 4px 10px;
  background: #e3f2fd;
  border-radius: 16px;
  font-size: 13px;
  color: var(--primary);
}

.more-skills {
  padding: 4px 10px;
  background: var(--background);
  border-radius: 16px;
  font-size: 13px;
  color: #666;
}

.medical-info-section {
  margin: 16px 0;
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid var(--accent);
}

.medical-title {
  font-weight: 500;
  margin-bottom: 8px;
}

.medical-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.medical-tag {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
}

.medical-tag.warning {
  color: var(--accent);
}

.medical-tag.info {
  color: var(--accent);
}

.message-title {
  font-weight: 500;
  margin-bottom: 8px;
}

.trip-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  font-size: 14px;
}

.review-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.accept-btn {
  background-color: var(--surface);
  color: var(--secondary);
  border-color: var(--secondary); 
}

.accept-btn:hover:not(:disabled) {
  color: var(--surface);
  background-color: var(--secondary);
}

.accept-btn:disabled {
  background-color: var(--secondary);
  cursor: not-allowed;
  opacity: 0.4;
}

.reject-btn {
  background-color: var(--surface);
  color: var(--extra);
  border-color: var(--extra);
}

.reject-btn:hover {
  background-color: var(--extra);
  color: var(--surface);
  
}

.trip-full-warning {
  margin-top: 12px;
  padding: 10px;
  background: var(--surface);
  border-radius: 6px;
  color: var(--extra);
  text-align: center;
  font-size: 14px;
}

/* Отклоненные заявки */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toggle-btn {
  padding: 6px 12px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.toggle-btn:hover {
  background: #e0e0e0;
}

.rejected-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Состояния загрузки и пустых списков */
.loading-state,
.no-applications {
  text-align: center;
  padding: 0 20px 20px 20px;
}

.no-organized-trips .empty-state {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h4 {
  margin: 0 0 8px 0;
}

.empty-state p {
  margin: 0 0 20px 0;
}

.no-applications h4 {
  margin: 0 0 16px 0;
}

.no-applications a,
.empty-state a {
  display: inline-block;
}
</style>