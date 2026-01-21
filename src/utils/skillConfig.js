export const SKILLS_CONFIG = {
    transport: [
      { id: 'driving_license_b', label: 'Водительские права категории B' },
      { id: 'offroad_experience', label: 'Опыт вождения внедорожника' },
      { id: 'car_rental', label: 'Могу арендовать автомобиль' }
    ],
    languages: [
      { id: 'english_intermediate', label: 'Английский (Intermediate)' },
      { id: 'german_basic', label: 'Немецкий (Basic)' }
    ],
    general: [
      { id: 'photographer', label: 'Фотограф' },
      { id: 'cook', label: 'Повар' },
      { id: 'medical_training', label: 'Медицинская подготовка' },
      { id: 'survival_skills', label: 'Навыки выживания в природе' }
    ]
  };
  
  export const ALL_SKILLS = Object.values(SKILLS_CONFIG).flat();