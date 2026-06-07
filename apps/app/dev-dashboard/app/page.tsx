import { getCourtListItems, getSports, getVenues } from "@atimar/data";
import type { CourtListItem, Venue } from "@atimar/types";

function countOpenVenues(venues: Venue[]) {
  return venues.filter((venue) => venue.open).length;
}

function getAveragePrice(courts: CourtListItem[]) {
  if (courts.length === 0) return 0;
  const total = courts.reduce((sum, court) => sum + court.pricePerHour, 0);
  return Math.round(total / courts.length);
}

export default function DevDashboardHome() {
  const venues = getVenues();
  const courts = getCourtListItems();
  const sports = getSports();

  const stats = [
    {
      label: "Centri sportivi",
      value: String(venues.length),
      helper: `${countOpenVenues(venues)} aperti ora`,
    },
    {
      label: "Campi",
      value: String(courts.length),
      helper: "entità primaria condivisa",
    },
    {
      label: "Sport gestiti",
      value: String(sports.length),
      helper: `Prezzo medio €${getAveragePrice(courts)}/h`,
    },
  ];

  return (
    <main className="dashboardShell">
      <section className="heroCard">
        <p className="eyebrow">ATIMAR / Super Admin</p>
        <h1>Dev dashboard</h1>
        <p className="heroText">
          Dashboard interna Next.js per amministrare lo stesso dominio dati
          dell'app cliente: venue, court, sport, disponibilità e booking. Non
          usa i componenti Expo o React Native.
        </p>
      </section>

      <section className="statsGrid" aria-label="Metriche principali">
        {stats.map((stat) => (
          <article className="statCard" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.helper}</small>
          </article>
        ))}
      </section>

      <section className="panel">
        <h2>Dominio condiviso</h2>
        <p>
          Il dashboard vive dentro <code>apps/app/dev-dashboard</code>, resta
          Next.js e importa solo la struttura dati condivisa da
          <code> @atimar/data</code> e <code>@atimar/types</code>. La UI resta
          web-specific e non dipende da <code>@atimar/ui-native</code>.
        </p>
      </section>
    </main>
  );
}
