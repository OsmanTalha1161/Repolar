const anaSayfa = 'index.html';
const ilkUyeler = [{ad:'Osman', kullanici:'osman', sifre:'1976', rol:'ana', departman:'Tüm departmanlar'}];
const ilkDepartmanlar = ['Yazılım','Mekanik','PR'];
const ilkGorevler = [];
const ilkDuyurular = [];
const ilkEtkinlikler = [];
function oku(anahtar, varsayilan) { try { return JSON.parse(localStorage.getItem(anahtar)) || varsayilan; } catch { return varsayilan; } }
function yaz(anahtar, deger) { try { localStorage.setItem(anahtar, JSON.stringify(deger)); } catch {} }
const ornekKullaniciAdlari = new Set(['ayse','mehmet','zeynep','elif','can']);
const kayitliUyeler = oku('takimUyeleri', null);
if (!kayitliUyeler) yaz('takimUyeleri', ilkUyeler);
else {
  const uyeler = kayitliUyeler.filter(u => !ornekKullaniciAdlari.has(String(u.kullanici).toLowerCase()));
  const anaYonetici = uyeler.find(u => String(u.kullanici).toLowerCase() === 'osman');
  if (anaYonetici) Object.assign(anaYonetici, ilkUyeler[0]);
  else uyeler.unshift(ilkUyeler[0]);
  yaz('takimUyeleri', uyeler);
}
const kayitliDepartmanlar = oku('takimDepartmanlari', null);
if (!kayitliDepartmanlar) yaz('takimDepartmanlari', ilkDepartmanlar);
else {
  const adDonusumu = {'Tasarım':'PR','Pazarlama':'PR'};
  const departmanlar = [...new Set(kayitliDepartmanlar.map(d => adDonusumu[d] || d).filter(Boolean))];
  if (!departmanlar.some(d => d.toLowerCase() === 'pr')) departmanlar.push('PR');
  yaz('takimDepartmanlari', departmanlar);
  for (const anahtar of ['takimUyeleri','takimGorevleri','takimDuyurulari','takimEtkinlikleri']) {
    const kayitlar = oku(anahtar, []);
    let degisti = false;
    kayitlar.forEach(k => { if (adDonusumu[k.departman]) { k.departman = adDonusumu[k.departman]; degisti = true; } });
    if (degisti) yaz(anahtar, kayitlar);
  }
}
if (!oku('takimGorevleri', null)) yaz('takimGorevleri', ilkGorevler);
if (!oku('takimDuyurulari', null)) yaz('takimDuyurulari', ilkDuyurular);
if (!oku('takimEtkinlikleri', null)) yaz('takimEtkinlikleri', ilkEtkinlikler);
function eskiOrnekleriSil(anahtar, basliklar) {
  const kayitlar = oku(anahtar, []);
  yaz(anahtar, kayitlar.filter(k => !basliklar.has(k.baslik)));
}
eskiOrnekleriSil('takimGorevleri', new Set(['Haftalık raporu hazırla','Yeni fikirleri listele','Parça kontrol listesini tamamla']));
eskiOrnekleriSil('takimDuyurulari', new Set(['Yeni çalışma planı']));
eskiOrnekleriSil('takimEtkinlikleri', new Set(['Haftalık takım toplantısı']));
try {
  const eskiOturum = JSON.parse(localStorage.getItem('takimOturumu') || 'null');
  if (eskiOturum && ornekKullaniciAdlari.has(String(eskiOturum.kullanici).toLowerCase())) localStorage.removeItem('takimOturumu');
} catch {}
const uyeOku = () => oku('takimUyeleri', ilkUyeler);
const gorevOku = () => oku('takimGorevleri', ilkGorevler);
const departmanOku = () => oku('takimDepartmanlari', ilkDepartmanlar);
const duyuruOku = () => oku('takimDuyurulari', ilkDuyurular);
const etkinlikOku = () => oku('takimEtkinlikleri', ilkEtkinlikler);
const oturum = () => {
 const kayitli = oku('takimOturumu', null);
 if (!kayitli) return null;
 const kisi = uyeOku().find(u => u.kullanici === kayitli.kullanici);
 return kisi ? {ad:kisi.ad,kullanici:kisi.kullanici,rol:kisi.rol,departman:kisi.departman} : null;
};
if (new URLSearchParams(location.search).has('oturum')) history.replaceState(null, '', location.pathname);
const ana = document.querySelector('main');
const sayfa = location.pathname.split('/').pop() || anaSayfa;
const basliklar = {'index.html':'Ana Sayfa','gorevler.html':'Görevler','etkinlikler.html':'Etkinlikler','duyurular.html':'Duyurular','departmanlar.html':'Departmanlar','uyeler.html':'Üyeler','giris.html':'Giriş'};
const yetki = oturum();
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
 function girisYap(kullanici, sifre) { const mesaj = document.querySelector('#girisMesaji'); const kisi = uyeOku().find(u => u.kullanici.toLowerCase() === kullanici.trim().toLowerCase() && u.sifre === sifre); if (!kisi) { mesaj.textContent = 'Kullanıcı adı veya şifre yanlış.'; return; } try { yaz('takimOturumu', kisi); } catch {} location.href = 'index.html'; }
 form.onsubmit = e => { e.preventDefault(); girisYap(form.elements.namedItem('kullanici').value, form.elements.namedItem('sifre').value); };
}
function bugunISO() { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function tarihiGoster(tarih, bosMetin='—') { if(!tarih)return bosMetin; const parcalar=String(tarih).split('-'); return parcalar.length===3?`${parcalar[2]}.${parcalar[1]}.${parcalar[0]}`:String(tarih); }
function gorevSonTarihi(g) { return g.sonTarih || g.tarih || ''; }
function etkinlikBaslangici(e) { return e.baslangicTarihi || e.tarih || bugunISO(); }
function etkinlikBitisi(e) { return e.bitisTarihi || e.tarih || etkinlikBaslangici(e); }
function anaSayfaKur() {
 const gorevler = gorevOku().filter(g => (yetki.rol === 'ana' || (yetki.rol === 'yan' && g.departman === yetki.departman) || (yetki.rol === 'uye' && g.kisi === yetki.ad)) && g.durum !== 'Tamamlandı');
 const yaklasanGorevler = [...gorevler].sort((a,b) => {
  const ta=gorevSonTarihi(a)||'9999-12-31', tb=gorevSonTarihi(b)||'9999-12-31';
  return ta.localeCompare(tb);
 }).slice(0,3);
 const bugun=bugunISO();
 const etkinlikler=etkinlikOku().filter(e=>yetki.rol==='ana'||e.departman==='Tüm departmanlar'||e.departman===yetki.departman).filter(e=>etkinlikBitisi(e)>=bugun).sort((a,b)=>etkinlikBaslangici(a).localeCompare(etkinlikBaslangici(b))).slice(0,3);
 const duyurular=duyuruOku().filter(d=>yetki.rol==='ana'||d.departman==='Tüm departmanlar'||d.departman===yetki.departman).filter(d=>(d.tarih||'')>=bugun).sort((a,b)=>(a.tarih||'').localeCompare(b.tarih||'')).slice(0,3);
 const gorevIcerigi=yaklasanGorevler.length?yaklasanGorevler.map(g=>`<li><strong>${guvenli(g.baslik)}</strong><span>${guvenli(g.kisi)} · ${guvenli(g.departman)} · ${gorevSonTarihi(g)?tarihiGoster(gorevSonTarihi(g)):'Süresiz'}</span></li>`).join(''):'<li class="bos-icerik">Bekleyen görev yok.</li>';
 const etkinlikIcerigi=etkinlikler.length?etkinlikler.map(e=>`<li><strong>${guvenli(e.baslik)}</strong><span>${tarihiGoster(etkinlikBaslangici(e))}${etkinlikBitisi(e)!==etkinlikBaslangici(e)?` – ${tarihiGoster(etkinlikBitisi(e))}`:''} · ${guvenli(e.yer||'Yer belirtilmedi')}</span></li>`).join(''):'<li class="bos-icerik">Yaklaşan etkinlik yok.</li>';
 const duyuruIcerigi=duyurular.length?duyurular.map(d=>`<li><strong>${guvenli(d.baslik)}</strong><span>${tarihiGoster(d.tarih)} · ${guvenli(d.departman)}</span></li>`).join(''):'<li class="bos-icerik">Yaklaşan duyuru yok.</li>';
 ana.innerHTML=`<div class="dashboard-welcome"><span class="eyebrow">TAKIM ÖZETİ</span><h2>Merhaba, ${guvenli(yetki.ad)}</h2><p>${yetki.rol==='ana'?'Tüm takımın güncel durumu.':yetki.rol==='yan'?`${guvenli(yetki.departman)} departmanının güncel durumu.`:'Sana atanan işler ve takım takvimi.'}</p></div><div class="dashboard-grid"><section class="dashboard-panel"><span class="eyebrow">${yetki.rol==='uye'?'GÖREVLERİM':yetki.rol==='yan'?'DEPARTMAN GÖREVLERİ':'YAKLAŞAN GÖREVLER'}</span><ul>${gorevIcerigi}</ul><a class="dashboard-more" href="gorevler.html">Görevleri aç <span aria-hidden="true">↗</span></a></section><section class="dashboard-panel"><span class="eyebrow">YAKLAŞAN ETKİNLİKLER</span><ul>${etkinlikIcerigi}</ul><a class="dashboard-more" href="etkinlikler.html">Etkinlikleri aç <span aria-hidden="true">↗</span></a></section><section class="dashboard-panel"><span class="eyebrow">YAKLAŞAN DUYURULAR</span><ul>${duyuruIcerigi}</ul><a class="dashboard-more" href="duyurular.html">Duyuruları aç <span aria-hidden="true">↗</span></a></section></div>`;
}
function gorevTablosuHTML(id, liste, durumDuzelt=false, yonetim=false) {
 const satirlar=liste.map(g=>`<tr><td>${guvenli(g.baslik)}</td><td>${guvenli(g.departman)}</td><td>${guvenli(g.kisi)}</td><td>${tarihiGoster(g.baslangicTarihi,'—')}</td><td>${tarihiGoster(gorevSonTarihi(g),'Süresiz')}</td><td>${durumDuzelt?`<select data-durum="${guvenli(g.id)}"><option ${g.durum==='Bekliyor'?'selected':''}>Bekliyor</option><option ${g.durum==='Devam ediyor'?'selected':''}>Devam ediyor</option><option ${g.durum==='Tamamlandı'?'selected':''}>Tamamlandı</option></select>`:guvenli(g.durum||'Bekliyor')}</td>${yonetim?`<td class="islem-hucre"><button type="button" class="buton-ikincil" data-gorev-duzenle="${guvenli(g.id)}">Düzenle</button><button type="button" class="buton-sil" data-gorev-sil="${guvenli(g.id)}">Sil</button></td>`:''}</tr>`).join('');
 const colspan=yonetim?7:6;
 return `<div class="kart tablo-karti"><table><thead><tr><th>Görev</th><th>Departman</th><th>Sorumlu</th><th>Başlangıç</th><th>Son tarih</th><th>Durum</th>${yonetim?'<th>İşlem</th>':''}</tr></thead><tbody id="${id}">${satirlar||`<tr><td colspan="${colspan}" class="bos-icerik">Henüz görev yok.</td></tr>`}</tbody></table></div>`;
}
function gorevlerKur() {
 const ekleYetkisi = yetki.rol === 'ana' || yetki.rol === 'yan';
 const yonetebilir = yetki.rol === 'ana';
 const tumGorevler=gorevOku();
 const kendiDepartmanGorevleri=yetki.rol==='uye'?tumGorevler.filter(g=>g.departman===yetki.departman&&g.kisi!==yetki.ad):[];
 const gorevler=tumGorevler.filter(g=>yetki.rol==='ana'||(yetki.rol==='yan'&&g.departman===yetki.departman)||(yetki.rol==='uye'&&g.kisi===yetki.ad));
 ana.innerHTML=`<h2>Görevler</h2><p>${yetki.rol==='ana'?'Bütün departmanların görevleri.':yetki.rol==='yan'?`${guvenli(yetki.departman)} departmanının görevleri.`:'Kendi görevlerin ve departmanındaki diğer görevler.'}</p><section id="gorevEkleBolum"></section>${yetki.rol==='uye'?`<section class="gorev-bolumu"><h3>Görevlerim</h3>${gorevTablosuHTML('kendiGorevTablo',gorevler,true)}</section><section class="gorev-bolumu"><h3>${guvenli(yetki.departman)} departmanındaki diğer görevler</h3>${gorevTablosuHTML('departmanGorevTablo',kendiDepartmanGorevleri,false)}</section>`:gorevTablosuHTML('gorevTablo',gorevler,false,yonetebilir)}`;
 if(ekleYetkisi){
  const bolum=document.querySelector('#gorevEkleBolum');
  bolum.innerHTML=`<section class="kart"><h3 id="gorevFormBaslik">Yeni görev ver</h3><form id="gorevForm"><input type="hidden" name="id"><label>Görev adı<input name="baslik" required></label><label>Departman<select name="departman" required></select></label><label>Üye<select name="kisi" required></select></label><label>Başlangıç tarihi<input type="date" name="baslangicTarihi" required></label><label>Son tarih <span class="yardimci-metin">Boş bırakılırsa süresiz</span><input type="date" name="sonTarih"></label>${yonetebilir?'<label>Durum<select name="durum"><option>Bekliyor</option><option>Devam ediyor</option><option>Tamamlandı</option></select></label>':''}<div class="form-islemleri"><button id="gorevKaydet">Görev ekle</button>${yonetebilir?'<button type="button" id="gorevVazgec" class="buton-ikincil" hidden>Vazgeç</button>':''}</div></form></section>`;
  const gform=document.querySelector('#gorevForm');
  const d=formEleman('#gorevForm','departman');
  d.innerHTML=(yetki.rol==='ana'?departmanOku():[yetki.departman]).map(x=>`<option value="${guvenli(x)}">${guvenli(x)}</option>`).join('');
  const baslangic=formEleman('#gorevForm','baslangicTarihi');baslangic.value=bugunISO();
  let seciliKisi='';
  function kisiDoldur(){
   const kisiler=uyeOku().filter(u=>u.rol!=='ana'&&u.departman===gform.elements.departman.value);
   gform.elements.kisi.innerHTML=kisiler.map(u=>`<option value="${guvenli(u.ad)}">${guvenli(u.ad)}</option>`).join('');
   if(seciliKisi&&!kisiler.some(u=>u.ad===seciliKisi))gform.elements.kisi.insertAdjacentHTML('beforeend',`<option value="${guvenli(seciliKisi)}">${guvenli(seciliKisi)}</option>`);
   if(seciliKisi)gform.elements.kisi.value=seciliKisi;seciliKisi='';
  }
  d.onchange=kisiDoldur;kisiDoldur();
  gform.onsubmit=e=>{
   e.preventDefault();const f=new FormData(gform);const liste=gorevOku();const id=f.get('id');
   const kayit={id:id?Number(id):Date.now(),baslik:String(f.get('baslik')).trim(),departman:f.get('departman'),kisi:f.get('kisi'),baslangicTarihi:f.get('baslangicTarihi')||bugunISO(),sonTarih:f.get('sonTarih')||'',durum:gform.elements.durum?.value||'Bekliyor'};
   const index=liste.findIndex(g=>String(g.id)===String(id));if(index<0)liste.push(kayit);else liste[index]=kayit;
   yaz('takimGorevleri',liste);gorevlerKur();
  };
  if(yonetebilir){
   document.querySelector('#gorevVazgec').onclick=()=>gorevlerKur();
   document.querySelector('#gorevTablo').addEventListener('click',e=>{
    const edit=e.target.closest('[data-gorev-duzenle]');const remove=e.target.closest('[data-gorev-sil]');
    if(edit){const g=gorevOku().find(x=>String(x.id)===edit.dataset.gorevDuzenle);if(!g)return;
     gform.elements.id.value=g.id;gform.elements.baslik.value=g.baslik;d.value=g.departman;seciliKisi=g.kisi;kisiDoldur();gform.elements.kisi.value=g.kisi;baslangic.value=g.baslangicTarihi||bugunISO();gform.elements.sonTarih.value=g.sonTarih||g.tarih||'';gform.elements.durum.value=g.durum||'Bekliyor';
     document.querySelector('#gorevFormBaslik').textContent='Görevi düzenle';document.querySelector('#gorevKaydet').textContent='Değişiklikleri kaydet';document.querySelector('#gorevVazgec').hidden=false;gform.scrollIntoView({behavior:'smooth',block:'center'});
    }
    if(remove){const g=gorevOku().find(x=>String(x.id)===remove.dataset.gorevSil);if(!g||!confirm(`“${g.baslik}” görevi silinsin mi?`))return;yaz('takimGorevleri',gorevOku().filter(x=>String(x.id)!==String(g.id)));gorevlerKur();}
   });
  }
 }
 const statusListener=container=>container?.querySelectorAll('[data-durum]').forEach(s=>s.onchange=()=>{const list=gorevOku();const g=list.find(x=>String(x.id)===s.dataset.durum);if(g){g.durum=s.value;yaz('takimGorevleri',list);}});
 statusListener(document.querySelector('#kendiGorevTablo'));
}function departmanlarKur() {
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
  <p>Üyeleri, kaptanları ve bağlı oldukları departmanları buradan yönetebilirsin.</p>
  ${yonetebilir ? `<section class="kart"><h3 id="uyeFormBaslik">Yeni kullanıcı ekle</h3><form id="uyeForm"><input type="hidden" name="eskiKullanici"><label>Ad soyad<input name="ad" required></label><label>Kullanıcı adı<input name="kullanici" required></label><label>Şifre<input name="sifre" placeholder="Üye için geçici şifre" required></label><label>Rol<select name="rol"><option value="uye">Üye</option><option value="yan">Yan kaptan</option></select></label><label>Departman<select name="departman" required></select></label><div class="uye-form-islemleri"><button id="uyeKaydet">Kullanıcı ekle</button><button type="button" id="uyeVazgec" class="buton-ikincil" hidden>Vazgeç</button></div></form><p id="uyeMesaji" role="status"></p></section>` : ''}
  <div class="kart"><table><thead><tr><th>Ad</th><th>Kullanıcı adı</th><th>Rol</th><th>Departman</th>${yonetebilir ? '<th>İşlem</th>' : ''}</tr></thead><tbody id="uyeTablo"></tbody></table></div>`;
 const tablo=document.querySelector('#uyeTablo');
 const liste=uyeOku();
 tablo.innerHTML=liste.map(u=>{
  const yonetici=u.rol==='ana';
  const islemler=yonetebilir&&!yonetici?`<td class="islem-hucre"><button type="button" class="buton-ikincil" data-uye-duzenle="${guvenli(u.kullanici)}">Düzenle</button><button type="button" class="buton-sil" data-uye-sil="${guvenli(u.kullanici)}">Sil</button></td>`:yonetebilir?'<td>Yönetici hesabı</td>':'';
  return `<tr><td>${guvenli(u.ad)}</td><td>${guvenli(u.kullanici)}</td><td><span class="rozet">${yonetici?'Ana Kaptan':u.rol==='yan'?'Yan Kaptan':'Üye'}</span></td><td>${guvenli(u.departman)}</td>${islemler}</tr>`;
 }).join('')||`<tr><td colspan="${yonetebilir?5:4}">Henüz üye eklenmemiş.</td></tr>`;
 if(!yonetebilir)return;
 const f=document.querySelector('#uyeForm');
 f.elements.departman.innerHTML=departmanOku().map(d=>`<option value="${guvenli(d)}">${guvenli(d)}</option>`).join('');
 const resetForm=()=>{f.reset();f.elements.eskiKullanici.value='';f.elements.sifre.required=true;f.elements.sifre.placeholder='Üye için geçici şifre';document.querySelector('#uyeFormBaslik').textContent='Yeni kullanıcı ekle';document.querySelector('#uyeKaydet').textContent='Kullanıcı ekle';document.querySelector('#uyeVazgec').hidden=true;document.querySelector('#uyeMesaji').textContent='';};
 f.onsubmit=e=>{
  e.preventDefault();
  const us=uyeOku();
  const eskiKullanici=f.elements.eskiKullanici.value;
  const eski=eskiKullanici?us.find(u=>u.kullanici===eskiKullanici):null;
  const kullanici=f.elements.kullanici.value.trim();
  if(!kullanici||us.some(u=>u.kullanici.toLowerCase()===kullanici.toLowerCase()&&u!==eski)){document.querySelector('#uyeMesaji').textContent='Bu kullanıcı adı zaten kullanılıyor.';return;}
  const eskiAd=eski?.ad;
  const kayit={ad:f.elements.ad.value.trim(),kullanici,sifre:f.elements.sifre.value||(eski?.sifre||''),rol:f.elements.rol.value,departman:f.elements.departman.value};
  if(eski)Object.assign(eski,kayit);else us.push(kayit);
  yaz('takimUyeleri',us);
  if(eski&&eskiAd!==kayit.ad){const gorevler=gorevOku().map(g=>g.kisi===eskiAd?{...g,kisi:kayit.ad}:g);yaz('takimGorevleri',gorevler);}
  uyelerKur();
 };
 document.querySelector('#uyeVazgec').onclick=resetForm;
 tablo.querySelectorAll('[data-uye-duzenle]').forEach(b=>b.onclick=()=>{
  const u=uyeOku().find(x=>x.kullanici===b.dataset.uyeDuzenle);if(!u)return;
  f.elements.eskiKullanici.value=u.kullanici;f.elements.ad.value=u.ad;f.elements.kullanici.value=u.kullanici;f.elements.sifre.value='';f.elements.sifre.required=false;f.elements.sifre.placeholder='Boş bırakırsan mevcut şifre korunur';f.elements.rol.value=u.rol;f.elements.departman.value=u.departman;
  document.querySelector('#uyeFormBaslik').textContent='Üye bilgilerini düzenle';document.querySelector('#uyeKaydet').textContent='Değişiklikleri kaydet';document.querySelector('#uyeVazgec').hidden=false;f.scrollIntoView({behavior:'smooth',block:'center'});
 });
 tablo.querySelectorAll('[data-uye-sil]').forEach(b=>b.onclick=()=>{
  const silinecek=uyeOku().find(u=>u.kullanici===b.dataset.uyeSil);if(!silinecek||silinecek.rol==='ana')return;
  if(!confirm(`${silinecek.ad} silinsin mi? Bu üyeye atanmış görevler “Atanmamış” olarak korunur.`))return;
  yaz('takimUyeleri',uyeOku().filter(u=>u.kullanici!==silinecek.kullanici));
  yaz('takimGorevleri',gorevOku().map(g=>g.kisi===silinecek.ad?{...g,kisi:'Atanmamış'}:g));
  uyelerKur();
 });
}function guvenli(metin){return String(metin).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function icerikKur(tur) {
 const duyuru=tur==='duyuru';
 const ad=duyuru?'duyuru':'etkinlik';
 const baslik=duyuru?'Duyurular':'Etkinlikler';
 const okuListe=duyuru?duyuruOku:etkinlikOku;
 const key=duyuru?'takimDuyurulari':'takimEtkinlikleri';
 const yonetebilir=yetki.rol==='ana'||yetki.rol==='yan';
 let liste=okuListe();
 if(yetki.rol==='yan'||yetki.rol==='uye')liste=liste.filter(x=>x.departman==='Tüm departmanlar'||x.departman===yetki.departman);
 const tarihAlanlari=duyuru?'<label>Tarih<input name="tarih" type="date" required></label>':'<label>Başlangıç tarihi<input name="baslangicTarihi" type="date" required></label><label>Bitiş tarihi<input name="bitisTarihi" type="date" required></label>';
 const etkinlikEkAlanlari=duyuru?'':'<label>Yer<input name="yer" required></label><label>Saat<input name="saat" type="time"></label>';
 ana.innerHTML=`<h2>${baslik}</h2><p id="icerikMesaji" role="status"></p>${yonetebilir?`<section class="kart"><h3 id="formBaslik">Yeni ${ad} ekle</h3><form id="icerikForm"><input type="hidden" name="id"><label>Başlık<input name="baslik" required maxlength="100"></label>${duyuru?'<label>Duyuru metni<textarea name="metin" required rows="4"></textarea></label>':'<label>Açıklama<textarea name="aciklama" rows="3"></textarea></label>'}${etkinlikEkAlanlari}${tarihAlanlari}<label>Departman<select name="departman" required></select></label><div class="form-islemleri"><button type="submit">${ad} kaydet</button><button type="reset" id="formTemizle" class="buton-ikincil">Formu temizle</button></div></form></section>`:''}<section><h3>Paylaşılan ${duyuru?'duyurular':'etkinlikler'}</h3><div id="icerikListe"></div></section>`;
 if(yonetebilir){
  const form=document.querySelector('#icerikForm');
  const departmanlar=yetki.rol==='ana'?['Tüm departmanlar',...departmanOku()]:[yetki.departman];
  form.elements.departman.innerHTML=departmanlar.map(d=>`<option value="${guvenli(d)}">${guvenli(d)}</option>`).join('');
  if(!duyuru){form.elements.baslangicTarihi.value=bugunISO();form.elements.bitisTarihi.value=bugunISO();}
  form.onsubmit=e=>{
   e.preventDefault();const all=okuListe();const id=form.elements.id.value;
   const kayit={id:id?Number(id):Date.now(),baslik:form.elements.baslik.value.trim(),departman:form.elements.departman.value};
   if(duyuru){kayit.tarih=form.elements.tarih.value;kayit.metin=form.elements.metin.value.trim();}
   else{kayit.baslangicTarihi=form.elements.baslangicTarihi.value;kayit.bitisTarihi=form.elements.bitisTarihi.value;kayit.tarih=kayit.baslangicTarihi;kayit.aciklama=form.elements.aciklama.value.trim();kayit.yer=form.elements.yer.value.trim();kayit.saat=form.elements.saat.value;
    if(kayit.bitisTarihi<kayit.baslangicTarihi){document.querySelector('#icerikMesaji').textContent='Bitiş tarihi başlangıç tarihinden önce olamaz.';return;}
   }
   if(yetki.rol==='yan'&&kayit.departman!==yetki.departman){document.querySelector('#icerikMesaji').textContent='Yalnızca kendi departmanına içerik ekleyebilirsin.';return;}
   const index=all.findIndex(x=>String(x.id)===String(id));if(index<0)all.push(kayit);else all[index]=kayit;
   yaz(key,all);icerikKur(tur);
  };
  document.querySelector('#formTemizle').onclick=()=>setTimeout(()=>{form.elements.id.value='';document.querySelector('#formBaslik').textContent=`Yeni ${ad} ekle`;if(!duyuru){form.elements.baslangicTarihi.value=bugunISO();form.elements.bitisTarihi.value=bugunISO();}},0);
 }
 const sirali=[...liste].sort((a,b)=>duyuru?(a.tarih||'').localeCompare(b.tarih||''):etkinlikBaslangici(a).localeCompare(etkinlikBaslangici(b)));
 const alan=document.querySelector('#icerikListe');
 alan.innerHTML=sirali.length?sirali.map(x=>`<article><h4>${guvenli(x.baslik)}</h4>${duyuru?`<p>${guvenli(x.metin)}</p>`:`<p>${guvenli(x.aciklama||'')}</p><p>Yer: ${guvenli(x.yer||'Belirtilmedi')}${x.saat?' · Saat: '+guvenli(x.saat):''}</p>`}<p>Departman: ${guvenli(x.departman)} · ${duyuru?'Tarih: '+tarihiGoster(x.tarih):'Tarih: '+tarihiGoster(etkinlikBaslangici(x))+' – '+tarihiGoster(etkinlikBitisi(x))}</p>${yonetebilir?`<button type="button" data-icerik-duzenle="${guvenli(x.id)}">Düzenle</button> <button type="button" class="buton-sil" data-icerik-sil="${guvenli(x.id)}">Sil</button>`:''}</article>`).join(''):'<p>Henüz içerik eklenmemiş.</p>';
 if(yonetebilir){
  alan.querySelectorAll('[data-icerik-duzenle]').forEach(b=>b.onclick=()=>{const x=okuListe().find(item=>String(item.id)===b.dataset.icerikDuzenle);if(!x)return;const form=document.querySelector('#icerikForm');form.elements.id.value=x.id;form.elements.baslik.value=x.baslik;form.elements.departman.value=x.departman;if(duyuru){form.elements.tarih.value=x.tarih;form.elements.metin.value=x.metin||'';}else{form.elements.baslangicTarihi.value=etkinlikBaslangici(x);form.elements.bitisTarihi.value=etkinlikBitisi(x);form.elements.aciklama.value=x.aciklama||'';form.elements.yer.value=x.yer||'';form.elements.saat.value=x.saat||'';}document.querySelector('#formBaslik').textContent=`${ad} düzenle`;});
  alan.querySelectorAll('[data-icerik-sil]').forEach(b=>b.onclick=()=>{if(!confirm(`Bu ${ad} silinsin mi?`))return;yaz(key,okuListe().filter(x=>String(x.id)!==b.dataset.icerikSil));icerikKur(tur);});
 }
}
if (sayfa === 'giris.html') girisKur();













