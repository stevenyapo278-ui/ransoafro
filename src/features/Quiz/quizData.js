export const quizQuestions = [
  {
    id: 1,
    tag: "Question 01 — L'épreuve de l'eau",
    text: "Comment vos cheveux réagissent-ils à l'eau sous la douche ?",
    options: [
      { val: "A", text: "L'eau perle à la surface. Je dois masser longtemps pour qu'ils soient mouillés." },
      { val: "B", text: "Mes cheveux se mouillent facilement et sans effort particulier." },
      { val: "C", text: "Mes cheveux sont instantanément saturés d'eau dès que je passe sous la douche." }
    ]
  },
  {
    id: 2,
    tag: "Question 02 — Le temps de séchage",
    text: "Combien de temps mettent vos cheveux à sécher naturellement ?",
    options: [
      { val: "A", text: "Une éternité — parfois plus de 8 heures." },
      { val: "B", text: "Quelques heures, de façon uniforme." },
      { val: "C", text: "Très rapidement (moins d'une heure), mais ils deviennent vite rêches." }
    ]
  },
  {
    id: 3,
    tag: "Question 03 — La réaction aux produits",
    text: "Comment vos cheveux réagissent-ils après l'application d'une crème ?",
    options: [
      { val: "A", text: "Les produits restent à la surface, mes cheveux semblent lourds ou poisseux." },
      { val: "B", text: "Les produits pénètrent bien et mes cheveux restent souples plusieurs jours." },
      { val: "C", text: "Mes cheveux \"boivent\" la crème en un instant, mais semblent secs dès le lendemain." }
    ]
  },
  {
    id: 4,
    tag: "Question 04 — Le test du toucher",
    text: "Faites glisser un doigt le long d'un cheveu, de la pointe vers la racine. Que ressentez-vous ?",
    options: [
      { val: "A", text: "Le cheveu est parfaitement lisse et glisse tout seul." },
      { val: "B", text: "Le cheveu est souple et régulier." },
      { val: "C", text: "On sent des aspérités, le cheveu semble rugueux ou s'emmêle facilement." }
    ]
  }
];

export const resultsData = {
  A: {
    icon: 'water',
    title: 'Porosité <em>Faible</em>',
    pct: 18,
    type: 'Faible',
    state: 'Vos cuticules sont très serrées, formant une barrière compacte. L\'eau et les soins peinent à pénétrer la fibre capillaire, mais une fois l\'hydratation capturée, elle se maintient longtemps.',
    sol: 'Utilisez la <strong>chaleur douce</strong> lors de vos soins (bonnet chauffant) pour entrouvrir les cuticules. Optez pour des <strong>laits capillaires légers</strong> et des <strong>huiles fines</strong> comme le jojoba ou les pépins de raisin. Évitez les produits lourds qui s\'accumulent sans pénétrer.'
  },
  B: {
    icon: 'leaf',
    title: 'Porosité <em>Moyenne</em>',
    pct: 52,
    type: 'Moyenne',
    state: 'Félicitations — vos cheveux sont dans un état d\'équilibre idéal. Vos cuticules s\'ouvrent et se referment naturellement, permettant une absorption et une rétention optimales de l\'hydratation.',
    sol: 'Continuez votre routine actuelle en <strong>alternant hydratation et nutrition légère</strong>. Maintenez cet équilibre précieux avec des soins réguliers à base d\'aloe vera, de beurre de karité léger et d\'huiles semi-légères. Votre couronne est saine — chérissez-la.'
  },
  C: {
    icon: 'heat',
    title: 'Porosité <em>Haute</em>',
    pct: 88,
    type: 'Haute',
    state: 'Vos cuticules sont trop ouvertes ou abîmées par des traitements chimiques, la chaleur ou le frottement. L\'eau entre rapidement mais s\'évapore tout aussi vite, laissant la fibre capillaire assoiffée.',
    sol: 'Intégrez des <strong>soins protéinés</strong> réguliers pour combler les brèches des cuticules. Scellez l\'hydratation avec des <strong>beurres riches</strong> (karité) ou des <strong>huiles lourdes</strong> (avocat, ricin). Terminez toujours le rinçage à <strong>l\'eau froide</strong> pour refermer les écailles.'
  }
};
