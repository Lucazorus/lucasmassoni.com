// Guides métier, en français. Contenu structuré : chaque guide a une
// introduction, des sections (h2, paragraphes, listes, h3 optionnels),
// une FAQ courte (balisée FAQPage) et des guides liés.

export const SITE_URL = "https://www.lucasmassoni.com";
export const AUTHOR = { name: "Lucas Massoni", url: SITE_URL };

const RAW = [
  {
    slug: "comment-migrer-ses-donnees-vers-salesforce",
    title: "Comment migrer ses données vers Salesforce sans rien perdre ?",
    description:
      "Audit, mapping, staging SQL, dédoublonnage, chargements batchés, recette et bascule avec plan de rollback : la méthode complète pour migrer des données vers Salesforce sans perte.",
    keywords: ["comment migrer vers Salesforce", "migration de données Salesforce", "data migration Salesforce", "reprise de données Salesforce", "mapping Salesforce", "staging SQL", "rollback migration"],
    date: "2026-10-19",
    updated: "2026-10-19",
    readingMinutes: 9,
    intro:
      "Une migration de données Salesforce ne se résume pas à un chargement de fichiers. C'est un projet à part entière, avec un périmètre, des règles de qualité, une recette et une bascule. Voici la méthode que j'applique sur chaque mission, de l'audit des sources au plan de retour arrière.",
    sections: [
      {
        h2: "1. Auditer les sources avant de parler d'outils",
        paragraphs: [
          "La première semaine se passe dans les données, pas dans Salesforce. Pour chaque source (ancien CRM, ERP, fichiers Excel, exports d'outils métier), on inventorie les objets, les volumes, les clés d'identification et les règles de gestion implicites. On mesure aussi la qualité : taux de valeurs manquantes par champ, doublons évidents, formats hétérogènes (dates, téléphones, pays).",
          "Cet audit produit deux livrables : un inventaire chiffré des sources et une liste des risques (données orphelines, références cassées, champs libres utilisés comme listes de valeurs). C'est sur cette base que l'on arbitre ce qui est migré, archivé ou abandonné.",
        ],
      },
      {
        h2: "2. Construire le mapping champ par champ",
        paragraphs: [
          "Le mapping est le contrat de la migration. Pour chaque champ cible Salesforce, il documente la source, la transformation appliquée et la règle en cas de valeur absente. Il est validé par les métiers, pas seulement par l'équipe technique.",
        ],
        list: [
          "Objets standard d'abord : Account, Contact, Lead, Opportunity, Case, puis les objets personnalisés.",
          "Listes de valeurs : on aligne les picklists cibles avant de transformer les valeurs sources.",
          "Identifiants externes : un champ External ID par objet migré, pour permettre les upserts et le rapprochement avec le système d'origine.",
          "Relations : on documente l'ordre de chargement imposé par les lookups et les master-detail.",
        ],
      },
      {
        h2: "3. Passer par un staging SQL",
        paragraphs: [
          "Charger directement les fichiers sources dans Salesforce est la meilleure façon de perdre le contrôle. Je passe systématiquement par une base de staging (PostgreSQL ou SQL Server selon le client). Chaque source y est importée telle quelle, puis transformée par des vues ou des scripts versionnés.",
          "Le staging permet de rejouer les transformations autant de fois que nécessaire, de produire des rapports d'écart et de conserver la traçabilité entre un enregistrement Salesforce et sa ligne d'origine.",
        ],
      },
      {
        h2: "4. Dédoublonner avant de charger",
        paragraphs: [
          "Les doublons se traitent dans le staging, avec des règles explicites : clé exacte (email, SIRET), puis rapprochements approximatifs sur le nom et l'adresse. Chaque fusion est journalisée. Les règles de doublons Salesforce (Duplicate Rules) servent ensuite de filet de sécurité, pas de méthode de nettoyage.",
        ],
      },
      {
        h2: "5. Charger par lots, dans le bon ordre",
        paragraphs: [
          "Les chargements se font par lots, objet par objet, en respectant les dépendances : comptes, puis contacts et opportunités, puis les objets qui les référencent. Pour les volumes importants, l'API Bulk 2.0 est la voie normale ; les scripts Python ou Data Loader s'appuient dessus.",
          "Chaque lot produit un journal : identifiants créés, erreurs par ligne, durée. Ces journaux alimentent le rapport de recette et servent de base au rollback.",
        ],
      },
      {
        h2: "6. Recetter avec les utilisateurs",
        paragraphs: [
          "La recette compare les comptages source et cible par objet, vérifie des échantillons choisis par les métiers et contrôle les relations (chaque contact est bien rattaché au bon compte, chaque opportunité au bon propriétaire). Elle se déroule d'abord dans un sandbox Full ou Partial, sur une copie complète des données, avant toute bascule en production.",
        ],
      },
      {
        h2: "7. Basculer avec un plan de rollback",
        paragraphs: [
          "La bascule est planifiée à l'heure près : gel des saisies dans l'ancien système, dernier delta, chargement, contrôles, ouverture aux utilisateurs. Le plan de rollback décrit comment revenir en arrière si un contrôle échoue : sauvegarde préalable (export de données ou snapshot du sandbox), scripts de suppression par identifiants de lot, critères de décision.",
          "Sur ma dernière mission, ce cadre a permis de migrer 1,5 million de documents, rattachés aux enregistrements Salesforce via un pipeline Python vers SharePoint, sans perte et sans interruption de service.",
        ],
      },
    ],
    faq: [
      {
        q: "Combien de temps dure une migration de données Salesforce ?",
        a: "De quelques semaines pour un CRM simple à plusieurs mois pour un périmètre multi-sources. L'audit et le mapping représentent souvent la moitié de l'effort ; le chargement lui-même est rapide s'il est bien préparé.",
      },
      {
        q: "Faut-il migrer tout l'historique ?",
        a: "Rarement. On migre ce qui sert aux processus actuels et on archive le reste dans un entrepôt consultable. Moins de données migrées, c'est moins de risques et une recette plus courte.",
      },
      {
        q: "Peut-on migrer sans interrompre l'activité ?",
        a: "Oui, avec une migration initiale complète suivie d'un ou plusieurs deltas, et une fenêtre de bascule courte pendant laquelle l'ancien système est en lecture seule.",
      },
    ],
    related: ["comment-charger-des-donnees-dans-salesforce", "comment-supprimer-les-doublons-dans-salesforce"],
  },

  {
    slug: "comment-charger-des-donnees-dans-salesforce",
    title: "Comment charger des données dans Salesforce : Data Loader ou script ?",
    description:
      "Data Loader, API Bulk 2.0, scripts Python avec simple-salesforce : comparatif des outils de chargement Salesforce selon le volume, la fréquence et la complexité des transformations.",
    keywords: ["Data Loader Salesforce", "Bulk API 2.0", "simple-salesforce", "charger des données Salesforce", "import Salesforce Python", "upsert Salesforce"],
    date: "2026-10-19",
    updated: "2026-10-19",
    readingMinutes: 7,
    intro:
      "Data Loader suffit pour un import ponctuel. Dès que les volumes montent, que les transformations se compliquent ou que le chargement doit être rejoué, un script maîtrisé devient plus sûr. Voici comment choisir, et ce qui change entre les deux approches.",
    sections: [
      {
        h2: "Ce que Data Loader fait bien",
        paragraphs: [
          "Data Loader est l'outil officiel de Salesforce pour insérer, mettre à jour, upserter, supprimer ou exporter des enregistrements à partir de fichiers CSV. Il gère le mapping de colonnes, l'authentification et les deux modes d'API : SOAP (lots de 200 enregistrements) et Bulk (lots jusqu'à 10 000).",
        ],
        list: [
          "Imports ponctuels de quelques milliers à quelques centaines de milliers de lignes.",
          "Opérations simples sans transformation : les données arrivent déjà prêtes.",
          "Équipes qui préfèrent une interface graphique et des fichiers de mapping réutilisables.",
          "Exécution en ligne de commande possible pour planifier des chargements récurrents.",
        ],
      },
      {
        h2: "Quand un script Python devient nécessaire",
        paragraphs: [
          "Un script Python, avec une bibliothèque comme simple-salesforce ou un appel direct à l'API REST et à l'API Bulk 2.0, prend le relais dès que le chargement n'est plus une simple copie de fichier.",
        ],
        list: [
          "Transformations à la volée : normalisation des formats, calcul de champs, résolution de références par External ID.",
          "Chargements dépendants : créer les comptes, récupérer leurs identifiants, puis charger les contacts en une seule exécution.",
          "Reprise sur erreur : relancer uniquement les lignes en échec, avec un journal détaillé par lot.",
          "Fichiers et pièces jointes : migrer des documents vers Salesforce Files ou vers un stockage externe comme SharePoint, en gardant le lien avec l'enregistrement.",
          "Volumes élevés : l'API Bulk 2.0 accepte des fichiers CSV volumineux et traite les lots côté serveur, de façon asynchrone.",
        ],
      },
      {
        h2: "Les règles communes aux deux approches",
        paragraphs: [
          "Quel que soit l'outil, les bonnes pratiques sont les mêmes. Utiliser des External ID et des upserts plutôt que des inserts aveugles, pour pouvoir rejouer un chargement sans créer de doublons. Désactiver temporairement les automatisations lourdes (Flows, triggers, règles de validation non indispensables) pendant les chargements de masse, puis les réactiver. Tester d'abord dans un sandbox avec un échantillon représentatif, puis avec le volume complet.",
          "Enfin, conserver un journal de chaque exécution : date, utilisateur, fichier source, nombre de lignes traitées, identifiants créés, erreurs. C'est ce journal qui rend possible un retour arrière propre.",
        ],
      },
      {
        h2: "Mon choix en pratique",
        paragraphs: [
          "Sur une migration, j'utilise Data Loader pour les objets de référence simples et les vérifications rapides, et des scripts Python versionnés pour tout ce qui se rejoue : chargements dépendants, deltas, documents. Le script est livré avec sa documentation et son journal, pour que l'équipe interne puisse le réexécuter sans moi.",
        ],
      },
    ],
    faq: [
      {
        q: "Data Loader peut-il charger plusieurs millions de lignes ?",
        a: "Oui en mode Bulk, mais le suivi des erreurs et la reprise deviennent fastidieux au-delà de quelques centaines de milliers de lignes. Un script apporte un journal et une reprise plus fins.",
      },
      {
        q: "Quelle bibliothèque Python pour Salesforce ?",
        a: "simple-salesforce couvre l'API REST et le Bulk pour la plupart des besoins. Pour l'API Bulk 2.0 avec de gros fichiers, un client HTTP direct reste simple à écrire et à maîtriser.",
      },
    ],
    related: ["comment-migrer-ses-donnees-vers-salesforce", "comment-supprimer-les-doublons-dans-salesforce"],
  },

  {
    slug: "comment-supprimer-les-doublons-dans-salesforce",
    title: "Comment supprimer les doublons dans Salesforce, et éviter qu'ils reviennent ?",
    description:
      "Comment identifier et fusionner les doublons de comptes, contacts et leads dans Salesforce : règles de rapprochement, Duplicate Rules, nettoyage en staging avant migration et fusion contrôlée.",
    keywords: ["doublons Salesforce", "dédoublonnage Salesforce", "Duplicate Rules", "Matching Rules", "fusion de comptes Salesforce", "qualité des données CRM"],
    date: "2026-10-19",
    updated: "2026-10-19",
    readingMinutes: 7,
    intro:
      "Les doublons coûtent cher : relances en double, reporting faux, commerciaux qui se marchent dessus. Salesforce fournit des règles de doublons, mais elles n'ont jamais nettoyé une base seules. Voici une méthode complète, du diagnostic à la fusion.",
    sections: [
      {
        h2: "Mesurer avant de nettoyer",
        paragraphs: [
          "On commence par quantifier : combien de comptes partagent le même SIRET ou le même domaine d'email, combien de contacts ont le même email, combien de leads correspondent déjà à un contact existant. Ces chiffres fixent l'ampleur du chantier et servent de référence pour mesurer le résultat.",
        ],
      },
      {
        h2: "Définir des règles de rapprochement explicites",
        paragraphs: [
          "Un doublon est une décision, pas une évidence. Les règles doivent être écrites et validées avec les métiers, par niveau de certitude.",
        ],
        list: [
          "Rapprochement exact : même email, même SIRET, même identifiant externe. Fusion automatique possible.",
          "Rapprochement fort : même nom normalisé et même code postal, ou même téléphone normalisé. Fusion après revue rapide.",
          "Rapprochement faible : noms proches (distance de chaînes), même ville. Revue manuelle systématique.",
        ],
        paragraphsAfter: [
          "La normalisation est la clé : minuscules, suppression des accents et des formes juridiques (SAS, SARL), formatage des téléphones au format international, nettoyage des espaces. Sans elle, la moitié des doublons passe entre les mailles.",
        ],
      },
      {
        h2: "Nettoyer en staging, pas en production",
        paragraphs: [
          "Avant une migration, le nettoyage se fait dans la base de staging : on calcule les groupes de doublons, on choisit l'enregistrement survivant selon des critères définis (le plus récent, le plus complet, celui qui porte des opportunités), on fusionne les valeurs des champs et on réaffecte les enregistrements liés. Chaque fusion est journalisée avec les identifiants d'origine.",
          "Sur une base déjà en production, la logique est la même, mais l'exécution passe par l'API de fusion de Salesforce ou par un outil dédié, par lots limités, avec un contrôle d'échantillon entre chaque lot.",
        ],
      },
      {
        h2: "Mettre en place le filet de sécurité",
        paragraphs: [
          "Une fois la base propre, les Matching Rules et Duplicate Rules de Salesforce empêchent la réapparition des doublons à la saisie et lors des imports. On les configure en mode alerte d'abord, puis en blocage sur les cas sûrs. Les règles standard couvrent les comptes, contacts et leads ; des règles personnalisées complètent pour les objets métier.",
          "Le dernier élément est organisationnel : une personne ou une équipe responsable de la qualité des données, un rapport hebdomadaire des doublons potentiels et une procédure de fusion connue des utilisateurs.",
        ],
      },
    ],
    faq: [
      {
        q: "Les Duplicate Rules suffisent-elles à nettoyer une base existante ?",
        a: "Non. Elles signalent les doublons potentiels à la saisie et à l'import, mais elles ne fusionnent rien. Le nettoyage d'une base existante demande un traitement dédié.",
      },
      {
        q: "Que devient l'historique lors d'une fusion ?",
        a: "Les enregistrements liés (activités, opportunités, cas) sont réaffectés à l'enregistrement survivant. Il faut vérifier les champs à valeurs multiples et les pièces jointes au cas par cas.",
      },
    ],
    related: ["comment-migrer-ses-donnees-vers-salesforce", "comment-charger-des-donnees-dans-salesforce"],
  },

  {
    slug: "pourquoi-mon-salesforce-cpq-est-devenu-ingerable",
    title: "Pourquoi mon paramétrage Salesforce CPQ est devenu ingérable ? 8 erreurs fréquentes",
    description:
      "Règles de prix empilées, bundles mal structurés, approbations trop larges, templates de devis non maintenus : les erreurs de paramétrage Salesforce CPQ les plus fréquentes et comment les corriger.",
    keywords: ["Salesforce CPQ", "paramétrage CPQ", "règles de prix CPQ", "bundles CPQ", "quote-to-cash", "devis Salesforce"],
    date: "2026-10-19",
    updated: "2026-10-19",
    readingMinutes: 8,
    intro:
      "Salesforce CPQ est puissant, et c'est précisément pour cela qu'il se dégrade vite quand chaque demande métier est traitée par une règle de plus. Après plusieurs projets de mise en place et de reprise, voici les erreurs que je retrouve le plus souvent.",
    sections: [
      {
        h2: "1. Empiler les règles de prix sans ordre ni documentation",
        paragraphs: [
          "Les Price Rules s'exécutent selon leur ordre d'évaluation et leur événement de calcul. Quand personne ne sait plus pourquoi une remise s'applique, c'est que les règles ont été ajoutées une à une, sans convention de nommage ni journal des modifications. La correction passe par un inventaire, une numérotation explicite et la suppression des règles mortes.",
        ],
      },
      {
        h2: "2. Modéliser des bundles qui ne reflètent pas l'offre",
        paragraphs: [
          "Un bundle doit correspondre à ce que les commerciaux vendent réellement. Trop de niveaux d'options, des fonctionnalités qui n'existent que pour contourner une contrainte technique, des options obligatoires modifiables : le résultat est un configurateur que les utilisateurs évitent. On repart de l'offre commerciale, pas du catalogue technique.",
        ],
      },
      {
        h2: "3. Déclencher des approbations pour tout",
        paragraphs: [
          "Si chaque devis passe par un manager, l'approbation ne protège plus rien : elle est validée sans lecture. Les seuils doivent viser les cas réellement risqués : remise au-delà d'un pourcentage, conditions de paiement non standard, produits hors catalogue. Les Advanced Approvals permettent des chaînes conditionnelles ; encore faut-il les limiter.",
        ],
      },
      {
        h2: "4. Négliger le modèle de produits",
        paragraphs: [
          "Codes produits incohérents, familles mal utilisées, attributs stockés dans des champs texte : le modèle de produits conditionne tout le reste (règles, rapports, intégration ERP). Il mérite une gouvernance et un responsable.",
        ],
      },
      {
        h2: "5. Laisser dériver les templates de devis",
        paragraphs: [
          "Les templates sont souvent créés au lancement puis jamais revus. Mentions légales obsolètes, sections conditionnelles cassées, mise en page qui ne gère pas les devis longs : on prévoit une revue à chaque changement d'offre.",
        ],
      },
      {
        h2: "6. Ignorer les performances de calcul",
        paragraphs: [
          "Un devis de plusieurs centaines de lignes avec des dizaines de règles peut mettre des dizaines de secondes à se calculer. Les causes habituelles : règles de prix qui parcourent toutes les lignes, champs formule lourds, Lookup Queries non filtrées. On mesure, puis on simplifie.",
        ],
      },
      {
        h2: "7. Oublier l'intégration en aval",
        paragraphs: [
          "Le devis signé doit devenir une commande, une facture, un contrat. Si les champs nécessaires à l'ERP ne sont pas prévus dès le paramétrage CPQ, l'intégration se fait à coups de ressaisies. Le mapping vers l'ERP se conçoit avec le modèle de produits.",
        ],
      },
      {
        h2: "8. Ne pas tester avec des devis réels",
        paragraphs: [
          "Les tests sur trois lignes de produits ne révèlent rien. On constitue un jeu de devis représentatifs, issus de la production, et on les rejoue à chaque modification de règle. C'est la seule façon de garantir qu'une correction n'en casse pas une autre.",
        ],
      },
    ],
    faq: [
      {
        q: "Faut-il repartir de zéro quand le paramétrage CPQ est devenu ingérable ?",
        a: "Rarement. Un audit permet en général de supprimer une partie des règles, d'en regrouper d'autres et de documenter le reste. La refonte complète ne se justifie que si le modèle de produits lui-même est à revoir.",
      },
      {
        q: "Combien de temps pour mettre en place Salesforce CPQ ?",
        a: "De deux à six mois selon la complexité du catalogue et des règles de prix, en comptant la reprise des données produits et la formation des équipes.",
      },
    ],
    related: ["salesforce-revenue-cloud-c-est-quoi-faut-il-quitter-cpq", "comment-automatiser-salesforce-flow-ou-apex"],
  },

  {
    slug: "comment-automatiser-salesforce-flow-ou-apex",
    title: "Comment automatiser Salesforce : Flow ou Apex ?",
    description:
      "Record-Triggered Flows, Apex triggers, classes asynchrones : critères concrets pour choisir entre Flow et Apex selon la complexité, les volumes, les limites de gouverneur et la maintenabilité.",
    keywords: ["Flow Salesforce", "Apex Salesforce", "Flow ou Apex", "automatisation Salesforce", "trigger Apex", "limites de gouverneur"],
    date: "2026-10-19",
    updated: "2026-10-19",
    readingMinutes: 7,
    intro:
      "Depuis le retrait de Workflow Rules et Process Builder, le choix se fait entre Flow et Apex. Les deux partagent les mêmes limites de plateforme ; ce qui change, c'est qui peut maintenir l'automatisation et à quel coût. Voici les critères que j'applique.",
    sections: [
      {
        h2: "Flow par défaut pour la logique métier simple",
        paragraphs: [
          "Un Record-Triggered Flow gère sans code les cas courants : mise à jour de champs à la création ou à la modification, création d'enregistrements liés, envoi d'emails, lancement d'approbations. Il est lisible par un administrateur, versionné dans Salesforce et déployable sans compilation.",
        ],
        list: [
          "Préférer les flows avant enregistrement (before-save) pour mettre à jour l'enregistrement déclencheur : plus rapides, sans DML supplémentaire.",
          "Un flow par objet et par événement, avec des sous-flows pour la logique partagée, plutôt que dix flows concurrents sur le même objet.",
          "Un ordre d'exécution explicite quand plusieurs flows coexistent.",
        ],
      },
      {
        h2: "Apex quand la logique devient algorithmique",
        paragraphs: [
          "Apex s'impose quand il faut parcourir des collections imbriquées, appliquer des règles complexes, appeler des services externes avec gestion d'erreurs fine, ou traiter de gros volumes en asynchrone (Batch Apex, Queueable). Il apporte aussi ce que Flow n'a pas : des tests unitaires automatisés, exigés à hauteur de 75 % de couverture pour déployer en production.",
        ],
        list: [
          "Un seul trigger par objet, qui délègue à une classe de gestion : le pattern trigger handler.",
          "Du code bulkifié dès la première ligne : jamais de requête ou de DML dans une boucle.",
          "Des tests qui couvrent les cas limites, pas seulement la couverture.",
        ],
      },
      {
        h2: "Les limites de gouverneur s'appliquent aux deux",
        paragraphs: [
          "Une transaction synchrone dispose, par exemple, de 100 requêtes SOQL et de 150 instructions DML. Flow et Apex consomment ces mêmes compteurs. Un flow mal conçu, avec une boucle qui fait une requête par enregistrement, échouera sur un chargement de masse exactement comme un Apex non bulkifié. Les tests de volume font partie de la recette, quel que soit l'outil.",
        ],
      },
      {
        h2: "Une grille de décision simple",
        list: [
          "Logique déclarative, maintenue par les admins, volumes raisonnables : Flow.",
          "Calculs complexes, intégrations avec gestion d'erreurs, traitements asynchrones de masse : Apex.",
          "Logique partagée entre plusieurs automatisations : une Invocable Apex appelée depuis les flows.",
          "Dans tous les cas : documentation, convention de nommage et un propriétaire identifié par automatisation.",
        ],
      },
    ],
    faq: [
      {
        q: "Peut-on tout faire en Flow ?",
        a: "Presque, mais pas toujours au meilleur coût. Au-delà d'un certain niveau de complexité, un flow devient plus difficile à lire et à tester qu'une classe Apex bien écrite.",
      },
      {
        q: "Faut-il migrer les anciens Process Builder vers Flow ?",
        a: "Oui, Salesforce fournit un outil de migration, mais c'est aussi l'occasion de regrouper et de simplifier les automatisations existantes plutôt que de les convertir une à une.",
      },
    ],
    related: ["pourquoi-mon-salesforce-cpq-est-devenu-ingerable", "comment-integrer-salesforce-avec-sap"],
  },

  {
    slug: "comment-faire-un-tableau-de-bord-commercial-salesforce",
    title: "Comment faire un tableau de bord commercial fiable avec Salesforce ?",
    description:
      "CRM Analytics, natif dans Salesforce, ou Tableau, plus ouvert aux sources externes : comparatif pour le pilotage commercial, le reporting de direction et la gouvernance des indicateurs.",
    keywords: ["comment faire un tableau de bord Salesforce", "Tableau", "CRM Analytics", "Tableau CRM", "dashboard commercial Salesforce", "reporting Salesforce", "KPI commerciaux"],
    date: "2026-10-19",
    updated: "2026-10-19",
    readingMinutes: 6,
    intro:
      "Les rapports et tableaux de bord standard de Salesforce couvrent le suivi quotidien. Dès que la direction veut croiser le CRM avec l'ERP, suivre des tendances ou partager des analyses hors Salesforce, deux outils s'offrent à vous. Voici comment les départager.",
    sections: [
      {
        h2: "CRM Analytics : l'analyse dans le flux de travail",
        paragraphs: [
          "CRM Analytics est intégré à Salesforce : les données CRM y sont synchronisées sans connecteur, les tableaux de bord s'affichent dans les pages d'enregistrement et respectent la sécurité Salesforce. Les recettes de données permettent de préparer et de croiser des jeux de données, y compris externes, sans quitter la plateforme.",
          "C'est l'outil adapté quand les utilisateurs vivent dans Salesforce et que l'analyse doit déboucher sur une action immédiate : relancer une opportunité, réaffecter un compte, lancer une campagne.",
        ],
      },
      {
        h2: "Tableau : l'analyse ouverte à tout le système d'information",
        paragraphs: [
          "Tableau, également édité par Salesforce, se connecte à presque toutes les sources : bases SQL, entrepôts de données, SAP, fichiers. Il excelle sur l'exploration visuelle, les analyses ad hoc et le partage avec des utilisateurs qui n'ont pas de licence Salesforce.",
          "C'est le choix naturel pour un reporting de direction qui consolide ventes, marges et production, ou pour une équipe data qui veut un outil unique sur tout le périmètre.",
        ],
      },
      {
        h2: "Ce qui compte plus que l'outil",
        list: [
          "Des définitions d'indicateurs validées et documentées : un taux de conversion calculé de deux façons différentes ruine la confiance.",
          "Un modèle de données préparé en amont, dans un entrepôt ou dans des recettes, plutôt que des calculs refaits dans chaque tableau de bord.",
          "Une fraîcheur des données annoncée aux utilisateurs et tenue.",
          "Un nombre limité de tableaux de bord, chacun avec un propriétaire et un public.",
        ],
      },
      {
        h2: "Et souvent, les deux",
        paragraphs: [
          "Beaucoup d'organisations combinent les deux : CRM Analytics pour les managers commerciaux dans Salesforce, Tableau pour la direction et la finance sur des données consolidées. La condition est de partager les mêmes définitions et la même source de vérité.",
        ],
      },
    ],
    faq: [
      {
        q: "Les rapports standard Salesforce ne suffisent-ils pas ?",
        a: "Ils suffisent pour le suivi opérationnel. Ils atteignent leurs limites sur les croisements multi-objets complexes, l'historique et les sources externes.",
      },
      {
        q: "Combien de temps pour mettre en place un premier tableau de bord ?",
        a: "Quelques jours pour un tableau de bord commercial sur des données Salesforce propres. L'essentiel du temps se passe à valider les définitions d'indicateurs avec les métiers.",
      },
    ],
    related: ["comment-migrer-ses-donnees-vers-salesforce", "comment-integrer-salesforce-avec-sap"],
  },

  {
    slug: "comment-integrer-salesforce-avec-sap",
    title: "Comment intégrer Salesforce avec SAP ou un autre ERP ?",
    description:
      "Synchronisation des comptes, commandes et factures entre SAP S/4HANA et Salesforce : patterns d'intégration (IDoc, OData, BAPI, REST, middleware), choix du système maître et gestion des erreurs.",
    keywords: ["comment intégrer Salesforce", "intégration SAP Salesforce", "SAP S/4HANA Salesforce", "IDoc", "OData SAP", "middleware SAP Salesforce", "synchronisation ERP CRM"],
    date: "2026-10-19",
    updated: "2026-10-19",
    readingMinutes: 8,
    intro:
      "L'intégration entre l'ERP et le CRM est le flux le plus sensible d'une entreprise : c'est elle qui relie une opportunité gagnée à une commande, puis à une facture. Voici les patterns qui fonctionnent, et les décisions à prendre avant la première ligne de code.",
    sections: [
      {
        h2: "Décider du système maître, objet par objet",
        paragraphs: [
          "Avant tout choix technique, on fixe pour chaque donnée qui fait foi. En général : les clients et les produits sont maîtrisés dans SAP et diffusés vers Salesforce ; les leads, opportunités et devis naissent dans Salesforce ; les commandes et factures reviennent de SAP. Un objet avec deux maîtres est un conflit garanti.",
        ],
      },
      {
        h2: "Les interfaces disponibles côté SAP",
        list: [
          "IDoc : échanges asynchrones par documents, adaptés aux flux de masse (clients, commandes, factures), avec reprise et suivi natifs.",
          "BAPI et RFC : appels synchrones de fonctions métier, utiles pour des créations ou contrôles à la demande.",
          "OData : services exposés via SAP Gateway ou SAP BTP, adaptés aux lectures et aux intégrations web modernes.",
          "SAP Integration Suite : la couche d'intégration de SAP BTP, qui orchestre ces interfaces et expose des API REST.",
        ],
      },
      {
        h2: "Les interfaces côté Salesforce",
        list: [
          "API REST et Bulk 2.0 pour les lectures et écritures, avec External ID pour les upserts idempotents.",
          "Platform Events et Change Data Capture pour publier les changements Salesforce vers l'extérieur sans scrutation.",
          "Apex Callouts pour des appels sortants ciblés, avec Named Credentials pour l'authentification.",
        ],
      },
      {
        h2: "Avec ou sans middleware",
        paragraphs: [
          "Une intégration point à point tient pour un ou deux flux simples. Au-delà, un middleware (SAP Integration Suite, MuleSoft, ou un ETL existant) apporte le routage, la transformation, la journalisation et la reprise sur erreur au même endroit. Le critère n'est pas la taille de l'entreprise mais le nombre de flux et le besoin de supervision.",
          "Quel que soit l'outil, les patterns d'intégration pilotée par les API (couches système, processus, expérience) permettent de réutiliser les mêmes connecteurs pour plusieurs besoins métier.",
        ],
      },
      {
        h2: "Gérer les erreurs comme un flux à part entière",
        paragraphs: [
          "Une intégration sans gestion d'erreurs explicite finit en tickets et en ressaisies. Chaque flux doit définir ce qui se passe quand SAP est indisponible, quand une donnée est rejetée par une règle de validation, quand un identifiant est inconnu : file d'attente et rejeu, alerte à un responsable, enregistrement en erreur visible dans Salesforce.",
          "Les tests se font avec des données réelles anonymisées et des scénarios d'erreur, pas seulement sur le cas nominal.",
        ],
      },
    ],
    faq: [
      {
        q: "Temps réel ou batch ?",
        a: "Les référentiels (clients, produits) tolèrent un batch quotidien ou horaire. Les statuts de commande et les stocks consultés par les commerciaux justifient du quasi temps réel, par événements.",
      },
      {
        q: "Faut-il un middleware pour un seul flux ?",
        a: "Non. Un flux simple et bien journalisé peut rester point à point. On passe au middleware quand les flux se multiplient ou que la supervision devient un besoin.",
      },
    ],
    related: ["comment-automatiser-salesforce-flow-ou-apex", "comment-faire-un-tableau-de-bord-commercial-salesforce"],
  },

  {
    slug: "comment-faire-des-devis-dans-salesforce",
    title: "Comment faire des devis dans Salesforce ? Quotes standard, CPQ et ce qu'il faut prévoir",
    description:
      "Devis Salesforce : quand les Quotes standard suffisent, quand passer à Salesforce CPQ, comment gérer catalogue, remises, approbations, templates PDF et transmission à l'ERP pour la facturation.",
    keywords: ["devis Salesforce", "comment faire un devis dans Salesforce", "Quotes Salesforce", "Salesforce CPQ", "template de devis Salesforce", "quote-to-cash"],
    date: "2026-10-19",
    updated: "2026-10-19",
    readingMinutes: 8,
    intro:
      "Faire un devis dans Salesforce est possible dès la licence Sales Cloud, avec l'objet Quote. La vraie question est ailleurs : votre offre tient-elle dans un catalogue simple, ou demande-t-elle des configurations, des règles de prix et des approbations ? La réponse détermine l'outil, le budget et le délai.",
    sections: [
      {
        h2: "Les Quotes standard de Sales Cloud",
        paragraphs: [
          "L'objet Quote est lié à une opportunité. Il reprend les lignes de produits (Quote Line Items) depuis le catalogue de prix (Price Book), calcule les totaux, génère un PDF à partir d'un template et permet de synchroniser le devis retenu avec l'opportunité.",
        ],
        list: [
          "Catalogue de produits et tarifs stables, peu de variantes.",
          "Remises simples, appliquées ligne par ligne ou sur le total.",
          "Un ou deux modèles de PDF, sans sections conditionnelles complexes.",
          "Approbation par un processus d'approbation standard, sur un montant ou une remise.",
        ],
        paragraphsAfter: [
          "Dans ce périmètre, un devis opérationnel se met en place en quelques jours : catalogue, template, processus d'approbation, formation. C'est aussi le point de départ que je recommande quand le processus commercial n'est pas encore stabilisé.",
        ],
      },
      {
        h2: "Quand passer à Salesforce CPQ",
        paragraphs: [
          "Salesforce CPQ (Configure, Price, Quote) s'impose quand le devis devient un objet de configuration : produits à options, bundles, abonnements avec dates de début et de fin, tarifs par volume ou par segment, remises conditionnelles, renouvellements et avenants.",
        ],
        list: [
          "Bundles et options avec règles de compatibilité entre produits.",
          "Règles de prix : remises par paliers, prix négociés par client, majorations selon les conditions.",
          "Abonnements, prorata et renouvellements automatiques.",
          "Approbations avancées à plusieurs niveaux selon le type d'écart.",
          "Templates de devis riches, avec sections conditionnelles et conditions générales versionnées.",
        ],
      },
      {
        h2: "Ce qu'il faut prévoir, quel que soit l'outil",
        paragraphs: [
          "Un projet de devis échoue rarement sur l'outil et souvent sur les données et le processus. Avant le paramétrage, on fixe le modèle de produits (codes, familles, unités), les règles de remise autorisées et les seuils d'approbation. On décide aussi de ce qui se passe après la signature : création de commande, transmission à l'ERP, facturation.",
          "La signature électronique, la génération de documents et la facturation ne sont pas natives dans Sales Cloud : elles passent par des solutions partenaires ou par l'ERP. Les champs nécessaires à ces étapes (SIREN, adresse de facturation, références de commande, conditions de paiement) doivent exister dans le devis dès le départ.",
        ],
      },
      {
        h2: "Ordre de grandeur des délais",
        list: [
          "Quotes standard, catalogue simple : une à deux semaines, formation comprise.",
          "Quotes standard avec approbations, templates multiples et intégration ERP : trois à six semaines.",
          "Salesforce CPQ : deux à six mois selon la complexité du catalogue et des règles de prix.",
        ],
      },
    ],
    faq: [
      {
        q: "Peut-on commencer avec les Quotes standard et migrer vers CPQ plus tard ?",
        a: "Oui, et c'est souvent la bonne trajectoire. Les produits, tarifs et opportunités sont réutilisés ; seules les lignes de devis changent de modèle. Un catalogue propre dès le départ facilite la transition.",
      },
      {
        q: "Salesforce peut-il envoyer les factures ?",
        a: "Pas avec Sales Cloud seul. La facturation se fait dans l'ERP ou avec Salesforce Billing. Le devis Salesforce doit alors porter toutes les données nécessaires à la facture.",
      },
    ],
    related: ["salesforce-revenue-cloud-c-est-quoi-faut-il-quitter-cpq", "facturation-electronique-salesforce-sap-comment-se-preparer"],
  },

  {
    slug: "facturation-electronique-salesforce-sap-comment-se-preparer",
    title: "Facturation électronique : comment se préparer avec Salesforce et SAP ?",
    description:
      "Réforme de la facturation électronique en France : ce qui change pour une entreprise équipée de Salesforce et de SAP, où produire les factures, quelles données préparer dans le CRM, formats Factur-X et UBL, plateformes de dématérialisation.",
    keywords: ["facturation électronique", "facturation électronique Salesforce", "facturation électronique SAP", "Factur-X", "plateforme de dématérialisation", "réforme facturation électronique 2026"],
    date: "2026-10-19",
    updated: "2026-10-19",
    readingMinutes: 8,
    intro:
      "La généralisation de la facturation électronique en France impose à toutes les entreprises assujetties à la TVA de recevoir des factures électroniques, puis de les émettre, selon un calendrier échelonné par taille d'entreprise. Pour une organisation qui vend dans Salesforce et facture dans SAP, la question est concrète : où se produit la facture conforme, et quelles données doivent circuler entre les deux systèmes ?",
    sections: [
      {
        h2: "Ce que la réforme demande, en résumé",
        paragraphs: [
          "Les factures entre entreprises établies en France doivent transiter sous forme structurée par des plateformes de dématérialisation agréées, dans des formats normalisés (Factur-X, UBL ou CII), avec transmission de données à l'administration. L'obligation de réception s'applique à toutes les entreprises à la première échéance ; l'obligation d'émission est échelonnée, les grandes entreprises et les ETI d'abord, puis les PME et micro-entreprises. Le calendrier précis et les plateformes agréées sont publiés par l'administration fiscale ; vérifiez la version en vigueur au moment de votre projet.",
        ],
      },
      {
        h2: "Où produire la facture : l'ERP, pas le CRM",
        paragraphs: [
          "Dans une architecture Salesforce et SAP, la facture conforme est produite par SAP, qui porte la comptabilité, les mentions légales et les formats réglementaires. SAP Document and Reporting Compliance prend en charge la génération des formats structurés et la connexion aux plateformes. Salesforce reste le système des devis, des commandes et de la relation client.",
          "Conséquence : le flux devis gagné, commande, facture doit être fiable de bout en bout. Une facture rejetée par une plateforme pour une donnée manquante ou incohérente remonte souvent à une saisie incomplète dans le CRM.",
        ],
      },
      {
        h2: "Les données à préparer dans Salesforce",
        list: [
          "Identification du client : SIREN ou SIRET, numéro de TVA intracommunautaire, raison sociale exacte, adresse de facturation structurée.",
          "Références : numéro de commande client, numéro de contrat ou de devis, conditions de paiement, mode de règlement.",
          "Lignes : désignation, quantité, unité, prix unitaire, taux de TVA par ligne, remises explicites.",
          "Mentions particulières : option pour les débits, exonérations, acomptes.",
        ],
        paragraphsAfter: [
          "La plupart de ces champs existent déjà dans Salesforce mais sont facultatifs ou saisis librement. Le chantier consiste à les rendre obligatoires au bon moment, à les contrôler (format du SIREN, validité du numéro de TVA) et à les transmettre sans ressaisie à SAP.",
        ],
      },
      {
        h2: "Les chantiers concrets",
        list: [
          "Audit des données clients : taux de comptes sans SIREN, adresses non structurées, doublons de comptes facturés.",
          "Règles de validation et champs obligatoires sur les comptes et les devis, avec une période de rattrapage pour les enregistrements existants.",
          "Intégration Salesforce vers SAP pour les commandes, avec External ID et journal des rejets visible par les commerciaux.",
          "Retour des statuts de facture et de paiement vers Salesforce, pour que les commerciaux voient ce qui est facturé et réglé.",
          "Tests avec des factures réelles anonymisées sur l'environnement de test de la plateforme choisie.",
        ],
      },
      {
        h2: "Par où commencer",
        paragraphs: [
          "Par un diagnostic de quelques jours : état des données clients dans Salesforce, flux existants vers SAP, écarts avec les mentions obligatoires. Il débouche sur un plan d'actions chiffré, priorisé par échéance, qui sépare ce qui relève du CRM, de l'intégration et de l'ERP.",
        ],
      },
    ],
    faq: [
      {
        q: "Salesforce peut-il émettre directement des factures électroniques conformes ?",
        a: "Pas avec Sales Cloud seul. Il faut soit l'ERP, soit une solution de facturation connectée à une plateforme agréée. Dans une architecture avec SAP, la facture conforme est produite par SAP.",
      },
      {
        q: "Les devis et commandes sont-ils concernés par la réforme ?",
        a: "Non, seules les factures le sont. Mais la qualité des données saisies au devis et à la commande conditionne directement la conformité des factures.",
      },
      {
        q: "Combien de temps faut-il pour se préparer ?",
        a: "Pour la partie CRM et intégration, comptez quelques semaines à quelques mois selon l'état des données et des flux. Le délai le plus long est souvent le nettoyage des comptes clients.",
      },
    ],
    related: ["comment-integrer-salesforce-avec-sap", "comment-faire-des-devis-dans-salesforce"],
  },

  {
    slug: "combien-coute-un-consultant-salesforce-freelance",
    title: "Combien coûte un consultant Salesforce freelance, et comment cadrer sa mission ?",
    description:
      "Tarif journalier d'un consultant Salesforce freelance en France, durée type des missions (migration, CPQ, intégration, analytics), ce qui est compris dans la prestation et comment éviter les dérives de périmètre.",
    keywords: ["consultant Salesforce freelance", "TJM consultant Salesforce", "tarif consultant Salesforce", "coût mission Salesforce", "freelance Salesforce France", "expert Salesforce indépendant"],
    date: "2026-10-19",
    updated: "2026-10-19",
    readingMinutes: 6,
    intro:
      "Le coût d'un consultant Salesforce freelance dépend moins du tarif journalier que de la façon dont la mission est cadrée. Voici les ordres de grandeur constatés en France, les durées typiques par type de projet et les clauses qui protègent les deux parties.",
    sections: [
      {
        h2: "Les ordres de grandeur du tarif journalier",
        paragraphs: [
          "En France, le tarif journalier d'un consultant Salesforce indépendant se situe en général entre 500 et 900 euros hors taxes, selon l'expérience, la spécialité (administration, développement Apex et LWC, CPQ, intégration, data) et le mode d'intervention. Les profils capables de couvrir à la fois le fonctionnel, le technique et la donnée se situent dans la partie haute, parce qu'ils remplacent plusieurs intervenants.",
          "Ces montants sont indicatifs : ils varient avec la durée d'engagement, la part de télétravail et le contexte. Ce qui compte, c'est le coût total de la mission rapporté au résultat livré.",
        ],
      },
      {
        h2: "Durées typiques par type de mission",
        list: [
          "Audit ou diagnostic : deux à dix jours, avec un rapport et un plan d'actions chiffré.",
          "Migration de données : de trois semaines à plusieurs mois selon le nombre de sources et les volumes.",
          "Mise en place de devis : une à deux semaines avec les Quotes standard, deux à six mois avec CPQ.",
          "Intégration avec un ERP : de quelques semaines pour un flux à plusieurs mois pour une intégration complète.",
          "Tableaux de bord et analytics : quelques jours à quelques semaines, l'essentiel étant la validation des indicateurs.",
        ],
      },
      {
        h2: "Ce qui doit être compris dans la prestation",
        list: [
          "Un cadrage écrit : périmètre, livrables, hypothèses, planning et chiffrage.",
          "La documentation de ce qui est livré : paramétrage, scripts, mappings, procédures.",
          "Des tests et une recette formalisés avant la mise en production.",
          "Un transfert de compétences aux équipes internes et une période de support après mise en production.",
        ],
      },
      {
        h2: "Éviter les dérives de périmètre",
        paragraphs: [
          "Le dépassement vient presque toujours de demandes ajoutées en cours de route sans réévaluation. Un bon cadre prévoit un point d'avancement régulier, une liste des demandes hors périmètre chiffrées séparément et un critère clair de fin de mission. Le forfait convient aux périmètres bien définis (audit, migration cadrée) ; la régie convient aux missions évolutives, avec un plafond.",
        ],
      },
      {
        h2: "Comment je travaille",
        paragraphs: [
          "Chaque mission commence par un cadrage, se déroule en itérations courtes avec des démonstrations régulières, et se termine par une passation documentée. Le chiffrage est fixé avant le démarrage et n'évolue qu'avec un accord écrit sur un changement de périmètre.",
        ],
      },
    ],
    faq: [
      {
        q: "Freelance ou cabinet de conseil ?",
        a: "Un freelance expérimenté coûte en général moins cher qu'un cabinet pour un périmètre équivalent, avec un interlocuteur unique du cadrage au transfert. Un cabinet se justifie pour des programmes qui demandent une équipe complète en parallèle.",
      },
      {
        q: "Faut-il une certification Salesforce ?",
        a: "Les certifications attestent des connaissances de la plateforme. Les références de missions comparables et la qualité du cadrage sont des indicateurs au moins aussi fiables.",
      },
    ],
    related: ["comment-migrer-ses-donnees-vers-salesforce", "comment-faire-des-devis-dans-salesforce"],
  },

  {
    slug: "salesforce-revenue-cloud-c-est-quoi-faut-il-quitter-cpq",
    title: "Salesforce Revenue Cloud, c'est quoi ? Et faut-il quitter CPQ ?",
    description:
      "Revenue Cloud (Revenue Cloud Advanced) : ce que couvre la nouvelle plateforme quote-to-cash de Salesforce, ce qui change par rapport à Salesforce CPQ, pour qui c'est pertinent et comment décider de migrer ou de rester.",
    keywords: ["Salesforce Revenue Cloud", "Revenue Cloud Advanced", "Revenue Cloud vs CPQ", "quote-to-cash Salesforce", "Revenue Lifecycle Management", "migration CPQ Revenue Cloud"],
    date: "2026-10-19",
    updated: "2026-10-19",
    readingMinutes: 8,
    intro:
      "Revenue Cloud est la plateforme avec laquelle Salesforce remplace progressivement Salesforce CPQ et Salesforce Billing. Elle couvre tout le cycle du devis à l'encaissement, directement sur la plateforme Salesforce et non plus dans un package installé. Voici ce qu'elle contient, ce qui change concrètement et comment décider si, et quand, migrer.",
    sections: [
      {
        h2: "Ce que couvre Revenue Cloud",
        paragraphs: [
          "Revenue Cloud, dans sa version actuelle dite Revenue Cloud Advanced, regroupe plusieurs briques natives qui s'enchaînent du catalogue à la facture.",
        ],
        list: [
          "Product Catalog Management : un catalogue unique, avec attributs, bundles et règles de compatibilité, partagé par tous les canaux de vente.",
          "Salesforce Pricing : des procédures de tarification déclaratives qui remplacent les règles de prix de CPQ, exécutées par un moteur dédié.",
          "Product Configurator : la configuration guidée des produits et des options, utilisable dans l'interface Salesforce ou en API.",
          "Transaction Management : devis, commandes et avenants, avec gestion des lignes et des cycles de vie.",
          "Contrats et exécution : la génération des contrats et l'orchestration de ce qui suit la signature (activation, livraison, abonnements).",
          "Billing : facturation, paiements, revenus récurrents et à l'usage, avec les écritures nécessaires à la comptabilité.",
        ],
      },
      {
        h2: "Ce qui change par rapport à Salesforce CPQ",
        paragraphs: [
          "Salesforce CPQ est un package géré, hérité de l'acquisition de Steelbrick, avec son propre modèle d'objets, ses règles de prix et son moteur de calcul. Revenue Cloud est construit sur les objets standard de la plateforme et expose ses fonctions en API, ce qui change trois choses.",
        ],
        list: [
          "Le modèle de données : le catalogue, les prix et les devis vivent dans des objets natifs, plus faciles à étendre, à intégrer et à analyser.",
          "La tarification : les procédures de prix se construisent de façon déclarative, avec une logique lisible, au lieu d'une pile de règles évaluées dans un ordre fragile.",
          "Les canaux : la même configuration et la même tarification servent au commercial dans Salesforce, à un portail client ou à un partenaire via l'API.",
        ],
        paragraphsAfter: [
          "Côté commercial, Salesforce a annoncé que CPQ n'est plus proposé aux nouveaux clients et positionne Revenue Cloud comme son successeur, avec un maintien du support pour les clients existants. Les échéances précises évoluent : vérifiez-les avec votre interlocuteur Salesforce avant de planifier.",
        ],
      },
      {
        h2: "Pour qui Revenue Cloud est pertinent dès maintenant",
        list: [
          "Les entreprises qui démarrent un projet de devis structuré : il n'y a plus de raison de partir sur CPQ.",
          "Les modèles d'abonnement, de consommation ou mixtes, où la facturation et les avenants sont au cœur du processus.",
          "Les organisations multicanales qui veulent une seule logique de prix pour les commerciaux, le e-commerce et les partenaires.",
          "Les équipes qui veulent industrialiser le quote-to-cash avec des intégrations ERP propres, en s'appuyant sur des objets standard.",
        ],
      },
      {
        h2: "Rester sur CPQ, pour l'instant",
        paragraphs: [
          "Un paramétrage CPQ stable, bien documenté et qui répond aux besoins n'a pas à être migré dans l'urgence. La bonne démarche consiste à faire l'inventaire de ce qui existe (produits, règles, templates, intégrations), à estimer l'effort de migration et à caler la décision sur un événement métier : refonte de l'offre, passage à l'abonnement, projet de facturation ou de portail client.",
        ],
      },
      {
        h2: "Comment décider",
        paragraphs: [
          "Un diagnostic de quelques jours suffit en général : cartographie du paramétrage CPQ actuel, écarts avec les capacités de Revenue Cloud, dépendances d'intégration, estimation de la migration et des risques. Il débouche sur un calendrier réaliste plutôt que sur une réponse de principe.",
        ],
      },
    ],
    faq: [
      {
        q: "Revenue Cloud remplace-t-il aussi Salesforce Billing ?",
        a: "Oui. La facturation fait partie de Revenue Cloud, qui couvre le cycle complet du devis à l'encaissement. Salesforce Billing suit la même trajectoire que CPQ.",
      },
      {
        q: "Les devis et contrats existants sont-ils perdus en migrant ?",
        a: "Non, mais ils doivent être migrés ou conservés en lecture. La stratégie dépend des abonnements en cours et des obligations de conservation ; c'est l'un des points clés du plan de migration.",
      },
    ],
    related: ["comment-migrer-de-salesforce-cpq-vers-revenue-cloud", "comment-faire-des-devis-dans-salesforce"],
  },

  {
    slug: "comment-migrer-de-salesforce-cpq-vers-revenue-cloud",
    title: "Comment migrer de Salesforce CPQ vers Revenue Cloud ?",
    description:
      "Plan de migration de Salesforce CPQ vers Revenue Cloud : inventaire du paramétrage, refonte du catalogue, conversion des règles de prix en procédures, reprise des devis, contrats et abonnements, coexistence et bascule.",
    keywords: ["migration CPQ vers Revenue Cloud", "Salesforce CPQ Revenue Cloud", "migrer CPQ", "Revenue Cloud Advanced migration", "reprise des abonnements Salesforce", "procédures de prix Salesforce"],
    date: "2026-10-19",
    updated: "2026-10-19",
    readingMinutes: 9,
    intro:
      "Migrer de CPQ vers Revenue Cloud n'est pas une mise à jour : c'est une réimplémentation du quote-to-cash sur un nouveau modèle, avec une reprise de données. Voici le plan que je recommande, étape par étape, et les pièges qui coûtent le plus cher.",
    sections: [
      {
        h2: "1. Inventorier ce que CPQ fait vraiment",
        paragraphs: [
          "On commence par extraire et documenter l'existant : produits et options, bundles, règles de prix et de produits, tableaux de remises, templates de devis, processus d'approbation, automatisations Apex et Flow qui touchent aux objets CPQ, intégrations ERP et outils tiers. On note pour chaque élément s'il est utilisé, par qui, et s'il répond encore à un besoin.",
          "Cet inventaire révèle presque toujours des règles mortes et des contournements accumulés. C'est le moment de les abandonner, pas de les reproduire.",
        ],
      },
      {
        h2: "2. Repenser le catalogue avant de le migrer",
        paragraphs: [
          "Revenue Cloud repose sur un catalogue unique avec attributs et classifications. Le catalogue CPQ, souvent construit produit par produit, gagne à être restructuré : familles cohérentes, attributs au lieu de variantes multipliées, bundles qui reflètent l'offre commerciale. Ce travail se fait avec le marketing et les ventes, pas seulement avec l'équipe technique.",
        ],
      },
      {
        h2: "3. Convertir les règles de prix en procédures",
        paragraphs: [
          "Les Price Rules de CPQ ne se transposent pas une à une. On repart des cas de tarification réels (listes de prix, remises par volume, prix négociés, majorations) et on les modélise en procédures de tarification lisibles. Les cas de test sont les devis réels extraits de CPQ : chaque procédure doit reproduire les montants attendus avant d'aller plus loin.",
        ],
      },
      {
        h2: "4. Décider du sort des devis, contrats et abonnements",
        list: [
          "Devis en cours : migrés s'ils sont actifs, sinon conservés en lecture dans CPQ ou archivés.",
          "Contrats et abonnements : c'est le point le plus sensible. Les abonnements actifs doivent être repris avec leurs dates, quantités et conditions de renouvellement, pour que les avenants et renouvellements fonctionnent dans Revenue Cloud.",
          "Historique de facturation : rarement migré ; on garde l'accès en lecture et on documente la règle.",
        ],
        paragraphsAfter: [
          "Cette reprise suit la même méthode qu'une migration de données classique : staging, mapping, chargements batchés, recette par comptage et par échantillons, plan de rollback.",
        ],
      },
      {
        h2: "5. Rebrancher les intégrations",
        paragraphs: [
          "Les flux vers l'ERP (commandes, facturation, référentiels produits) et les outils de signature ou de génération de documents sont à reconstruire sur les nouveaux objets. C'est souvent l'occasion de simplifier : les objets standard de Revenue Cloud s'intègrent plus directement que le modèle CPQ.",
        ],
      },
      {
        h2: "6. Organiser la coexistence et la bascule",
        paragraphs: [
          "Peu d'entreprises basculent tout en un jour. Une coexistence par équipe, par gamme ou par pays permet de limiter le risque, à condition de définir clairement où chaque devis se crée pendant la transition. La bascule finale suit un plan daté : gel des devis dans CPQ, dernier delta d'abonnements, contrôles, ouverture dans Revenue Cloud, période de support renforcé.",
        ],
      },
      {
        h2: "Les pièges les plus fréquents",
        list: [
          "Reproduire le paramétrage CPQ à l'identique, y compris ses défauts.",
          "Sous-estimer la reprise des abonnements et des contrats.",
          "Tester avec des devis fictifs au lieu de devis réels.",
          "Oublier les rapports et tableaux de bord qui lisaient les objets CPQ.",
          "Lancer la migration sans propriétaire métier du catalogue et des prix.",
        ],
      },
    ],
    faq: [
      {
        q: "Combien de temps dure une migration CPQ vers Revenue Cloud ?",
        a: "De trois à neuf mois selon la complexité du catalogue, le nombre de règles de prix et le volume d'abonnements à reprendre. L'inventaire initial permet de donner une estimation fiable.",
      },
      {
        q: "Peut-on migrer progressivement ?",
        a: "Oui, par périmètre (équipe, gamme, pays), à condition de fixer des règles claires de coexistence et de ne pas laisser la transition s'éterniser.",
      },
    ],
    related: ["salesforce-revenue-cloud-c-est-quoi-faut-il-quitter-cpq", "comment-migrer-ses-donnees-vers-salesforce"],
  },

  {
    slug: "comment-gerer-devis-contrats-et-facturation-avec-revenue-cloud",
    title: "Comment gérer devis, contrats et facturation avec Salesforce Revenue Cloud ?",
    description:
      "Mettre en place le quote-to-cash avec Revenue Cloud : catalogue et tarification, devis et avenants, contrats et abonnements, facturation récurrente ou à l'usage, lien avec l'ERP et la facturation électronique.",
    keywords: ["Revenue Cloud facturation", "Salesforce Billing", "quote-to-cash Revenue Cloud", "abonnements Salesforce", "facturation à l'usage Salesforce", "Revenue Cloud SAP"],
    date: "2026-10-19",
    updated: "2026-10-19",
    readingMinutes: 8,
    intro:
      "Revenue Cloud promet un cycle continu du devis à l'encaissement. La promesse tient si les décisions d'architecture sont prises au bon moment : où vit le catalogue, qui fait foi sur les prix, où se produit la facture, comment l'ERP est alimenté. Voici comment structurer une mise en place.",
    sections: [
      {
        h2: "Le catalogue et les prix, une seule source de vérité",
        paragraphs: [
          "Tout part du catalogue : produits, attributs, bundles, puis procédures de tarification. Dans une architecture avec un ERP, on décide d'abord qui maîtrise le référentiel produit. En général, les produits et les prix de base viennent de l'ERP et sont synchronisés vers Revenue Cloud ; les règles commerciales (remises, bundles, conditions) vivent dans Revenue Cloud.",
        ],
      },
      {
        h2: "Devis et avenants",
        paragraphs: [
          "Les devis s'appuient sur le configurateur et les procédures de prix. Les avenants (ajout, retrait, changement de quantité ou de durée) sont gérés nativement sur les lignes d'abonnement, ce qui évite les devis parallèles et les ressaisies. Les approbations restent ciblées sur les écarts réels : remise au-delà d'un seuil, conditions de paiement dérogatoires.",
        ],
      },
      {
        h2: "Contrats et abonnements",
        paragraphs: [
          "À la signature, Revenue Cloud génère le contrat et les abonnements correspondants, avec dates, quantités et conditions de renouvellement. L'orchestration de l'exécution déclenche ce qui suit : activation du service, livraison, mise à disposition des accès. Les renouvellements et résiliations se pilotent depuis ces abonnements, avec une vue claire de la base installée.",
        ],
      },
      {
        h2: "Facturation récurrente et à l'usage",
        paragraphs: [
          "La brique Billing produit les factures à partir des abonnements et des consommations : facturation à date fixe, au prorata, à l'usage avec remontée des volumes consommés, avoirs et ajustements. Elle génère aussi les écritures nécessaires à la reconnaissance du revenu.",
          "Deux questions à trancher tôt : la facture légale est-elle produite par Revenue Cloud ou par l'ERP, et comment la facturation électronique est-elle assurée ? En France, la facture doit transiter par une plateforme agréée dans un format structuré. Si l'ERP (SAP, par exemple) porte déjà cette conformité, Revenue Cloud alimente l'ERP et c'est lui qui émet. Dans le cas contraire, une solution connectée à une plateforme agréée est à prévoir.",
        ],
      },
      {
        h2: "Le lien avec l'ERP",
        list: [
          "Référentiels : clients et produits synchronisés avec External ID, dans un sens défini.",
          "Commandes : envoyées à l'ERP à la signature, avec un retour de statut visible par les commerciaux.",
          "Facturation et paiements : selon le choix du système émetteur, soit l'ERP facture à partir des commandes, soit Revenue Cloud facture et transmet les écritures à la comptabilité.",
          "Erreurs : file de rejeu, alertes et enregistrements en erreur visibles dans Salesforce.",
        ],
      },
      {
        h2: "Un ordre de mise en place qui fonctionne",
        list: [
          "Catalogue et tarification, validés sur des devis réels.",
          "Devis, approbations et templates.",
          "Contrats, abonnements et orchestration.",
          "Facturation et intégration comptable.",
          "Portail client ou canaux partenaires, une fois le socle stable.",
        ],
      },
    ],
    faq: [
      {
        q: "Revenue Cloud peut-il remplacer la facturation de l'ERP ?",
        a: "Techniquement oui pour la facturation client, mais la comptabilité, la fiscalité et la conformité réglementaire restent en général dans l'ERP. La décision se prend avec la direction financière.",
      },
      {
        q: "Peut-on démarrer par les devis et ajouter la facturation plus tard ?",
        a: "Oui, c'est même l'ordre recommandé. Le catalogue et les procédures de prix construits pour les devis servent ensuite tels quels à la facturation.",
      },
    ],
    related: ["salesforce-revenue-cloud-c-est-quoi-faut-il-quitter-cpq", "facturation-electronique-salesforce-sap-comment-se-preparer"],
  },
];

// Ordre d'affichage : les questions à plus forte intention d'achat d'abord
const ORDER = [
  "comment-migrer-ses-donnees-vers-salesforce",
  "comment-faire-des-devis-dans-salesforce",
  "salesforce-revenue-cloud-c-est-quoi-faut-il-quitter-cpq",
  "facturation-electronique-salesforce-sap-comment-se-preparer",
  "comment-migrer-de-salesforce-cpq-vers-revenue-cloud",
  "comment-gerer-devis-contrats-et-facturation-avec-revenue-cloud",
  "comment-integrer-salesforce-avec-sap",
  "combien-coute-un-consultant-salesforce-freelance",
  "comment-supprimer-les-doublons-dans-salesforce",
  "comment-faire-un-tableau-de-bord-commercial-salesforce",
  "comment-automatiser-salesforce-flow-ou-apex",
  "pourquoi-mon-salesforce-cpq-est-devenu-ingerable",
  "comment-charger-des-donnees-dans-salesforce",
];
export const guides = [...RAW].sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));

export const getGuide = (slug) => guides.find((g) => g.slug === slug);
