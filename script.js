// 3C Social Media Post Generator Script

class SocialMediaGenerator {
    constructor() {
        this.canvas = document.getElementById('previewCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.backgroundImages = {}; // Store multiple background images
        this.logoImage = null;
        this.currentBackgroundImage = null;
        
        this.initializeElements();
        this.loadURLParameters(); // Load shared post data
        this.loadAssets();
        this.bindEvents();
        this.initializeCanvas();
    }

    updateBackgroundForTheme() {
        const contentType = this.contentType.value.toLowerCase();
        
        // Try to get theme-specific background
        if (this.backgroundImages[contentType]) {
            this.currentBackgroundImage = this.backgroundImages[contentType];
            console.log(`✓ Using ${contentType}-bg.png`);
        } else if (this.backgroundImages['default']) {
            this.currentBackgroundImage = this.backgroundImages['default'];
            console.log('✓ Using default background (7.png)');
        } else {
            this.currentBackgroundImage = null;
            console.log('⚠ No background images available, using gradient');
        }
    }

    updateThemeStatus() {
        if (!this.themeStatus) return;
        
        const contentType = this.contentType.value.toLowerCase();
        const loadedThemes = Object.keys(this.backgroundImages).filter(key => key !== 'default');
        
        if (this.backgroundImages[contentType]) {
            this.themeStatus.textContent = `✓ Using ${contentType} theme background`;
            this.themeStatus.style.color = '#4CAF50';
        } else if (this.backgroundImages['default']) {
            this.themeStatus.textContent = `Using default background (add ${contentType}-bg.png for theme)`;
            this.themeStatus.style.color = '#FFC107';
        } else {
            this.themeStatus.textContent = 'No background images found - using gradient';
            this.themeStatus.style.color = '#FF9800';
        }
        
        console.log(`Loaded themes: ${loadedThemes.join(', ')}`);
    }

    loadURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check if this is a shared post
        if (urlParams.has('shared')) {
            console.log('📤 Loading shared post...');
            
            // Load all parameters
            const contentType = urlParams.get('type') || 'Quiz';
            const title = urlParams.get('title') || '';
            const description = urlParams.get('desc') || '';
            const linkType = urlParams.get('linkType') || 'landing';
            const linkUrl = urlParams.get('url') || '';
            const imageSize = urlParams.get('size') || 'instagram-square';
            
            // Populate form fields
            this.contentType.value = contentType;
            this.title.value = decodeURIComponent(title);
            this.description.value = decodeURIComponent(description);
            this.linkType.value = linkType;
            this.linkUrl.value = decodeURIComponent(linkUrl);
            this.imageSize.value = imageSize;
            
            console.log('✅ Shared post loaded successfully');
            
            // Show shared post indicator
            this.showSharedPostNotification();
        }
    }

    showSharedPostNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'shared-post-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">🔗</span>
                <span class="notification-text">Viewing shared post</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Insert at top of container
        const container = document.querySelector('.container');
        container.insertBefore(notification, container.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    generateShareableURL() {
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();
        
        // Add all current form values
        params.set('shared', '1');
        params.set('type', this.contentType.value);
        params.set('title', encodeURIComponent(this.title.value));
        params.set('desc', encodeURIComponent(this.description.value));
        params.set('linkType', this.linkType.value);
        params.set('url', encodeURIComponent(this.linkUrl.value));
        params.set('size', this.imageSize.value);
        
        return `${baseUrl}?${params.toString()}`;
    }

    // NEW: Generate Interactive Post URL
    generateInteractivePostURL() {
        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '') + 'embed.html';
        const params = new URLSearchParams();
        
        // Add parameters for interactive post
        params.set('embedded', '1');
        params.set('type', this.contentType.value);
        params.set('title', encodeURIComponent(this.title.value));
        params.set('desc', encodeURIComponent(this.description.value));
        params.set('linkType', this.linkType.value);
        params.set('url', encodeURIComponent(this.linkUrl.value));
        params.set('size', this.imageSize.value);
        
        return `${baseUrl}?${params.toString()}`;
    }

    async sharePost() {
        const shareUrl = this.generateShareableURL();
        
        // Copy to clipboard
        try {
            await navigator.clipboard.writeText(shareUrl);
            
            // Show success message
            const originalText = this.shareBtn.textContent;
            this.shareBtn.textContent = 'URL Copied! ✓';
            this.shareBtn.style.background = '#4CAF50';
            
            setTimeout(() => {
                this.shareBtn.textContent = originalText;
                this.shareBtn.style.background = '#61d8e6';
            }, 3000);
            
            console.log('📋 Share URL copied to clipboard:', shareUrl);
            
        } catch (err) {
            // Fallback: Show URL in prompt for manual copying
            const userCopy = prompt('Copy this shareable URL:', shareUrl);
            console.log('📋 Share URL generated:', shareUrl);
        }
        
        // Also show the URL in console for easy access
        console.log('🔗 Shareable URL:', shareUrl);
    }

    // NEW: Forward as Interactive Post
    async forwardInteractivePost() {
        const interactiveUrl = this.generateInteractivePostURL();
        
        // Copy to clipboard
        try {
            await navigator.clipboard.writeText(interactiveUrl);
            
            // Show success message
            const originalText = this.forwardBtn.textContent;
            this.forwardBtn.textContent = 'Interactive URL Copied! ✓';
            this.forwardBtn.style.background = '#4CAF50';
            
            setTimeout(() => {
                this.forwardBtn.textContent = originalText;
                this.forwardBtn.style.background = '#ff6b6b';
            }, 3000);
            
            console.log('📋 Interactive post URL copied to clipboard:', interactiveUrl);
            
            // Also open a preview
            window.open(interactiveUrl, '_blank', 'width=800,height=800');
            
        } catch (err) {
            // Fallback: Show URL in prompt for manual copying
            const userCopy = prompt('Copy this interactive post URL:', interactiveUrl);
            console.log('📋 Interactive post URL generated:', interactiveUrl);
        }
        
        console.log('🎨 Interactive Post URL:', interactiveUrl);
        console.log('💡 This URL displays your post as an interactive image with working button!');
        console.log('🔗 Use this URL in your dashboard at: https://threadcommand.center/dashboard/content');
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
        this.shareBtn = document.getElementById('sharePost');
        this.forwardBtn = document.getElementById('forwardPost'); // NEW
        this.generateDescBtn = document.getElementById('generateDesc');
        this.themeStatus = document.getElementById('themeStatus');
    }

    async loadAssets() {
        try {
            // Load logo first
            this.logoImage = await this.loadImage('./assets/logo.png');
            
            // Define theme background images
            const themes = ['quiz', 'game', 'puzzle', 'challenge', 'assessment', 'workshop', 'course', 'tool'];
            
            // Load all theme backgrounds
            for (const theme of themes) {
                try {
                    this.backgroundImages[theme] = await this.loadImage(`./assets/${theme}-bg.png`);
                    console.log(`✓ Loaded ${theme}-bg.png`);
                } catch (error) {
                    console.warn(`⚠ Could not load ${theme}-bg.png, will use fallback`);
                }
            }
            
            // Load default fallback background
            try {
                this.backgroundImages['default'] = await this.loadImage('./assets/7.png');
                console.log('✓ Loaded default background (7.png)');
            } catch (error) {
                console.warn('⚠ Could not load default background');
            }
            
            console.log('Assets loading completed');
            this.updateBackgroundForTheme(); // Set initial background
            this.updatePreview(); // Refresh preview once images load
            this.updateThemeStatus(); // Update status display
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

        // Content type change handler - update background
        this.contentType.addEventListener('change', () => {
            this.updateBackgroundForTheme();
            this.updateThemeStatus();
            this.updatePreview();
        });

        // Link type change handler
        this.linkType.addEventListener('change', () => this.handleLinkTypeChange());

        // Generate description
        this.generateDescBtn.addEventListener('click', () => this.generateDescription());

        // Generate post
        this.generateBtn.addEventListener('click', () => this.generatePost());

        // Download post
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        
        // Share post URL
        this.shareBtn.addEventListener('click', () => this.sharePost());
        
        // NEW: Forward as Interactive Post
        if (this.forwardBtn) {
            this.forwardBtn.addEventListener('click', () => this.forwardInteractivePost());
        }
        
        // Canvas click handler for button
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // Add cursor pointer on button hover
        this.canvas.addEventListener('mousemove', (e) => this.handleCanvasHover(e));
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
        
        if (this.currentBackgroundImage) {
            // Draw the theme-specific background image
            ctx.drawImage(this.currentBackgroundImage, 0, 0, canvas.width, canvas.height);
            
            // Add subtle overlay for better text visibility
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(35, 13, 58, 0.3)');
            gradient.addColorStop(0.5, 'rgba(74, 26, 92, 0.2)');
            gradient.addColorStop(1, 'rgba(45, 14, 64, 0.3)');
            
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
        
        // Store button coordinates for click detection
        this.buttonBounds = {
            x: x - width / 2,
            y: y - height / 2,
            width: width,
            height: height
        };
    }

    drawContactInfo(x, y, fontSize) {
        const ctx = this.ctx;
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // Brand name in gold
        const line1 = '3C Thread To Success';
        ctx.fillStyle = '#997a64';
        ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
        ctx.fillText(line1, x, y);
        
        // Contact info in cyan
        const line2 = 'www.3c-innergrowth.com | 3c.innertherapy@gmail.com';
        ctx.fillStyle = '#61d8e6';
        ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
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
    
    handleCanvasClick(e) {
        if (!this.buttonBounds) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        // Check if click is within button bounds
        if (x >= this.buttonBounds.x && 
            x <= this.buttonBounds.x + this.buttonBounds.width &&
            y >= this.buttonBounds.y && 
            y <= this.buttonBounds.y + this.buttonBounds.height) {
            
            this.openLandingPage();
        }
    }
    
    handleCanvasHover(e) {
        if (!this.buttonBounds) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        // Check if hover is over button
        if (x >= this.buttonBounds.x && 
            x <= this.buttonBounds.x + this.buttonBounds.width &&
            y >= this.buttonBounds.y && 
            y <= this.buttonBounds.y + this.buttonBounds.height) {
            
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'default';
        }
    }
    
    openLandingPage() {
        let url = this.linkUrl.value;
        
        // If no URL provided, use default based on link type
        if (!url) {
            const linkType = this.linkType.value;
            switch (linkType) {
                case 'landing':
                    url = 'https://anica-blip.github.io/3c-quiz-admin/landing.html?quiz=quiz.01';
                    break;
                case 'canva':
                    url = 'https://canva.com';
                    break;
                case 'notion':
                    url = 'https://notion.so';
                    break;
                default:
                    url = 'https://www.3c-innergrowth.com';
            }
        }
        
        // Open in new tab
        window.open(url, '_blank');
        
        // Track click for shared posts
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('shared')) {
            console.log('🎯 Shared post button clicked - redirecting to:', url);
        }
    }
}

// Initialize the generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SocialMediaGenerator();
});

