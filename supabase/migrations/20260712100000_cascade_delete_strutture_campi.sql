-- Eliminare una Struttura o un Campo deve rimuovere automaticamente i dati
-- collegati (join table e dati di dettaglio), invece di bloccarsi con un
-- errore di foreign key.

alter table public."Campi"
  drop constraint "Campi_fk_struttura_fkey",
  add constraint "Campi_fk_struttura_fkey"
    foreign key ("fk_struttura") references public."Strutture"("id") on delete cascade;

alter table public."Campi_Sport"
  drop constraint "Campi_Sport_fk_campo_fkey",
  add constraint "Campi_Sport_fk_campo_fkey"
    foreign key ("fk_campo") references public."Campi"("id") on delete cascade;

alter table public."Campi_Preferiti"
  drop constraint "Campi_Preferiti_fk_campo_fkey",
  add constraint "Campi_Preferiti_fk_campo_fkey"
    foreign key ("fk_campo") references public."Campi"("id") on delete cascade;

alter table public."Foto_Strutture"
  drop constraint "Foto_Strutture_fk_struttura_fkey",
  add constraint "Foto_Strutture_fk_struttura_fkey"
    foreign key ("fk_struttura") references public."Strutture"("id") on delete cascade;

alter table public."Orari_Strutture"
  drop constraint "Orari_Strutture_fk_struttura_fkey",
  add constraint "Orari_Strutture_fk_struttura_fkey"
    foreign key ("fk_struttura") references public."Strutture"("id") on delete cascade;

alter table public."RecensioniStrutture"
  drop constraint "RecensioniStrutture_fk_struttura_fkey",
  add constraint "RecensioniStrutture_fk_struttura_fkey"
    foreign key ("fk_struttura") references public."Strutture"("id") on delete cascade;

alter table public."Strutture_Servizi"
  drop constraint "Strutture_Servizi_fk_struttura_fkey",
  add constraint "Strutture_Servizi_fk_struttura_fkey"
    foreign key ("fk_struttura") references public."Strutture"("id") on delete cascade;
