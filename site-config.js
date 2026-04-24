/**
 * Site-wide constants for JavaScript. Keep in sync with site-config.json.
 * Update both when domain or phone list changes. First phone is used for
 * default WhatsApp links in main.js; add more entries in `phones` and update
 * JSON-LD in index.html to match.
 */
(function (global) {
  'use strict';
  var phones = [
    {
      label: 'Phone / WhatsApp',
      phoneDisplay: '+92 330 9089380',
      phoneTel: '+923309089380',
      whatsappE164: '923309089380'
    },
    {
      label: 'Phone / call',
      phoneDisplay: '+92 346 5849077',
      phoneTel: '+923465849077',
      whatsappE164: '923465849077'
    }
  ];
  var primary = phones[0] || {};
  var whatsappE164 = primary.whatsappE164 || '923309089380';
  var cfg = {
    origin: 'https://citycenter-c1markaz-b17.pk',
    phones: phones,
    whatsappE164: whatsappE164,
    whatsappUrl: 'https://wa.me/' + whatsappE164,
    phoneDisplay: primary.phoneDisplay || '',
    phoneTel: primary.phoneTel || '',
    brandName: 'City Center C1 Markaz B-17',
    shortAddress: 'Street 41, C1 Block, B-17 Islamabad'
  };
  global.__SITE__ = Object.freeze(cfg);
})(typeof window !== 'undefined' ? window : globalThis);
