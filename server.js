const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const port = 1600;

// Buat folder jika belum ada
const dirs = ['uploads', 'outputs', 'public'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

// lokasi exe
const exe = "C:/Users/Administrator/Downloads/Project/waifu2x-node/waifu2x-ncnn-vulkan.exe";

// upload config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Fungsi untuk membersihkan file lama
function cleanupOldFiles(maxAge = 3600000) { // default 1 jam
  const now = Date.now();
  
  // Bersihkan folder uploads
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      console.error('Error membaca folder uploads:', err);
      return;
    }
    
    files.forEach(file => {
      const filePath = path.join('uploads/', file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error mendapatkan stat file:', err);
          return;
        }
        
        const fileAge = now - stats.mtimeMs;
        if (fileAge > maxAge) {
          fs.unlink(filePath, err => {
            if (err) {
              console.error('Error menghapus file upload lama:', err);
            } else {
              console.log(`File upload lama dihapus: ${file}`);
            }
          });
        }
      });
    });
  });
  
  // Bersihkan folder outputs
  fs.readdir('outputs/', (err, files) => {
    if (err) {
      console.error('Error membaca folder outputs:', err);
      return;
    }
    
    files.forEach(file => {
      const filePath = path.join('outputs/', file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error mendapatkan stat file:', err);
          return;
        }
        
        const fileAge = now - stats.mtimeMs;
        if (fileAge > maxAge) {
          fs.unlink(filePath, err => {
            if (err) {
              console.error('Error menghapus file output lama:', err);
            } else {
              console.log(`File output lama dihapus: ${file}`);
            }
          });
        }
      });
    });
  });
}

// Jalankan pembersihan setiap 30 menit
setInterval(() => cleanupOldFiles(), 30 * 60 * 1000);

// static web
app.use(express.static('public'));
app.use('/outputs', express.static('outputs'));
app.use('/uploads', express.static('uploads'));

// API upscale dengan parameter
app.post('/upscale', upload.single('image'), (req, res) => {
  const input = path.resolve(req.file.path);
  const originalFilename = req.file.originalname;
  const outputFilename = `upscaled_${req.file.filename}`;
  const output = path.resolve(`outputs/${outputFilename}`);

  // Ambil parameter dari request body
  const scale = req.body.scale || 2;
  const denoise = req.body.denoise || 1;
  const format = req.body.format || 'png';
  const model = req.body.model || 'models-upconv_7_anime_style_art_rgb';

  // Validasi parameter
  const validScales = [1, 2, 4, 8, 16, 32];
  const validDenoise = [0, 1, 2, 3];
  const validFormats = ['png', 'jpg', 'webp'];
  const validModels = [
    'models-cunet',
    'models-upconv_7_anime_style_art_rgb',
    'models-upconv_7_photo'
  ];

  const scaleValue = validScales.includes(parseInt(scale)) ? scale : 2;
  const denoiseValue = validDenoise.includes(parseInt(denoise)) ? denoise : 1;
  const formatValue = validFormats.includes(format) ? format : 'png';
  const modelValue = validModels.includes(model) ? model : 'models-upconv_7_anime_style_art_rgb';

  // Bangun command
  let cmd = `"${exe}" -i "${input}" -o "${output}"`;
  
  if (scaleValue != 2) cmd += ` -s ${scaleValue}`;
  if (denoiseValue > 0) cmd += ` -n ${denoiseValue}`;
  cmd += ` -f ${formatValue}`;
  if (modelValue != 'models-upconv_7_anime_style_art_rgb') cmd += ` -m ${modelValue}`;

  console.log("RUN:", cmd);
  console.log(`Parameters: Scale=${scaleValue}x, Denoise=${denoiseValue}, Format=${formatValue}, Model=${modelValue}`);

  const startTime = Date.now();

  exec(cmd, (err, stdout, stderr) => {
    const endTime = Date.now();
    const processingTime = ((endTime - startTime) / 1000).toFixed(2);

    if (err) {
      console.error(err);
      
      // Hapus file input jika gagal
      fs.unlink(input, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error menghapus file input setelah gagal:', unlinkErr);
        } else {
          console.log('File input dihapus karena proses gagal:', path.basename(input));
        }
      });
      
      return res.status(500).json({ 
        error: "Upscale gagal", 
        details: err.message,
        stderr: stderr
      });
    }

    // Dapatkan ukuran file hasil
    const stats = fs.statSync(output);
    const fileSize = stats.size;

    // Hapus file input (original) setelah sukses
    fs.unlink(input, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error menghapus file input:', unlinkErr);
      } else {
        console.log('File input berhasil dihapus:', path.basename(input));
      }
    });

    res.json({
      originalImage: `/uploads/${path.basename(input)}`, // Ini akan tetap bisa diakses sampai browser selesai loading
      upscaledImage: `/outputs/${outputFilename}`,
      originalName: originalFilename,
      outputName: outputFilename,
      parameters: {
        scale: scaleValue,
        denoise: denoiseValue,
        format: formatValue,
        model: modelValue
      },
      processingTime: processingTime,
      fileSize: fileSize,
      filesCleaned: {
        input: true,
        message: 'File original telah dihapus dari server'
      }
    });
  });
});

// API untuk mendapatkan informasi parameter yang tersedia
app.get('/api/parameters', (req, res) => {
  res.json({
    scales: [1, 2, 4, 8, 16, 32],
    denoiseLevels: [0, 1, 2, 3],
    formats: ['png', 'jpg', 'webp'],
    models: [
      { id: 'models-cunet', name: 'CUNET (Anime)', description: 'Terbaik untuk anime' },
      { id: 'models-upconv_7_anime_style_art_rgb', name: 'Upconv 7 Anime', description: 'Recommended untuk anime' },
      { id: 'models-upconv_7_photo', name: 'Upconv 7 Photo', description: 'Untuk foto/real image' }
    ],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    cleanup: {
      autoCleanup: true,
      maxAge: '1 jam',
      description: 'File lama akan otomatis dihapus'
    }
  });
});

// API untuk membersihkan semua file (manual cleanup)
app.post('/api/cleanup', (req, res) => {
  cleanupOldFiles(0); // Hapus semua file
  res.json({ message: 'Pembersihan file dimulai' });
});

// Fungsi untuk mendapatkan IP lokal
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// Jalankan server di semua interface (0.0.0.0)
app.listen(port, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log('\n🚀 Waifu2x Upscaler berjalan!');
  console.log('📱 Local:   http://localhost:' + port);
  console.log('🌐 LAN:     http://' + localIP + ':' + port);
  console.log('\n💡 Parameter yang tersedia:');
  console.log('   - Scale: 1x, 2x, 4x, 8x, 16x, 32x');
  console.log('   - Denoise: Level 0-3');
  console.log('   - Format: PNG, JPG, WebP');
  console.log('   - Model: Anime/Photo\n');
  console.log('🧹 Auto-cleanup: File lama akan dihapus setiap 30 menit');
  console.log('   File input langsung dihapus setelah proses selesai\n');
});