/* ══════════ MERIDIAN HEALTH — shared content & image library ══════════ */
window.MH = (function () {
  'use strict';
  // Unsplash CDN helper — real, displayable photography
  const U = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

  const DEPARTMENTS = [
    { id:'cardiology', tag:'Heart & Vascular Institute', name:'Cardiology', wait:'≈ 9 min', docs:14, head:'Dr. Amara Osei',
      img:U('photo-1505751172876-fa1923c5c528'), fb:'cardiology-stethoscope',
      desc:'From prevention to complex intervention — two cath labs, a dedicated CCU and a heart-failure clinic that follows every patient for life.',
      long:'The Heart & Vascular Institute runs the district’s only 24/7 primary-PCI service, meaning a blocked artery is opened at any hour of any day. Our prevention clinic pairs cardiologists with dietitians and exercise physiologists so that many patients never need the cath lab at all.',
      services:['24/7 primary PCI (heart-attack response)','Echocardiography & stress testing','Electrophysiology & ablation','Cardiac rehabilitation gym'],
      stats:[['Cath labs','2'],['ICU pods','24'],['Procedures / yr','3,100']] },
    { id:'neurology', tag:'Brain & Spine Institute', name:'Neurology', wait:'≈ 12 min', docs:9, head:'Dr. Sofia Marchetti',
      img:U('photo-1559757148-5c350d0d3c56'), fb:'neurology-brain-scan',
      desc:'Comprehensive stroke unit with 25-minute door-to-needle times, video-EEG monitoring and dedicated neuro-rehabilitation therapists.',
      long:'Every suspected stroke is triaged straight to CT on arrival, and our thrombolysis clock starts at the ambulance door, not the desk. Beyond emergencies, the institute runs epilepsy, movement-disorder and memory clinics with same-week scheduling.',
      services:['Hyper-acute stroke pathway','Epilepsy & video-EEG monitoring','Movement-disorder clinic','Neuro-rehabilitation suite'],
      stats:[['Stroke bays','6'],['EEG beds','8'],['Door-to-needle','25 min']] },
    { id:'pediatrics', tag:'Children’s Hospital Wing', name:'Pediatrics', wait:'≈ 6 min', docs:12, head:'Dr. Mei-Ling Chao',
      img:U('photo-1503454537195-1dcabb73ffb9'), fb:'pediatrics-children',
      desc:'Level-III NICU, child-sized wards with play therapists, and evening walk-in clinics so school never has to miss a day.',
      long:'The children’s wing is a hospital inside a hospital: separate entrance, separate pharmacy, and clinicians who only ever treat kids. Our asthma-and-sleep clinic and school partnership programme have cut emergency visits among enrolled children by a third.',
      services:['Level-III neonatal intensive care','Vaccination & growth clinic','Pediatric surgery','Child psychology support'],
      stats:[['NICU cots','18'],['Play therapists','5'],['Walk-in until','20:00']] },
    { id:'orthopedics', tag:'Bone, Joint & Sports Institute', name:'Orthopedics', wait:'≈ 11 min', docs:11, head:'Dr. Viktor Lindqvist',
      img:U('photo-1571019613454-1cb2f99b2d8b'), fb:'orthopedics-rehab',
      desc:'Robotic-assisted joint replacement, a sports-injury clinic trusted by three professional teams, and an on-site physiotherapy gym.',
      long:'Robotic assistance lets our surgeons plan cuts in 3D before the first incision, which is why most joint patients stand and walk within 24 hours. The adjacent rehab gym means physiotherapy starts before you leave the building.',
      services:['Robotic knee & hip replacement','Arthroscopy & sports injuries','Spine clinic','Physiotherapy gym'],
      stats:[['Theatres','3'],['Robotic cases / yr','640'],['Walk-by','24 h']] },
    { id:'oncology', tag:'Cancer Centre', name:'Oncology', wait:'≈ 10 min', docs:8, head:'Dr. Hana Suzuki',
      img:U('photo-1579165466741-7f35a4755657'), fb:'oncology-lab',
      desc:'Precision oncology with same-week tumour-board review, modern infusion suites and psycho-oncology support for patients and families.',
      long:'Diagnosis to treatment plan in under seven days is our published promise: genomic profiling runs in-house and every case is reviewed by a multi-disciplinary tumour board before therapy begins. Day suites are designed for comfort during long infusions.',
      services:['Chemotherapy day suites','Immunotherapy & targeted therapy','Genomic tumour profiling','Survivorship program'],
      stats:[['Infusion chairs','22'],['Tumour board','Weekly'],['Trial access','14']] },
    { id:'radiology', tag:'Imaging & Diagnostics', name:'Radiology', wait:'≈ 8 min', docs:7, head:'Dr. Elena Petrova',
      img:U('photo-1538108149393-fbbd81895907'), fb:'radiology-mri',
      desc:'3T MRI, 128-slice CT, digital X-ray and interventional radiology — reports delivered the same day, day or night.',
      long:'Imaging never sleeps at Meridian: night radiographers and a teleradiology partner guarantee same-day reporting even at 3 AM. Interventional radiology now replaces many open procedures with pinhole image-guided ones.',
      services:['3T MRI & 128-slice CT','Ultrasound & Doppler','Interventional radiology','Same-day reporting'],
      stats:[['MRI','3T'],['CT','128-slice'],['Reports','Same day']] },
    { id:'maternity', tag:'Maternity & Women’s Health', name:'Maternity', wait:'≈ 7 min', docs:10, head:'Dr. Ingrid Halvorsen',
      img:U('photo-1555252333-9f8e92e65df9'), fb:'maternity-newborn',
      desc:'Water-birth suites, level-III NICU backup, and a midwife-led model with obstetrician cover around the clock.',
      long:'Birth suites face the river and come with water-birth pools, while a level-III NICU sits one corridor away for the moments that matter. Midwives lead low-risk care; obstetricians lead the high-risk clinic and are in-house 24/7.',
      services:['Birth suites & water birth','High-risk pregnancy clinic','IVF & fertility counselling','Gynaecologic surgery'],
      stats:[['Birth suites','12'],['NICU level','III'],['C-section rate','19%']] },
    { id:'dermatology', tag:'Skin & Laser Centre', name:'Dermatology', wait:'≈ 7 min', docs:6, head:'Dr. Claire Fontaine',
      img:U('photo-1556228578-8c89e6adf883'), fb:'dermatology-skin',
      desc:'Medical and surgical dermatology with dermoscopic mole mapping, laser therapy and a dedicated pediatric dermatology clinic.',
      long:'Fifteen-minute dermoscopy screens have caught more than sixty early melanomas since 2023 — the centre’s proudest statistic. Surgical, laser and pediatric dermatology sit under one roof for cradle-to-grandparent skin care.',
      services:['Dermoscopy & mole mapping','Laser & light therapy','Patch-testing clinic','Pediatric dermatology'],
      stats:[['Mole screens / yr','4,200'],['Lasers','5'],['Melanomas caught','60+']] },
    { id:'emergency', tag:'Emergency & Trauma', name:'Emergency', wait:'Triage < 5 min', docs:21, head:'Rotating consultant',
      img:U('photo-1519494026892-80bbd2d6fd0d'), fb:'emergency-corridor',
      desc:'Triage in under five minutes, always. Ambulances dispatch in under 90 seconds on the hotline.',
      long:'The emergency centre never closes: resuscitation bays, a direct elevator to theatres and on-call cover in every specialty, 365 nights a year. If you are unsure whether to come in, call — a nurse will triage you on the phone.',
      services:['24/7 resuscitation bays','On-call cover in every specialty','Direct elevator to theatres & ICU'],
      stats:[['Resus bays','4'],['Ambulance dispatch','< 90 s'],['Open','24/7']] }
  ];

  const DOCTORS = [
    { name:'Dr. Amara Osei', dept:'cardiology', role:'Interventional Cardiologist', yrs:16, rating:'4.9',
      photo:U('photo-1559839734-2b71ea197ec2',600), fb:'doctor-amara',
      edu:['MD — Johns Hopkins University','FACC, American College of Cardiology'], langs:['English','French','Yoruba'], slots:['Today 3:45 PM','Thu 9:10 AM','Fri 11:00 AM'],
      bio:'Leads Meridian’s 24/7 heart-attack service and has performed 4,000+ interventions since 2014. Famous for saying the best stent is the one you never need — prevention comes first in her clinic.' },
    { name:'Dr. Liam Novak', dept:'cardiology', role:'Cardiac Electrophysiologist', yrs:12, rating:'4.8',
      photo:U('photo-1612349317150-e413f6a5b16d',600), fb:'doctor-liam',
      edu:['MD — Charles University, Prague','EP Fellowship — Cleveland Clinic'], langs:['English','Czech','German'], slots:['Wed 10:20 AM','Fri 2:00 PM'],
      bio:'Specialises in complex ablation for atrial fibrillation and device implantation, with a 96% first-procedure success rate across the last three years of published outcomes.' },
    { name:'Dr. Sofia Marchetti', dept:'neurology', role:'Stroke & Vascular Neurologist', yrs:14, rating:'4.9',
      photo:U('photo-1573496359142-b8d87734a5a2',600), fb:'doctor-sofia',
      edu:['MD — University of Milan','PhD Neuroscience — Karolinska Institute'], langs:['Italian','English','Swedish'], slots:['Today 5:15 PM','Thu 8:40 AM'],
      bio:'Built Meridian’s hyper-acute stroke pathway that cut door-to-needle time to 25 minutes. Runs the region’s only video-EEG monitoring unit for complex epilepsy.' },
    { name:'Dr. Mei-Ling Chao', dept:'pediatrics', role:'Neonatologist', yrs:11, rating:'5.0',
      photo:U('photo-1580489944761-15a19d654956',600), fb:'doctor-meiling',
      edu:['MD — National Taiwan University','Neonatology Fellowship — Toronto'], langs:['Mandarin','English'], slots:['Today 9:40 AM','Sat 10:10 AM'],
      bio:'Heads the Level-III NICU and the family-integrated care program that lets parents stay round the clock. 400+ premature babies go home healthy from her unit each year.' },
    { name:'Dr. Viktor Lindqvist', dept:'orthopedics', role:'Orthopedic Surgeon', yrs:18, rating:'4.7',
      photo:U('photo-1622253692010-333f2da6031d',600), fb:'doctor-viktor',
      edu:['MD — Karolinska Institute','FRCS (Orth) — London'], langs:['Swedish','English','German'], slots:['Wed 9:00 AM','Fri 3:30 PM'],
      bio:'Pioneer of robotic joint replacement in the region and team surgeon for three national squads. His patients walk within 24 hours of surgery as standard protocol.' },
    { name:'Dr. Hana Suzuki', dept:'oncology', role:'Medical Oncologist', yrs:13, rating:'4.9',
      photo:U('photo-1573497019940-1c28c88b4f3e',600), fb:'doctor-hana',
      edu:['MD — University of Tokyo','PhD Clinical Oncology — Oxford'], langs:['Japanese','English'], slots:['Thu 1:20 PM','Fri 10:40 AM'],
      bio:'Chairs the weekly tumour board and leads the genomic profiling program that matches patients to targeted therapies and trials within days of diagnosis.' },
    { name:'Dr. Elena Petrova', dept:'radiology', role:'Interventional Radiologist', yrs:10, rating:'4.8',
      photo:U('photo-1594744803329-e58b31de8bf5',600), fb:'doctor-elena',
      edu:['MD — Sofia Medical University','IR Fellowship — Vienna'], langs:['Bulgarian','English','Russian'], slots:['Today 4:30 PM','Sat 9:20 AM'],
      bio:'Runs the 3T MRI and same-day reporting service, and performs image-guided biopsies and ablations that spare patients open surgery entirely.' },
    { name:'Dr. Ingrid Halvorsen', dept:'maternity', role:'Obstetrician & Gynaecologist', yrs:15, rating:'4.9',
      photo:U('photo-1544005313-94ddf0286df2',600), fb:'doctor-ingrid',
      edu:['MD — University of Oslo','FACOG'], langs:['Norwegian','English'], slots:['Wed 9:20 AM','Sat 10:10 AM'],
      bio:'Leads the high-risk pregnancy clinic and the midwife-led birth-suite model. Has delivered over 6,000 babies, and still sends every family a handwritten card.' },
    { name:'Dr. Claire Fontaine', dept:'dermatology', role:'Dermatologic Surgeon', yrs:9, rating:'4.8',
      photo:U('photo-1594824476967-48c8b964273f',600), fb:'doctor-claire',
      edu:['MD — Sorbonne University','Laser Surgery Fellowship — Brussels'], langs:['French','English'], slots:['Today 3:00 PM','Thu 4:15 PM'],
      bio:'Directs the skin-and-laser centre’s mole-mapping program, which has caught 60+ early melanomas since 2023 through routine 15-minute dermoscopy screens.' },
    { name:'Dr. Thomas Adeyemi', dept:'pediatrics', role:'Pediatric Pulmonologist', yrs:8, rating:'4.8',
      photo:U('photo-1537368910025-700350fe46c7',600), fb:'doctor-thomas',
      edu:['MD — University of Lagos','Pulmonology Fellowship — Boston Children’s'], langs:['English','Yoruba'], slots:['Mon 11:30 AM','Wed 2:40 PM'],
      bio:'Runs the children’s asthma and sleep clinic, and the school-partnership program that has cut emergency asthma visits among enrolled kids by a third.' }
  ];

  const PACKAGES = [
    { name:'Essential Screen', price:149, for:'Adults under 35 · annual baseline', hot:false,
      list:['45+ blood parameters','ECG & chest X-ray','Physician review (30 min)','BMI & nutrition consult','Digital report in 24 h','12-month health record'] },
    { name:'Advanced 360', price:329, for:'Ages 35–50 · full-body baseline', hot:true,
      list:['70+ blood parameters','ECG, echo & stress test','Abdominal + thyroid ultrasound','Cancer marker panel','Full-body skin check','Physician review (45 min)','Diet & fitness plan'] },
    { name:'Executive Longevity', price:690, for:'Ages 50+ · concierge half-day', hot:false,
      list:['90+ blood parameters','Cardiac CT calcium score','3T MRI screening (select organs)','Full-body skin mapping','Bone density scan','Specialist panel review','1-year coordinator access','Home sample collection'] }
  ];

  const GALLERY = [
    { img:U('photo-1519494026892-80bbd2d6fd0d',800), fb:'icu-suite', cap:'Private ICU suites — family can stay' },
    { img:U('photo-1584982751601-97dcc096659c',800), fb:'operating-theatre', cap:'Hybrid operating theatres × 12' },
    { img:U('photo-1555252333-9f8e92e65df9',800), fb:'birth-suite', cap:'Water-birth suites with river view' },
    { img:U('photo-1571019613454-1cb2f99b2d8b',800), fb:'rehab-gym', cap:'Rehabilitation gym & hydrotherapy' },
    { img:U('photo-1586773860418-d37222d8fce3',800), fb:'hospital-lobby', cap:'The winter-garden lobby' },
    { img:U('photo-1497366811353-6870744d04b2',800), fb:'roof-garden', cap:'Rooftop recovery garden' }
  ];

  const STORIES = [
    { img:U('photo-1500648767791-00dcc994a43e',200), fb:'patient-jonathan', name:'Jonathan Reyes', tag:'Cardiac care · 2026',
      quote:'The cath lab team had me treated 26 minutes after I walked through the door. I counted — twice. Three months on, I’m back on the bike.' },
    { img:U('photo-1544005313-94ddf0286df2',200), fb:'patient-priya', name:'Priya & Dev Sharma', tag:'Neonatology · 2025',
      quote:'Our daughter spent her first 40 days in the NICU. The nurses knew her — and us — by name from day one, and taught us everything before discharge.' },
    { img:U('photo-1594744803329-e58b31de8bf5',200), fb:'patient-margaret', name:'Margaret Ellison', tag:'Orthopedics · 2026',
      quote:'Knee replacement at 68. Ten weeks later I walked my granddaughter down the aisle. The physio gym and the follow-up calls made all the difference.' },
    { img:U('photo-1507003211169-0a1dd7228f2d',200), fb:'patient-hannah', name:'Hannah Cole', tag:'Pediatrics · 2026',
      quote:'Telehealth at 2 AM meant a real doctor saw my son before we’d even found the thermometer. We were in a bed by sunrise — no waiting-room gamble.' }
  ];

  const NEWS = [
    { img:U('photo-1538108149393-fbbd81895907',800), fb:'news-mri', cat:'Facilities', date:'Aug 4, 2026', read:'3 min',
      title:'Meridian opens the region’s first 3T research MRI',
      text:'The new scanner halves scan times and enables cardiac mapping previously available only in university centres 400 km away.' },
    { img:U('photo-1505751172876-fa1923c5c528',800), fb:'news-heart', cat:'Cardiology', date:'Jul 22, 2026', read:'5 min',
      title:'Five numbers your heart wants you to know',
      text:'Dr. Amara Osei on the only five metrics she tracks for every patient — and the one she says people obsess over far too much.' },
    { img:U('photo-1503454537195-1dcabb73ffb9',800), fb:'news-sleep', cat:'Pediatrics', date:'Jul 9, 2026', read:'4 min',
      title:'Night-shift parents: a pediatrician’s sleep guide',
      text:'Dr. Adeyemi’s practical, evidence-based playbook for fevers, coughs and 3 AM decisions — including when to stay home and when to come in.' }
  ];

  const TIMELINE = [
    { y:'1993', t:'Meridian General opens', d:'120 beds on Harborline Avenue, one promise: nobody waits overnight for an answer.' },
    { y:'2001', t:'Heart & Vascular Institute', d:'First cath lab in the district; the 24/7 heart-attack service begins two years later.' },
    { y:'2010', t:'Teaching hospital status', d:'Accredited for residency training; beds grow to 300 and the research ethics board is founded.' },
    { y:'2016', t:'First robotic joint replacement', d:'The region’s first fully robotic knee replacement, performed by Dr. Lindqvist’s team.' },
    { y:'2021', t:'Harborline expansion', d:'480 beds, 96 ICU pods, Level-III NICU and the winter-garden lobby open to the public.' },
    { y:'2026', t:'Telehealth network', d:'Remote monitoring reaches 40,000 households; door-to-doctor time falls below 12 minutes.' }
  ];

  const FAQS = [
    ['Do I need a referral to book?', 'No. Book any outpatient department directly — online, by phone, or by walking in. A referral is only required by a few insurance plans, and our desk will tell you instantly if yours is one.'],
    ['How fast are test results?', 'Blood work the same day; MRI and CT reports within 24 hours. Everything lands in your patient portal and with your doctor simultaneously.'],
    ['What are the visiting hours?', 'General wards 10:00–20:00, ICU 11:00–12:00 and 17:00–18:00. Two visitors per patient at a time; children are welcome with an adult.'],
    ['Do you handle emergencies at night?', 'Yes — emergency and trauma never close. Every specialty keeps on-call cover, 365 nights a year, and ambulances dispatch in under 90 seconds.'],
    ['Can I cancel or reschedule?', 'Any time before your slot, free of charge — from the Appointment Wallet or by phone. The slot is released to other patients immediately.'],
    ['Is parking really free?', 'Three hours free with validation at any outpatient visit, 600 bays, EV chargers on P2, and free valet for maternity and oncology patients.']
  ];

  const INSURERS = ['Aetna','Cigna','UnitedHealth','BlueCross','Humana','Kaiser','Medicare','Medicaid'];
  const TICKER = ['⛑ Emergency wait ≈ 9 min','❤ Cath lab on standby 24/7','◷ MRI & CT reports same day','🩸 Blood bank: O− urgently needed','🧒 Pediatrics walk-in until 8 PM','💊 Pharmacy open until midnight','📡 Telehealth online now','🫀 Free BP screening Saturdays','🚑 Ambulance dispatch < 90 s','🏥 96 ICU pods · 12 theatres'];

  const HERO = { main:U('photo-1519494026892-80bbd2d6fd0d',1000), fbMain:'hospital-atrium',
                 polaroid:U('photo-1576091160399-112ba8d25d1d',600), fbPolaroid:'cath-team',
                 map:U('photo-1524661135-423995f22d0b',1000), fbMap:'city-map' };

  return { U, DEPARTMENTS, DOCTORS, PACKAGES, GALLERY, STORIES, NEWS, TIMELINE, FAQS, INSURERS, TICKER, HERO };
})();
