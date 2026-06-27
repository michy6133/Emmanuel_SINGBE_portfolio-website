import type { SiteContent } from './types'

export const DEFAULT_CONTENT: SiteContent = {
  contact: {
    phone: '+229 01 00 00 00 00',
    email: 'contact@emmanuelsingbe.com',
    whatsapp: '22901000000000',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
  stats: [
    { value: 100, suffix: '+', label: 'Vidéos réalisées' },
    { value: 25, suffix: '+', label: 'Projets accompagnés' },
    { value: 3, suffix: '', label: 'Certifications' },
    { value: 2, suffix: '+', label: "Années d'expérience" },
  ],
  why: [
    {
      title: 'Créativité',
      text: 'Je transforme les idées en contenus visuels engageants qui captent immédiatement l’attention.',
    },
    {
      title: 'Réactivité',
      text: 'Communication fluide, écoute active et respect rigoureux des délais convenus.',
    },
    {
      title: 'Stratégie',
      text: 'Chaque contenu poursuit un objectif précis et s’inscrit dans une vision globale.',
    },
    {
      title: 'Adaptabilité',
      text: 'Des solutions sur mesure adaptées aux entreprises, marques et entrepreneurs.',
    },
  ],
  projects: [
    {
      id: 'brand-campaign',
      title: 'Campagne produit immersive',
      client: 'TechNova',
      year: '2024',
      category: 'Marques',
      thumbnail: '/work-brand-campaign.png',
      shortDescription:
        'Direction et réalisation d’une campagne vidéo de lancement produit pour les réseaux sociaux.',
      context:
        'TechNova lançait un nouveau produit phare et souhaitait une campagne vidéo percutante pensée pour le mobile.',
      objectives:
        'Mettre en valeur le produit, générer du désir et maximiser la portée organique sur Instagram et TikTok.',
      results:
        'Plus de 250 000 vues cumulées sur les premières 72 heures et un taux d’engagement supérieur à 9%.',
      gallery: ['/work-brand-campaign.png', '/work-social.png', '/work-fashion.png'],
    },
    {
      id: 'corporate-event',
      title: 'Couverture de conférence annuelle',
      client: 'Sèmè City',
      year: '2024',
      category: 'Événementiel',
      thumbnail: '/work-event.png',
      shortDescription:
        'Captation et aftermovie dynamique d’un événement professionnel de grande envergure.',
      context:
        'Un événement réunissant des centaines de participants nécessitait une couverture complète et un rendu premium.',
      objectives:
        'Immortaliser les temps forts et produire un aftermovie partageable mettant en valeur l’expérience.',
      results:
        'Un aftermovie livré en 48h, largement relayé par les partenaires et participants.',
      gallery: ['/work-event.png', '/work-documentary.png', '/work-brand-campaign.png'],
    },
    {
      id: 'social-series',
      title: 'Série de contenus social media',
      client: 'Maison Kola',
      year: '2023',
      category: 'Community Management',
      thumbnail: '/work-social.png',
      shortDescription:
        'Ligne éditoriale et production mensuelle de contenus verticaux pour une marque lifestyle.',
      context:
        'La marque souhaitait structurer sa présence digitale avec une identité forte et cohérente.',
      objectives:
        'Construire une ligne éditoriale claire et produire des contenus réguliers à fort impact.',
      results:
        'Croissance de +180% de la communauté en six mois et une présence cohérente sur tous les formats.',
      gallery: ['/work-social.png', '/work-fashion.png', '/work-brand-campaign.png'],
    },
    {
      id: 'documentary',
      title: 'Portrait documentaire',
      client: 'Fondation IAM',
      year: '2023',
      category: 'Vidéo',
      thumbnail: '/work-documentary.png',
      shortDescription:
        'Réalisation d’un mini-documentaire portrait mettant en lumière un parcours inspirant.',
      context:
        'La fondation souhaitait raconter l’histoire d’un de ses bénéficiaires de manière émouvante.',
      objectives:
        'Créer une narration sincère, soignée et émotionnelle au service du message.',
      results:
        'Une vidéo saluée pour sa qualité narrative et utilisée comme contenu phare de communication.',
      gallery: ['/work-documentary.png', '/work-event.png', '/work-music.png'],
    },
    {
      id: 'fashion',
      title: 'Lookbook vidéo mode',
      client: 'Atelier Adé',
      year: '2024',
      category: 'Marques',
      thumbnail: '/work-fashion.png',
      shortDescription:
        'Direction artistique et réalisation d’un lookbook vidéo pour une collection mode.',
      context:
        'Une marque de mode émergente voulait présenter sa nouvelle collection avec un rendu haut de gamme.',
      objectives:
        'Sublimer les pièces et créer un univers visuel premium et désirable.',
      results:
        'Un lookbook vidéo qui a renforcé le positionnement premium de la marque.',
      gallery: ['/work-fashion.png', '/work-brand-campaign.png', '/work-social.png'],
    },
    {
      id: 'music-video',
      title: 'Clip & captation live',
      client: 'Artiste indépendant',
      year: '2023',
      category: 'Vidéo',
      thumbnail: '/work-music.png',
      shortDescription:
        'Captation multi-caméra et montage rythmé d’une performance musicale live.',
      context:
        'Un artiste indépendant souhaitait un contenu énergique pour accompagner sa sortie.',
      objectives:
        'Retranscrire l’énergie de la performance et créer un contenu partageable.',
      results:
        'Un clip dynamique qui a accompagné une sortie réussie sur les plateformes.',
      gallery: ['/work-music.png', '/work-event.png', '/work-documentary.png'],
    },
  ],
  services: [
    {
      title: 'Création de contenu vidéo mobile',
      text: 'Production de vidéos dynamiques adaptées aux réseaux sociaux afin de renforcer votre visibilité et capter l’attention de votre audience.',
    },
    {
      title: 'Community Management',
      text: 'Gestion stratégique des réseaux sociaux, animation de communauté et création d’une relation durable avec votre audience.',
    },
    {
      title: 'Couverture d’événements',
      text: 'Captation et réalisation de contenus photo et vidéo pour vos événements professionnels ou privés.',
    },
    {
      title: 'Stratégie de contenu',
      text: 'Conception d’une ligne éditoriale et d’un plan de contenu performant aligné sur vos objectifs.',
    },
    {
      title: 'Accompagnement de marques',
      text: 'Conseil et accompagnement pour développer une image forte, cohérente et mémorable.',
    },
  ],
  certifications: [
    {
      year: '2024',
      title: 'Certification MTN Bénin',
      org: 'MTN Bénin',
      logo: '/placeholder-logo.png',
      description:
        'Programme de formation au marketing digital et à la création de contenu pour le mobile.',
      skills: ['Marketing digital', 'Création mobile', 'Stratégie'],
    },
    {
      year: '2023',
      title: 'Formation Sèmè City',
      org: 'Sèmè City',
      logo: '/placeholder-logo.png',
      description:
        'Formation avancée en production audiovisuelle et storytelling de marque.',
      skills: ['Production vidéo', 'Storytelling', 'Direction artistique'],
    },
    {
      year: '2023',
      title: 'Fondation IAM',
      org: 'Fondation IAM',
      logo: '/placeholder-logo.png',
      description:
        'Accompagnement en communication digitale et gestion de communauté.',
      skills: ['Community Management', 'Communication', 'Réseaux sociaux'],
    },
    {
      year: '2022',
      title: 'Certifications complémentaires',
      org: 'Programmes divers',
      logo: '/placeholder-logo.png',
      description:
        'Formations continues en montage vidéo, photographie et outils créatifs.',
      skills: ['Montage', 'Photographie', 'Outils créatifs'],
    },
  ],
  testimonials: [
    {
      name: 'Aïcha D.',
      role: 'Responsable Marketing',
      company: 'TechNova',
      photo: '/client-1.png',
      text: 'Emmanuel a su transformer notre vision en une campagne vidéo qui a dépassé toutes nos attentes. Professionnel, créatif et réactif.',
    },
    {
      name: 'Karim B.',
      role: 'Fondateur',
      company: 'Maison Kola',
      photo: '/client-2.png',
      text: 'Grâce à sa stratégie de contenu, notre communauté a explosé. Un partenaire de confiance qui comprend réellement les enjeux digitaux.',
    },
    {
      name: 'Fatou N.',
      role: 'Directrice',
      company: 'Atelier Adé',
      photo: '/client-3.png',
      text: 'Un sens du détail et une exigence rares. Le rendu de nos vidéos est tout simplement haut de gamme. Je recommande sans hésiter.',
    },
  ],
  navLinks: [
    { label: 'À propos', href: '#about' },
    { label: 'Réalisations', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Parcours', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
  ],
  welcomeVideo: {
    enabled: true,
    videoUrl: '/welcome.mp4',
    posterImage: '/hero-bg.png',
    title: 'Bienvenue dans mon univers créatif',
    subtitle: 'Découvrez mon approche de la vidéo mobile en quelques secondes',
  },
  hero: {
    eyebrow: 'Portfolio · Studio créatif',
    titleLine1: 'Emmanuel',
    titleLine2: 'SINGBE',
    subtitle: 'Vidéaste Mobile · Créateur de contenu · Community Manager',
    description:
      'Dans un monde où l’attention est devenue la ressource la plus précieuse, chaque vidéo doit raconter une histoire, susciter une émotion et générer un impact.',
    portraitImage: '/emmanuel-portrait.png',
    experienceValue: '2+ ans',
    experienceLabel: "d'expérience créative",
  },
  about: {
    title: 'Donner vie à vos idées en images',
    description:
      'Vidéaste mobile, créateur de contenu et community manager, je transforme les idées des marques et entrepreneurs en contenus visuels qui captent l’attention et génèrent de l’impact. Mon approche allie créativité, stratégie et exigence technique pour raconter votre histoire de la manière la plus juste.',
    portraitImage: '/emmanuel-portrait.png',
    experienceValue: '2+ ans',
    experienceLabel: "d'expérience créative",
    extendedBio: [
      'Mon aventure dans l’audiovisuel a commencé par une passion simple : raconter des histoires avec les outils que tout le monde a dans la poche. Très vite, j’ai compris que la vidéo mobile n’était pas une contrainte mais une force — agile, authentique et parfaitement adaptée aux codes des réseaux sociaux.',
      'Au fil des projets, j’ai accompagné des marques, des entrepreneurs et des institutions dans la création de contenus à fort impact : campagnes produit, couvertures d’événements, séries social media et documentaires de marque. Chaque collaboration est l’occasion de conjuguer sensibilité artistique et vision stratégique.',
      'Formé auprès de structures reconnues comme Sèmè City, la Fondation IAM et certifié par MTN Bénin, je continue d’affiner mon expertise pour offrir à mes clients un accompagnement à la hauteur des standards des meilleures agences.',
    ],
  },
}
