/**
 * Vercel Web Analytics initialization
 * This script injects the Vercel Analytics tracking for the site.
 */
(function() {
  'use strict';
  
  // Initialize Vercel Web Analytics
  // The script will automatically track page views in production
  // Development mode will log events to console for debugging
  window.va = window.va || function () { 
    (window.vaq = window.vaq || []).push(arguments); 
  };
  
  // Inject the analytics script
  // This will be replaced with the actual Vercel analytics endpoint after deployment
  var script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  
  // Add error handling
  script.onerror = function() {
    // Silently fail if analytics script cannot be loaded
    console.debug('Vercel Analytics: Script could not be loaded');
  };
  
  // Append to head
  if (document.head) {
    document.head.appendChild(script);
  }
})();
