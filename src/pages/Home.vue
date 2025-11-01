<template>
    <section class="hero-section">
        <h1>Откройте мир вместе</h1>
        <p>Найдите попутчиков для ваших приключений. Планируйте маршруты, делитесь бюджетом и создавайте незабываемые воспоминания.</p>
    </section>
    <section class="search-section">
        <div class="search-header">
            <h2>Найдите свое путешествие</h2>
            <button type="button" @click="showModal = true" class="filters">Фильтры</button>
            <div v-if="showModal" class="modal-filters">
                <button type="button" @click="showModal = false">Закрыть</button>
            </div>
        </div>
        <div class="search-panel">
            <div class="travel-direction">
                <label for="direction">Куда хотите поехать?</label>
                <input type="text" id="direction" placeholder="Например, Кавказ или Байкал" >
            </div>
            <div class="travel-date">
                <label for="date">Дата начала</label>
                <input type="date" id="date">
            </div>
            <div class="travel-budget">
                <label for="budget">Бюджет</label>
                <select>
                    <option checked>Любой бюджет</option>
                    <option value="low">До 20 000₽</option>
                    <option value="medium">20 000 - 50 000₽</option>
                    <option value="high">От 50 000₽</option>
                </select>
            </div>
            <button type="button" @click="search()">Найти</button>
        </div>
    </section>
    <section class="popular-trips-section">
        <div class="popular-trips-header">
            <h2>Популярные путешествия</h2>
            <router-link to="/allTrips" class="link">Все путешествия</router-link>
        </div>
        <div v-for="trip in mostPopularTrips" :key="trip.id" class="popular-trips-main">
            <div class="trip-card">
                <router-link :to="`/trips/${trip.id}`" class="cardLink">
                    <div class="trip-badge">Популярное</div>
                    <div class="trip-image">
                        <img src="../assets/baikal.jpg" alt="" class="imgOfTravel">
                    </div>
                    <div class="trip-content">
                        <div class="trip-header">
                            <h3>{{ trip.travelName }}</h3>
                            <div class="trip-price">{{ trip.travelPrice }}₽</div>
                        </div>
                        <div class="trip-main">
                            <span class="trip-main-item">{{ trip.travelDirection }}</span>
                            <span class="trip-main-item">{{ trip.travelDate }}</span>
                            <span class="trip-main-item">{{ trip.travelDuration }}</span>
                        </div>
                        <span class="trip-description">{{ trip.travelDescription }}</span>
                        <div class="trip-footer">
                            <div class="trip-participants">
                                <div class="avatar-group">
                                    <div v-for="participant in trip.travelParticipants" class="avatar">
                                        {{ participant.name[0] }}
                                    </div>
                                </div>
                                
                                <span>{{ trip.travelCurrentParticipants }}/{{ trip.travelMaxParticipants }} участников</span>
                            </div>
                            <div class="trip-stats">
                                <span>{{ trip.travelStats }}</span>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
        
    </section>
</template>

<script>

export default {
    name: 'Home',
    data(){
        return{
            showModal: false,
            mostPopularTrips: [
                {
                    travelName: "Горный поход на Кавказ",
                    travelDirection: "Кавказские горы",
                    travelDate: "15-22 июля 2024",
                    travelDuration: 1,
                    travelDescription: "Недельный поход по живописным маршрутам Кавказа. Маршрут средней сложности, ночуем в палатках, готовим на костре.",
                    tavelpCurrentParticipants: 3,
                    tavelpMaxParticipants: 6,
                    travelParticipants: [
                        {
                            name: "Андрей"
                        },
                        {
                            name: "Марина"
                        },
                        {
                            name: "Савелий"
                        }
                    ],
                    travelStats: "Средняя",
                    travelPrice: "35 000",
                    tripID: 1
                },
                {
                    travelName: "Горный поход на Кавказ",
                    travelDirection: "Кавказские горы",
                    travelDate: "15-22 июля 2024",
                    travelDuration: 2,
                    travelDescription: "Недельный поход по живописным маршрутам Кавказа. Маршрут средней сложности, ночуем в палатках, готовим на костре.",
                    tavelpCurrentParticipants: 3,
                    tavelpMaxParticipants: 6,
                    travelParticipants: [
                        {
                            name: "Андрей"
                        },
                        {
                            name: "Марина"
                        },
                        {
                            name: "Савелий"
                        }
                    ],
                    travelStats: "Средняя",
                    travelPrice: "35 000",
                    tripID: 2
                },
                {
                    travelName: "Горный поход на Кавказ",
                    travelDirection: "Кавказские горы",
                    travelDate: "15-22 июля 2024",
                    travelDuration: 3,
                    travelDescription: "Недельный поход по живописным маршрутам Кавказа. Маршрут средней сложности, ночуем в палатках, готовим на костре.",
                    tavelpCurrentParticipants: 3,
                    tavelpMaxParticipants: 6,
                    travelParticipants: [
                        {
                            name: "Андрей"
                        },
                        {
                            name: "Марина"
                        },
                        {
                            name: "Савелий"
                        }
                    ],
                    travelStats: "Средняя",
                    travelPrice: "35 000",
                    tripID: 3
                },
                {
                    travelName: "Горный поход на Кавказ",
                    travelDirection: "Кавказские горы",
                    travelDate: "15-22 июля 2024",
                    travelDuration: 4,
                    travelDescription: "Недельный поход по живописным маршрутам Кавказа. Маршрут средней сложности, ночуем в палатках, готовим на костре.",
                    travelCurrentParticipants: 3,
                    travelMaxParticipants: 6,
                    travelParticipants: [
                        {
                            name: "Андрей"
                        },
                        {
                            name: "Марина"
                        },
                        {
                            name: "Савелий"
                        }
                    ],
                    travelStats: "Средняя",
                    travelPrice: "35 000",
                    tripID: 4
                },
                {
                    travelName: "Горный поход на Кавказ",
                    travelDirection: "Кавказские горы",
                    travelDate: "15-22 июля 2024",
                    travelDuration: 5,
                    travelDescription: "Недельный поход по живописным маршрутам Кавказа. Маршрут средней сложности, ночуем в палатках, готовим на костре.",
                    travelCurrentParticipants: 3,
                    travelMaxParticipants: 6,
                    travelParticipants: [
                        {
                            name: "Андрей"
                        },
                        {
                            name: "Марина"
                        },
                        {
                            name: "Савелий"
                        }
                    ],
                    travelStats: "Средняя",
                    travelPrice: "35 000",
                    tripID: 5
                },
                {
                    travelName: "Горный поход на Кавказ",
                    travelDirection: "Кавказские горы",
                    travelDate: "15-22 июля 2024",
                    travelDuration: 6,
                    travelDescription: "Недельный поход по живописным маршрутам Кавказа. Маршрут средней сложности, ночуем в палатках, готовим на костре.",
                    travelCurrentParticipants: 3,
                    travelMaxParticipants: 6,
                    travelParticipants: [
                        {
                            name: "Андрей"
                        },
                        {
                            name: "Марина"
                        },
                        {
                            name: "Савелий"
                        }
                    ],
                    travelStats: "Средняя",
                    travelPrice: "35 000",
                    tripID: 6
                },
                {
                    travelName: "Горный поход на Кавказ",
                    travelDirection: "Кавказские горы",
                    travelDate: "15-22 июля 2024",
                    travelDuration: 7,
                    travelDescription: "Недельный поход по живописным маршрутам Кавказа. Маршрут средней сложности, ночуем в палатках, готовим на костре.",
                    travelCurrentParticipants: 3,
                    travelMaxParticipants: 6,
                    travelParticipants: [
                        {
                            name: "Андрей"
                        },
                        {
                            name: "Марина"
                        },
                        {
                            name: "Савелий"
                        }
                    ],
                    travelStats: "Средняя",
                    travelPrice: "35 000",
                    tripID: 7
                },
                {
                    travelName: "Горный поход на Кавказ",
                    travelDirection: "Кавказские горы",
                    travelDate: "15-22 июля 2024",
                    travelDuration: 8,
                    travelDescription: "Недельный поход по живописным маршрутам Кавказа. Маршрут средней сложности, ночуем в палатках, готовим на костре.",
                    travelCurrentParticipants: 3,
                    travelMaxParticipants: 6,
                    travelParticipants: [
                        {
                            name: "Андрей"
                        },
                        {
                            name: "Марина"
                        },
                        {
                            name: "Савелий"
                        }
                    ],
                    travelStats: "Средняя",
                    travelPrice: "35 000",
                    tripID: 8
                },
                {
                    travelName: "Горный поход на Кавказ",
                    travelDirection: "Кавказские горы",
                    travelDate: "15-22 июля 2024",
                    travelDuration: 9,
                    travelDescription: "Недельный поход по живописным маршрутам Кавказа. Маршрут средней сложности, ночуем в палатках, готовим на костре.",
                    travelCurrentParticipants: 3,
                    travelMaxParticipants: 6,
                    travelParticipants: [
                        {
                            name: "Андрей"
                        },
                        {
                            name: "Марина"
                        },
                        {
                            name: "Савелий"
                        }
                    ],
                    travelStats: "Средняя",
                    travelPrice: "35 000",
                    tripID: 9
                },
                {
                    travelName: "Горный поход на Кавказ",
                    travelDirection: "Кавказские горы",
                    travelDate: "15-22 июля 2024",
                    travelDuration: 10,
                    travelDescription: "Недельный поход по живописным маршрутам Кавказа. Маршрут средней сложности, ночуем в палатках, готовим на костре.",
                    travelCurrentParticipants: 3,
                    travelMaxParticipants: 6,
                    travelParticipants: [
                        {
                            name: "Андрей"
                        },
                        {
                            name: "Марина"
                        },
                        {
                            name: "Савелий"
                        }
                    ],
                    travelStats: "Средняя",
                    travelPrice: "35 000",
                    tripID: 10
                }
            ]
        }
    }
}
</script>

<style>
.hero-section{
    text-align: center;
    margin-bottom: 3rem;
    padding: 4rem 0px 2rem;
    border-radius: 0px 0px 2rem 2rem;
}
.hero-section h1{
    font-size: 3.5rem;
    font-weight: 800;
    background-clip: text;
    margin-bottom: 1rem;
    line-height: 1.2;
    color: #2563eb;
}
.hero-section p{
    color: #64748b;
    font-size: 1.25rem;
    max-width: 600px;
    margin: 0px auto 2rem;
}
.trip-card{
    position: relative;
}
.trip-badge{
    background: rgb(154, 220, 203);
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
.trip-image{
    width: 520px;
    height: 250px;
}
.imgOfTravel{
    width: 100%;
    height: 100%;
}
</style>