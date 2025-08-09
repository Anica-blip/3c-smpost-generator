// 3C Social Media Post Generator Script

class SocialMediaGenerator {
    constructor() {
        this.canvas = document.getElementById('previewCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.backgroundImage = null;
        this.logoImage = null;
        
        this.initializeElements();
        this.loadAssets();
        this.bindEvents();
        this.initializeCanvas();
    }

    initializeElements() {
        this.contentType = document.getElementById('contentType');
        this.title = document.getElementById('title');
        this.description = document.getElementById('description');
        this.linkType = document.getElementById('linkType');
        this.linkUrl = document.getElementById('linkUrl');
        this.imageSize = document.getElementById('imageSize');
        this.generateBtn = document.getElementById('generatePost');
        this.downloadBtn = document.getElementById('downloadPost');
        this.generateDescBtn = document.getElementById('generateDesc');
    }

    async loadAssets() {
        try {
            // Load background image
            this.backgroundImage = await this.loadImage('assets/7.png');
            
            // Load logo
            this.logoImage = await this.loadImage('assets/logo.png');
            
            console.log('Assets loaded successfully');
        } catch (error) {
            console.warn('Some assets failed to load:', error);
            // Continue without assets - will use fallback colors
        }
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    bindEvents() {
        // Auto-update preview on input changes
        [this.contentType, this.title, this.description, this.imageSize].forEach(element => {
            element.addEventListener('input', () => this.updatePreview());
            element.addEventListener('change', () => this.updatePreview());
        });

        // Link type change handler
        this.linkType.addEventListener('change', () => this.handleLinkTypeChange());

        // Generate description
        this.generateDescBtn.addEventListener('click', () => this.generateDescription());

        // Generate post
        this.generateBtn.addEventListener('click', () => this.generatePost());

        // Download post
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
    }

    handleLinkTypeChange() {
        const linkType = this.linkType.value;
        const linkUrl = this.linkUrl;

        switch (linkType) {
            case 'landing':
                linkUrl.placeholder = 'https://anica-blip.github.io/3c-quiz-admin/landing.html?quiz=quiz.01';
                linkUrl.value = '';
                break;
            case 'canva':
                linkUrl.placeholder = 'https://canva.com/design/your-design-id';
                linkUrl.value = '';
                break;
            case 'notion':
                linkUrl.placeholder = 'https://notion.so/your-page';
                linkUrl.value = '';
                break;
            case 'custom':
                linkUrl.placeholder = 'https://your-custom-url.com';
                linkUrl.value = '';
                break;
        }
    }

    generateDescription() {
        const contentType = this.contentType.value;
        const title = this.title.value || 'Your Amazing Content';
        
        const descriptions = {
            'Quiz': [
                `Ready to discover something amazing about yourself? This ${title.toLowerCase()} will reveal insights you never knew you had!`,
                `Curious about your hidden strengths? Take this quiz and unlock your potential with personalized insights!`,
                `Think you know yourself well? This quiz might surprise you with what it reveals about your unique qualities!`
            ],
            'Game': [
                `Get ready for an exciting challenge! This game combines fun with personal growth in unexpected ways.`,
                `Ready to play your way to new insights? This interactive experience is more than just entertainment!`,
                `Challenge accepted! This game will test your skills while helping you discover something new about yourself.`
            ],
            'Puzzle': [
                `Love solving puzzles? This one comes with a twist - you'll learn something valuable about yourself too!`,
                `Ready for a mental challenge? This puzzle will engage your mind and reveal surprising insights!`,
                `Think outside the box with this unique puzzle that combines problem-solving with self-discovery!`
            ],
            'Challenge': [
                `Are you up for this challenge? It's designed to push your boundaries and unlock new potential!`,
                `Ready to step outside your comfort zone? This challenge will transform how you see yourself!`,
                `Think you've got what it takes? This challenge will test your limits and reveal your true strengths!`
            ],
            'Assessment': [
                `Get personalized insights with this comprehensive assessment designed just for you!`,
                `Ready to understand yourself better? This assessment provides detailed insights into your unique qualities!`,
                `Discover your strengths and growth areas with this thoughtfully designed assessment!`
            ]
        };

        const typeDescriptions = descriptions[contentType] || descriptions['Quiz'];
        const randomDescription = typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
        
        this.description.value = randomDescription;
        this.updatePreview();
    }

    initializeCanvas() {
        this.setCanvasSize();
        this.updatePreview();
    }

    setCanvasSize() {
        const size = this.imageSize.value;
        const dimensions = this.getSizeDimensions(size);
        
        this.canvas.width = dimensions.width;
        this.canvas.height = dimensions.height;
    }

    getSizeDimensions(size) {
        const dimensions = {
            'instagram-square': { width: 1080, height: 1080 },
            'instagram-story': { width: 1080, height: 1920 },
            'facebook-post': { width: 1200, height: 630 },
            'twitter-post': { width: 1200, height: 675 },
            'linkedin-post': { width: 1200, height: 627 }
        };
        
        return dimensions[size] || dimensions['instagram-square'];
    }

    updatePreview() {
        this.setCanvasSize();
        this.drawCanvas();
    }

    drawCanvas() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Draw content
        this.drawContent();
        
        // Enable download button
        this.downloadBtn.disabled = false;
    }

    drawBackground() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        if (this.backgroundImage) {
            // Draw the loaded background image
            ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
            
            // Add overlay for better text visibility
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(35, 13, 58, 0.8)');
            gradient.addColorStop(0.5, 'rgba(74, 26, 92, 0.6)');
            gradient.addColorStop(1, 'rgba(45, 14, 64, 0.8)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            // Fallback gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#230d3a');
            gradient.addColorStop(0.5, '#4a1a5c');
            gradient.addColorStop(1, '#2d0e40');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    drawContent() {
        const canvas = this.canvas;
        const isSquare = canvas.width === canvas.height;
        const isStory = canvas.height > canvas.width;
        
        let logoSize, logoY, contentTypeY, titleY, descY, buttonY, contactY;
        let titleFontSize, descFontSize, contentTypeFontSize;
        
        // Responsive sizing based on canvas dimensions
        if (isStory) {
            // Instagram Story layout
            logoSize = canvas.width * 0.15;
            logoY = canvas.height * 0.1;
            contentTypeY = logoY + logoSize + (canvas.height * 0.08);
            titleY = contentTypeY + (canvas.height * 0.1);
            descY = titleY + (canvas.height * 0.25);
            buttonY = canvas.height * 0.75;
            contactY = canvas.height * 0.85;
            
            titleFontSize = Math.floor(canvas.width * 0.06);
            descFontSize = Math.floor(canvas.width * 0.035);
            contentTypeFontSize = Math.floor(canvas.width * 0.04);
        } else if (isSquare) {
            // Instagram Square layout
            logoSize = canvas.width * 0.12;
            logoY = canvas.height * 0.08;
            contentTypeY = logoY + logoSize + (canvas.height * 0.06);
            titleY = contentTypeY + (canvas.height * 0.08);
            descY = titleY + (canvas.height * 0.2);
            buttonY = canvas.height * 0.72;
            contactY = canvas.height * 0.85;
            
            titleFontSize = Math.floor(canvas.width * 0.05);
            descFontSize = Math.floor(canvas.width * 0.032);
            contentTypeFontSize = Math.floor(canvas.width * 0.035);
        } else {
            // Landscape layout (Facebook, Twitter, LinkedIn)
            logoSize = canvas.height * 0.2;
            logoY = canvas.height * 0.1;
            contentTypeY = logoY + logoSize + (canvas.height * 0.05);
            titleY = contentTypeY + (canvas.height * 0.08);
            descY = titleY + (canvas.height * 0.2);
            buttonY = canvas.height * 0.75;
            contactY = canvas.height * 0.9;
            
            titleFontSize = Math.floor(canvas.height * 0.08);
            descFontSize = Math.floor(canvas.height * 0.045);
            contentTypeFontSize = Math.floor(canvas.height * 0.05);
        }
        
        // Draw logo
        this.drawLogo(canvas.width / 2, logoY, logoSize);
        
        // Draw content type
        this.drawContentType(canvas.width / 2, contentTypeY, contentTypeFontSize);
        
        // Draw title
        this.drawTitle(canvas.width / 2, titleY, titleFontSize, canvas.width * 0.85);
        
        // Draw description
        this.drawDescription(canvas.width / 2, descY, descFontSize, canvas.width * 0.85);
        
        // Draw button
        this.drawButton(canvas.width / 2, buttonY, canvas.width * 0.4);
        
        // Draw contact info
        this.drawContactInfo(canvas.width / 2, contactY, Math.floor(canvas.width * 0.025));
    }

    drawLogo(x, y, size) {
        const ctx = this.ctx;
        
        if (this.logoImage) {
            // Draw logo with gold border
            ctx.save();
            
            // Create circular clipping path
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
            ctx.clip();
            
            // Draw logo image
            ctx.drawImage(
                this.logoImage,
                x - size / 2,
                y - size / 2,
                size,
                size
            );
            
            ctx.restore();
            
            // Draw gold border
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
            ctx.strokeStyle = '#997a64';
            ctx.lineWidth = 4;
            ctx.stroke();
        } else {
            // Fallback: Draw placeholder circle
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
            ctx.fillStyle = '#997a64';
            ctx.fill();
            ctx.strokeStyle = '#997a64';
            ctx.lineWidth = 4;
            ctx.stroke();
            
            // Add "3C" text
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${size * 0.3}px Livvic, Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('3C', x, y);
        }
    }

    drawContentType(x, y, fontSize) {
        const ctx = this.ctx;
        const contentType = this.contentType.value;
        
        ctx.fillStyle = '#61d8e6';
        ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(contentType.toUpperCase(), x, y);
    }

    drawTitle(x, y, fontSize, maxWidth) {
        const ctx = this.ctx;
        const title = this.title.value || 'Your Amazing Title Here';
        
        ctx.fillStyle = '#a49079';
        ctx.font = `bold ${fontSize}px Arimo, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // Add glow effect
        ctx.shadowColor = '#a49079';
        ctx.shadowBlur = 20;
        
        this.wrapText(ctx, title, x, y, maxWidth, fontSize * 1.2);
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }

    drawDescription(x, y, fontSize, maxWidth) {
        const ctx = this.ctx;
        const description = this.description.value || 'Discover something amazing about yourself with this interactive experience designed just for you!';
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        this.wrapText(ctx, description, x, y, maxWidth, fontSize * 1.4);
    }

    drawButton(x, y, width) {
        const ctx = this.ctx;
        const height = width * 0.2;
        const radius = height / 2;
        
        // Draw button background
        ctx.fillStyle = '#997a64';
        ctx.beginPath();
        ctx.roundRect(x - width / 2, y - height / 2, width, height, radius);
        ctx.fill();
        
        // Add button shadow
        ctx.shadowColor = 'rgba(153, 122, 100, 0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 5;
        
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw button text
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${height * 0.4}px Inter, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GO IN', x, y);
    }

    drawContactInfo(x, y, fontSize) {
        const ctx = this.ctx;
        
        ctx.fillStyle = '#61d8e6';
        ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        const line1 = '3C Thread To Success';
        const line2 = 'www.3c-innergrowth.com | 3c.innertherapy@gmail.com';
        
        ctx.fillText(line1, x, y);
        ctx.fillText(line2, x, y + fontSize * 1.5);
    }

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
    }

    generatePost() {
        this.updatePreview();
        
        // Show success message
        const originalText = this.generateBtn.textContent;
        this.generateBtn.textContent = 'Generated! ✓';
        this.generateBtn.style.background = '#4CAF50';
        
        setTimeout(() => {
            this.generateBtn.textContent = originalText;
            this.generateBtn.style.background = '#997a64';
        }, 2000);
    }

    downloadImage() {
        const canvas = this.canvas;
        const contentType = this.contentType.value;
        const title = this.title.value || 'social-post';
        const size = this.imageSize.value;
        
        // Clean filename
        const cleanTitle = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const filename = `3c-${contentType.toLowerCase()}-${cleanTitle}-${size}.png`;
        
        // Create download link
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // Show success message
            const originalText = this.downloadBtn.textContent;
            this.downloadBtn.textContent = 'Downloaded! ✓';
            this.downloadBtn.style.background = '#4CAF50';
            
            setTimeout(() => {
                this.downloadBtn.textContent = originalText;
                this.downloadBtn.style.background = 'rgba(97, 216, 230, 0.2)';
            }, 2000);
        });
    }
}

// Initialize the generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SocialMediaGenerator();
});
