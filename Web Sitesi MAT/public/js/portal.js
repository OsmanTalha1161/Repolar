const anaSayfa = 'index.html';
const ilkUyeler = [
  {ad:'Ayşe Yılmaz', kullanici:'ayse', sifre:'1234', rol:'ana', departman:'Tüm departmanlar'},
  {ad:'Mehmet Demir', kullanici:'mehmet', sifre:'1234', rol:'yan', departman:'Yazılım'},
  {ad:'Zeynep Arslan', kullanici:'zeynep', sifre:'1234', rol:'yan', departman:'Mekanik'},
  {ad:'Elif Kaya', kullanici:'elif', sifre:'1234', rol:'uye', departman:'Yazılım'},
  {ad:'Can Yıldız', kullanici:'can', sifre:'1234', rol:'uye', departman:'Mekanik'}
];
const ilkDepartmanlar = ['Yazılım','Mekanik','Tasarım','Pazarlama'];
const ilkGorevler = [
  {id:1, baslik:'Haftalık raporu hazırla', kisi:'Ayşe Yılmaz', departman:'Yazılım', tarih:'2026-11-25', durum:'Devam ediyor'},
  {id:2, baslik:'Yeni fikirleri listele', kisi:'Elif Kaya', departman:'Yazılım', tarih:'2026-11-28', durum:'Bekliyor'},
  {id:3, baslik:'Parça kontrol listesini tamamla', kisi:'Can Yıldız', departman:'Mekanik', tarih:'2026-11-29', durum:'Bekliyor'}
];
const ilkDuyurular = [{id:1, baslik:'Yeni çalışma planı', metin:'Gelecek haftanın çalışma planı paylaşıldı. Lütfen görevlerinizi kontrol edin.', departman:'Tüm departmanlar', tarih:'2026-11-19'}];
const ilkEtkinlikler = [{id:1, baslik:'Haftalık takım toplantısı', aciklama:'Haftalık çalışma ve görev değerlendirmesi.', yer:'Toplantı odası', tarih:'2026-11-27', saat:'14:00', departman:'Tüm departmanlar'}];
function oku(anahtar, varsayilan) { try { return JSON.parse(localStorage.getItem(anahtar)) || varsayilan; } catch { return varsayilan; } }
function yaz(anahtar, deger) { try { localStorage.setItem(anahtar, JSON.stringify(deger)); } catch {} }
if (!oku('takimUyeleri', null)) yaz('takimUyeleri', ilkUyeler);
if (!oku('takimDepartmanlari', null)) yaz('takimDepartmanlari', ilkDepartmanlar);
if (!oku('takimGorevleri', null)) yaz('takimGorevleri', ilkGorevler);
if (!oku('takimDuyurulari', null)) yaz('takimDuyurulari', ilkDuyurular);
if (!oku('takimEtkinlikleri', null)) yaz('takimEtkinlikleri', ilkEtkinlikler);
const uyeOku = () => oku('takimUyeleri', ilkUyeler);
const gorevOku = () => oku('takimGorevleri', ilkGorevler);
const departmanOku = () => oku('takimDepartmanlari', ilkDepartmanlar);
const duyuruOku = () => oku('takimDuyurulari', ilkDuyurular);
const etkinlikOku = () => oku('takimEtkinlikleri', ilkEtkinlikler);
const oturum = () => { const linkOturumu = new URLSearchParams(location.search).get('oturum'); if (linkOturumu) { try { return JSON.parse(linkOturumu); } catch {} } return oku('takimOturumu', null); };
const ana = document.querySelector('main');
const sayfa = location.pathname.split('/').pop() || anaSayfa;
const basliklar = {'index.html':'Ana Sayfa','gorevler.html':'Görevler','etkinlikler.html':'Etkinlikler','duyurular.html':'Duyurular','departmanlar.html':'Departmanlar','uyeler.html':'Üyeler','giris.html':'Giriş'};
const yetki = oturum();
const oturumBaglantisi = yetki ? encodeURIComponent(JSON.stringify({ad:yetki.ad,kullanici:yetki.kullanici,rol:yetki.rol,departman:yetki.departman})) : '';
if (sayfa !== 'giris.html' && !yetki) location.replace('giris.html');
if (sayfa === 'giris.html' && yetki) location.replace('index.html');
if (sayfa !== 'giris.html' && yetki) {
  menuKur();
  document.querySelectorAll('nav a').forEach(a => { if (a.getAttribute('href') === sayfa) a.classList.add('aktif'); });
  const header = document.querySelector('header');
  const cikis = document.createElement('button'); cikis.className = 'cikis'; cikis.textContent = `${yetki.ad} · ${yetki.rol === 'ana' ? 'Ana Kaptan' : yetki.rol === 'yan' ? 'Yan Kaptan' : 'Üye'} · Çıkış`;
  cikis.onclick = () => { try { localStorage.removeItem('takimOturumu'); } catch {} location.href = 'giris.html'; };
  header.append(cikis);

  if (sayfa === 'index.html') anaSayfaKur();
  if (sayfa === 'gorevler.html') gorevlerKur();
  if (sayfa === 'departmanlar.html') departmanlarKur();
  if (sayfa === 'uyeler.html') uyelerKur();
  if (sayfa === 'duyurular.html') icerikKur('duyuru');
  if (sayfa === 'etkinlikler.html') icerikKur('etkinlik');
  ana.querySelectorAll('a').forEach(a => { a.href += '?oturum=' + oturumBaglantisi; });
  document.querySelectorAll('nav a').forEach(a => { a.href += '?oturum=' + oturumBaglantisi; });
}
function menuKur() {
 const nav = document.querySelector('header nav');
 if (!nav) return;
 nav.innerHTML = `<ul>
  <li><a href="index.html">Ana Sayfa</a></li>
  <li><a href="gorevler.html">Görevler</a></li>
  <li><a href="etkinlikler.html">Etkinlikler</a></li>
  <li><a href="duyurular.html">Duyurular</a></li>
  <li><a href="departmanlar.html">Departmanlar</a></li>
  <li><a href="uyeler.html">Üyeler ve Kaptanlar</a></li>
 </ul>`;
}
function girisKur() {
 const form = document.querySelector('#girisForm');
 function girisYap(kullanici, sifre) { const mesaj = document.querySelector('#girisMesaji'); const kisi = uyeOku().find(u => u.kullanici.toLowerCase() === kullanici.trim().toLowerCase() && u.sifre === sifre); if (!kisi) { mesaj.textContent = 'Kullanıcı adı veya şifre yanlış.'; return; } try { yaz('takimOturumu', kisi); } catch {} location.href = 'index.html?oturum=' + encodeURIComponent(JSON.stringify({ad:kisi.ad,kullanici:kisi.kullanici,rol:kisi.rol,departman:kisi.departman})); }
 form.onsubmit = e => { e.preventDefault(); girisYap(form.elements.namedItem('kullanici').value, form.elements.namedItem('sifre').value); };
 document.querySelectorAll('[data-demo-user]').forEach(b => b.onclick = () => { const kisi = uyeOku().find(u => u.kullanici === b.dataset.demoUser); if (kisi) girisYap(kisi.kullanici, kisi.sifre); });
}
function anaSayfaKur() {
 const gorevler = gorevOku().filter(g => yetki.rol === 'ana' || g.departman === yetki.departman || g.kisi === yetki.ad);
 const kullanicilar = uyeOku().filter(u => yetki.rol === 'ana' || u.departman === yetki.departman);
 ana.innerHTML = `<h2>Ana Sayfa</h2><p>Hoş geldin, ${yetki.ad}. ${yetki.rol === 'ana' ? 'Tüm departmanları ve üyeleri buradan yönetebilirsin.' : yetki.rol === 'yan' ? `${yetki.departman} departmanındaki görevleri yönetebilirsin.` : 'Sana verilen görevleri buradan takip edebilirsin.'}</p><div class="ozetler"><div class="ozet"><strong>${gorevler.length}</strong>Görev</div><div class="ozet"><strong>${departmanOku().length}</strong>Departman</div><div class="ozet"><strong>${kullanicilar.length}</strong>Görüntülenen üye</div></div><section class="kart"><h3>Hızlı bağlantılar</h3><p><a href="gorevler.html">Görevleri görüntüle</a> · <a href="duyurular.html">Duyurular</a> · <a href="etkinlikler.html">Etkinlikler</a></p></section>`;
}
function gorevlerKur() {
 const ekleYetkisi = yetki.rol === 'ana' || yetki.rol === 'yan';
 const gorevler = gorevOku().filter(g => yetki.rol === 'ana' || (yetki.rol === 'yan' && g.departman === yetki.departman) || (yetki.rol === 'uye' && g.kisi === yetki.ad));
 ana.innerHTML = `<h2>Görevler</h2><p>${yetki.rol === 'ana' ? 'Bütün departmanların görevleri.' : yetki.rol === 'yan' ? `${yetki.departman} departmanının görevleri.` : 'Sana atanan görevler.'}</p><section id="gorevEkleBolum"></section><div class="kart"><table><thead><tr><th>Görev</th><th>Departman</th><th>Sorumlu</th><th>Son Tarih</th><th>Durum</th></tr></thead><tbody id="gorevTablo"></tbody></table></div>`;
 if (ekleYetkisi) { const bolum=document.querySelector('#gorevEkleBolum'); bolum.innerHTML=`<section class="kart"><h3>Yeni görev ver</h3><form id="gorevForm"><label>Görev adı<input name="baslik" required></label><label>Departman<select name="departman" required></select></label><label>Üye<select name="kisi" required></select></label><label>Son tarih<input type="date" name="tarih" required></label><button>Görev ekle</button></form></section>`; const d=formEleman('#gorevForm','departman'); d.innerHTML=(yetki.rol==='ana'?departmanOku():[yetki.departman]).map(x=>`<option>${x}</option>`).join(''); const gform=document.querySelector('#gorevForm'); function kisiDoldur(){gform.kisi.innerHTML=uyeOku().filter(u=>u.rol==='uye'&&u.departman===gform.departman.value).map(u=>`<option>${u.ad}</option>`).join('');} gform.departman.onchange=kisiDoldur; kisiDoldur(); gform.onsubmit=e=>{e.preventDefault();const f=new FormData(gform);const liste=gorevOku();liste.push({id:Date.now(),baslik:f.get('baslik'),departman:f.get('departman'),kisi:f.get('kisi'),tarih:f.get('tarih'),durum:'Bekliyor'});yaz('takimGorevleri',liste);gorevlerKur();}; }
 tabloyuDoldur(gorevler);
}
function formEleman(selector, name){return document.querySelector(`${selector} [name="${name}"]`);}
function tabloyuDoldur(gorevler) {const tablo=document.querySelector('#gorevTablo'); if(!tablo)return; tablo.innerHTML=gorevler.length?gorevler.map(g=>`<tr><td>${guvenli(g.baslik)}</td><td>${guvenli(g.departman)}</td><td>${guvenli(g.kisi)}</td><td>${g.tarih}</td><td>${yetki.rol==='uye'?`<select data-durum="${g.id}"><option ${g.durum==='Bekliyor'?'selected':''}>Bekliyor</option><option ${g.durum==='Devam ediyor'?'selected':''}>Devam ediyor</option><option ${g.durum==='Tamamlandı'?'selected':''}>Tamamlandı</option></select>`:g.durum}</td></tr>`).join(''):'<tr><td colspan="5">Henüz görev yok.</td></tr>'; tablo.querySelectorAll('[data-durum]').forEach(s=>s.onchange=()=>{const list=gorevOku();const g=list.find(x=>String(x.id)===s.dataset.durum);if(g){g.durum=s.value;yaz('takimGorevleri',list);}});}
function departmanlarKur() {
 const yonetebilir = yetki.rol === 'ana';
 ana.innerHTML = `<h2>Departmanlar</h2>
  <p>Tüm departmanları ve bu departmanlardaki üyeleri görüntüleyebilirsin.</p>
  ${yonetebilir ? `<section class="kart"><form id="departmanForm"><label>Departman adı<input name="ad" required></label><label>Yan kaptan<select name="kaptan"><option value="">Henüz atama yapma</option></select></label><button>Departman ekle</button></form></section>` : ''}
  <ul id="departmanListesi"></ul>`;
 if (yonetebilir) {
  const form = document.querySelector('#departmanForm');
  const kaptan = form.kaptan;
  kaptan.innerHTML = '<option value="">Henüz atama yapma</option>' + uyeOku().filter(u => u.rol === 'uye').map(u => `<option value="${u.kullanici}">${guvenli(u.ad)}</option>`).join('');
  form.onsubmit = e => {
   e.preventDefault();
   const ad = form.ad.value.trim();
   const ds = departmanOku();
   if (!ad || ds.some(x => x.toLowerCase() === ad.toLowerCase())) return;
   ds.push(ad);
   yaz('takimDepartmanlari', ds);
   if (kaptan.value) {
    const us = uyeOku();
    const k = us.find(u => u.kullanici === kaptan.value);
    if (k) { k.rol = 'yan'; k.departman = ad; yaz('takimUyeleri', us); }
   }
   departmanlarKur();
  };
 }
 document.querySelector('#departmanListesi').innerHTML = departmanOku().map(d => {
  const kisiler = uyeOku().filter(u => u.departman === d);
  const kaptanlar = kisiler.filter(u => u.rol === 'yan').map(u => guvenli(u.ad));
  const uyeler = kisiler.filter(u => u.rol === 'uye').map(u => guvenli(u.ad));
  return `<li class="kart"><strong>${guvenli(d)}</strong><p>Yan kaptan: ${kaptanlar.join(', ') || 'Atanmamış'}</p><p>Üyeler: ${uyeler.join(', ') || 'Henüz üye yok'}</p></li>`;
 }).join('');
}
function uyelerKur() {
 const yonetebilir = yetki.rol === 'ana';
 ana.innerHTML = `<h2>Üyeler ve kaptanlar</h2>
  <p>Tüm kullanıcılar üyeleri, kaptanları ve bağlı oldukları departmanları görüntüleyebilir.</p>
  ${yonetebilir ? `<section class="kart"><h3>Yeni kullanıcı ekle</h3><form id="uyeForm"><label>Ad soyad<input name="ad" required></label><label>Kullanıcı adı<input name="kullanici" required></label><label>Geçici şifre<input name="sifre" value="1234" required></label><label>Rol<select name="rol"><option value="uye">Üye</option><option value="yan">Yan kaptan</option></select></label><label>Departman<select name="departman"></select></label><button>Kullanıcı ekle</button></form></section>` : ''}
  <div class="kart"><table><thead><tr><th>Ad</th><th>Kullanıcı adı</th><th>Rol</th><th>Departman</th></tr></thead><tbody id="uyeTablo"></tbody></table></div>`;
 if (yonetebilir) {
  const f = document.querySelector('#uyeForm');
  f.departman.innerHTML = departmanOku().map(d => `<option>${guvenli(d)}</option>`).join('');
  f.onsubmit = e => {
   e.preventDefault();
   const us = uyeOku();
   const kullanici = f.kullanici.value.trim();
   if (!kullanici || us.some(u => u.kullanici.toLowerCase() === kullanici.toLowerCase())) return;
   us.push({ad:f.ad.value.trim(), kullanici, sifre:f.sifre.value, rol:f.rol.value, departman:f.departman.value});
   yaz('takimUyeleri', us);
   uyelerKur();
  };
 }
 document.querySelector('#uyeTablo').innerHTML = uyeOku().map(u => `<tr><td>${guvenli(u.ad)}</td><td>${guvenli(u.kullanici)}</td><td><span class="rozet">${u.rol === 'ana' ? 'Ana Kaptan' : u.rol === 'yan' ? 'Yan Kaptan' : 'Üye'}</span></td><td>${guvenli(u.departman)}</td></tr>`).join('');
}function guvenli(metin){return String(metin).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function icerikKur(tur) {
 const duyuru = tur === 'duyuru';
 const ad = duyuru ? 'duyuru' : 'etkinlik';
 const baslik = duyuru ? 'Duyurular' : 'Etkinlikler';
 const okuListe = duyuru ? duyuruOku : etkinlikOku;
 const key = duyuru ? 'takimDuyurulari' : 'takimEtkinlikleri';
 const yonetebilir = yetki.rol === 'ana' || yetki.rol === 'yan';
 let liste = okuListe();
 if (yetki.rol === 'yan' || yetki.rol === 'uye') liste = liste.filter(x => x.departman === 'Tüm departmanlar' || x.departman === yetki.departman);
 ana.innerHTML = `<h2>${baslik}</h2><p id="icerikMesaji" role="status"></p>${yonetebilir ? `<section><h3 id="formBaslik">Yeni ${ad} ekle</h3><form id="icerikForm"><input type="hidden" name="id"><label>Başlık <input name="baslik" required maxlength="100"></label><br>${duyuru ? '<label>Duyuru metni <textarea name="metin" required rows="4"></textarea></label><br>' : '<label>Açıklama <textarea name="aciklama" rows="3"></textarea></label><br><label>Yer <input name="yer" required></label><br><label>Saat <input name="saat" type="time"></label><br>'}<label>Tarih <input name="tarih" type="date" required></label><br><label>Departman <select name="departman" required></select></label><br><button type="submit">${ad} kaydet</button> <button type="reset" id="formTemizle">Formu temizle</button></form></section>` : ''}<section><h3>Paylaşılan ${duyuru ? 'duyurular' : 'etkinlikler'}</h3><div id="icerikListe"></div></section>`;
 if (yonetebilir) {
  const form = document.querySelector('#icerikForm');
  const departmanlar = yetki.rol === 'ana' ? ['Tüm departmanlar', ...departmanOku()] : [yetki.departman];
  form.elements.departman.innerHTML = departmanlar.map(d => `<option>${guvenli(d)}</option>`).join('');
  form.onsubmit = e => {
   e.preventDefault();
   const all = okuListe();
   const id = form.elements.id.value;
   const kayit = {id:id ? Number(id) : Date.now(), baslik:form.elements.baslik.value.trim(), tarih:form.elements.tarih.value, departman:form.elements.departman.value};
   if (duyuru) kayit.metin = form.elements.metin.value.trim();
   else { kayit.aciklama = form.elements.aciklama.value.trim(); kayit.yer = form.elements.yer.value.trim(); kayit.saat = form.elements.saat.value; }
   if (yetki.rol === 'yan' && kayit.departman !== yetki.departman) { document.querySelector('#icerikMesaji').textContent = 'Yalnızca kendi departmanına içerik ekleyebilirsin.'; return; }
   const index = all.findIndex(x => x.id === kayit.id);
   if (index < 0) all.push(kayit); else all[index] = kayit;
   yaz(key, all);
   icerikKur(tur);
  };
  document.querySelector('#formTemizle').onclick = () => setTimeout(() => { form.elements.id.value = ''; document.querySelector('#formBaslik').textContent = `Yeni ${ad} ekle`; }, 0);
 }
 const sirali = [...liste].sort((a,b) => duyuru ? b.tarih.localeCompare(a.tarih) : a.tarih.localeCompare(b.tarih));
 const alan = document.querySelector('#icerikListe');
 alan.innerHTML = sirali.length ? sirali.map(x => `<article><h4>${guvenli(x.baslik)}</h4>${duyuru ? `<p>${guvenli(x.metin)}</p>` : `<p>${guvenli(x.aciklama || '')}</p><p>Yer: ${guvenli(x.yer)}${x.saat ? ' · Saat: '+guvenli(x.saat) : ''}</p>`}<p>Departman: ${guvenli(x.departman)} · Tarih: ${guvenli(x.tarih)}</p>${yonetebilir ? `<button type="button" data-icerik-duzenle="${x.id}">Düzenle</button> <button type="button" data-icerik-sil="${x.id}">Sil</button>` : ''}</article>`).join('') : '<p>Henüz içerik eklenmemiş.</p>';
 if (yonetebilir) {
  alan.querySelectorAll('[data-icerik-duzenle]').forEach(b => b.onclick = () => { const x = okuListe().find(item => String(item.id) === b.dataset.icerikDuzenle); const form = document.querySelector('#icerikForm'); if (!x) return; form.elements.id.value = x.id; form.elements.baslik.value = x.baslik; form.elements.tarih.value = x.tarih; form.elements.departman.value = x.departman; if (duyuru) form.elements.metin.value = x.metin; else { form.elements.aciklama.value = x.aciklama || ''; form.elements.yer.value = x.yer || ''; form.elements.saat.value = x.saat || ''; } document.querySelector('#formBaslik').textContent = `${ad} düzenle`; });
  alan.querySelectorAll('[data-icerik-sil]').forEach(b => b.onclick = () => { if (!confirm(`Bu ${ad} silinsin mi?`)) return; yaz(key, okuListe().filter(x => String(x.id) !== b.dataset.icerikSil)); icerikKur(tur); });
 }
}
if (sayfa === 'giris.html') girisKur();





