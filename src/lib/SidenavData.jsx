import { FaJournalWhills } from "react-icons/fa";
import { GiAstronautHelmet, GiRayGun } from "react-icons/gi";
import { GiRuleBook } from "react-icons/gi";

export const SidenavData = [
   {
      id: 0,
      icon: <FaJournalWhills />,
      menuName: "Blog",
      submenu: [
         { title: "Traduction Paizoblog", link: "/tradPaizoBlogCards" },
         { title: "Blog Starfinder-fr", link: "/blogCards" }
      ]
   },
   // {
   //    id: 1,
   //    icon: <GiAstronautHelmet />,
   //    menuName: "Création perso",
   //    submenu: [
   //       { title: "Ascendances", link: "/" },
   //       { title: "Archetypes", link: "/" },
   //       { title: "Historiques", link: "/" },
   //       { title: "Classes", link: "/" },
   //       { title: "Compétences", link: "/" }
   //    ]
   // },
   // {
   //    id: 2,
   //    icon: <GiRayGun />,
   //    menuName: "Équipement",
   //    submenu: [
   //       { title: "Armures", link: "/" },
   //       { title: "Armes", link: "/" },
   //       { title: "Boucliers", link: "/" },
   //       { title: "Artefacts", link: "/" }
   //    ]
   // },
   // {
   //    id: 3,
   //    icon: <GiRuleBook />,
   //    menuName: "Règles",
   //    submenu: [
   //       { title: "Actions", link: "/" },
   //       { title: "Activités", link: "/" },
   //       { title: "Conditions", link: "/" },
   //       { title: "Traits", link: "/" }
   //    ]
   // }
]