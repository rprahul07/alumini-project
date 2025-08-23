import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title = 'CUCEK Alumni Connect - Connect with Alumni Worldwide',
  description = 'Join our growing network of successful CUCEK graduates. Build meaningful connections, share experiences, and explore opportunities together.',
  keywords = 'CUCEK, alumni, network, graduates, professional, connections, career, opportunities',
  image = '/src/assets/Thirike.jpg',
  url = window.location.href,
  type = 'website'
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="CUCEK Alumni Connect" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="CUCEK Alumni Association" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      
              {/* DNS Prefetch */}
        <link rel="dns-prefetch" href={import.meta.env.VITE_API_BASE_URL || '//localhost:5001'} />
        <link rel="dns-prefetch" href="//alumniblob.blob.core.windows.net" />
    </Helmet>
  );
};

export default SEOHead;
