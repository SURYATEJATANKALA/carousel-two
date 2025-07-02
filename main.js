// Enhanced Bootstrap Video Hero Carousel with Advanced Features

document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('#heroCarousel');
  const videos = document.querySelectorAll('.video-container video');
  
  // Initialize Bootstrap carousel
  const bootstrapCarousel = new bootstrap.Carousel(carousel, {
    interval: 5000,
    ride: 'carousel',
    pause: 'hover',
    wrap: true,
    keyboard: true,
    touch: true
  });

  // Preload videos for better performance
  function preloadVideos() {
    videos.forEach((video, index) => {
      if (index === 0) {
        video.play().catch(e => console.log('Autoplay prevented:', e));
      } else {
        video.load();
      }
    });
  }

  // Handle video playback on slide change
  function handleVideoPlayback() {
    carousel.addEventListener('slide.bs.carousel', function(e) {
      // Pause all videos
      videos.forEach(video => {
        video.pause();
      });
    });

    carousel.addEventListener('slid.bs.carousel', function(e) {
      // Play video in active slide
      const activeSlide = e.target.querySelector('.carousel-item.active');
      const activeVideo = activeSlide.querySelector('video');
      
      if (activeVideo) {
        activeVideo.currentTime = 0;
        activeVideo.play().catch(e => console.log('Video play failed:', e));
      }

      // Reset and trigger animations
      resetAnimations(activeSlide);
      triggerAnimations(activeSlide);
    });
  }

  // Reset animations when slide changes
  function resetAnimations(slide) {
    const animatedElements = slide.querySelectorAll('[class*="animate-"]');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.animation = 'none';
    });
  }

  // Trigger animations with staggered delays
  function triggerAnimations(slide) {
    const animatedElements = slide.querySelectorAll('[class*="animate-"]');
    
    setTimeout(() => {
      animatedElements.forEach((el, index) => {
        setTimeout(() => {
          el.style.animation = '';
          el.style.opacity = '';
        }, index * 200);
      });
    }, 100);
  }

  // Handle intersection observer for better performance
  function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target.querySelector('video');
          if (video && entry.target.classList.contains('active')) {
            video.play().catch(e => console.log('Video play failed:', e));
          }
        } else {
          const video = entry.target.querySelector('video');
          if (video) {
            video.pause();
          }
        }
      });
    }, {
      threshold: 0.5
    });

    document.querySelectorAll('.carousel-item').forEach(item => {
      observer.observe(item);
    });
  }

  // Handle touch gestures for mobile
  function setupTouchControls() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    carousel.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    carousel.addEventListener('touchend', function(e) {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Only handle horizontal swipes (ignore vertical scrolling)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          bootstrapCarousel.prev();
        } else {
          bootstrapCarousel.next();
        }
      }
    });
  }

  // Handle keyboard navigation
  function setupKeyboardControls() {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        bootstrapCarousel.prev();
      } else if (e.key === 'ArrowRight') {
        bootstrapCarousel.next();
      } else if (e.key === ' ') {
        e.preventDefault();
        const isPaused = carousel.querySelector('.carousel').classList.contains('paused');
        if (isPaused) {
          bootstrapCarousel.cycle();
          carousel.querySelector('.carousel').classList.remove('paused');
        } else {
          bootstrapCarousel.pause();
          carousel.querySelector('.carousel').classList.add('paused');
        }
      }
    });
  }

  // Handle video loading errors
  function setupVideoErrorHandling() {
    videos.forEach(video => {
      video.addEventListener('error', function() {
        console.log('Video failed to load, showing fallback image');
        const fallbackImg = video.nextElementSibling;
        if (fallbackImg && fallbackImg.tagName === 'IMG') {
          video.style.display = 'none';
          fallbackImg.style.display = 'block';
        }
      });

      video.addEventListener('loadeddata', function() {
        console.log('Video loaded successfully');
        const fallbackImg = video.nextElementSibling;
        if (fallbackImg && fallbackImg.tagName === 'IMG') {
          fallbackImg.style.display = 'none';
        }
      });
    });
  }

  // Handle window resize for responsive video
  function setupResponsiveVideo() {
    function adjustVideoSize() {
      videos.forEach(video => {
        const container = video.parentElement;
        const containerRatio = container.offsetWidth / container.offsetHeight;
        const videoRatio = video.videoWidth / video.videoHeight;
        
        if (containerRatio > videoRatio) {
          video.style.width = '100%';
          video.style.height = 'auto';
        } else {
          video.style.width = 'auto';
          video.style.height = '100%';
        }
      });
    }

    window.addEventListener('resize', adjustVideoSize);
    
    // Initial adjustment
    videos.forEach(video => {
      video.addEventListener('loadedmetadata', adjustVideoSize);
    });
  }

  // Initialize all features
  function init() {
    preloadVideos();
    handleVideoPlayback();
    setupIntersectionObserver();
    setupTouchControls();
    setupKeyboardControls();
    setupVideoErrorHandling();
    setupResponsiveVideo();
    
    // Initial animation trigger for first slide
    const firstSlide = document.querySelector('.carousel-item.active');
    if (firstSlide) {
      triggerAnimations(firstSlide);
    }

    console.log('Bootstrap Video Hero Carousel initialized successfully!');
  }

  // Start initialization
  init();

  // Handle page visibility change (pause videos when tab is not active)
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      videos.forEach(video => video.pause());
    } else {
      const activeVideo = document.querySelector('.carousel-item.active video');
      if (activeVideo) {
        activeVideo.play().catch(e => console.log('Video play failed:', e));
      }
    }
  });
});

// Utility function to check if device supports video autoplay
function canAutoplay() {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.muted = true;
    video.src = 'data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAADhmZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTMgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAAV//7aMf5/gn8JHHNVAAKJAf//8/////zQEAAAAB1nSDBgIAAAAAL0C8HHgAAAAAAAAHQHg5AAAA';
    
    video.play().then(() => {
      resolve(true);
    }).catch(() => {
      resolve(false);
    });
  });
}

// Export functions for potential external use
window.VideoCarousel = {
  canAutoplay,
  init: () => console.log('VideoCarousel already initialized')
};