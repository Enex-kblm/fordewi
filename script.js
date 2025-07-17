/**
 * K-Pop Photo Booth Application
 * Aplikasi photo booth dengan tema K-Pop yang memungkinkan pengguna
 * mengambil foto dengan kamera dan menerapkan frame K-Pop
 */

class KPopPhotoBooth {
    constructor() {
        // Canvas dan context untuk manipulasi gambar
        this.canvas = document.getElementById('resultCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.captureCanvas = document.getElementById('captureCanvas');
        this.captureCtx = this.captureCanvas.getContext('2d');
        
        // Video element untuk preview kamera
        this.video = document.getElementById('cameraVideo');
        
        // Template yang sedang aktif
        this.currentTemplate = 'blackpink';
        
        // Status kamera
        this.cameraStream = null;
        this.photoTaken = false;
        
        // Binding event listeners
        this.bindEvents();
        
        // Inisialisasi template
        this.initializeTemplates();
    }

    /**
     * Mengikat event listeners ke elemen DOM
     */
    bindEvents() {
        // Tombol kontrol kamera
        document.getElementById('startCameraBtn').addEventListener('click', () => this.startCamera());
        document.getElementById('captureBtn').addEventListener('click', () => this.capturePhoto());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetCamera());
        
        // Tombol download
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadPhoto());
        
        // Template selection
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => this.selectTemplate(card.dataset.template));
        });
        
        // Modal controls
        document.getElementById('errorOkBtn').addEventListener('click', () => this.hideModal());
        document.querySelector('.modal-close').addEventListener('click', () => this.hideModal());
    }

    /**
     * Inisialisasi template pertama kali
     */
    initializeTemplates() {
        // Set template pertama sebagai aktif
        this.selectTemplate('blackpink');
    }

    /**
     * Memulai akses kamera
     */
    async startCamera() {
        try {
            this.showLoading();
            
            // Request akses kamera
            const constraints = {
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            };

            this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.cameraStream;
            
            // Update button states
            document.getElementById('startCameraBtn').disabled = true;
            document.getElementById('captureBtn').disabled = false;
            
            this.hideLoading();
            
        } catch (error) {
            this.hideLoading();
            this.handleCameraError(error);
        }
    }

    /**
     * Mengambil foto dari video stream
     */
    capturePhoto() {
        if (!this.cameraStream) {
            this.showError('Kamera belum diaktifkan!');
            return;
        }

        try {
            this.showLoading();
            
            // Set ukuran canvas sesuai video
            const videoWidth = this.video.videoWidth;
            const videoHeight = this.video.videoHeight;
            
            this.captureCanvas.width = videoWidth;
            this.captureCanvas.height = videoHeight;
            
            // Gambar frame video ke canvas
            this.captureCtx.drawImage(this.video, 0, 0, videoWidth, videoHeight);
            
            // Terapkan template K-Pop
            this.applyTemplate();
            
            // Update button states
            document.getElementById('captureBtn').disabled = true;
            document.getElementById('resetBtn').disabled = false;
            document.getElementById('downloadBtn').disabled = false;
            
            this.photoTaken = true;
            this.hideLoading();
            
        } catch (error) {
            this.hideLoading();
            this.showError('Gagal mengambil foto: ' + error.message);
        }
    }

    /**
     * Menerapkan template K-Pop ke foto
     */
    applyTemplate() {
        const imageData = this.captureCtx.getImageData(0, 0, this.captureCanvas.width, this.captureCanvas.height);
        
        // Set ukuran result canvas
        this.canvas.width = this.captureCanvas.width;
        this.canvas.height = this.captureCanvas.height;
        
        // Gambar foto asli
        this.ctx.putImageData(imageData, 0, 0);
        
        // Terapkan template berdasarkan pilihan
        this.applyTemplateFrame();
        
        // Tampilkan result canvas
        this.canvas.style.display = 'block';
    }

    /**
     * Menerapkan frame template sesuai pilihan
     */
    applyTemplateFrame() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Simpan context state
        this.ctx.save();
        
        switch (this.currentTemplate) {
            case 'blackpink':
                this.applyBlackPinkFrame(width, height);
                break;
            case 'bts':
                this.applyBTSFrame(width, height);
                break;
            case 'twice':
                this.applyTwiceFrame(width, height);
                break;
            case 'newjeans':
                this.applyNewJeansFrame(width, height);
                break;
            case 'stray-kids':
                this.applyStrayKidsFrame(width, height);
                break;
        }
        
        // Restore context state
        this.ctx.restore();
    }

    /**
     * Template frame BLACKPINK
     */
    applyBlackPinkFrame(width, height) {
        const borderSize = 20;
        
        // Gradient border
        const gradient = this.ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ff1493');
        gradient.addColorStop(1, '#000000');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, borderSize);
        this.ctx.fillRect(0, 0, borderSize, height);
        this.ctx.fillRect(width - borderSize, 0, borderSize, height);
        this.ctx.fillRect(0, height - borderSize, width, borderSize);
        
        // Decorative elements
        this.drawDiamondPattern(width, height);
        this.drawText('BLACKPINK', width / 2, height - 30, '#ffffff', '24px');
    }

    /**
     * Template frame BTS
     */
    applyBTSFrame(width, height) {
        const borderSize = 20;
        
        // Purple gradient border
        const gradient = this.ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#800080');
        gradient.addColorStop(1, '#4b0082');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, borderSize);
        this.ctx.fillRect(0, 0, borderSize, height);
        this.ctx.fillRect(width - borderSize, 0, borderSize, height);
        this.ctx.fillRect(0, height - borderSize, width, borderSize);
        
        // Stars decoration
        this.drawStars(width, height);
        this.drawText('BTS', width / 2, height - 30, '#ffffff', '24px');
    }

    /**
     * Template frame TWICE
     */
    applyTwiceFrame(width, height) {
        const borderSize = 20;
        
        // Colorful gradient border
        const gradient = this.ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(0.33, '#4ecdc4');
        gradient.addColorStop(0.66, '#45b7d1');
        gradient.addColorStop(1, '#96ceb4');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, borderSize);
        this.ctx.fillRect(0, 0, borderSize, height);
        this.ctx.fillRect(width - borderSize, 0, borderSize, height);
        this.ctx.fillRect(0, height - borderSize, width, borderSize);
        
        // Circles decoration
        this.drawCirclePattern(width, height);
        this.drawText('TWICE', width / 2, height - 30, '#ffffff', '24px');
    }

    /**
     * Template frame NewJeans
     */
    applyNewJeansFrame(width, height) {
        const borderSize = 20;
        
        // Light blue gradient border
        const gradient = this.ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(1, '#f0f8ff');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, borderSize);
        this.ctx.fillRect(0, 0, borderSize, height);
        this.ctx.fillRect(width - borderSize, 0, borderSize, height);
        this.ctx.fillRect(0, height - borderSize, width, borderSize);
        
        // Clean squares decoration
        this.drawSquarePattern(width, height);
        this.drawText('NewJeans', width / 2, height - 30, '#333333', '24px');
    }

    /**
     * Template frame Stray Kids
     */
    applyStrayKidsFrame(width, height) {
        const borderSize = 20;
        
        // Red gradient border
        const gradient = this.ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ff4500');
        gradient.addColorStop(1, '#dc143c');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, borderSize);
        this.ctx.fillRect(0, 0, borderSize, height);
        this.ctx.fillRect(width - borderSize, 0, borderSize, height);
        this.ctx.fillRect(0, height - borderSize, width, borderSize);
        
        // Lightning decoration
        this.drawLightningPattern(width, height);
        this.drawText('Stray Kids', width / 2, height - 30, '#ffffff', '24px');
    }

    /**
     * Menggambar pattern diamond untuk BLACKPINK
     */
    drawDiamondPattern(width, height) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 5; i++) {
            const x = (width / 6) * (i + 1);
            const y = 40;
            this.drawDiamond(x, y, 8);
        }
    }

    /**
     * Menggambar diamond shape
     */
    drawDiamond(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x + size, y);
        this.ctx.lineTo(x, y + size);
        this.ctx.lineTo(x - size, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    /**
     * Menggambar bintang untuk BTS
     */
    drawStars(width, height) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * (width - 40) + 20;
            const y = Math.random() * (height - 40) + 20;
            this.drawStar(x, y, 5);
        }
    }

    /**
     * Menggambar bintang
     */
    drawStar(x, y, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const xPos = x + Math.cos(angle) * size;
            const yPos = y + Math.sin(angle) * size;
            if (i === 0) {
                this.ctx.moveTo(xPos, yPos);
            } else {
                this.ctx.lineTo(xPos, yPos);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    /**
     * Menggambar circle pattern untuk TWICE
     */
    drawCirclePattern(width, height) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * (width - 40) + 20;
            const y = Math.random() * (height - 40) + 20;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    /**
     * Menggambar square pattern untuk NewJeans
     */
    drawSquarePattern(width, height) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 6; i++) {
            const x = (width / 7) * (i + 1) - 5;
            const y = 40;
            this.ctx.fillRect(x, y, 10, 10);
        }
    }

    /**
     * Menggambar lightning pattern untuk Stray Kids
     */
    drawLightningPattern(width, height) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
            const x = (width / 4) * (i + 1);
            this.ctx.beginPath();
            this.ctx.moveTo(x, 30);
            this.ctx.lineTo(x + 10, 50);
            this.ctx.lineTo(x - 5, 50);
            this.ctx.lineTo(x + 5, 70);
            this.ctx.stroke();
        }
    }

    /**
     * Menggambar teks dengan styling
     */
    drawText(text, x, y, color, fontSize) {
        this.ctx.fillStyle = color;
        this.ctx.font = `bold ${fontSize} 'Poppins', sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x, y);
    }

    /**
     * Memilih template
     */
    selectTemplate(templateName) {
        this.currentTemplate = templateName;
        
        // Update UI
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('active');
        });
        
        document.querySelector(`[data-template="${templateName}"]`).classList.add('active');
        
        // Jika sudah ada foto, terapkan template baru
        if (this.photoTaken) {
            this.applyTemplate();
        }
    }

    /**
     * Reset kamera dan foto
     */
    resetCamera() {
        // Reset foto
        this.photoTaken = false;
        this.canvas.style.display = 'none';
        
        // Reset button states
        document.getElementById('captureBtn').disabled = false;
        document.getElementById('resetBtn').disabled = true;
        document.getElementById('downloadBtn').disabled = true;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.captureCtx.clearRect(0, 0, this.captureCanvas.width, this.captureCanvas.height);
    }

    /**
     * Download foto hasil
     */
    downloadPhoto() {
        if (!this.photoTaken) {
            this.showError('Belum ada foto untuk didownload!');
            return;
        }

        try {
            // Buat link download
            const link = document.createElement('a');
            link.download = `kpop-photo-${this.currentTemplate}-${Date.now()}.png`;
            link.href = this.canvas.toDataURL('image/png');
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            this.showError('Gagal mendownload foto: ' + error.message);
        }
    }

    /**
     * Handle error kamera
     */
    handleCameraError(error) {
        let message = 'Gagal mengakses kamera. ';
        
        switch (error.name) {
            case 'NotAllowedError':
                message += 'Izin kamera ditolak. Silakan berikan izin akses kamera.';
                break;
            case 'NotFoundError':
                message += 'Kamera tidak ditemukan pada perangkat Anda.';
                break;
            case 'NotReadableError':
                message += 'Kamera sedang digunakan oleh aplikasi lain.';
                break;
            case 'OverconstrainedError':
                message += 'Kamera tidak mendukung resolusi yang diminta.';
                break;
            default:
                message += 'Error: ' + error.message;
        }
        
        this.showError(message);
    }

    /**
     * Tampilkan loading overlay
     */
    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    }

    /**
     * Sembunyikan loading overlay
     */
    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    /**
     * Tampilkan error modal
     */
    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorModal').classList.add('active');
    }

    /**
     * Sembunyikan modal
     */
    hideModal() {
        document.getElementById('errorModal').classList.remove('active');
    }
}

/**
 * Inisialisasi aplikasi saat DOM loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Cek dukungan browser
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Browser Anda tidak mendukung akses kamera. Silakan gunakan browser yang lebih modern.');
        return;
    }

    // Inisialisasi aplikasi
    const app = new KPopPhotoBooth();
    
    // Expose ke window untuk debugging (optional)
    window.photoBooth = app;
});

/**
 * Service Worker registration (optional, untuk PWA)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered: ', registration))
            .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });
}