// Guides métier, en français. Contenu structuré : chaque guide a une
// introduction, des sections (h2, paragraphes, listes), une FAQ courte et
// des guides liés. `seoTitle` (60 caractères max) sert de balise <title> ;
// `title` est la question complète affichée en H1.
// Liens internes dans le texte : [texte](/guides/slug).

export const SITE_URL = "https://www.lucasmassoni.com";
export const AUTHOR = {
  name: "Lucas Massoni",
  url: SITE_URL,
  linkedin: "https://www.linkedin.com/in/lucas-massoni/",
  jobTitle: "Consultant indépendant Salesforce, data et analytics",
  bio: "Consultant indépendant spécialisé en Salesforce, en migration de données et en data visualisation. Il intervient du cadrage à la mise en production, sur le CRM, les devis, les intégrations avec l'ERP et les tableaux de bord.",
};

const D = "2026-10-19";

const RAW = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "comment-migrer-ses-donnees-vers-salesforce",
    title: "Comment migrer ses données vers Salesforce sans rien perdre ?",
    seoTitle: "Migrer ses données vers Salesforce : la méthode",
    description:
      "Audit, périmètre, mapping, staging SQL, dédoublonnage, chargement, recette et rollback : une méthode en huit étapes pour migrer vers Salesforce sans perte.",
    keywords: ["comment migrer vers Salesforce", "migration de données Salesforce", "data migration Salesforce", "reprise de données Salesforce", "mapping Salesforce", "staging SQL", "rollback migration"],
    date: D,
    updated: D,
    intro:
      "Une migration de données vers Salesforce ne se résume pas à un import de fichiers. C'est un projet à part entière, avec un périmètre, des règles de qualité, une recette et une bascule. Voici une méthode en huit étapes, de l'audit des sources au plan de retour arrière, suivie des erreurs qui reviennent le plus souvent.",
    sections: [
      {
        h2: "1. Auditer les sources avant de choisir un outil",
        paragraphs: [
          "La première étape se passe dans les données, pas dans Salesforce. Pour chaque source, qu'il s'agisse d'un ancien CRM, d'un ERP, de fichiers Excel ou d'exports d'outils métier, on inventorie les objets, les volumes et les règles de gestion implicites.",
        ],
        list: [
          "Volumes par objet et par source, et leur évolution sur les derniers mois.",
          "Clés d'identification : existe-t-il un identifiant stable pour chaque client, contact et contrat ?",
          "Qualité par champ : taux de valeurs vides, formats hétérogènes pour les dates, téléphones et pays, valeurs hors liste.",
          "Règles implicites : champs libres utilisés comme listes de valeurs, codes internes, conventions de saisie propres à une équipe.",
        ],
        paragraphsAfter: [
          "Cet audit produit deux livrables : un inventaire chiffré des sources et une liste des risques, comme les données orphelines, les références cassées ou les doublons massifs. C'est sur cette base que l'on choisit les outils, et non l'inverse.",
        ],
      },
      {
        h2: "2. Fixer le périmètre : migrer, archiver ou abandonner",
        paragraphs: [
          "Tout ne mérite pas d'être migré. Pour chaque objet, on décide ce qui part dans Salesforce, ce qui est archivé dans un stockage consultable et ce qui est abandonné. La question à poser pour chaque catégorie : sert-elle un processus actuel, une obligation légale ou une analyse historique ?",
          "Un critère de date est souvent le plus simple à appliquer, par exemple les comptes actifs et les opportunités des trois dernières années. Le reste est exporté, documenté et rendu accessible en lecture. Moins de données migrées, c'est moins de règles de transformation, une recette plus courte et un risque plus faible.",
        ],
      },
      {
        h2: "3. Construire le mapping champ par champ",
        paragraphs: [
          "Le mapping est le contrat de la migration. Pour chaque champ cible Salesforce, il documente la source, la transformation appliquée et la règle en cas de valeur absente. Il est validé par les métiers, pas seulement par l'équipe technique.",
        ],
        list: [
          "Objets standard d'abord : Account, Contact, Lead, Opportunity, Case, puis les objets personnalisés.",
          "Listes de valeurs : on aligne les picklists cibles avant de transformer les valeurs sources.",
          "Identifiants externes : un champ External ID par objet migré, pour permettre les upserts et le rapprochement avec le système d'origine.",
          "Relations : on documente l'ordre de chargement imposé par les lookups et les relations maître-détail.",
          "Propriétaires : chaque enregistrement doit être rattaché à un utilisateur actif ; les anciens collaborateurs sont remappés vers un propriétaire défini.",
          "Historique de création : la permission « Set Audit Fields upon Record Creation » permet de reprendre les dates et auteurs de création d'origine.",
          "Types d'enregistrement et devises : à fixer avant le chargement, car ils conditionnent les listes de valeurs et les montants.",
        ],
      },
      {
        h2: "4. Passer par un staging SQL",
        paragraphs: [
          "Charger directement les fichiers sources dans Salesforce est la meilleure façon de perdre le contrôle. Une base de staging, PostgreSQL ou SQL Server par exemple, reçoit chaque source telle quelle, puis la transforme par des vues ou des scripts versionnés.",
          "Concrètement, le staging contient trois couches : les données brutes telles qu'importées, les tables transformées au format Salesforce, et les tables de résultat qui reçoivent les identifiants Salesforce créés. Cette troisième couche sert à résoudre les relations entre objets et à préparer un éventuel retour arrière.",
          "Le staging permet aussi de rejouer les transformations autant de fois que nécessaire, de produire des rapports d'écart et de conserver la traçabilité entre un enregistrement Salesforce et sa ligne d'origine.",
        ],
      },
      {
        h2: "5. Dédoublonner avant de charger",
        paragraphs: [
          "Les doublons se traitent dans le staging, avec des règles explicites : clé exacte comme l'email ou le SIRET, puis rapprochements approximatifs sur le nom et l'adresse. Chaque fusion est journalisée. Les règles de doublons de Salesforce servent ensuite de filet de sécurité, pas de méthode de nettoyage.",
          "La méthode détaillée, avec les limites de la fusion native, est décrite dans le guide [pour supprimer les doublons dans Salesforce](/guides/comment-supprimer-les-doublons-dans-salesforce).",
        ],
      },
      {
        h2: "6. Charger par lots, dans le bon ordre",
        paragraphs: ["Les chargements suivent les dépendances entre objets. Un ordre type :"],
        list: [
          "Utilisateurs, rôles et données de référence, comme les produits et les catalogues de prix.",
          "Comptes, puis contacts.",
          "Opportunités, puis leurs lignes de produits.",
          "Requêtes, contrats et objets personnalisés qui référencent les précédents.",
          "Activités, notes et fichiers en dernier, car ils pointent vers tout le reste.",
        ],
        paragraphsAfter: [
          "Pour les volumes importants, l'API Bulk 2.0 est la voie normale ; Data Loader et les scripts s'appuient dessus. Pendant les chargements de masse, les automatisations lourdes sont contournées pour l'utilisateur de chargement, puis réactivées. Le choix de l'outil est détaillé dans le guide [Data Loader ou script](/guides/comment-charger-des-donnees-dans-salesforce).",
          "Chaque lot produit un journal : identifiants créés, erreurs par ligne, durée. Ces journaux alimentent le rapport de recette et servent de base au rollback.",
        ],
      },
      {
        h2: "7. Recetter avec les utilisateurs",
        paragraphs: [
          "La recette se déroule d'abord dans un sandbox Full ou Partial, sur une copie représentative des données, avant toute bascule en production. Elle combine des contrôles automatiques et des vérifications métier.",
        ],
        list: [
          "Comptages source et cible par objet, avec une explication pour chaque écart.",
          "Contrôle des relations : chaque contact rattaché au bon compte, chaque opportunité au bon propriétaire.",
          "Échantillons choisis par les métiers, comparés champ par champ avec la source.",
          "Tests de processus : un commercial retrouve ses comptes, un rapport redonne les totaux attendus.",
        ],
      },
      {
        h2: "8. Basculer avec un plan de rollback",
        paragraphs: [
          "La bascule est planifiée à l'heure près : gel des saisies dans l'ancien système, dernier delta, chargement, contrôles, ouverture aux utilisateurs. Le plan de rollback décrit comment revenir en arrière si un contrôle échoue : sauvegarde préalable, scripts de suppression par identifiants de lot, critères de décision et personne habilitée à décider.",
          "La période qui suit compte autant que la bascule : support renforcé pendant une à deux semaines, liste des anomalies remontées par les utilisateurs, corrections par lots journalisés.",
        ],
      },
      {
        h2: "Les erreurs les plus fréquentes",
        list: [
          "Choisir l'outil avant d'avoir audité les données.",
          "Migrer tout l'historique par défaut, sans se demander à quoi il servira.",
          "Charger directement en production sans répétition complète en sandbox.",
          "Oublier les automatisations qui se déclenchent pendant le chargement : emails envoyés aux clients, tâches créées par milliers.",
          "Perdre le lien entre chaque enregistrement Salesforce et sa ligne d'origine, ce qui rend toute correction ultérieure hasardeuse.",
        ],
      },
    ],
    faq: [
      {
        q: "Combien de temps dure une migration de données Salesforce ?",
        a: "De quelques semaines pour un CRM simple à plusieurs mois pour un périmètre multi-sources. L'audit et le mapping représentent souvent une large part de l'effort ; le chargement lui-même est rapide s'il est bien préparé.",
      },
      {
        q: "Faut-il migrer tout l'historique ?",
        a: "Rarement. On migre ce qui sert aux processus actuels et on archive le reste dans un stockage consultable. Moins de données migrées, c'est moins de risques et une recette plus courte.",
      },
      {
        q: "Peut-on migrer sans interrompre l'activité ?",
        a: "Oui, avec une migration initiale complète suivie d'un ou plusieurs deltas, et une fenêtre de bascule courte pendant laquelle l'ancien système est en lecture seule.",
      },
    ],
    related: ["comment-charger-des-donnees-dans-salesforce", "comment-supprimer-les-doublons-dans-salesforce"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "comment-charger-des-donnees-dans-salesforce",
    title: "Comment charger des données dans Salesforce : Data Loader ou script ?",
    seoTitle: "Data Loader ou script : charger des données Salesforce",
    description:
      "Assistant d'importation, Data Loader, API Bulk 2.0 ou script Python : quel outil pour charger des données dans Salesforce, et comment choisir.",
    keywords: ["Data Loader Salesforce", "Bulk API 2.0", "simple-salesforce", "charger des données Salesforce", "import Salesforce Python", "upsert Salesforce"],
    date: D,
    updated: D,
    intro:
      "Data Loader suffit pour un import ponctuel. Dès que les volumes montent, que les transformations se compliquent ou que le chargement doit être rejoué, un script maîtrisé devient plus sûr. Voici ce que chaque option fait bien, ses limites, et comment choisir.",
    sections: [
      {
        h2: "Ce que Data Loader fait bien",
        paragraphs: [
          "Data Loader est l'outil officiel de Salesforce pour insérer, mettre à jour, upserter, supprimer ou exporter des enregistrements à partir de fichiers CSV. Il gère le mapping de colonnes, l'authentification et plusieurs modes d'API : SOAP, par lots de 200 enregistrements au plus ; Bulk, par lots jusqu'à 10 000 ; et Bulk 2.0 dans ses versions récentes, où Salesforce découpe lui-même les lots.",
        ],
        list: [
          "Imports ponctuels de quelques milliers à quelques centaines de milliers de lignes.",
          "Opérations simples sans transformation : les données arrivent déjà prêtes.",
          "Équipes qui préfèrent une interface graphique et des fichiers de mapping réutilisables.",
          "Exécution en ligne de commande possible pour planifier des chargements récurrents.",
        ],
      },
      {
        h2: "Ses limites",
        paragraphs: [
          "Data Loader charge ce qu'on lui donne. Il ne transforme rien, ne résout pas les relations entre objets à votre place et ne garde pas de mémoire d'une exécution à l'autre.",
        ],
        list: [
          "Chaque exécution produit un fichier de succès et un fichier d'erreurs : la reprise consiste à corriger et recharger ces fichiers à la main.",
          "Les chargements dépendants demandent plusieurs exécutions successives, avec report manuel des identifiants créés.",
          "La ligne de commande se configure par fichiers XML, peu lisibles et difficiles à versionner proprement.",
        ],
      },
      {
        h2: "Quand un script Python devient nécessaire",
        paragraphs: [
          "Un script Python, avec une bibliothèque comme simple-salesforce ou un appel direct aux API REST et Bulk 2.0, prend le relais dès que le chargement n'est plus une simple copie de fichier.",
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
        h2: "Les autres options",
        list: [
          "L'assistant d'importation de données, intégré à Salesforce : simple, limité à 50 000 enregistrements par import et à certains objets.",
          "Les outils ETL et d'intégration du marché : utiles quand les chargements deviennent récurrents et doivent être supervisés au même endroit que les autres flux.",
          "Les outils en ligne bâtis sur les API Salesforce : pratiques pour des imports planifiés sans infrastructure à maintenir.",
        ],
      },
      {
        h2: "Les règles communes à tous les outils",
        paragraphs: [
          "Quel que soit l'outil, les bonnes pratiques sont les mêmes. Utiliser des External ID et des upserts plutôt que des inserts aveugles, pour pouvoir rejouer un chargement sans créer de doublons. Tester d'abord dans un sandbox avec un échantillon représentatif, puis avec le volume complet.",
          "Pendant les chargements de masse, les flows, triggers et règles de validation se déclenchent sur chaque enregistrement. Une permission personnalisée, vérifiée par ces automatisations, permet de les contourner pour l'utilisateur de chargement uniquement, sans toucher au paramétrage.",
          "Enfin, conserver un journal de chaque exécution : date, utilisateur, fichier source, nombre de lignes traitées, identifiants créés, erreurs. C'est ce journal qui rend possible un retour arrière propre.",
        ],
      },
      {
        h2: "Comment choisir",
        list: [
          "Import ponctuel, données déjà propres, un seul objet : assistant d'importation ou Data Loader.",
          "Plusieurs objets liés, transformations, reprises à prévoir : script versionné.",
          "Chargements récurrents à superviser : outil d'intégration, ou script planifié avec alertes.",
        ],
        paragraphsAfter: [
          "Dans une migration, les deux cohabitent souvent : Data Loader pour les vérifications et les objets de référence, des scripts pour tout ce qui doit être rejoué. Le cadre complet est décrit dans le guide [pour migrer ses données vers Salesforce](/guides/comment-migrer-ses-donnees-vers-salesforce).",
        ],
      },
    ],
    faq: [
      {
        q: "Data Loader peut-il charger plusieurs millions de lignes ?",
        a: "Oui avec les API Bulk, mais le suivi des erreurs et la reprise deviennent fastidieux au-delà de quelques centaines de milliers de lignes. Un script apporte un journal et une reprise plus fins.",
      },
      {
        q: "Quelle bibliothèque Python pour Salesforce ?",
        a: "simple-salesforce couvre l'API REST et les API Bulk et Bulk 2.0, ce qui suffit à la plupart des chargements. Pour des besoins très spécifiques, un client HTTP direct sur l'API Bulk 2.0 reste simple à écrire.",
      },
    ],
    related: ["comment-migrer-ses-donnees-vers-salesforce", "comment-supprimer-les-doublons-dans-salesforce"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "comment-supprimer-les-doublons-dans-salesforce",
    title: "Comment supprimer les doublons dans Salesforce, et éviter qu'ils reviennent ?",
    seoTitle: "Doublons Salesforce : les supprimer et les éviter",
    description:
      "Règles de correspondance, fusion native et ses limites, nettoyage en staging et filet de sécurité : la méthode pour dédoublonner Salesforce.",
    keywords: ["doublons Salesforce", "dédoublonnage Salesforce", "Duplicate Rules", "Matching Rules", "fusion de comptes Salesforce", "qualité des données CRM"],
    date: D,
    updated: D,
    intro:
      "Les doublons coûtent cher : relances en double, reporting faux, commerciaux qui se marchent dessus. Salesforce fournit des outils pour les détecter et en fusionner quelques-uns, mais pas pour nettoyer une base en profondeur. Voici une méthode complète, du diagnostic à la fusion, et ce que la plateforme sait faire nativement.",
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
          "Rapprochement faible : noms proches, même ville. Revue manuelle systématique.",
        ],
        paragraphsAfter: [
          "La normalisation est la clé : minuscules, suppression des accents et des formes juridiques comme SAS ou SARL, téléphones au format international, espaces nettoyés. Sans elle, une grande partie des doublons passe entre les mailles.",
        ],
      },
      {
        h2: "Ce que Salesforce sait faire nativement",
        list: [
          "Les règles de correspondance (Matching Rules) définissent quand deux enregistrements sont considérés comme identiques, de façon exacte ou approximative.",
          "Les règles de doublons (Duplicate Rules) déclenchent une alerte ou un blocage à la création et à la modification, y compris par API.",
          "Les tâches de doublons (Duplicate Jobs), disponibles dans les éditions Performance et Unlimited, analysent une base existante et produisent des listes de doublons.",
          "La fusion native regroupe jusqu'à trois enregistrements à la fois, pour les comptes, contacts, leads et requêtes. Les objets personnalisés ne se fusionnent pas nativement.",
        ],
        paragraphsAfter: [
          "Ces outils suffisent pour contenir le problème au quotidien. Pour une base qui compte des milliers de doublons, ou pour des objets personnalisés, il faut un traitement dédié.",
        ],
      },
      {
        h2: "Nettoyer en staging avant une migration",
        paragraphs: [
          "Avant une migration, le nettoyage se fait dans la base de staging : on calcule les groupes de doublons, on choisit l'enregistrement survivant selon des critères définis, on fusionne les valeurs des champs et on réaffecte les enregistrements liés. Chaque fusion est journalisée avec les identifiants d'origine.",
          "C'est l'une des huit étapes décrites dans le guide [pour migrer ses données vers Salesforce](/guides/comment-migrer-ses-donnees-vers-salesforce).",
        ],
      },
      {
        h2: "Fusionner une base déjà en production",
        paragraphs: [
          "Sur une base en production, la logique est la même, mais l'exécution passe par l'API de fusion de Salesforce, avec ses contraintes, ou par un traitement qui réaffecte les enregistrements liés avant de supprimer les doublons. On avance par lots limités, avec un contrôle d'échantillon entre chaque lot.",
        ],
        list: [
          "Choisir le survivant selon des critères écrits : le plus récent, le plus complet, celui qui porte des opportunités ou un identifiant ERP.",
          "Vérifier les références externes : un ERP ou un outil marketing qui pointe vers l'identifiant supprimé doit être mis à jour.",
          "Contrôler les champs fusionnés : valeurs multiples, propriétaires, consentements marketing.",
          "Prévenir les utilisateurs concernés, dont les listes et rapports peuvent changer.",
        ],
      },
      {
        h2: "Mettre en place le filet de sécurité",
        paragraphs: [
          "Une fois la base propre, les règles de correspondance et de doublons empêchent la réapparition des doublons à la saisie et lors des imports. On les configure en mode alerte d'abord, puis en blocage sur les cas sûrs. Les règles standard couvrent les comptes, contacts et leads ; des règles personnalisées complètent pour les objets métier.",
          "Le dernier élément est organisationnel : une personne responsable de la qualité des données, un rapport hebdomadaire des doublons potentiels et une procédure de fusion connue des utilisateurs.",
        ],
      },
    ],
    faq: [
      {
        q: "Les Duplicate Rules suffisent-elles à nettoyer une base existante ?",
        a: "Non. Elles signalent ou bloquent les doublons à la saisie et à l'import, mais elles ne fusionnent rien. Le nettoyage d'une base existante demande un traitement dédié.",
      },
      {
        q: "Peut-on fusionner plus de trois enregistrements à la fois ?",
        a: "Pas en une seule opération native. On fusionne par paliers successifs, ou on passe par un traitement dédié qui réaffecte les enregistrements liés puis supprime les doublons.",
      },
      {
        q: "Que devient l'historique lors d'une fusion ?",
        a: "Les enregistrements liés, comme les activités, opportunités et requêtes, sont réaffectés à l'enregistrement survivant. Les champs à valeurs multiples et les fichiers se vérifient au cas par cas.",
      },
    ],
    related: ["comment-migrer-ses-donnees-vers-salesforce", "comment-charger-des-donnees-dans-salesforce"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "pourquoi-mon-salesforce-cpq-est-devenu-ingerable",
    title: "Pourquoi mon paramétrage Salesforce CPQ est devenu ingérable ? 8 erreurs fréquentes",
    seoTitle: "Salesforce CPQ ingérable : 8 erreurs de paramétrage",
    description:
      "Règles de prix empilées, bundles mal conçus, approbations trop larges, calculs lents : les erreurs de paramétrage CPQ et leurs corrections.",
    keywords: ["Salesforce CPQ", "paramétrage CPQ", "règles de prix CPQ", "bundles CPQ", "cascade de prix CPQ", "quote-to-cash"],
    date: D,
    updated: D,
    intro:
      "Salesforce CPQ est puissant, et c'est précisément pour cela qu'il se dégrade vite quand chaque demande métier est traitée par une règle de plus. Voici les huit erreurs de paramétrage les plus fréquentes et la façon de les corriger. Elles comptent aussi avant une [migration vers Revenue Cloud](/guides/comment-migrer-de-salesforce-cpq-vers-revenue-cloud), où il vaut mieux ne pas reproduire les défauts existants.",
    sections: [
      {
        h2: "Comprendre la cascade de prix",
        paragraphs: [
          "Beaucoup d'erreurs viennent d'une mauvaise compréhension de l'ordre de calcul. CPQ part du prix catalogue, applique les prix spéciaux comme les prix négociés, calcule le prorata, applique les barèmes de remise pour obtenir le prix standard, puis les remises additionnelles, partenaires et distributeurs jusqu'au prix net.",
          "Une règle de prix qui écrit dans le mauvais champ, ou à la mauvaise étape du calcul, casse toute la cascade. Avant de corriger quoi que ce soit, on cartographie quelles règles interviennent à quelle étape.",
        ],
      },
      {
        h2: "1. Empiler les règles de prix sans ordre ni documentation",
        paragraphs: [
          "Les Price Rules s'exécutent selon leur ordre d'évaluation et leur événement de calcul. Quand personne ne sait plus pourquoi une remise s'applique, c'est que les règles ont été ajoutées une à une, sans convention de nommage ni journal des modifications. La correction passe par un inventaire, une numérotation explicite et la suppression des règles mortes.",
          "Un bon test : chaque règle doit pouvoir être expliquée en une phrase par quelqu'un du métier.",
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
          "Codes produits incohérents, familles mal utilisées, attributs stockés dans des champs texte : le modèle de produits conditionne tout le reste, des règles aux rapports en passant par l'intégration ERP. Il mérite une gouvernance et un responsable.",
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
          "Un devis de plusieurs centaines de lignes avec des dizaines de règles peut mettre de longues secondes à se calculer. Les causes habituelles : règles de prix qui parcourent toutes les lignes, champs formule lourds, Lookup Queries non filtrées, plugin de calcul JavaScript mal écrit. On mesure, puis on simplifie.",
        ],
      },
      {
        h2: "7. Oublier l'intégration en aval",
        paragraphs: [
          "Le devis signé doit devenir une commande, une facture, un contrat. Si les champs nécessaires à l'ERP ne sont pas prévus dès le paramétrage, l'intégration se fait à coups de ressaisies. Le mapping vers l'ERP se conçoit avec le modèle de produits.",
        ],
      },
      {
        h2: "8. Ne pas tester avec des devis réels",
        paragraphs: [
          "Les tests sur trois lignes de produits ne révèlent rien. On constitue un jeu de devis représentatifs, issus de la production, et on les rejoue à chaque modification de règle. C'est le moyen le plus sûr de vérifier qu'une correction n'en casse pas une autre.",
        ],
      },
    ],
    faq: [
      {
        q: "Faut-il repartir de zéro quand le paramétrage CPQ est devenu ingérable ?",
        a: "Rarement. Un audit permet en général de supprimer une partie des règles, d'en regrouper d'autres et de documenter le reste. La refonte complète ne se justifie que si le modèle de produits lui-même est à revoir.",
      },
      {
        q: "Faut-il corriger CPQ ou passer à Revenue Cloud ?",
        a: "CPQ n'est plus proposé aux nouveaux clients mais reste supporté pour les clients existants. Si le paramétrage répond aux besoins, une remise en ordre suffit à court terme. Si l'offre évolue fortement, mieux vaut préparer la [migration vers Revenue Cloud](/guides/comment-migrer-de-salesforce-cpq-vers-revenue-cloud) que refondre CPQ.",
      },
    ],
    related: ["salesforce-revenue-cloud-c-est-quoi-faut-il-quitter-cpq", "comment-migrer-de-salesforce-cpq-vers-revenue-cloud"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "comment-automatiser-salesforce-flow-ou-apex",
    title: "Comment automatiser Salesforce : Flow ou Apex ?",
    seoTitle: "Flow ou Apex : comment automatiser Salesforce",
    description:
      "Record-Triggered Flows, triggers Apex, traitements asynchrones, tests et limites de gouverneur : des critères concrets pour choisir entre Flow et Apex.",
    keywords: ["Flow Salesforce", "Apex Salesforce", "Flow ou Apex", "automatisation Salesforce", "trigger Apex", "Flow Trigger Explorer", "limites de gouverneur"],
    date: D,
    updated: D,
    intro:
      "Depuis la fin du support de Workflow Rules et de Process Builder, le choix se fait entre Flow et Apex. Les deux partagent les mêmes limites de plateforme ; ce qui change, c'est la complexité qu'ils absorbent et qui peut les maintenir. Voici des critères concrets pour choisir, et les bonnes pratiques communes aux deux.",
    sections: [
      {
        h2: "Flow par défaut pour la logique métier simple",
        paragraphs: [
          "Un Record-Triggered Flow gère sans code les cas courants : mise à jour de champs à la création ou à la modification, création d'enregistrements liés, envoi d'emails, lancement d'approbations. Il est lisible par un administrateur, versionné dans Salesforce et déployable sans compilation.",
        ],
        list: [
          "Préférer les flows avant enregistrement pour mettre à jour l'enregistrement déclencheur : plus rapides, sans DML supplémentaire.",
          "Plusieurs flows par objet sont possibles : l'explorateur de déclencheurs et le champ d'ordre de déclenchement fixent leur séquence. Le risque n'est pas leur nombre mais leur prolifération sans responsable.",
          "Des chemins d'erreur sur chaque action qui peut échouer, avec un message exploitable plutôt qu'une erreur générique.",
        ],
      },
      {
        h2: "Apex quand la logique devient algorithmique",
        paragraphs: [
          "Apex s'impose quand il faut parcourir des collections imbriquées, appliquer des règles complexes, appeler des services externes avec une gestion d'erreurs fine, ou traiter de gros volumes en asynchrone avec Batch Apex ou Queueable. Le code Apex doit être couvert à 75 % au moins par des tests pour être déployé en production.",
        ],
        list: [
          "Un seul trigger par objet, qui délègue à une classe de gestion : le pattern trigger handler.",
          "Du code bulkifié dès la première ligne : jamais de requête ou de DML dans une boucle.",
          "Des tests qui couvrent les cas limites et les volumes, pas seulement le pourcentage de couverture.",
        ],
      },
      {
        h2: "Les limites de gouverneur s'appliquent aux deux",
        paragraphs: [
          "Une transaction synchrone dispose par exemple de 100 requêtes SOQL et de 150 instructions DML. Flow et Apex consomment ces mêmes compteurs. Un flow mal conçu, avec une boucle qui fait une requête par enregistrement, échouera sur un chargement de masse exactement comme un Apex non bulkifié. Les tests de volume font partie de la recette, quel que soit l'outil.",
        ],
      },
      {
        h2: "Tester les flows comme le code",
        paragraphs: [
          "Les tests de flow, disponibles depuis fin 2022 pour les flows déclenchés par un enregistrement, vérifient le résultat attendu sur des cas définis. Contrairement aux tests Apex, ils ne sont pas obligatoires pour déployer, ce qui pousse à les négliger. On les exige dans la recette au même titre que les tests Apex.",
        ],
      },
      {
        h2: "Prévoir les chargements de masse",
        paragraphs: [
          "Lors des imports et des migrations, les automatisations se déclenchent sur chaque enregistrement. Une permission personnalisée de contournement, vérifiée dans les flows, les triggers et les règles de validation, permet de les désactiver pour l'utilisateur de chargement sans toucher au paramétrage. Le sujet est détaillé dans le guide [Data Loader ou script](/guides/comment-charger-des-donnees-dans-salesforce).",
        ],
      },
      {
        h2: "Les erreurs fréquentes",
        list: [
          "Des flows sans chemin d'erreur, qui bloquent l'utilisateur avec un message incompréhensible.",
          "Plusieurs automatisations qui écrivent le même champ, avec un résultat qui dépend de l'ordre d'exécution.",
          "La même logique dupliquée entre un flow et un trigger, qui finissent par diverger.",
          "Des emails envoyés aux clients pendant un import, faute de contournement prévu.",
        ],
      },
      {
        h2: "Une grille de décision simple",
        list: [
          "Logique déclarative, maintenue par les administrateurs, volumes raisonnables : Flow.",
          "Calculs complexes, intégrations avec gestion d'erreurs, traitements asynchrones de masse : Apex.",
          "Logique partagée entre plusieurs automatisations : une action Apex invocable appelée depuis les flows.",
          "Dans tous les cas : documentation, convention de nommage et un propriétaire identifié par automatisation.",
        ],
      },
    ],
    faq: [
      {
        q: "Peut-on tout faire en Flow ?",
        a: "Presque, mais pas toujours au meilleur coût. Au-delà d'un certain niveau de complexité, un flow devient plus difficile à lire et à faire évoluer qu'une classe Apex bien écrite.",
      },
      {
        q: "Faut-il migrer les anciens Process Builder vers Flow ?",
        a: "Oui, leur support a pris fin. Salesforce fournit un outil de migration, mais c'est aussi l'occasion de regrouper et de simplifier les automatisations existantes plutôt que de les convertir une à une.",
      },
    ],
    related: ["comment-charger-des-donnees-dans-salesforce", "comment-integrer-salesforce-avec-sap"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "comment-faire-un-tableau-de-bord-commercial-salesforce",
    title: "Comment faire un tableau de bord commercial fiable avec Salesforce ?",
    seoTitle: "Tableau de bord commercial Salesforce : la méthode",
    description:
      "Décisions, indicateurs, données, outil, lecture : la méthode en six étapes pour un tableau de bord commercial fiable avec Salesforce.",
    keywords: ["comment faire un tableau de bord Salesforce", "dashboard commercial Salesforce", "CRM Analytics", "Tableau", "Power BI Salesforce", "reporting Salesforce", "KPI commerciaux"],
    date: D,
    updated: D,
    intro:
      "Un tableau de bord commercial fiable tient moins à l'outil qu'à trois choses : des questions claires, des indicateurs définis et des données propres. Voici une méthode en six étapes, avec un comparatif des outils disponibles autour de Salesforce.",
    sections: [
      {
        h2: "1. Partir des décisions, pas des données",
        paragraphs: [
          "Avant de choisir un graphique, on liste les décisions que le tableau de bord doit éclairer : où concentrer l'effort commercial, quelle prévision annoncer au comité de direction, faut-il renforcer une équipe. Chaque indicateur doit servir au moins une de ces décisions ; sinon, il n'a pas sa place.",
        ],
      },
      {
        h2: "2. Définir chaque indicateur par écrit",
        paragraphs: [
          "Un taux de transformation calculé de deux façons différentes ruine la confiance. Chaque indicateur reçoit une fiche : question à laquelle il répond, formule, périmètre, source, fréquence de mise à jour, propriétaire. Les indicateurs utiles et leurs définitions sont détaillés dans le guide [sur les KPI commerciaux](/guides/quels-kpi-suivre-pour-piloter-une-equipe-commerciale).",
        ],
      },
      {
        h2: "3. Fiabiliser les données sources",
        list: [
          "Des étapes de vente définies, avec des critères de passage connus des commerciaux.",
          "Des dates de clôture et des montants tenus à jour, contrôlés par des règles de validation.",
          "Une base sans doublons de comptes, sinon chaque indicateur par client est faux.",
          "Un historique des étapes conservé, pour mesurer la durée du cycle et les conversions.",
        ],
        paragraphsAfter: [
          "Si la base contient des doublons, le nettoyage passe avant le tableau de bord : la méthode est dans le guide [sur les doublons Salesforce](/guides/comment-supprimer-les-doublons-dans-salesforce).",
        ],
      },
      {
        h2: "4. Choisir l'outil",
        list: [
          "Les rapports et tableaux de bord standard couvrent le suivi quotidien. Ils atteignent leurs limites sur les croisements complexes, l'historique et les sources externes.",
          "CRM Analytics est intégré à Salesforce : les tableaux de bord s'affichent dans les pages d'enregistrement, respectent la sécurité Salesforce et permettent d'agir directement.",
          "Tableau, également édité par Salesforce, se connecte à presque toutes les sources et excelle sur l'exploration et le reporting de direction.",
          "Power BI est souvent déjà en place dans l'entreprise. Il se connecte à Salesforce par des connecteurs natifs ou via un entrepôt de données, comme l'explique le guide [pour connecter Salesforce à Power BI](/guides/comment-connecter-salesforce-a-power-bi).",
        ],
        paragraphsAfter: [
          "Salesforce pousse aussi Data Cloud et Tableau Next, sa nouvelle génération d'analytics bâtie sur Data Cloud. Ils se justifient quand les données de plusieurs systèmes doivent être unifiées dans Salesforce ; pour un premier tableau de bord commercial, ils ne sont pas un prérequis.",
        ],
      },
      {
        h2: "5. Concevoir pour la lecture",
        paragraphs: [
          "Pour une direction commerciale, les premiers indicateurs à afficher sont en général le pipeline créé, le taux de transformation, la couverture du pipeline, la durée du cycle de vente et l'écart entre prévision et réalisé.",
        ],
        list: [
          "Cinq à sept indicateurs en tête, pas trente.",
          "Chaque indicateur avec sa tendance et son objectif, pas seulement une valeur.",
          "Une hiérarchie : la synthèse en haut, le détail par équipe ou par produit en dessous.",
          "La date de mise à jour des données visible sur le tableau de bord.",
        ],
      },
      {
        h2: "6. Faire vivre le tableau de bord",
        paragraphs: [
          "Un tableau de bord sans propriétaire se dégrade en quelques mois. On nomme un responsable, on le revoit en réunion commerciale et on supprime ce qui n'est plus regardé.",
          "Beaucoup d'organisations combinent plusieurs outils, par exemple CRM Analytics pour les managers commerciaux et Tableau ou Power BI pour la direction. Cela fonctionne à une condition : partager les mêmes définitions et la même source de vérité.",
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
        a: "Quelques jours sur des données Salesforce propres. L'essentiel du temps se passe à valider les définitions d'indicateurs avec les métiers et à corriger les données.",
      },
    ],
    related: ["quels-kpi-suivre-pour-piloter-une-equipe-commerciale", "comment-connecter-salesforce-a-power-bi"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "quels-kpi-suivre-pour-piloter-une-equipe-commerciale",
    title: "Quels KPI suivre pour piloter une équipe commerciale ?",
    seoTitle: "KPI commerciaux : quels indicateurs suivre ?",
    description:
      "Conversion, vélocité, pipeline, prévision, valeur : les indicateurs commerciaux utiles, leur définition exacte et les pièges de calcul.",
    keywords: ["KPI commerciaux", "indicateurs commerciaux", "taux de transformation", "couverture du pipeline", "durée du cycle de vente", "KPI Salesforce"],
    date: D,
    updated: D,
    intro:
      "Un bon pilotage commercial repose sur peu d'indicateurs, définis sans ambiguïté et calculés de la même façon partout. Voici les familles d'indicateurs utiles, leur définition, et les erreurs de calcul qui faussent le plus souvent les tableaux de bord.",
    sections: [
      {
        h2: "Partir des questions de la direction",
        paragraphs: [
          "Chaque indicateur répond à une question : génère-t-on assez d'affaires, les transforme-t-on bien, assez vite, et à quel prix ? Les familles ci-dessous suivent ces questions. Un indicateur qui ne répond à aucune question de pilotage n'a pas sa place dans le tableau de bord de direction.",
        ],
      },
      {
        h2: "Volume et conversion",
        list: [
          "Pipeline créé : montant des opportunités créées sur la période, par source et par équipe.",
          "Taux de conversion lead vers opportunité : leads convertis sur leads traités, sur une même cohorte.",
          "Taux de transformation : opportunités gagnées sur opportunités clôturées, gagnées et perdues. Les opportunités ouvertes n'entrent pas dans le calcul.",
          "Conversion par étape : part des opportunités qui passent d'une étape à la suivante, pour repérer où le pipeline se bloque.",
        ],
      },
      {
        h2: "Vélocité",
        list: [
          "Durée du cycle de vente : de la création à la clôture, mesurée sur les opportunités gagnées.",
          "Temps passé par étape : à partir de l'historique des étapes, pour identifier les goulots.",
          "Délai de devis : entre la demande et l'envoi du devis, souvent révélateur de la complexité du processus.",
          "Vélocité commerciale : nombre d'opportunités, multiplié par le taux de transformation et le montant moyen, divisé par la durée du cycle. Elle résume l'effet combiné des quatre leviers.",
        ],
      },
      {
        h2: "Pipeline et prévision",
        list: [
          "Couverture du pipeline : pipeline ouvert sur la période, rapporté à l'objectif restant. Le bon ratio dépend du taux de transformation de l'équipe.",
          "Âge des opportunités : celles qui dépassent largement la durée moyenne du cycle sont rarement gagnées.",
          "Précision des prévisions : écart entre la prévision annoncée en début de période et le résultat réel.",
          "Glissements de dates : opportunités dont la date de clôture a été repoussée, signe d'un pipeline surestimé.",
        ],
      },
      {
        h2: "Valeur",
        list: [
          "Montant moyen des affaires gagnées, par segment et par produit.",
          "Remise moyenne accordée et son évolution, à rapprocher de la marge.",
          "Pour les modèles d'abonnement : revenu récurrent, taux de renouvellement et rétention nette.",
        ],
      },
      {
        h2: "Ce que Salesforce fournit pour les mesurer",
        list: [
          "L'historique des opportunités enregistre les changements d'étape, de montant et de date de clôture : c'est la base de la vélocité et des glissements.",
          "Le suivi de l'historique des champs étend cette traçabilité aux champs choisis.",
          "Les rapports de tendance historique comparent l'état du pipeline à différentes dates.",
          "Les prévisions collaboratives structurent la prévision par commercial, manager et période.",
        ],
        paragraphsAfter: [
          "Pour des analyses plus poussées ou croisées avec l'ERP, les données sont exploitées dans un outil d'analyse, par exemple en [connectant Salesforce à Power BI](/guides/comment-connecter-salesforce-a-power-bi).",
        ],
      },
      {
        h2: "Rédiger la fiche de chaque indicateur",
        paragraphs: [
          "Chaque indicateur est documenté sur une fiche courte, validée par la direction commerciale et partagée avec ceux qui construisent les rapports.",
        ],
        list: [
          "La question à laquelle il répond.",
          "La formule exacte, avec les filtres : types d'opportunités, devises, exclusions.",
          "Le champ de date utilisé : date de création, de clôture ou d'étape.",
          "La source et la fréquence de mise à jour.",
          "Le propriétaire et le seuil d'alerte.",
        ],
      },
      {
        h2: "Les pièges de calcul les plus fréquents",
        list: [
          "Inclure les opportunités ouvertes dans le taux de transformation, ce qui le fait baisser artificiellement.",
          "Mélanger les devises sans conversion, ou avec des taux différents selon les rapports.",
          "Comparer des périodes sur des champs de date différents.",
          "Suivre trop d'indicateurs : au-delà d'une dizaine, plus personne ne les regarde.",
        ],
        paragraphsAfter: [
          "La mise en forme de ces indicateurs dans un tableau de bord est traitée dans le guide [pour faire un tableau de bord commercial fiable](/guides/comment-faire-un-tableau-de-bord-commercial-salesforce).",
        ],
      },
    ],
    faq: [
      {
        q: "Combien d'indicateurs faut-il suivre ?",
        a: "Cinq à sept pour la direction, quelques-uns de plus pour les managers. Au-delà, l'attention se disperse et les écarts de définition se multiplient.",
      },
      {
        q: "Quel ratio de couverture du pipeline viser ?",
        a: "Il dépend du taux de transformation. Avec un taux de 25 %, il faut environ quatre fois l'objectif restant en pipeline qualifié ; avec 40 %, deux fois et demie suffisent.",
      },
    ],
    related: ["comment-faire-un-tableau-de-bord-commercial-salesforce", "comment-connecter-salesforce-a-power-bi"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "comment-connecter-salesforce-a-power-bi",
    title: "Comment connecter Salesforce à Power BI ?",
    seoTitle: "Connecter Salesforce à Power BI : les 3 méthodes",
    description:
      "Connecteur Objects, connecteur Reports ou entrepôt : les trois façons de relier Salesforce à Power BI, leurs limites et la sécurité.",
    keywords: ["Power BI Salesforce", "connecter Salesforce à Power BI", "connecteur Salesforce Power BI", "Salesforce Objects Power BI", "Salesforce Reports Power BI", "reporting Salesforce Power BI"],
    date: D,
    updated: D,
    intro:
      "Power BI est souvent l'outil d'analyse déjà en place quand une entreprise adopte Salesforce. Les deux se connectent sans difficulté, mais pas toujours de la bonne façon. Voici les trois méthodes possibles, leurs limites, et les points à traiter pour que les chiffres soient justes et que chacun ne voie que ce qu'il doit voir.",
    sections: [
      {
        h2: "Les prérequis",
        list: [
          "Un accès API côté Salesforce : inclus dans les éditions Enterprise, Unlimited et Performance, en option sur l'édition Professional.",
          "Un compte de service dédié à l'extraction, avec la permission API activée et une visibilité définie sur les objets et les champs.",
          "Une estimation des volumes, car chaque rafraîchissement consomme des appels API sur le quota quotidien de l'organisation.",
        ],
      },
      {
        h2: "Méthode 1 : le connecteur Salesforce Objects",
        paragraphs: [
          "Dans Power BI Desktop, le connecteur Salesforce Objects lit directement les objets standard et personnalisés : comptes, opportunités, lignes de produits, objets métier. On choisit les objets et les champs, puis on modélise dans Power BI.",
          "C'est la méthode la plus rapide pour démarrer. Ses limites apparaissent avec les volumes : rafraîchissements longs, consommation d'appels API, et pas de mode DirectQuery, les données étant importées à chaque rafraîchissement. Il faut aussi penser à récupérer les libellés des listes de valeurs et à gérer la conversion des devises.",
        ],
      },
      {
        h2: "Méthode 2 : le connecteur Salesforce Reports",
        paragraphs: [
          "Le connecteur Salesforce Reports importe le résultat d'un rapport Salesforce existant. L'avantage : les filtres et la logique du rapport sont réutilisés tels quels. La limite est forte : l'API des rapports ne renvoie que 2 000 lignes. Cette méthode convient aux petites synthèses, pas à l'analyse détaillée.",
        ],
      },
      {
        h2: "Méthode 3 : passer par un entrepôt de données",
        paragraphs: [
          "Dès que les volumes grandissent, que l'historique compte ou que Salesforce doit être croisé avec l'ERP, on extrait les données dans un entrepôt : SQL Server, Azure SQL, Microsoft Fabric, Snowflake ou équivalent. L'extraction est incrémentale, à partir du champ SystemModstamp, par un outil d'intégration ou un script planifié.",
          "Power BI se branche alors sur l'entrepôt, qui porte un modèle propre et historisé. Les calculs complexes sont faits une fois, au même endroit, et servent à tous les rapports.",
        ],
      },
      {
        h2: "Modéliser les données dans Power BI",
        list: [
          "Un schéma en étoile : des tables de faits pour les opportunités et leurs lignes, des dimensions pour les comptes, utilisateurs, produits et dates.",
          "Une table de dates qui suit l'exercice fiscal de l'entreprise, si celui-ci ne commence pas en janvier.",
          "Les montants convertis dans une devise de référence, avec la même source de taux que Salesforce.",
          "L'historique des opportunités pour mesurer les glissements de dates et la durée passée par étape.",
        ],
      },
      {
        h2: "Rafraîchissement et quotas d'API",
        paragraphs: [
          "Chaque rafraîchissement d'un modèle connecté directement à Salesforce relit les objets sélectionnés et consomme des appels API. Sur de gros volumes, cela pèse sur le quota quotidien partagé avec les intégrations et les chargements.",
        ],
        list: [
          "Limiter les objets et les champs extraits à ce que les rapports utilisent réellement.",
          "Filtrer à la source, par exemple sur les opportunités des dernières années.",
          "Planifier les rafraîchissements hors des fenêtres de chargement et d'intégration.",
          "Suivre la consommation d'appels API dans Salesforce après la mise en production.",
        ],
      },
      {
        h2: "Les erreurs de chiffres les plus fréquentes",
        list: [
          "Afficher les valeurs techniques des listes de valeurs au lieu de leurs libellés.",
          "Additionner des montants en devises différentes.",
          "Oublier que les dates et heures renvoyées par l'API sont en UTC, ce qui décale certains enregistrements d'un jour.",
          "Recalculer dans Power BI un champ formule Salesforce avec une logique légèrement différente.",
        ],
      },
      {
        h2: "Ne pas oublier la sécurité",
        paragraphs: [
          "Power BI ne reprend pas les règles de partage de Salesforce. Le connecteur voit toutes les données visibles par le compte utilisé, et tous les lecteurs du rapport publié voient ces mêmes données. Si un commercial ne doit voir que son territoire, il faut reconstruire cette restriction dans Power BI avec la sécurité au niveau des lignes.",
        ],
      },
    ],
    faq: [
      {
        q: "Power BI ou CRM Analytics ?",
        a: "Power BI si l'entreprise l'utilise déjà et que les analyses croisent plusieurs systèmes. CRM Analytics si les utilisateurs travaillent dans Salesforce et doivent agir depuis le tableau de bord. Le guide [sur les tableaux de bord commerciaux](/guides/comment-faire-un-tableau-de-bord-commercial-salesforce) compare les options.",
      },
      {
        q: "Peut-on avoir des données en temps réel dans Power BI ?",
        a: "Pas avec les connecteurs Salesforce, qui fonctionnent en import. Des rafraîchissements planifiés plusieurs fois par jour suffisent en général au pilotage commercial.",
      },
    ],
    related: ["comment-faire-un-tableau-de-bord-commercial-salesforce", "quels-kpi-suivre-pour-piloter-une-equipe-commerciale"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "comment-integrer-salesforce-avec-sap",
    title: "Comment intégrer Salesforce avec SAP ou un autre ERP ?",
    seoTitle: "Intégrer Salesforce avec SAP ou un ERP",
    description:
      "Système maître, flux, API SAP et Salesforce, middleware, gestion des erreurs : comment intégrer Salesforce avec SAP S/4HANA ou un autre ERP.",
    keywords: ["comment intégrer Salesforce", "intégration SAP Salesforce", "SAP S/4HANA Salesforce", "intégration ERP CRM", "OData SAP", "middleware SAP Salesforce", "synchronisation ERP CRM"],
    date: D,
    updated: D,
    intro:
      "L'intégration entre l'ERP et le CRM est l'un des flux les plus sensibles d'une entreprise : c'est elle qui relie une opportunité gagnée à une commande, puis à une facture. Voici les décisions à prendre avant la première ligne de code, les interfaces disponibles de part et d'autre, et les principes qui rendent les flux fiables dans la durée.",
    sections: [
      {
        h2: "Décider du système maître, objet par objet",
        paragraphs: [
          "Avant tout choix technique, on fixe pour chaque donnée qui fait foi. En général, les clients et les produits sont maîtrisés dans l'ERP et diffusés vers Salesforce ; les leads, opportunités et devis naissent dans Salesforce ; les commandes et factures reviennent de l'ERP. Un objet avec deux maîtres est un conflit garanti.",
          "Dans SAP S/4HANA, clients et fournisseurs sont gérés comme des partenaires commerciaux. C'est l'identifiant du partenaire, stocké dans un champ External ID côté Salesforce, qui fait le lien entre les deux systèmes.",
        ],
      },
      {
        h2: "Les flux typiques",
        list: [
          "Clients : création ou mise à jour dans l'ERP, diffusion vers les comptes Salesforce.",
          "Produits et prix de base : diffusés de l'ERP vers le catalogue Salesforce.",
          "Commandes : créées dans Salesforce à la signature, transmises à l'ERP qui les exécute.",
          "Statuts, livraisons et factures : remontés de l'ERP vers Salesforce pour les commerciaux.",
          "Encours et conditions de paiement : consultés à la demande depuis Salesforce.",
        ],
        paragraphsAfter: [
          "Le flux des factures et de leurs statuts prend une importance particulière avec la [facturation électronique obligatoire](/guides/facturation-electronique-obligatoire-salesforce-erp). Si les devis et la facturation passent par Revenue Cloud, le découpage des rôles est décrit dans le guide [sur le cycle complet avec Revenue Cloud](/guides/comment-gerer-devis-contrats-et-facturation-avec-revenue-cloud).",
        ],
      },
      {
        h2: "Les interfaces disponibles côté SAP",
        list: [
          "IDoc : échanges asynchrones par documents, adaptés aux flux de masse comme les clients, commandes et factures, avec suivi et reprise natifs.",
          "BAPI et RFC : appels synchrones de fonctions métier, utiles pour des créations ou contrôles à la demande.",
          "OData : services exposés par SAP Gateway ou SAP BTP, adaptés aux lectures et aux intégrations web modernes.",
          "SAP Integration Suite : la couche d'intégration de SAP BTP, qui orchestre ces interfaces et expose des API REST.",
        ],
        paragraphsAfter: [
          "Sur S/4HANA, et en particulier dans sa version cloud, on privilégie les API publiées par SAP, comme API_BUSINESS_PARTNER pour les partenaires commerciaux ou API_SALES_ORDER_SRV pour les commandes de vente, plutôt que des développements spécifiques. C'est le principe du « clean core » : garder le cœur de l'ERP standard pour faciliter les mises à jour.",
        ],
      },
      {
        h2: "Les interfaces côté Salesforce",
        list: [
          "API REST et Bulk 2.0 pour les lectures et écritures, avec External ID pour les upserts idempotents.",
          "Platform Events et Change Data Capture pour publier les changements Salesforce vers l'extérieur sans scrutation.",
          "Appels sortants en Apex pour des besoins ciblés, avec des Named Credentials pour l'authentification.",
        ],
      },
      {
        h2: "Avec ou sans middleware",
        paragraphs: [
          "Une intégration point à point tient pour un ou deux flux simples. Au-delà, un middleware, comme SAP Integration Suite, MuleSoft ou un ETL déjà en place, apporte le routage, la transformation, la journalisation et la reprise sur erreur au même endroit. Le critère n'est pas la taille de l'entreprise mais le nombre de flux et le besoin de supervision.",
          "Quel que soit l'outil, découper les intégrations en couches réutilisables, une pour l'accès à chaque système et une pour chaque processus métier, évite de reconstruire les mêmes connecteurs pour chaque nouveau besoin.",
        ],
      },
      {
        h2: "Rendre les flux rejouables",
        paragraphs: [
          "Une intégration fiable est idempotente : rejouer un message ne crée pas de doublon. Les upserts sur External ID côté Salesforce et les identifiants de message côté ERP garantissent ce comportement. Chaque message porte aussi un identifiant de corrélation qui permet de suivre une commande de bout en bout, de Salesforce à la facture.",
        ],
      },
      {
        h2: "Gérer les erreurs comme un flux à part entière",
        paragraphs: [
          "Une intégration sans gestion d'erreurs explicite finit en tickets et en ressaisies. Chaque flux doit définir ce qui se passe quand l'ERP est indisponible, quand une donnée est rejetée par une règle de validation, quand un identifiant est inconnu : file d'attente et rejeu, alerte à un responsable, enregistrement en erreur visible dans Salesforce.",
          "Les tests se font avec des données réelles anonymisées et des scénarios d'erreur, pas seulement sur le cas nominal.",
        ],
      },
    ],
    faq: [
      {
        q: "Temps réel ou batch ?",
        a: "Les référentiels comme les clients et les produits tolèrent un batch quotidien ou horaire. Les statuts de commande et les stocks consultés par les commerciaux justifient du quasi temps réel, par événements.",
      },
      {
        q: "Faut-il un middleware pour un seul flux ?",
        a: "Non. Un flux simple et bien journalisé peut rester point à point. On passe au middleware quand les flux se multiplient ou que la supervision devient un besoin.",
      },
    ],
    related: ["facturation-electronique-obligatoire-salesforce-erp", "comment-gerer-devis-contrats-et-facturation-avec-revenue-cloud"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "comment-faire-des-devis-dans-salesforce",
    title: "Comment faire des devis dans Salesforce ? Quotes standard ou Revenue Cloud",
    seoTitle: "Devis dans Salesforce : Quotes ou Revenue Cloud ?",
    description:
      "Quand les Quotes standard suffisent, quand passer à Revenue Cloud, templates, signature et délais : comment faire des devis dans Salesforce.",
    keywords: ["devis Salesforce", "comment faire un devis dans Salesforce", "Quotes Salesforce", "Revenue Cloud", "template de devis Salesforce", "quote-to-cash"],
    date: D,
    updated: D,
    intro:
      "Faire un devis dans Salesforce est possible dès la licence Sales Cloud, avec l'objet Quote. La vraie question est ailleurs : votre offre tient-elle dans un catalogue simple, ou demande-t-elle des configurations, des règles de prix et des abonnements ? La réponse détermine l'outil, le budget et le délai.",
    sections: [
      {
        h2: "Les Quotes standard de Sales Cloud",
        paragraphs: [
          "L'objet Quote est lié à une opportunité. Il reprend les lignes de produits depuis le catalogue de prix, calcule les totaux, génère un PDF à partir d'un template et permet de synchroniser le devis retenu avec l'opportunité.",
        ],
        list: [
          "Catalogue de produits et tarifs stables, peu de variantes.",
          "Remises simples, appliquées ligne par ligne ou sur le total.",
          "Un ou deux modèles de PDF, sans sections conditionnelles complexes.",
          "Approbation par un processus standard, sur un montant ou un taux de remise.",
        ],
        paragraphsAfter: [
          "Dans ce périmètre, un devis opérationnel se met en place en une à deux semaines : catalogue, template, processus d'approbation, formation. C'est aussi le bon point de départ quand le processus commercial n'est pas encore stabilisé.",
        ],
      },
      {
        h2: "Quand passer à Revenue Cloud",
        paragraphs: [
          "Revenue Cloud s'impose quand le devis devient un objet de configuration : produits à options, bundles, abonnements avec dates de début et de fin, tarifs par volume ou par segment, remises conditionnelles, renouvellements et avenants. C'est la solution que Salesforce propose désormais pour ces besoins ; Salesforce CPQ, qui les couvrait jusqu'ici, n'est plus proposé aux nouveaux clients.",
        ],
        list: [
          "Bundles et options avec règles de compatibilité entre produits.",
          "Tarification avancée : remises par paliers, prix négociés par client, majorations selon les conditions.",
          "Abonnements, prorata, renouvellements et avenants.",
          "Approbations à plusieurs niveaux selon le type d'écart.",
          "Facturation récurrente ou à l'usage intégrée au même cycle.",
        ],
        paragraphsAfter: [
          "Les entreprises déjà équipées de CPQ peuvent continuer à l'utiliser ; la question de la migration est traitée dans le guide [Revenue Cloud ou CPQ](/guides/salesforce-revenue-cloud-c-est-quoi-faut-il-quitter-cpq).",
        ],
      },
      {
        h2: "Templates, documents et signature",
        paragraphs: [
          "Les Quotes standard génèrent un PDF à partir d'un template simple. Pour des documents riches, avec sections conditionnelles et conditions générales versionnées, il faut un outil de génération de documents, inclus dans Revenue Cloud ou apporté par une solution partenaire. La signature électronique passe par un service connecté, qui renvoie le devis signé et met à jour l'opportunité.",
        ],
      },
      {
        h2: "Ce qu'il faut prévoir, quel que soit l'outil",
        paragraphs: [
          "Un projet de devis échoue rarement sur l'outil et souvent sur les données et le processus. Avant le paramétrage, on fixe le modèle de produits, avec ses codes, familles et unités, les règles de remise autorisées et les seuils d'approbation. On décide aussi de ce qui se passe après la signature : création de commande, transmission à l'ERP, facturation.",
          "La facturation n'est pas native dans Sales Cloud : elle se fait dans l'ERP ou avec la brique de facturation de Revenue Cloud. Les données nécessaires, comme le SIREN, l'adresse de facturation, les références de commande et les conditions de paiement, doivent exister dans le devis dès le départ, d'autant plus avec la [facturation électronique obligatoire](/guides/facturation-electronique-obligatoire-salesforce-erp).",
        ],
      },
      {
        h2: "Les étapes d'un projet de devis",
        list: [
          "Cartographier le processus actuel : qui fait les devis, avec quels outils, quelles validations et quels délais.",
          "Construire le catalogue de produits et les catalogues de prix, avec un responsable désigné.",
          "Concevoir les templates avec les équipes commerciales et juridiques.",
          "Paramétrer les approbations sur les seuils retenus.",
          "Brancher l'aval : commande, ERP, facturation.",
          "Former les commerciaux sur des cas réels, puis suivre l'adoption pendant les premières semaines.",
        ],
      },
      {
        h2: "Les erreurs à éviter",
        list: [
          "Laisser coexister des devis faits hors de Salesforce, puis ressaisis : les données de pipeline deviennent fausses.",
          "Créer un produit par client ou par variante au lieu de travailler avec des prix et des remises.",
          "Autoriser les remises sans seuil ni approbation, puis découvrir l'érosion de marge en fin d'année.",
          "Publier un template sans relecture juridique des conditions générales.",
        ],
      },
      {
        h2: "Ordre de grandeur des délais",
        list: [
          "Quotes standard, catalogue simple : une à deux semaines, formation comprise.",
          "Quotes standard avec approbations, templates multiples et intégration ERP : trois à six semaines.",
          "Revenue Cloud : deux à six mois selon la complexité du catalogue, des règles de prix et de la facturation.",
        ],
      },
    ],
    faq: [
      {
        q: "Peut-on commencer avec les Quotes standard et passer à Revenue Cloud plus tard ?",
        a: "Oui, et c'est souvent la bonne trajectoire. Revenue Cloud repose lui aussi sur les objets standard de devis et de produits : les produits, catalogues de prix et opportunités sont réutilisés. Un catalogue propre dès le départ facilite la transition.",
      },
      {
        q: "Salesforce peut-il émettre les factures ?",
        a: "Pas avec Sales Cloud seul. La facturation se fait dans l'ERP ou avec Revenue Cloud. Le devis doit alors porter toutes les données nécessaires à la facture.",
      },
    ],
    related: ["salesforce-revenue-cloud-c-est-quoi-faut-il-quitter-cpq", "facturation-electronique-obligatoire-salesforce-erp"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "facturation-electronique-obligatoire-salesforce-erp",
    title: "Facturation électronique obligatoire : que faut-il adapter dans Salesforce et l'ERP ?",
    seoTitle: "Facturation électronique : adapter Salesforce et l'ERP",
    description:
      "En vigueur depuis septembre 2026 : e-reporting, nouvelles mentions, statuts. Ce que la facturation électronique change pour Salesforce et l'ERP.",
    keywords: ["facturation électronique", "facturation électronique obligatoire", "facturation électronique Salesforce", "plateforme agréée", "PDP", "e-reporting", "Factur-X"],
    date: D,
    updated: D,
    intro:
      "Depuis le 1er septembre 2026, toutes les entreprises assujetties à la TVA en France doivent pouvoir recevoir des factures électroniques, et les grandes entreprises et les ETI doivent les émettre. Les PME et micro-entreprises suivront le 1er septembre 2027. Pour une organisation qui vend dans Salesforce et facture dans un ERP, la question est concrète : où se produit la facture conforme, et quelles données doivent circuler entre les deux systèmes ?",
    sections: [
      {
        h2: "Ce que la réforme impose",
        paragraphs: [
          "Les factures entre entreprises établies en France transitent désormais sous forme structurée par des plateformes agréées par l'administration, appelées jusqu'en 2025 plateformes de dématérialisation partenaires, ou PDP. Les formats admis sont Factur-X, UBL et CII. Le portail public de facturation ne sert pas d'outil d'échange : il tient l'annuaire des entreprises et centralise les données transmises à l'administration.",
          "Le calendrier fixé par la loi : réception obligatoire pour toutes les entreprises, et émission pour les grandes entreprises et les ETI, depuis le 1er septembre 2026 ; émission pour les PME et micro-entreprises au 1er septembre 2027. Vérifiez les textes en vigueur au moment de votre projet, des ajustements restent possibles.",
        ],
      },
      {
        h2: "L'e-reporting, l'autre volet",
        paragraphs: [
          "Les opérations qui ne relèvent pas de la facturation électronique entre entreprises françaises doivent être déclarées : ventes aux particuliers, opérations avec des entreprises étrangères, et données de paiement pour les prestations de services. Ces données transitent aussi par la plateforme agréée, selon le même calendrier que l'émission.",
        ],
      },
      {
        h2: "Les nouvelles mentions obligatoires",
        paragraphs: ["Quatre mentions s'ajoutent aux mentions habituelles des factures :"],
        list: [
          "Le numéro SIREN du client.",
          "L'adresse de livraison des biens, si elle diffère de l'adresse de facturation.",
          "La catégorie de l'opération : livraison de biens, prestation de services, ou les deux.",
          "L'option pour le paiement de la TVA d'après les débits, le cas échéant.",
        ],
        paragraphsAfter: [
          "Chacune remonte à une donnée qui naît souvent dans le CRM : la fiche client, l'adresse portée par le devis, le type de produit vendu.",
        ],
      },
      {
        h2: "Où produire la facture : dans l'ERP, en général",
        paragraphs: [
          "Dans une architecture Salesforce et ERP, la facture conforme est produite par l'ERP, qui porte la comptabilité, les mentions légales et la connexion à la plateforme agréée. Avec SAP, c'est le rôle de SAP Document and Reporting Compliance. Salesforce reste le système des devis, des commandes et de la relation client. Si la facturation se fait dans Salesforce, avec Revenue Cloud par exemple, il faut la connecter à une plateforme agréée.",
          "Conséquence : le flux devis gagné, commande, facture doit être fiable de bout en bout. Une facture rejetée pour une donnée manquante ou incohérente remonte souvent à une saisie incomplète dans le CRM.",
        ],
      },
      {
        h2: "Les données à préparer dans Salesforce",
        list: [
          "Identification du client : SIREN ou SIRET, numéro de TVA intracommunautaire, raison sociale exacte, adresse de facturation structurée.",
          "Adresse de livraison distincte, quand elle existe, portée par le devis et la commande.",
          "Catégorie de l'opération, déduite du type de produit, bien ou service, plutôt que saisie à la main.",
          "Références : numéro de commande client, numéro de contrat ou de devis, conditions et mode de paiement.",
          "Lignes : désignation, quantité, unité, prix unitaire, taux de TVA par ligne, remises explicites.",
        ],
        paragraphsAfter: [
          "La plupart de ces champs existent déjà dans Salesforce mais sont facultatifs ou saisis librement. Le chantier consiste à les rendre obligatoires au bon moment, à les contrôler, par exemple le format du SIREN et la validité du numéro de TVA, et à les transmettre sans ressaisie à l'ERP.",
        ],
      },
      {
        h2: "Remonter les statuts de facture",
        paragraphs: [
          "Chaque facture électronique suit un cycle de vie tracé par la plateforme : déposée, rejetée, refusée, encaissée, entre autres. Plusieurs de ces statuts sont obligatoires, dont « encaissée » pour les prestations de services. Remonter ces statuts dans Salesforce permet aux commerciaux de voir qu'une facture a été refusée par le client avant même qu'il ne les appelle.",
        ],
      },
      {
        h2: "Les chantiers concrets",
        list: [
          "Audit des données clients : comptes sans SIREN, adresses non structurées, doublons de comptes facturés.",
          "Règles de validation et champs obligatoires sur les comptes et les devis, avec une période de rattrapage pour les enregistrements existants.",
          "Intégration Salesforce vers l'ERP pour les commandes, avec External ID et journal des rejets visible par les commerciaux.",
          "Retour des statuts de facture et de paiement vers Salesforce.",
          "Tests avec des factures réelles anonymisées sur l'environnement de test de la plateforme choisie.",
        ],
        paragraphsAfter: [
          "Pour les grandes entreprises et les ETI, l'enjeu est désormais de fiabiliser des flux déjà en production. Pour les PME, l'échéance de septembre 2027 laisse le temps de traiter les données clients, qui sont le chantier le plus long. Les principes d'intégration sont détaillés dans le guide [pour intégrer Salesforce avec un ERP](/guides/comment-integrer-salesforce-avec-sap).",
        ],
      },
    ],
    faq: [
      {
        q: "Une PME doit-elle déjà agir ?",
        a: "Oui pour la réception, obligatoire depuis septembre 2026 : il faut avoir choisi une plateforme agréée pour recevoir ses factures fournisseurs. L'émission ne sera obligatoire qu'en septembre 2027.",
      },
      {
        q: "Salesforce peut-il émettre directement des factures électroniques conformes ?",
        a: "Pas avec Sales Cloud seul. Il faut soit l'ERP, soit une solution de facturation, comme Revenue Cloud, connectée à une plateforme agréée.",
      },
      {
        q: "Les devis et commandes sont-ils concernés par la réforme ?",
        a: "Non, seules les factures et les données d'e-reporting le sont. Mais la qualité des données saisies au devis et à la commande conditionne directement la conformité des factures.",
      },
    ],
    related: ["comment-integrer-salesforce-avec-sap", "comment-faire-des-devis-dans-salesforce"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "combien-coute-un-consultant-salesforce-freelance",
    title: "Combien coûte un consultant Salesforce freelance, et comment cadrer sa mission ?",
    seoTitle: "Consultant Salesforce freelance : tarif et cadrage",
    description:
      "Tarif journalier d'un consultant Salesforce freelance en France, durées types par mission, forfait ou régie, et les questions à poser avant de signer.",
    keywords: ["consultant Salesforce freelance", "TJM consultant Salesforce", "tarif consultant Salesforce", "coût mission Salesforce", "freelance Salesforce France", "expert Salesforce indépendant"],
    date: D,
    updated: D,
    intro:
      "Le coût d'un consultant Salesforce freelance dépend moins du tarif journalier que de la façon dont la mission est cadrée. Voici les ordres de grandeur du marché français, les durées typiques par type de projet et les points qui protègent les deux parties.",
    sections: [
      {
        h2: "Les ordres de grandeur du tarif journalier",
        paragraphs: [
          "En France, le tarif journalier d'un consultant Salesforce indépendant se situe en général entre 500 et 900 euros hors taxes, selon l'expérience, la spécialité et le mode d'intervention. Les profils qui couvrent à la fois le fonctionnel, le technique et la donnée se situent plutôt dans le haut de la fourchette, parce qu'ils remplacent plusieurs intervenants.",
          "Ces montants sont indicatifs : ils varient avec la durée d'engagement, la part de télétravail et le contexte. Ce qui compte, c'est le coût total de la mission rapporté au résultat livré.",
        ],
      },
      {
        h2: "Durées typiques par type de mission",
        list: [
          "Audit ou diagnostic : deux à dix jours, avec un rapport et un plan d'actions chiffré.",
          "Migration de données : de trois semaines à plusieurs mois selon le nombre de sources et les volumes.",
          "Mise en place de devis : une à deux semaines avec les Quotes standard, deux à six mois avec Revenue Cloud.",
          "Intégration avec un ERP : de quelques semaines pour un flux à plusieurs mois pour une intégration complète.",
          "Tableaux de bord et analytics : quelques jours à quelques semaines, l'essentiel étant la validation des indicateurs.",
        ],
      },
      {
        h2: "Ce qui fait varier le coût total",
        list: [
          "L'état des données : une base propre et documentée réduit l'audit et la recette.",
          "Le nombre de systèmes à connecter, et la qualité de leurs API.",
          "La disponibilité des équipes internes pour valider les choix et tester.",
          "Les exigences de sécurité et de conformité, qui ajoutent des étapes de revue.",
          "La part de changement organisationnel : former et accompagner prend du temps.",
        ],
        paragraphsAfter: [
          "Le déroulé détaillé des missions les plus courantes est décrit dans les guides [pour migrer ses données vers Salesforce](/guides/comment-migrer-ses-donnees-vers-salesforce) et [pour faire des devis dans Salesforce](/guides/comment-faire-des-devis-dans-salesforce).",
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
        h2: "Forfait ou régie",
        paragraphs: [
          "Le forfait engage le consultant sur un résultat et un prix ; il convient aux périmètres bien définis, comme un audit ou une migration cadrée. La régie facture le temps passé ; elle convient aux missions évolutives, à condition de fixer un plafond et des points de revue réguliers.",
        ],
      },
      {
        h2: "Éviter les dérives de périmètre",
        paragraphs: [
          "Le dépassement vient presque toujours de demandes ajoutées en cours de route sans réévaluation. Un bon cadre prévoit un point d'avancement régulier, une liste des demandes hors périmètre chiffrées séparément et un critère clair de fin de mission.",
        ],
      },
      {
        h2: "Les questions à poser avant de signer",
        list: [
          "Quels livrables précis seront remis, et sous quelle forme ?",
          "Qui, côté client, valide chaque étape, et dans quel délai ?",
          "Comment sont traitées les demandes hors périmètre ?",
          "Quelle documentation et quel transfert de compétences sont prévus ?",
          "Quelle période de support après la mise en production ?",
        ],
      },
    ],
    faq: [
      {
        q: "Freelance ou cabinet de conseil ?",
        a: "Un freelance expérimenté coûte en général moins cher qu'un cabinet pour un périmètre équivalent, avec un interlocuteur unique du cadrage au transfert. Un cabinet se justifie pour des programmes qui demandent une équipe complète en parallèle.",
      },
      {
        q: "Comment évaluer un consultant avant de le choisir ?",
        a: "Sur la qualité de son cadrage : un consultant qui pose des questions précises sur vos données, vos processus et vos contraintes avant de chiffrer limite les mauvaises surprises. Les références de missions comparables complètent l'évaluation.",
      },
    ],
    related: ["comment-migrer-ses-donnees-vers-salesforce", "comment-faire-des-devis-dans-salesforce"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "salesforce-revenue-cloud-c-est-quoi-faut-il-quitter-cpq",
    title: "Salesforce Revenue Cloud, c'est quoi ? Et faut-il quitter CPQ ?",
    seoTitle: "Salesforce Revenue Cloud : faut-il quitter CPQ ?",
    description:
      "Ce que couvre Revenue Cloud, ce qui change par rapport à Salesforce CPQ, pour qui c'est pertinent et comment décider de migrer ou de rester.",
    keywords: ["Salesforce Revenue Cloud", "Revenue Cloud Advanced", "Revenue Cloud vs CPQ", "quote-to-cash Salesforce", "Revenue Lifecycle Management", "migration CPQ Revenue Cloud"],
    date: D,
    updated: D,
    intro:
      "Revenue Cloud est la plateforme avec laquelle Salesforce remplace progressivement Salesforce CPQ et Salesforce Billing. Elle couvre tout le cycle du devis à l'encaissement, directement sur la plateforme Salesforce et non plus dans un package installé. Voici ce qu'elle contient, ce qui change concrètement et comment décider si, et quand, migrer.",
    sections: [
      {
        h2: "Ce que couvre Revenue Cloud",
        paragraphs: [
          "Revenue Cloud, dans sa version actuelle dite Revenue Cloud Advanced, regroupe plusieurs briques natives qui s'enchaînent du catalogue à la facture.",
        ],
        list: [
          "Product Catalog Management : un catalogue unique, avec classifications, attributs, bundles et règles de compatibilité, partagé par tous les canaux de vente.",
          "Salesforce Pricing : des procédures de tarification déclaratives qui remplacent les règles de prix de CPQ.",
          "Product Configurator : la configuration guidée des produits et des options, dans l'interface Salesforce ou par API.",
          "Transaction Management : devis, commandes et avenants, avec gestion des lignes et de leur cycle de vie.",
          "Dynamic Revenue Orchestrator : l'orchestration de ce qui suit la signature, comme l'activation, la livraison et le provisionnement.",
          "Billing : facturation récurrente, à l'usage ou ponctuelle, paiements et écritures pour la comptabilité.",
        ],
      },
      {
        h2: "Ce qui change par rapport à Salesforce CPQ",
        paragraphs: [
          "Salesforce CPQ est un package géré, issu du rachat de Steelbrick, avec son propre modèle d'objets, ses règles de prix et son moteur de calcul. Revenue Cloud est construit sur les objets standard de la plateforme et expose ses fonctions par API, ce qui change trois choses.",
        ],
        list: [
          "Le modèle de données : le catalogue, les prix, les devis et les actifs vivent dans des objets natifs, plus faciles à étendre, à intégrer et à analyser.",
          "La tarification : les procédures de prix se construisent de façon déclarative, avec une logique lisible, au lieu d'une pile de règles évaluées dans un ordre fragile.",
          "Les canaux : la même configuration et la même tarification servent au commercial dans Salesforce, à un portail client ou à un partenaire par API.",
        ],
        paragraphsAfter: [
          "Côté commercial, Salesforce ne propose plus CPQ aux nouveaux clients et positionne Revenue Cloud comme son successeur, avec un maintien du support pour les clients existants. Les échéances précises évoluent : vérifiez-les avec votre interlocuteur Salesforce avant de planifier.",
        ],
      },
      {
        h2: "Ce que ça implique pour les équipes",
        paragraphs: [
          "Les compétences CPQ ne se transposent pas directement. Le catalogue, les procédures de tarification et le modèle d'actifs demandent une prise en main par les administrateurs et les intégrateurs. Les intégrations, rapports et automatisations qui lisaient les objets CPQ sont à reprendre. C'est un projet de transformation, pas une mise à jour.",
        ],
      },
      {
        h2: "Pour qui Revenue Cloud est pertinent dès maintenant",
        list: [
          "Les entreprises qui démarrent un projet de devis structuré : il n'y a plus de raison de partir sur CPQ.",
          "Les modèles d'abonnement, de consommation ou mixtes, où la facturation et les avenants sont au cœur du processus.",
          "Les organisations multicanales qui veulent une seule logique de prix pour les commerciaux, le e-commerce et les partenaires.",
          "Les équipes qui veulent industrialiser le cycle complet avec des intégrations ERP propres, sur des objets standard.",
        ],
      },
      {
        h2: "Rester sur CPQ, pour l'instant",
        paragraphs: [
          "Un paramétrage CPQ stable, documenté et qui répond aux besoins n'a pas à être migré dans l'urgence. La bonne démarche consiste à faire l'inventaire de ce qui existe, à estimer l'effort de migration et à caler la décision sur un événement métier : refonte de l'offre, passage à l'abonnement, projet de facturation ou de portail client. Si le paramétrage actuel pose problème, le guide [sur les erreurs de paramétrage CPQ](/guides/pourquoi-mon-salesforce-cpq-est-devenu-ingerable) aide à le remettre en ordre en attendant.",
        ],
      },
      {
        h2: "Comment décider",
        paragraphs: [
          "Un diagnostic de quelques jours suffit en général : cartographie du paramétrage CPQ actuel, écarts avec les capacités de Revenue Cloud, dépendances d'intégration, estimation de la migration et des risques. Il débouche sur un calendrier réaliste plutôt que sur une réponse de principe. Le déroulé d'une migration est décrit dans le guide [pour migrer de CPQ vers Revenue Cloud](/guides/comment-migrer-de-salesforce-cpq-vers-revenue-cloud).",
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
    related: ["comment-migrer-de-salesforce-cpq-vers-revenue-cloud", "comment-gerer-devis-contrats-et-facturation-avec-revenue-cloud"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "comment-migrer-de-salesforce-cpq-vers-revenue-cloud",
    title: "Comment migrer de Salesforce CPQ vers Revenue Cloud ?",
    seoTitle: "Migrer de Salesforce CPQ vers Revenue Cloud",
    description:
      "Inventaire, catalogue, procédures de prix, reprise des devis et abonnements, intégrations et bascule : le plan pour migrer de CPQ vers Revenue Cloud.",
    keywords: ["migration CPQ vers Revenue Cloud", "Salesforce CPQ Revenue Cloud", "migrer CPQ", "Revenue Cloud Advanced migration", "modèle de données Revenue Cloud", "procédures de prix Salesforce"],
    date: D,
    updated: D,
    intro:
      "Migrer de CPQ vers Revenue Cloud n'est pas une mise à jour : c'est une réimplémentation du cycle de vente sur un nouveau modèle de données, avec une reprise de données. Voici le plan recommandé étape par étape, les deux modèles de données côte à côte, l'équivalence objet par objet et les pièges qui coûtent le plus cher.",
    sections: [
      {
        h2: "1. Inventorier ce que CPQ fait vraiment",
        paragraphs: [
          "On commence par extraire et documenter l'existant : produits et options, bundles, règles de prix et de produits, barèmes de remise, templates de devis, processus d'approbation, automatisations Apex et Flow qui touchent aux objets CPQ, intégrations ERP et outils tiers. On note pour chaque élément s'il est utilisé, par qui, et s'il répond encore à un besoin.",
          "Cet inventaire révèle presque toujours des règles mortes et des contournements accumulés. C'est le moment de les abandonner, pas de les reproduire.",
        ],
      },
      {
        h2: "2. Repenser le catalogue avant de le migrer",
        paragraphs: [
          "Revenue Cloud repose sur un catalogue unique avec classifications et attributs. Le catalogue CPQ, souvent construit produit par produit, gagne à être restructuré : familles cohérentes, attributs au lieu de variantes multipliées, bundles qui reflètent l'offre commerciale. Ce travail se fait avec le marketing et les ventes, pas seulement avec l'équipe technique.",
        ],
      },
      {
        h2: "3. Convertir les règles de prix en procédures",
        paragraphs: [
          "Les règles de prix de CPQ ne se transposent pas une à une. On repart des cas de tarification réels, comme les listes de prix, remises par volume, prix négociés et majorations, et on les modélise en procédures de tarification lisibles. Les cas de test sont des devis réels extraits de CPQ : chaque procédure doit reproduire les montants attendus avant d'aller plus loin.",
        ],
      },
      {
        h2: "4. Décider du sort des devis, contrats et abonnements",
        list: [
          "Devis en cours : migrés s'ils sont actifs, sinon conservés en lecture dans CPQ ou archivés.",
          "Contrats et abonnements : le point le plus sensible. Les abonnements CPQ actifs deviennent des actifs dans Revenue Cloud ; ils doivent être repris avec leurs dates, quantités et conditions de renouvellement, pour que les avenants et renouvellements fonctionnent.",
          "Historique de facturation : rarement migré ; on garde l'accès en lecture et on documente la règle.",
        ],
        paragraphsAfter: [
          "Cette reprise suit la même méthode qu'une [migration de données classique](/guides/comment-migrer-ses-donnees-vers-salesforce) : staging, mapping, chargements par lots, recette par comptage et par échantillons, plan de rollback.",
        ],
      },
      {
        h2: "5. Rebrancher les intégrations",
        paragraphs: [
          "Les flux vers l'ERP, pour les commandes, la facturation et les référentiels produits, et les outils de signature ou de génération de documents sont à reconstruire sur les nouveaux objets. C'est souvent l'occasion de simplifier : les objets standard de Revenue Cloud s'intègrent plus directement que le modèle CPQ.",
        ],
      },
      {
        h2: "6. Organiser la coexistence et la bascule",
        paragraphs: [
          "Peu d'entreprises basculent tout en un jour. Une coexistence par équipe, par gamme ou par pays limite le risque, à condition de définir clairement où chaque devis se crée pendant la transition. La bascule finale suit un plan daté : gel des devis dans CPQ, dernier delta d'abonnements, contrôles, ouverture dans Revenue Cloud, période de support renforcé.",
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
        a: "Oui, par périmètre, qu'il s'agisse d'une équipe, d'une gamme ou d'un pays, à condition de fixer des règles claires de coexistence et de ne pas laisser la transition s'éterniser.",
      },
    ],
    related: ["salesforce-revenue-cloud-c-est-quoi-faut-il-quitter-cpq", "comment-gerer-devis-contrats-et-facturation-avec-revenue-cloud"],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "comment-gerer-devis-contrats-et-facturation-avec-revenue-cloud",
    title: "Comment gérer devis, contrats et facturation avec Salesforce Revenue Cloud ?",
    seoTitle: "Revenue Cloud : devis, contrats et facturation",
    description:
      "Catalogue, devis, avenants, actifs, facturation récurrente ou à l'usage et lien avec l'ERP : le cycle complet avec Salesforce Revenue Cloud.",
    keywords: ["Revenue Cloud facturation", "Revenue Cloud Billing", "quote-to-cash Revenue Cloud", "abonnements Salesforce", "facturation à l'usage Salesforce", "Revenue Cloud ERP"],
    date: D,
    updated: D,
    intro:
      "Revenue Cloud promet un cycle continu du devis à l'encaissement. La promesse tient si les décisions d'architecture sont prises au bon moment : où vit le catalogue, qui fait foi sur les prix, où se produit la facture, comment l'ERP est alimenté. Voici comment structurer une mise en place.",
    sections: [
      {
        h2: "Le catalogue et les prix, une seule source de vérité",
        paragraphs: [
          "Tout part du catalogue : produits, classifications, attributs, bundles, puis procédures de tarification. Dans une architecture avec un ERP, on décide d'abord qui maîtrise le référentiel produit. En général, les produits et les prix de base viennent de l'ERP et sont synchronisés vers Revenue Cloud ; les règles commerciales, comme les remises, bundles et conditions, vivent dans Revenue Cloud.",
        ],
      },
      {
        h2: "Devis et avenants",
        paragraphs: [
          "Les devis s'appuient sur le configurateur et les procédures de prix. Les avenants, qu'il s'agisse d'un ajout, d'un retrait, d'un changement de quantité ou de durée, partent des actifs du client, ce qui évite les devis parallèles et les ressaisies. Les approbations restent ciblées sur les écarts réels : remise au-delà d'un seuil, conditions de paiement dérogatoires.",
        ],
      },
      {
        h2: "Contrats et actifs",
        paragraphs: [
          "À la signature, la commande est créée puis exécutée : l'orchestrateur déclenche l'activation du service, la livraison et la mise à disposition des accès. Les produits vendus deviennent des actifs, avec leurs dates, quantités et périodes successives. Les renouvellements, avenants et résiliations se pilotent depuis ces actifs, avec une vue claire de la base installée de chaque client.",
        ],
      },
      {
        h2: "Facturation récurrente et à l'usage",
        paragraphs: [
          "La brique de facturation produit les factures à partir des actifs et des consommations : facturation à date fixe, au prorata, à l'usage avec remontée des volumes consommés, avoirs et ajustements. Elle génère aussi les écritures nécessaires à la reconnaissance du revenu.",
          "Deux questions sont à trancher tôt : la facture légale est-elle produite par Revenue Cloud ou par l'ERP, et comment la facturation électronique est-elle assurée ? En France, la facture entre entreprises doit transiter par une plateforme agréée dans un format structuré. Si l'ERP porte déjà cette conformité, Revenue Cloud alimente l'ERP et c'est lui qui émet. Sinon, Revenue Cloud doit être connecté à une plateforme agréée. Le sujet est détaillé dans le guide [sur la facturation électronique](/guides/facturation-electronique-obligatoire-salesforce-erp).",
        ],
      },
      {
        h2: "Le lien avec l'ERP",
        list: [
          "Référentiels : clients et produits synchronisés avec External ID, dans un sens défini.",
          "Commandes : envoyées à l'ERP à la signature, avec un retour de statut visible par les commerciaux.",
          "Facturation et paiements : soit l'ERP facture à partir des commandes, soit Revenue Cloud facture et transmet les écritures à la comptabilité.",
          "Erreurs : file de rejeu, alertes et enregistrements en erreur visibles dans Salesforce.",
        ],
        paragraphsAfter: [
          "Les principes d'intégration valables pour tout ERP sont décrits dans le guide [pour intégrer Salesforce avec un ERP](/guides/comment-integrer-salesforce-avec-sap).",
        ],
      },
      {
        h2: "Les données à prévoir dès le départ",
        list: [
          "Clients : SIREN, numéro de TVA, adresses de facturation et de livraison structurées, contacts de facturation.",
          "Produits : modèle de vente de chaque produit, ponctuel, abonnement ou à l'usage, avec sa durée et sa fréquence.",
          "Règles de facturation : fréquence, facturation à échoir ou à terme échu, traitement des prorata et des avoirs.",
          "Usage : source des consommations, fréquence de remontée et contrôle de complétude avant facturation.",
          "Comptabilité : correspondance entre produits, comptes comptables et codes de TVA, validée avec la finance.",
        ],
      },
      {
        h2: "Un ordre de mise en place qui fonctionne",
        list: [
          "Catalogue et tarification, validés sur des devis réels.",
          "Devis, approbations et documents.",
          "Commandes, actifs et orchestration.",
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
    related: ["salesforce-revenue-cloud-c-est-quoi-faut-il-quitter-cpq", "facturation-electronique-obligatoire-salesforce-erp"],
  },
];

// ---------------------------------------------------------------------------
// Temps de lecture calculé sur le texte réel (230 mots par minute)
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;
export const plainText = (s = "") => s.replace(LINK, "$1");
const countWords = (g) => {
  const parts = [g.intro];
  for (const s of g.sections) parts.push(s.h2, ...(s.paragraphs || []), ...(s.list || []), ...(s.paragraphsAfter || []));
  for (const f of g.faq || []) parts.push(f.q, f.a);
  return parts.map(plainText).join(" ").split(/\s+/).filter(Boolean).length;
};

// Ordre d'affichage : les questions à plus forte intention d'achat d'abord
const ORDER = [
  "comment-migrer-ses-donnees-vers-salesforce",
  "comment-faire-des-devis-dans-salesforce",
  "salesforce-revenue-cloud-c-est-quoi-faut-il-quitter-cpq",
  "facturation-electronique-obligatoire-salesforce-erp",
  "comment-migrer-de-salesforce-cpq-vers-revenue-cloud",
  "comment-faire-un-tableau-de-bord-commercial-salesforce",
  "comment-connecter-salesforce-a-power-bi",
  "quels-kpi-suivre-pour-piloter-une-equipe-commerciale",
  "comment-gerer-devis-contrats-et-facturation-avec-revenue-cloud",
  "comment-integrer-salesforce-avec-sap",
  "combien-coute-un-consultant-salesforce-freelance",
  "comment-supprimer-les-doublons-dans-salesforce",
  "comment-automatiser-salesforce-flow-ou-apex",
  "pourquoi-mon-salesforce-cpq-est-devenu-ingerable",
  "comment-charger-des-donnees-dans-salesforce",
];

export const guides = RAW.map((g) => {
  const words = countWords(g);
  return { ...g, words, readingMinutes: Math.max(2, Math.round(words / 230)) };
}).sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));

export const getGuide = (slug) => guides.find((g) => g.slug === slug);
