import type { Post } from "@/types";

export const initialPosts: Post[] = [
  {
    id: 1,
    author: "Gamelan Laras Wening",
    discipline: "Musik & karawitan",
    location: "Jawa Tengah",
    type: "Gagasan pengembangan karya",
    body:
      "Sedang merancang pertunjukan yang mempertemukan instrumen gamelan dengan sistem notasi internasional. Tujuannya agar musisi dari disiplin berbeda dapat membaca struktur komposisi yang sama tanpa menghilangkan karakter bunyi tiap instrumen.",
    image:
      "https://images.unsplash.com/photo-1671636791627-a5b55434aadb?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Kelompok pemain musik tradisional duduk bersama",
    imageCredit: "Reidika Haris / Unsplash",
    tags: ["Komposisi", "Musik lintas disiplin", "Mencari kolaborator"],
  },
  {
    id: 2,
    author: "Raka Bimantara",
    discipline: "Teater & pedalangan",
    location: "Yogyakarta",
    type: "Ajakan kolaborasi",
    body:
      "Mencari ilustrator fauna dan dalang untuk menguji bentuk wayang kulit dengan tokoh binatang Nusantara. Eksperimen akan tetap mencatat sumber teknik, pembuat figur, dan konteks cerita yang digunakan.",
    tags: ["Wayang kulit", "Ilustrasi fauna", "Riset bentuk"],
  },
  {
    id: 3,
    author: "Ni Luh Sekarini",
    discipline: "Tari tradisi",
    location: "Bali",
    type: "Portofolio karya",
    body:
      "Cuplikan dokumentasi pertunjukan dan proses latihan. Halaman portofolio dapat memuat peran, tahun produksi, afiliasi sanggar, serta kebutuhan lisensi dokumentasi.",
    image:
      "https://images.unsplash.com/photo-1741272689174-f7f03b09a0ab?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Penari Bali tampil bersama ansambel",
    imageCredit: "Didi Paul / Unsplash",
    tags: ["Pertunjukan", "Portofolio", "Tari"],
  },
];

export const disciplines = [
  {
    name: "Tari",
    note: "Penari, koreografer, pelatih, dan sanggar tari.",
    visual: "https://images.unsplash.com/photo-1554785007-399e80f5cb72?auto=format&fit=crop&w=800&q=82",
    credit: "Anggit Rizkianto",
  },
  {
    name: "Musik & karawitan",
    note: "Pemain instrumen, komposer, vokalis, dan kelompok musik.",
    visual: "https://images.unsplash.com/photo-1671636791627-a5b55434aadb?auto=format&fit=crop&w=800&q=82",
    credit: "Reidika Haris",
  },
  {
    name: "Teater & pedalangan",
    note: "Aktor, sutradara, penulis lakon, dalang, dan perancang panggung.",
    visual: "https://images.unsplash.com/photo-1710611236752-91dee307f6e2?auto=format&fit=crop&w=800&q=82",
    credit: "Krisna Yuda",
  },
  {
    name: "Kriya & wastra",
    note: "Perajin, pembatik, penenun, desainer, dan pengajar.",
    visual: "https://images.unsplash.com/photo-1604973104381-870c92f10343?auto=format&fit=crop&w=800&q=82",
    credit: "Mahmur Marganti",
  },
  {
    name: "Sastra & tutur",
    note: "Penulis, penutur, penerjemah, dan pengarsip bahasa.",
    visual: "https://images.unsplash.com/photo-1654860687488-119a90eafa86?auto=format&fit=crop&w=800&q=82",
    credit: "Dhan",
  },
  {
    name: "Rupa & media",
    note: "Perupa, fotografer, ilustrator, dan pembuat media budaya.",
    visual: "https://images.unsplash.com/photo-1656058031541-b283d3d75669?auto=format&fit=crop&w=800&q=82",
    credit: "Firall Ar Dunda",
  },
];

export const services = [
  {
    title: "Pertunjukan tari untuk acara",
    discipline: "Tari tradisi",
    description: "Paket pertunjukan untuk acara komunitas, institusi, dan program kebudayaan.",
    image:
      "https://images.unsplash.com/photo-1554785007-399e80f5cb72?auto=format&fit=crop&w=900&q=85",
    credit: "Anggit Rizkianto / Unsplash",
  },
  {
    title: "Lokakarya proses batik tulis",
    discipline: "Kriya & wastra",
    description: "Kelas pengenalan batik tulis dengan pilihan kapasitas, durasi, dan kebutuhan alat.",
    image:
      "https://images.unsplash.com/photo-1604973104381-870c92f10343?auto=format&fit=crop&w=900&q=85",
    credit: "Mahmur Marganti / Unsplash",
  },
  {
    title: "Ansambel musik tradisi",
    discipline: "Musik & karawitan",
    description: "Pertunjukan ansambel dengan pilihan formasi dan kebutuhan teknis yang transparan.",
    image:
      "https://images.unsplash.com/photo-1670179716479-93dadc7a6093?auto=format&fit=crop&w=900&q=85",
    credit: "Shannia Christanty / Unsplash",
  },
];

export const networkProfiles = [
  {
    id: "penari",
    name: "Sekar Larasati",
    headline: "Penari dan fasilitator lokakarya",
    location: "Yogyakarta",
    disciplines: ["Tari", "Lokakarya"],
    banner: "https://images.unsplash.com/photo-1554785007-399e80f5cb72?auto=format&fit=crop&w=900&q=85",
    credit: "Anggit Rizkianto / Unsplash",
  },
  {
    id: "musisi",
    name: "Bagas Pradipta",
    headline: "Pemain gamelan dan kolaborator ansambel",
    location: "Surakarta",
    disciplines: ["Musik & karawitan", "Komposisi"],
    banner: "https://images.unsplash.com/photo-1671636791627-a5b55434aadb?auto=format&fit=crop&w=900&q=85",
    credit: "Reidika Haris / Unsplash",
  },
  {
    id: "perajin",
    name: "Dewi Arum Sari",
    headline: "Perajin dan pengajar proses batik",
    location: "Yogyakarta",
    disciplines: ["Kriya & wastra", "Batik"],
    banner: "https://images.unsplash.com/photo-1604973104381-870c92f10343?auto=format&fit=crop&w=900&q=85",
    credit: "Mahmur Marganti / Unsplash",
  },
  {
    id: "dalang",
    name: "Jati Wicaksana",
    headline: "Dalang dan perancang panggung",
    location: "Surabaya",
    disciplines: ["Teater & pedalangan", "Riset bentuk"],
    banner: "https://images.unsplash.com/photo-1710611236752-91dee307f6e2?auto=format&fit=crop&w=900&q=85",
    credit: "Krisna Yuda / Unsplash",
  },
  {
    id: "penutur",
    name: "Maya Rannu",
    headline: "Penutur dan penyusun materi cerita",
    location: "Makassar",
    disciplines: ["Sastra & tutur", "Edukasi"],
    banner: "https://images.unsplash.com/photo-1654860687488-119a90eafa86?auto=format&fit=crop&w=900&q=85",
    credit: "Dhan / Unsplash",
  },
  {
    id: "perupa",
    name: "Nara Purnama",
    headline: "Perupa dan ilustrator budaya",
    location: "Bandung",
    disciplines: ["Rupa & media", "Ilustrasi"],
    banner: "https://images.unsplash.com/photo-1656058031541-b283d3d75669?auto=format&fit=crop&w=900&q=85",
    credit: "Firall Ar Dunda / Unsplash",
  },
];

export const culturalOrganizations = [
  {
    id: "sanggar-gerak",
    name: "Sanggar Lintas Gerak",
    type: "Sanggar",
    location: "Surabaya",
    description: "Ruang latihan tari, teater, dan penciptaan pertunjukan lintas disiplin.",
    disciplines: ["Tari", "Teater & pedalangan"],
    accepting: true,
    banner: "https://images.unsplash.com/photo-1741272689174-f7f03b09a0ab?auto=format&fit=crop&w=1000&q=85",
    credit: "Didi Paul / Unsplash",
  },
  {
    id: "pusat-musik",
    name: "Pusat Musik Laras Nuswa",
    type: "Instansi kebudayaan",
    location: "Surakarta",
    description: "Pusat kelas, dokumentasi, dan program kolaborasi musik tradisi.",
    disciplines: ["Musik & karawitan"],
    accepting: true,
    banner: "https://images.unsplash.com/photo-1670179716479-93dadc7a6093?auto=format&fit=crop&w=1000&q=85",
    credit: "Shannia Christanty / Unsplash",
  },
  {
    id: "forum-tutur",
    name: "Forum Aksara Tutur",
    type: "Komunitas",
    location: "Makassar",
    description: "Komunitas tutur, penulisan, penerjemahan, dan pengarsipan cerita.",
    disciplines: ["Sastra & tutur", "Edukasi"],
    accepting: true,
    banner: "https://images.unsplash.com/photo-1654860687488-119a90eafa86?auto=format&fit=crop&w=1000&q=85",
    credit: "Dhan / Unsplash",
  },
];

export const marketplaceListings = [
  {
    id: "jasa-tari",
    kind: "service" as const,
    title: "Pertunjukan tari untuk acara",
    discipline: "Tari",
    location: "Yogyakarta",
    description: "Paket pertunjukan untuk acara komunitas dan institusi. Harga mencakup penampil dan persiapan dasar.",
    price: 3500000,
    unit: "per acara",
    image: "https://images.unsplash.com/photo-1554785007-399e80f5cb72?auto=format&fit=crop&w=900&q=85",
    credit: "Anggit Rizkianto / Unsplash",
    slots: [
      { id: "tari-1", date: "21 Nov", time: "09.00 sampai 13.00", status: "available" as const },
      { id: "tari-2", date: "22 Nov", time: "13.00 sampai 17.00", status: "booked" as const },
      { id: "tari-3", date: "28 Nov", time: "09.00 sampai 13.00", status: "available" as const },
    ],
  },
  {
    id: "jasa-musik",
    kind: "service" as const,
    title: "Ansambel musik tradisi",
    discipline: "Musik & karawitan",
    location: "Surakarta",
    description: "Paket ansambel untuk pertunjukan atau kolaborasi dengan pembahasan kebutuhan teknis setelah memilih jadwal.",
    price: 4500000,
    unit: "per acara",
    image: "https://images.unsplash.com/photo-1671636791627-a5b55434aadb?auto=format&fit=crop&w=900&q=85",
    credit: "Reidika Haris / Unsplash",
    slots: [
      { id: "musik-1", date: "20 Nov", time: "18.00 sampai 22.00", status: "booked" as const },
      { id: "musik-2", date: "23 Nov", time: "18.00 sampai 22.00", status: "available" as const },
      { id: "musik-3", date: "29 Nov", time: "09.00 sampai 13.00", status: "available" as const },
    ],
  },
  {
    id: "produk-batik",
    kind: "product" as const,
    title: "Karya batik tulis ukuran panel",
    discipline: "Kriya & wastra",
    location: "Yogyakarta",
    description: "Panel batik tulis untuk interior, diproses manual dengan detail warna yang khas.",
    price: 875000,
    unit: "per produk",
    stock: 4,
    image: "https://images.unsplash.com/photo-1604973104381-870c92f10343?auto=format&fit=crop&w=900&q=85",
    credit: "Mahmur Marganti / Unsplash",
  },
  {
    id: "produk-rekaman",
    kind: "product" as const,
    title: "Rekaman komposisi gamelan",
    discipline: "Musik & karawitan",
    location: "Surakarta",
    description: "Album digital berisi komposisi gamelan kontemporer dan catatan proses penciptaan.",
    price: 150000,
    unit: "per produk",
    stock: 12,
    image: "https://images.unsplash.com/photo-1670179716479-93dadc7a6093?auto=format&fit=crop&w=900&q=85",
    credit: "Shannia Christanty / Unsplash",
  },
];

export const workshops = [
  {
    cluster: "Teater & pedalangan",
    title: "Dasar penciptaan karakter pertunjukan",
    format: "Tatap muka",
    description: "Struktur katalog untuk jadwal, pengajar, tempat, kapasitas, biaya, dan prasyarat.",
  },
  {
    cluster: "Tari",
    title: "Laboratorium gerak berbasis tradisi",
    format: "Program intensif",
    description: "Ruang belajar untuk membaca ulang pola gerak dengan mencatat sumber dan konteksnya.",
  },
  {
    cluster: "Musik & karawitan",
    title: "Pengenalan notasi untuk kolaborasi ansambel",
    format: "Kelas ansambel",
    description: "Latihan menyusun bahasa kerja bersama bagi pemain dari latar musik berbeda.",
  },
  {
    cluster: "Kriya & wastra",
    title: "Pengenalan proses batik tulis",
    format: "Kelas praktik",
    description: "Pembelajaran proses, alat, material, dan etika penggunaan motif.",
  },
];

export const collaborations = [
  {
    field: "Musik & pertunjukan",
    title: "Notasi bersama untuk ansambel lintas tradisi",
    need: "Mencari komposer, pemain musik tradisi, dan peneliti musik.",
  },
  {
    field: "Pedalangan & ilustrasi",
    title: "Eksperimen figur fauna dalam wayang kulit",
    need: "Mencari dalang, perajin kulit, ilustrator fauna, dan penulis cerita.",
  },
  {
    field: "Tari & media",
    title: "Arsip gerak untuk materi belajar",
    need: "Mencari penari, videografer, dan penyusun materi pembelajaran.",
  },
];
