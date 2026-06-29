import type { Lang } from "./content";

export const ui = {
  bs: {
    locale: "BS",
    otherLocale: "EN",
    viewService: "Otvori uslugu",
    allServices: "Sve usluge",
    contactText: "Ako ovaj problem postoji u tvom biznisu, razgovor je sljedeći korak.",
    proof: "Sistem, metrika, strategija i egzekucija.",
    backServices: "Nazad na usluge",
    contactHeading: "Započnimo vašu digitalnu evoluciju",
    contactBody:
      "Popunite formu ili pošaljite poruku. Cilj je da brzo razumijemo gdje je rast blokiran i šta prvo treba popraviti.",
  },
  en: {
    locale: "EN",
    otherLocale: "BS",
    viewService: "View service",
    allServices: "All services",
    contactText: "If this problem exists in your business, a conversation is the next step.",
    proof: "Systems, metrics, strategy, and execution.",
    backServices: "Back to services",
    contactHeading: "Let’s start your digital evolution",
    contactBody:
      "Fill the form or send a message. The goal is to quickly understand where growth is blocked and what should be fixed first.",
  },
} satisfies Record<Lang, Record<string, string>>;
