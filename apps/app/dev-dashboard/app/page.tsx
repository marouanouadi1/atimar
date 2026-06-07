const stats = [
  { label: "Utenti attivi", value: "128", helper: "+12% questa settimana" },
  { label: "Centri sportivi", value: "24", helper: "6 in revisione" },
  { label: "Prenotazioni demo", value: "312", helper: "mock data" },
];

export default function DevDashboardHome() {
  return (
    <main className="dashboardShell">
      <section className="heroCard">
        <p className="eyebrow">ATIMAR / Super Admin</p>
        <h1>Dev dashboard</h1>
        <p className="heroText">
          Dashboard interna per verificare metriche, centri sportivi e flussi
          operativi senza usare i componenti React Native dell'app cliente.
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
        <h2>Struttura semplificata</h2>
        <p>
          Il dashboard vive dentro <code>apps/app/dev-dashboard</code> e usa le
          stesse dipendenze React dell'app Expo, dichiarate una sola volta in
          <code> apps/app/package.json</code>.
        </p>
      </section>
    </main>
  );
}
