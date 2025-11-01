<template>
    <section class="hero-section">
        <h1>Откройте мир вместе</h1>
        <p>Найдите попутчиков для ваших приключений. Планируйте маршруты, делитесь бюджетом и создавайте незабываемые воспоминания.</p>
    </section>
    <section class="search-section">
        <div class="search-header">
            <h2>Найдите своё путешествие</h2>
            <button type="button" @click="showModal = true" class="filtersButton">Фильтры</button>
            <div v-if="showModal" class="modal-filters">
                <button type="button" @click="showModal = false">Закрыть</button>
            </div>
        </div>
        <form class="search-panel" @submit.prevent="handleSearch">
            <div class="search-item">
                <label for="direction">Куда хотите поехать?</label>
                <input type="text" id="direction" placeholder="Например, Кавказ или Байкал" >
            </div>
            <div class="search-item">
                <label for="date">Дата начала</label>
                <input type="date" id="date">
            </div>
            <div class="search-item">
                <label for="budget">Бюджет</label>
                <select>
                    <option checked>Любой бюджет</option>
                    <option value="low">До 20 000₽</option>
                    <option value="medium">20 000 - 50 000₽</option>
                    <option value="high">От 50 000₽</option>
                </select>
            </div>
            <BlueBtn type="submit" @click="handleSearch">Найти</BlueBtn>
        </form>
    </section>
    <section class="popular-trips-section">
        <div class="popular-trips-header">
            <h2>Популярные путешествия</h2>
            <router-link to="/allTrips" class="link">
                <span>Все путешествия</span>
                <span>→</span>
            </router-link>
        </div>
        <div class="popular-trips-main">
            <TripCard
            v-for="trip in mostPopularTrips"
            :key="trip.tripID"
            :trip="trip"
            />
        </div>
        
    </section>
</template>

<script>
import BlueBtn from '@/components/ui/BlueBtn.vue';
import TripCard from '@/components/ui/TripCard.vue'
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
    },
    methods: {
        handleSearch() {
            console.log("Форма отправлена")
        }
    },
    components: {
        BlueBtn,
        TripCard
    }
}
</script>

<style>
.hero-section{
    text-align: center;
    margin-bottom: 3rem;
    padding: 4rem 0px 2rem;
    border-radius: 0px 0px 2rem 2rem;
    background: var(--gradient-surface);
}
.hero-section h1{
    font-size: 3.5rem;
    font-weight: 800;
    background-clip: text;
    margin-bottom: 1rem;
    line-height: 1.2;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.hero-section p{
    color: var(--text-secondary);
    font-size: 1.25rem;
    max-width: 600px;
    margin: 0px auto 2rem;
}
.search-section{
    background: var(--surface);
    padding: 2rem;
    border-radius: 1.5rem;
    box-shadow: var(--shadow);
    margin-bottom: 3rem;
}

.search-header{
    display: flex;
    justify-content: start;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
}

.search-header h2{
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 700;
}
.search-header .filtersButton{
    background: none;
    border: 2px solid var(--border);
    padding: 0.5rem 0.8rem;
    border-radius: 10px;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.4s ease;
}
.search-header .filtersButton:hover {
    border-color: var(--primary);
    color: var(--primary);
}
.search-panel{
    display: grid;
    grid-template-columns: 2fr 1fr 1fr auto;
    gap: 1rem;
    align-items: end;
}
.search-panel .search-item{
    position: relative;
}
.search-panel .search-item label{
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.9rem;
}
.search-panel .search-item input, select{
    width: 100%;
    padding: 1rem 1.5rem;
    border: 2px solid var(--border);
    border-radius: 12px;
    background: var(--surface);
    font-size: 1rem;
    transition: all 0.3s ease;
    font-family: inherit;
}
.search-panel .search-item:nth-child(3) select{
    padding: 1rem 0.5rem;
}
.popular-trips-section{
    margin-bottom: 4rem;
}
.popular-trips-header{
    display: flex; 
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border);
}
.popular-trips-header h2{
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
}
.popular-trips-header .link{
    text-decoration: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.popular-trips-header .link span{
    color: var(--primary);
}
.popular-trips-main{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 2rem;
}

</style>