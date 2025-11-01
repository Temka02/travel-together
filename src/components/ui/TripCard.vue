<template>
    <div class="trip-card">
        <router-link :to="`/trips/${trip.id}`" class="cardLink">
            <div class="trip-badge">Популярное</div>
            <div class="trip-image">
                <img src="@/assets/baikal.jpg" alt="" class="imgOfTravel">
            </div>
            <div class="trip-content">
                <div class="trip-header">
                    <h3>{{ trip.travelName }}</h3>
                    <div class="trip-price">{{ trip.travelPrice }}₽</div>
                </div>
                <div class="trip-main">
                    <div class="trip-main-item">
                        <span>📍</span>
                        <span>{{ trip.travelDirection }}</span>
                    </div>
                    <div class="trip-main-item">
                        <span>📅</span>
                        <span>{{ trip.travelDate }}</span>
                    </div>
                    <div class="trip-main-item">
                        <span>⏱️</span>
                        <span>{{ trip.travelDuration }} дней</span>
                    </div>
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
                    <div class="trip-stats medium">
                        <span>{{ trip.travelStats }}</span>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'TripCard',
    props: {
        trip: {
            type: Object,
            required: true
        }
    }
}
</script>

<style>
.trip-card{
    background: var(--surface);
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    border: 1px solid var(--border);
}
.cardLink{
    text-decoration: none;
    color: inherit;
    display: block;
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
    height: 330px;
    background: var(--gradient-primary);
    position: relative;
    overflow: hidden;
}
.imgOfTravel{
    width: 100%;
    height: 100%;
}
.trip-content {
    padding: 1.5rem;
}
.trip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}
.trip-header h3{
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.4;
    flex: 1;
}
.trip-header .trip-price{
    background: var(--gradient-primary);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 700;
    font-size: 1.1rem;
}
.trip-main {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
}
.trip-main-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
}
.trip-description {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.trip-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
}
.trip-participants {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}
.trip-participants .avatar-group{
    display: flex;
}
.avatar:first-child {
    margin-left: 0;
}
.avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    color: white;
    font-weight: 600;
    border: 2px solid var(--surface);
    margin-left: -8px;
}
.trip-stats{
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1.1rem;
}
.easy{
    background: var(--secondary);
}
.medium{
    background: var(--accent);
}
.hard{
    background: var(--extra);
}
.trip-stats span{
    background: inherit;
    color: inherit;
}
</style>