select storage.create_bucket('avatars', public := true);

-- Lecture publique des fichiers du bucket avatars
create policy "Public read avatars"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

-- Upload autorisé pour les utilisateurs authentifiés
create policy "Authenticated insert avatars"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'avatars');

-- Optionnel: mise à jour/suppression par le propriétaire
create policy "Authenticated update own avatars"
on storage.objects
for update
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid())
with check (bucket_id = 'avatars' and owner = auth.uid());

create policy "Authenticated delete own avatars"
on storage.objects
for delete
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid());
