# Waifu2x Material Upscaler 🚀

![Version](https://img.shields.io/badge/version-3.0-blue)
![Material Design](https://img.shields.io/badge/Material%20Design-3-purple)
![Node](https://img.shields.io/badge/node-%3E%3D14-green)

Aplikasi web modern untuk upscaling gambar menggunakan Waifu2x dengan antarmuka Material Design 3. Mendukung akses lokal dan LAN, auto-cleanup, serta berbagai parameter pengaturan.

![Screenshot](screenshot.png)

## ✨ Fitur Utama

- 🎨 **Material Design 3** - Antarmuka modern dengan dark mode support
- 📱 **Akses LAN** - Bisa diakses dari perangkat lain dalam jaringan
- 🔧 **Pengaturan Lengkap** - Scale, denoise, format output, dan model AI
- 🧹 **Auto-cleanup** - File otomatis dihapus setelah diproses
- 📊 **Progress Bar** - Visualisasi proses real-time
- ⌨️ **Keyboard Shortcuts** - Navigasi cepat dengan keyboard
- 🌓 **Dark Mode** - Otomatis mengikuti preferensi sistem

## 🛠️ Parameter yang Didukung

| Parameter | Nilai | Deskripsi |
|-----------|-------|-----------|
| Scale | 1x, 2x, 4x, 8x, 16x, 32x | Perbesaran gambar |
| Denoise | Level 0-3 | Pengurangan noise |
| Format | PNG, JPG, WebP | Format output |
| Model | CUNET, Upconv 7 Anime, Upconv 7 Photo | Model AI yang digunakan |

## 📋 Prasyarat

- Node.js 14 atau lebih tinggi
- Waifu2x NCNN Vulkan ([Download](https://github.com/nihui/waifu2x-ncnn-vulkan/releases))
- Windows/Linux/MacOS

## 🚀 Instalasi

1. **Clone repository**
```bash
git clone https://github.com/username/waifu2x-material-upscaler.git
cd waifu2x-material-upscaler
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Waifu2x**
   - Download waifu2x-ncnn-vulkan dari [releases](https://github.com/nihui/waifu2x-ncnn-vulkan/releases)
   - Extract ke folder `waifu2x-ncnn-vulkan`
   - Salin path executable ke konfigurasi

4. **Konfigurasi**
```bash
cp .env.example .env
# Edit .env sesuai path waifu2x Anda
```

5. **Jalankan aplikasi**
```bash
npm start
# atau untuk development dengan auto-reload
npm run dev
```

6. **Buka browser**
   - Local: http://localhost:3000
   - LAN: http://[IP-ANDA]:3000

## ⚙️ Konfigurasi

Edit file `.env` untuk mengatur:

```env
PORT=3000
WAIFU2X_PATH=C:/path/to/waifu2x-ncnn-vulkan.exe
MAX_FILE_SIZE=10485760
CLEANUP_INTERVAL=1800000
FILE_MAX_AGE=3600000
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Fungsi |
|----------|--------|
| `Ctrl + O` | Pilih file |
| `Ctrl + Enter` | Mulai upscale |
| `Ctrl + Shift + D` | Bersihkan file lama |

## 📁 Struktur File

```
📦 waifu2x-material-upscaler
├── 📂 public/          # File statis (HTML, CSS, JS)
├── 📂 uploads/         # Temporary upload files
├── 📂 outputs/         # Hasil upscale
├── server.js           # Main server
├── package.json        # Dependencies
└── README.md           # Dokumentasi
```

## 🔒 Keamanan & Privasi

- ✅ File input langsung dihapus setelah diproses
- ✅ Auto-cleanup file lama setiap 30 menit
- ✅ Tidak ada data yang dikirim ke server eksternal
- ✅ Proses 100% lokal

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan:

1. Fork repository
2. Buat branch baru (`git checkout -b fitur-keren`)
3. Commit perubahan (`git commit -m 'Tambah fitur keren'`)
4. Push ke branch (`git push origin fitur-keren`)
5. Buat Pull Request

## 📝 Lisensi

MIT License - lihat file [LICENSE](LICENSE) untuk detail

## 🙏 Kredit

- [Waifu2x NCNN Vulkan](https://github.com/nihui/waifu2x-ncnn-vulkan) - Engine upscale
- [Material Design 3](https://m3.material.io/) - Design system
- [Express.js](https://expressjs.com/) - Web framework

## 📧 Kontak

- GitHub: [@Huokaaa](https://github.com/huokaaa)
- Email: huokaaa@example.com

---

⭐ **Berikan bintang jika proyek ini bermanfaat!**
